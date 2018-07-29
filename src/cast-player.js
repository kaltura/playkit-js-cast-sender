// @flow
import {cast as remote, core} from 'kaltura-player-js';
import {CastStateManager} from './cast-state-manager';
import {CastTracksManager} from './cast-tracks-manager';
import {CastPlaybackEngine} from './cast-playack-engine';
import {CastUI} from './cast-ui';
import {CastLoader} from './cast-loader';

const {Env, Track, TextStyle, EventType, StateType, FakeEvent, Utils, EngineType} = core;
const {
  BaseRemotePlayer,
  PlayerSnapshot,
  RemoteControl,
  RemoteConnectedPayload,
  RemoteDisconnectedPayload,
  RemoteAvailablePayload,
  RemoteSession,
  TextStyleConverter
} = remote;

class CastPlayer extends BaseRemotePlayer {
  static Type: string = 'chromecast';

  static isSupported(): boolean {
    return Env.browser.name === 'Chrome';
  }

  _castContext: Object;
  _castRemotePlayer: Object;
  _castRemotePlayerController: Object;
  _ui: CastUI;
  _stateManager: CastStateManager;
  _tracksManager: CastTracksManager;
  _engine: CastPlaybackEngine;
  _readyPromise: ?Promise<*> = null;
  _mediaInfo: ?Object = null;
  _firstPlay: boolean = true;
  _ended: boolean = false;

  constructor(config: Object, remoteControl: RemoteControl) {
    super('CastPlayer', config, remoteControl);
    CastLoader.load()
      .then(() => {
        this._initializeCastApi();
        this._initializeRemotePlayer();
      })
      .catch((/* e */) => {
        // TODO - Error handling
      });
  }

  loadMedia(mediaInfo: Object, options?: CastLoadOptions): Promise<*> {
    this.reset();

    const media = new chrome.cast.media.MediaInfo();
    const request = new chrome.cast.media.LoadRequest(media);

    if (options) {
      request.autoplay = options.autoplay;
      request.currentTime = options.startTime;
      if (this.textStyle && !this.textStyle.isEqual(options.textStyle)) {
        media.textTrackStyle = TextStyleConverter.toCastTextStyle(options.textStyle);
      }
      media.customData = {
        audioLanguage: options.audioLanguage,
        textLanguage: options.textLanguage
      };
    }

    media.customData = media.customData || {};
    media.customData.mediaInfo = mediaInfo;

    return this._castSession.loadMedia(request).then(
      () => {
        this._mediaInfo = mediaInfo;
        this._onLoadMediaSuccess();
      },
      errorCode => {
        this._mediaInfo = null;
        this._onLoadMediaFailed(errorCode);
      }
    );
  }

  getMediaInfo(): ?Object {
    return Utils.Object.copyDeep(this._mediaInfo);
  }

  ready(): Promise<*> {
    return this._readyPromise ? this._readyPromise : Promise.resolve();
  }

  play(): void {
    if (this.paused) {
      this._engine.play();
    } else if (this._ended && this.getMediaInfo()) {
      this.loadMedia(this._mediaInfo);
    }
  }

  pause(): void {
    if (!this.paused) {
      this._engine.pause();
    }
  }

  reset(): void {
    this._firstPlay = true;
    this._ended = false;
    this._tracksManager.reset();
    this._engine.reset();
    this._stateManager.reset();
    this._readyPromise = this._createReadyPromise();
  }

  destroy(): void {
    this._firstPlay = true;
    this._ended = false;
    this._readyPromise = null;
    this._eventManager.destroy();
    this._tracksManager.destroy();
    this._engine.destroy();
    this._stateManager.destroy();
  }

  isLive(): boolean {
    const mediaInfo = this._castRemotePlayer.mediaInfo;
    return mediaInfo ? mediaInfo.streamType === chrome.cast.media.StreamType.LIVE : false;
  }

  isDvr(): boolean {
    if (this.isLive()) {
      const mediaInfo = this._castRemotePlayer.mediaInfo;
      return mediaInfo.customData && mediaInfo.customData.isDvr;
    }
    return false;
  }

  seekToLiveEdge(): void {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      const range = mediaSession.liveSeekableRange;
      if (range) {
        this._engine.currentTime = range.end;
      }
    }
  }

  getStartTimeOfDvrWindow(): number {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      const range = mediaSession.liveSeekableRange;
      if (range) {
        return range.start;
      }
    }
    return 0;
  }

  getTracks(type?: string): Array<Track> {
    return this._tracksManager.getTracks(type);
  }

  getActiveTracks(): Object {
    return this._tracksManager.getActiveTracks();
  }

  selectTrack(track: ?Track): void {
    return this._tracksManager.selectTrack(track);
  }

  hideTextTrack(): void {
    this._tracksManager.hideTextTrack();
  }

  startCasting(): Promise<*> {
    return cast && cast.framework ? cast.framework.CastContext.getInstance().requestSession() : Promise.reject();
  }

  isCastAvailable(): boolean {
    return !!this._castRemotePlayer;
  }

  stopCasting(): void {
    this._castSession.endSession(true);
  }

  set textStyle(style: TextStyle): void {
    this._tracksManager.textStyle = style;
  }

  get textStyle(): ?TextStyle {
    return this._tracksManager.textStyle;
  }

  set currentTime(to: number): void {
    this._engine.currentTime = to;
  }

  get currentTime(): ?number {
    return this._engine.currentTime;
  }

  get duration(): ?number {
    return this._engine.duration;
  }

  set volume(vol: number): void {
    this._engine.volume = vol;
  }

  get volume(): ?number {
    return this._engine.volume;
  }

  get paused(): ?boolean {
    return this._engine.paused;
  }

  get seeking(): ?boolean {
    return this._engine.seeking;
  }

  set muted(mute: boolean): void {
    this._engine.muted = mute;
  }

  get muted(): ?boolean {
    return this._engine.muted;
  }

  get src(): ?string {
    if (this._castRemotePlayer.mediaInfo) {
      return this._castRemotePlayer.mediaInfo.contentUrl;
    }
  }

  get poster(): string {
    try {
      return this._castRemotePlayer.mediaInfo.metadata.images[0].url;
    } catch (e) {
      return '';
    }
  }

  get playbackRate(): ?number {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      return mediaSession.playbackRate;
    }
  }

  get engineType(): ?string {
    return EngineType.HTML5;
  }

  get type(): string {
    return CastPlayer.Type;
  }

  _initializeCastApi(): void {
    const options: Object = {};

    options.receiverApplicationId = this._config.receiverApplicationId || chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    options.autoJoinPolicy = this._config.autoJoinPolicy || chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

    this._logger.debug('Init cast API with options', options);
    cast.framework.CastContext.getInstance().setOptions(options);

    const payload = new RemoteAvailablePayload(this, true);
    this._remoteControl.onRemoteDeviceAvailable(payload);
  }

  _initializeRemotePlayer(): void {
    this._castContext = cast.framework.CastContext.getInstance();
    this._castRemotePlayer = new cast.framework.RemotePlayer();
    this._castRemotePlayerController = new cast.framework.RemotePlayerController(this._castRemotePlayer);

    this._ui = new CastUI();
    this._tracksManager = new CastTracksManager(this._castRemotePlayer);
    this._engine = new CastPlaybackEngine(this._castRemotePlayer, this._castRemotePlayerController);
    this._stateManager = new CastStateManager(this._castRemotePlayer, this._castRemotePlayerController);

    this._castRemotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, () => {
      if (this._castRemotePlayer.isConnected) {
        this._setupRemotePlayer();
      } else {
        this._setupLocalPlayer();
      }
    });
  }

  _setupRemotePlayer(): void {
    this._logger.debug('Setup remote player');
    this._attachListeners();
    this._castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const snapshot = this._remoteControl.getPlayerSnapshot();
    const session = new RemoteSession(
      this._castSession.getSessionId(),
      this._castSession.getCastDevice().friendlyName,
      this._castSession.getSessionState() !== cast.framework.SessionState.SESSION_STARTED
    );
    const payload = new RemoteConnectedPayload(this, session, this._ui);
    this._remoteControl.onRemoteDeviceConnected(payload);
    if (session.resuming) {
      this._resumeSession();
    } else if (snapshot.mediaInfo) {
      this.loadMedia(snapshot.mediaInfo, snapshot);
    }
  }

  _setupLocalPlayer(): void {
    this._logger.debug('Setup local player');
    const snapshot = new PlayerSnapshot(this);
    const payload = new RemoteDisconnectedPayload(this, snapshot);
    this.pause();
    this.destroy();
    this._remoteControl.onRemoteDeviceDisconnected(payload);
  }

  _createReadyPromise(): void {
    this._readyPromise = new Promise((resolve, reject) => {
      this._eventManager.listenOnce(this, EventType.TRACKS_CHANGED, () => {
        this.dispatchEvent(new FakeEvent(EventType.MEDIA_LOADED));
        resolve();
      });
      this._eventManager.listen(this, EventType.ERROR, reject);
    }).catch((/* e */) => {
      // TODO - Error handling
    });
  }

  _attachListeners(): void {
    this._eventManager.listen(this._engine, EventType.TIME_UPDATE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.PAUSE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.PLAY, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.VOLUME_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.MUTE_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.DURATION_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.ENDED, e => {
      if (this.isLive()) {
        const mediaSession = this._castSession.getMediaSession();
        if (mediaSession) {
          const range = mediaSession.liveSeekableRange;
          if (range && range.isLiveDone) {
            this._ended = true;
            this.dispatchEvent(e);
          }
        }
      } else {
        this._ended = true;
        this.dispatchEvent(e);
      }
    });
    this._eventManager.listen(this._tracksManager, EventType.TRACKS_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.TEXT_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.VIDEO_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.AUDIO_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.TEXT_STYLE_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._stateManager, EventType.PLAYER_STATE_CHANGED, e => {
      if (this._stateManager.currentState.type === StateType.PLAYING) {
        this.dispatchEvent(new FakeEvent(EventType.PLAYING));
      }
      this.dispatchEvent(e);
    });
  }

  _handleFirstPlay(): void {
    this._firstPlay = false;
    this.dispatchEvent(new FakeEvent(EventType.PLAY));
    this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAY));
    this.dispatchEvent(new FakeEvent(EventType.PLAYING));
    this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_STARTED));
    if (this.paused) {
      this.dispatchEvent(new FakeEvent(EventType.PAUSE));
    }
  }

  _resumeSession(): void {
    const onMediaInfoChanged = () => {
      this._castRemotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, onMediaInfoChanged);
      this._mediaInfo = mediaSession.customData.mediaInfo;
      this._onLoadMediaSuccess();
    };
    this.reset();
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      this._castRemotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, onMediaInfoChanged);
    }
  }

  _onLoadMediaSuccess(): void {
    this._logger.debug('Load media success');
    this.dispatchEvent(
      new FakeEvent(EventType.SOURCE_SELECTED, {
        selectedSource: [
          {
            url: this._castRemotePlayer.mediaInfo.contentUrl,
            mimetype: this._castRemotePlayer.mediaInfo.contentType
          }
        ]
      })
    );
    this.dispatchEvent(new FakeEvent(EventType.LOADED_METADATA));
    this.dispatchEvent(new FakeEvent(EventType.ABR_MODE_CHANGED, {mode: 'auto'}));
    this._tracksManager.parseTracks();
    this._handleFirstPlay();
  }

  _onLoadMediaFailed(errorCode: string): void {
    this._logger.debug('Load media failed', errorCode);
    // TODO
  }
}

export {CastPlayer};
