// @flow
import {cast as remote, core} from 'kaltura-player-js';
import {CastStateManager} from './cast-state-manager';
import {CastTracksManager} from './cast-tracks-manager';
import {CastPlaybackEngine} from './cast-playback-engine';
import {CastUI} from './cast-ui';
import {CastLoader} from './cast-loader';
import {CastAdsController} from './cast-ads-controller';
import {CastAdsManager} from './cast-ads-manager';

const {Env, Track, TextStyle, EventType, StateType, FakeEvent, Utils, EngineType, AbrMode, Error} = core;
const {
  BaseRemotePlayer,
  PlayerSnapshot,
  RemoteControl,
  RemoteConnectedPayload,
  RemoteDisconnectedPayload,
  RemoteAvailablePayload,
  RemoteSession,
  TextStyleConverter,
  CustomMessageType,
  CustomMessage,
  CustomEventMessage
} = remote;

export const INTERVAL_FREQUENCY = 500;
export const SECONDS_TO_MINUTES_DIVIDER = 60;
export const CUSTOM_CHANNEL = 'urn:x-cast:com.kaltura.cast.playkit';

/**
 * The threshold in seconds from duration that we still consider it as live edge
 * @type {number}
 * @const
 */
const LIVE_EDGE_THRESHOLD: number = 10;

/**
 * Cast Sender Player.
 * @class CastPlayer
 * @param {CastConfigObject} config - The cast configuration.
 * @param {RemoteControl} remoteControl - The remote control.
 * @extends BaseRemotePlayer
 */
class CastPlayer extends BaseRemotePlayer {
  /**
   * The remote player type.
   * @static
   * @type {string}
   * @memberof CastPlayer
   * @override
   */
  static Type: string = 'chromecast';

  /**
   * @function isSupported
   * @static
   * @returns {boolean} - Whether the cast player is supported in the current runtime environment.
   * @memberof CastPlayer
   * @override
   */
  static isSupported(): boolean {
    return Env.browser.name === 'Chrome';
  }

  /**
   * The default cast configuration.
   * @static
   * @type {Object}
   * @memberof CastPlayer
   * @override
   */
  static defaultConfig: Object = {
    liveEdgeThreshold: 5
  };

  _remoteSession: RemoteSession;
  _castSession: Object;
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
  _playbackStarted: boolean = false;
  _reset: boolean = true;
  _destroyed: boolean = false;
  _isOnLiveEdge: boolean = false;
  _mediaInfoIntervalId: number;
  _adsController: CastAdsController;
  _adsManager: CastAdsManager;

  constructor(castConfig: CastConfigObject, remoteControl: RemoteControl) {
    super('CastPlayer', castConfig, remoteControl);
    CastLoader.load()
      .then(() => {
        this._initializeCastApi();
        this._initializeRemotePlayer();
      })
      .catch(e => {
        this._logger.error('Cast initialized error', e);
      });
  }

  /**
   * Loads a media to the receiver application.
   * @param {ProviderMediaInfoObject} mediaInfo - The entry media info.
   * @param {Object} [options] - The request options. See {@link https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.LoadRequest|chrome.cast.media.LoadRequest}
   * @returns {Promise<void>} - Promise to indicate load succeed or failed.
   * @instance
   * @memberof CastPlayer
   */
  loadMedia(mediaInfo: Object, options?: Object): Promise<*> {
    this._logger.debug('Load media', mediaInfo, options);
    this._mediaInfo = mediaInfo;
    return this._castMedia({mediaInfo}, options);
  }

  /**
   * Set a media to the receiver application.
   * @param {ProviderMediaConfigObject} mediaConfig - The entry media config.
   * @param {Object} [options] - The request options. See {@link https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.LoadRequest|chrome.cast.media.LoadRequest}
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  setMedia(mediaConfig: Object, options?: Object): void {
    this._logger.debug('Set media', mediaConfig, options);
    this._castMedia({mediaConfig}, options);
  }

  /**
   * Gets the media Info.
   * @returns {ProviderMediaInfoObject} - The media info.
   * @instance
   * @memberof CastPlayer
   */
  getMediaInfo(): ?Object {
    return Utils.Object.copyDeep(this._mediaInfo);
  }

  /**
   * Gets the media config.
   * @returns {ProviderMediaConfigObject} - The media config.
   * @instance
   * @memberof CastPlayer
   */
  getMediaConfig(): ?Object {
    const mediaConfig = {
      sources: this._playerConfig.sources,
      plugins: this._playerConfig.plugins
    };
    return Utils.Object.copyDeep(mediaConfig);
  }

  /**
   * The cast player readiness.
   * @returns {Promise<*>} - Promise which resolved when the cast player is ready.
   * @instance
   * @memberof CastPlayer
   */
  ready(): Promise<*> {
    return this._readyPromise ? this._readyPromise : Promise.resolve();
  }

  /**
   * Start/resume playback.
   * @instance
   * @returns {void}
   * @memberof CastPlayer
   */
  play(): void {
    if (!this.ended || this._adsManager.adBreak) {
      this._engine.play();
    } else {
      this._loadOrSetMedia({
        mediaInfo: this._mediaInfo,
        mediaConfig: this.getMediaConfig()
      });
    }
  }

  /**
   * Pause playback.
   * @instance
   * @returns {void}
   * @memberof CastPlayer
   */
  pause(): void {
    this._engine.pause();
  }

  /**
   * Stops and reset the cast player.
   * @instance
   * @returns {void}
   * @memberof CastPlayer
   */
  reset(): void {
    clearInterval(this._mediaInfoIntervalId);
    if (this._reset) return;
    this._reset = true;
    this._firstPlay = true;
    this._ended = false;
    this._isOnLiveEdge = false;
    this._tracksManager.reset();
    this._engine.reset();
    this._adsManager.reset();
    this._stateManager.reset();
    this._readyPromise = this._createReadyPromise();
    this.dispatchEvent(new FakeEvent(EventType.PLAYER_RESET));
  }

  /**
   * Destroys the cast player.
   * @instance
   * @returns {void}
   * @memberof CastPlayer
   */
  destroy(): void {
    clearInterval(this._mediaInfoIntervalId);
    if (this._destroyed) return;
    this._destroyed = true;
    this._firstPlay = true;
    this._ended = false;
    this._isOnLiveEdge = false;
    this._readyPromise = null;
    this._eventManager.destroy();
    this._tracksManager.destroy();
    this._engine.destroy();
    this._adsManager.destroy();
    this._stateManager.destroy();
    this.dispatchEvent(new FakeEvent(EventType.PLAYER_DESTROY));
  }

  /**
   * @returns {boolean} - Whether the current playback is a live playback.
   * @instance
   * @memberof CastPlayer
   */
  isLive(): boolean {
    const mediaInfo = this._castRemotePlayer.mediaInfo;
    return mediaInfo ? mediaInfo.streamType === chrome.cast.media.StreamType.LIVE : false;
  }

  /**
   * Get whether the video is seeked to live edge in dvr
   * @returns {boolean} - Whether the video is seeked to live edge in dvr
   * @public
   */
  isOnLiveEdge(): boolean {
    return this._isOnLiveEdge;
  }

  /**
   * @returns {boolean} - Whether the current live playback has DVR window. In case of non-live playback will return false.
   * @instance
   * @memberof CastPlayer
   */
  isDvr(): boolean {
    if (this.isLive()) {
      const mediaSession = this._castSession.getMediaSession();
      if (mediaSession) {
        const range = mediaSession.liveSeekableRange;
        if (range) {
          const startMinutes = range.start / SECONDS_TO_MINUTES_DIVIDER;
          const endMinutes = range.end / SECONDS_TO_MINUTES_DIVIDER;
          return endMinutes - startMinutes > this._castConfig.liveEdgeThreshold;
        }
      }
    }
    return false;
  }

  /**
   * Seeks to the live edge.
   * @instance
   * @returns {void}
   * @memberof CastPlayer
   */
  seekToLiveEdge(): void {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      const range = mediaSession.liveSeekableRange;
      if (range) {
        this._engine.currentTime = range.end;
      }
    }
  }

  /**
   * @returns {number} - The start time of the DVR window.
   * @instance
   * @memberof CastPlayer
   */
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

  /**
   * @function enableAdaptiveBitrate
   * @description Enables automatic adaptive bitrate switching.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */

  /**
   * @function isAdaptiveBitrateEnabled
   * @returns {boolean} - Whether adaptive bitrate is enabled.
   * @instance
   * @memberof CastPlayer
   */

  /**
   * @param {string} [type] - Track type.
   * @returns {Array<Track>} - The cast player tracks.
   * @instance
   * @memberof CastPlayer
   */
  getTracks(type?: string): Array<Track> {
    return this._tracksManager.getTracks(type);
  }

  /**
   * @returns {Object} - The cast player active tracks.
   * @instance
   * @memberof CastPlayer
   */
  getActiveTracks(): Object {
    return this._tracksManager.getActiveTracks();
  }

  /**
   * Select a certain track to be active.
   * @param {Track} track - The track to activate.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  selectTrack(track: ?Track): void {
    this._tracksManager.selectTrack(track);
  }

  /**
   * Hides the active text track.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  hideTextTrack(): void {
    this._tracksManager.hideTextTrack();
  }

  /**
   * Start casting.
   * @returns {Promise<*>} - A promise to indicate session is starting, or failed
   * @instance
   * @memberof CastPlayer
   */
  startCasting(): Promise<*> {
    return cast && cast.framework ? cast.framework.CastContext.getInstance().requestSession() : Promise.reject();
  }

  /**
   * @returns {boolean} - Whether casting is available.
   * @instance
   * @memberof CastPlayer
   */
  isCastAvailable(): boolean {
    return !!this._castRemotePlayer;
  }

  /**
   * Stops the current cast session.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  stopCasting(): void {
    this._castSession.endSession(true);
  }

  /**
   * Gets the current remote session.
   * @returns {RemoteSession} - The remote session.
   * @instance
   * @memberof CastPlayer
   */
  getCastSession(): RemoteSession {
    return Utils.Object.copyDeep(this._remoteSession);
  }

  /**
   * @return {CastAdsController} - The cast ads controller.
   * @instance
   * @memberof CastPlayer
   */
  get ads(): ?CastAdsController {
    return this._adsController;
  }

  /**
   * Setter.
   * @param {TextStyle} style - The text style to set.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  set textStyle(style: TextStyle): void {
    this._tracksManager.textStyle = style;
  }

  /**
   * Getter.
   * @returns {TextStyle} - The current text style.
   * @instance
   * @memberof CastPlayer
   */
  get textStyle(): ?TextStyle {
    return this._tracksManager.textStyle;
  }

  /**
   * Setter.
   * @param {number} to - The number to set in seconds.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  set currentTime(to: number): void {
    this._engine.currentTime = to;
  }

  /**
   * Getter.
   * @returns {number} - The current time in seconds.
   * @instance
   * @memberof CastPlayer
   */
  get currentTime(): ?number {
    return this._engine.currentTime;
  }

  /**
   * @returns {number} - The duration in seconds.
   * @instance
   * @memberof CastPlayer
   */
  get duration(): ?number {
    return this._engine.duration;
  }

  /**
   * Setter.
   * @param {number} vol - The volume to set in the range of 0-1.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  set volume(vol: number): void {
    this._engine.volume = vol;
  }

  /**
   * Getter.
   * @returns {number} - The current volume in the range of 0-1.
   * @instance
   * @memberof CastPlayer
   */
  get volume(): ?number {
    return this._engine.volume;
  }

  /**
   * @returns {boolean} - Whether the cast player is in paused state.
   * @instance
   * @memberof CastPlayer
   */
  get paused(): ?boolean {
    return this._engine.paused;
  }

  /**
   * @returns {boolean} - Whether the cast player is in ended state.
   * @instance
   * @memberof CastPlayer
   */
  get ended(): ?boolean {
    return this._ended;
  }

  /**
   * @returns {boolean} - Whether the cast player is in seeking state.
   * @instance
   * @memberof CastPlayer
   */
  get seeking(): ?boolean {
    return this._engine.seeking;
  }

  /**
   * Setter.
   * @param {boolean} mute - The mute value to set.
   * @returns {void}
   * @instance
   * @memberof CastPlayer
   */
  set muted(mute: boolean): void {
    this._engine.muted = mute;
  }

  /**
   * Getter.
   * @returns {boolean} - The muted state.
   * @instance
   * @memberof CastPlayer
   */
  get muted(): ?boolean {
    return this._engine.muted;
  }

  /**
   * @returns {string} - The current playing source url.
   * @instance
   * @memberof CastPlayer
   */
  get src(): ?string {
    if (this._castRemotePlayer.mediaInfo) {
      return this._castRemotePlayer.mediaInfo.contentUrl;
    }
  }

  /**
   * @returns {string} - The current poster url.
   * @instance
   * @memberof CastPlayer
   */
  get poster(): string {
    try {
      return this._castRemotePlayer.mediaInfo.metadata.images[0].url;
    } catch (e) {
      return '';
    }
  }

  /**
   * @returns {string} - The current playback rate.
   * @instance
   * @memberof CastPlayer
   */
  get playbackRate(): ?number {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      return mediaSession.playbackRate;
    }
  }

  /**
   * @returns {string} - The active engine type.
   * @instance
   * @memberof CastPlayer
   */
  get engineType(): ?string {
    return EngineType.CAST;
  }

  /**
   * @returns {string} - The remote player type.
   * @instance
   * @memberof CastPlayer
   */
  get type(): string {
    return CastPlayer.Type;
  }

  /**
   * @name config
   * @returns {Object} - The runtime cast player config.
   * @instance
   * @memberof CastPlayer
   */

  _initializeCastApi(): void {
    const options: Object = {};

    options.receiverApplicationId = this._castConfig.receiverApplicationId || chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    options.autoJoinPolicy = this._castConfig.autoJoinPolicy || chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;

    this._logger.debug('Init cast API with options', options);
    const castContext = cast.framework.CastContext.getInstance();
    castContext.setOptions(options);
    castContext.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, event => {
      const payload = new RemoteAvailablePayload(this, event.castState !== cast.framework.CastState.NO_DEVICES_AVAILABLE);
      this._remoteControl.onRemoteDeviceAvailable(payload);
    });
  }

  _initializeRemotePlayer(): void {
    this._castContext = cast.framework.CastContext.getInstance();
    this._addSessionLifecycleListeners();
    this._castRemotePlayer = new cast.framework.RemotePlayer();
    this._castRemotePlayerController = new cast.framework.RemotePlayerController(this._castRemotePlayer);
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
    this._castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    this._castSession.addMessageListener(CUSTOM_CHANNEL, (customChannel, customMessage) => this._onCustomMessage(customChannel, customMessage));
    this._tracksManager = new CastTracksManager(this._castRemotePlayer);
    this._engine = new CastPlaybackEngine(this._castRemotePlayer, this._castRemotePlayerController);
    this._stateManager = new CastStateManager(this._castRemotePlayer, this._castRemotePlayerController);
    this._adsManager = new CastAdsManager(this);
    this._ui = new CastUI();
    this._attachListeners();
    const snapshot = this._remoteControl.getPlayerSnapshot();
    this._playerConfig = snapshot.config;
    this._remoteSession = new RemoteSession(
      this._castSession.getSessionId(),
      this._castSession.getCastDevice().friendlyName,
      this._castSession.getSessionState() !== cast.framework.SessionState.SESSION_STARTED
    );
    const payload = new RemoteConnectedPayload(this, this._remoteSession, this._ui);
    this._remoteControl.onRemoteDeviceConnected(payload);
    if (this._remoteSession.resuming && !(Env.browser.major >= 73 && Env.os.name === 'Android')) {
      // Android Chrome 73 and up gets SESSION_RESUMED also in the initial session
      this._resumeSession();
    } else if (snapshot) {
      const loadOptions = this._getLoadOptions(snapshot);
      this._loadOrSetMedia(snapshot, loadOptions);
    }
  }

  _loadOrSetMedia(mediaObject: Object, options?: Object): void {
    const {mediaInfo, mediaConfig} = mediaObject;
    if (mediaInfo) {
      this.loadMedia(mediaInfo, options);
    } else if (mediaConfig) {
      this.setMedia({sources: mediaObject.mediaConfig.sources, plugins: {}}, options);
    }
  }

  _castMedia(mediaObject: Object, options?: Object): Promise<*> {
    this.reset();
    this._remoteControl.getUIWrapper().reset();

    if (this._playbackStarted) {
      this.dispatchEvent(new FakeEvent(EventType.CHANGE_SOURCE_STARTED));
    }
    const media = new chrome.cast.media.MediaInfo();
    const request = new chrome.cast.media.LoadRequest(media);

    if (options) {
      Object.keys(options).forEach(option => {
        if (option !== 'media') {
          // $FlowFixMe
          request[option] = options[option];
        } else {
          // $FlowFixMe
          Object.keys(options.media).forEach(mediaOption => {
            // $FlowFixMe
            media[mediaOption] = options.media[mediaOption];
          });
        }
      });
    }

    media.customData = media.customData || {};
    media.customData.mediaInfo = mediaObject.mediaInfo;
    media.customData.mediaConfig = mediaObject.mediaConfig;
    return this._castSession.loadMedia(request).then(() => this._onLoadMediaSuccess(), error => this._onLoadMediaFailed(error));
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
    this._readyPromise = new Promise(resolve => {
      this._eventManager.listenOnce(this, EventType.TRACKS_CHANGED, () => {
        this.dispatchEvent(new FakeEvent(EventType.MEDIA_LOADED));
        resolve();
      });
    });
  }

  _attachListeners(): void {
    this._eventManager.listen(this._engine, EventType.TIME_UPDATE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.PAUSE, e => this._onPause(e));
    this._eventManager.listen(this._engine, EventType.PLAY, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.VOLUME_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.MUTE_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.DURATION_CHANGE, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.ENDED, e => this._onEnded(e));
    this._eventManager.listen(this._engine, EventType.SEEKING, e => this.dispatchEvent(e));
    this._eventManager.listen(this._engine, EventType.SEEKED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.TRACKS_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.TEXT_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.VIDEO_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.AUDIO_TRACK_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.TEXT_STYLE_CHANGED, e => this.dispatchEvent(e));
    this._eventManager.listen(this._tracksManager, EventType.ERROR, e => this.dispatchEvent(e));
    this._eventManager.listen(this._stateManager, EventType.PLAYER_STATE_CHANGED, e => this._onPlayerStateChanged(e));
  }

  _onPause(e: FakeEvent): void {
    this._isOnLiveEdge = false;
    this._eventManager.listenOnce(this._engine, EventType.PLAY, () => {
      this._isOnLiveEdge = true;
    });
    this.dispatchEvent(e);
  }

  _onEnded(e: FakeEvent): void {
    this._ended = true;
    this.dispatchEvent(e);
    if (this._adsManager.allAdsCompleted) {
      this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_ENDED));
    } else {
      this._eventManager.listenOnce(this, EventType.ALL_ADS_COMPLETED, () => {
        this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_ENDED));
      });
    }
  }

  _onPlayerStateChanged(e: FakeEvent): void {
    if (this._ended) return;
    if (this._stateManager.currentState.type === StateType.PLAYING) {
      this.dispatchEvent(new FakeEvent(EventType.PLAYING));
    }
    this.dispatchEvent(e);
  }

  _handleFirstPlay(): void {
    if (this._playbackStarted) {
      this.dispatchEvent(new FakeEvent(EventType.CHANGE_SOURCE_ENDED));
    }
    this.dispatchEvent(new FakeEvent(EventType.PLAYBACK_START));
    this.dispatchEvent(new FakeEvent(EventType.PLAY));
    this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAY));
    this.dispatchEvent(new FakeEvent(EventType.FIRST_PLAYING));
    this.dispatchEvent(new FakeEvent(EventType.PLAYING));
    if (this.paused) {
      this.dispatchEvent(new FakeEvent(EventType.PAUSE));
    }
    this._firstPlay = false;
    this._playbackStarted = true;
  }

  _resumeSession(): void {
    this._readyPromise = this._createReadyPromise();
    this._mediaInfoIntervalId = setInterval(() => {
      const mediaSession = this._castSession.getMediaSession();
      if (mediaSession && mediaSession.customData) {
        clearInterval(this._mediaInfoIntervalId);
        this._mediaInfo = mediaSession.customData.mediaInfo;
        this._logger.debug('Resuming session with media info', this._mediaInfo);
        this._onLoadMediaSuccess();
      }
    }, INTERVAL_FREQUENCY);
  }

  _onLoadMediaSuccess(): void {
    this._logger.debug('Load media success');
    this._reset = false;
    this._triggerInitialPlayerEvents();
    this._tracksManager.parseTracks();
    this._handleFirstPlay();
    let startTime = this._playerConfig.playback.startTime;
    if (this.isLive() && (startTime === -1 || (typeof this.duration === 'number' && startTime >= this.duration - LIVE_EDGE_THRESHOLD))) {
      this._isOnLiveEdge = true;
    }
  }

  _triggerInitialPlayerEvents(): void {
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
    this.dispatchEvent(new FakeEvent(EventType.ABR_MODE_CHANGED, {mode: AbrMode.AUTO}));
  }

  _onLoadMediaFailed(error: Object): void {
    this._logger.debug('Load media falied', error);
    this.dispatchEvent(
      new FakeEvent(EventType.ERROR, new Error(Error.Severity.CRITICAL, Error.Category.CAST, Error.Code.CAST_LOAD_MEDIA_FAILED, error))
    );
  }

  _addSessionLifecycleListeners(): void {
    this._castContext.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, event => {
      switch (event.sessionState) {
        case cast.framework.SessionState.SESSION_STARTING:
          this._remoteControl.onRemoteDeviceConnecting();
          break;
        case cast.framework.SessionState.SESSION_RESUMED:
          if (Env.browser.major >= 73 && Env.os.name === 'Android') {
            this._remoteControl.onRemoteDeviceConnecting();
          }
          break;
        case cast.framework.SessionState.SESSION_ENDING:
          this._remoteControl.onRemoteDeviceDisconnecting();
          break;
        case cast.framework.SessionState.SESSION_START_FAILED:
          this._remoteControl.onRemoteDeviceConnectFailed();
          break;
      }
    });
  }

  _getLoadOptions(snapshot: PlayerSnapshot): Object {
    const loadOptions = {
      autoplay: this._playerConfig.playback.autoplay,
      currentTime: this._playerConfig.playback.startTime,
      media: {}
    };
    if (this.textStyle && !this.textStyle.isEqual(snapshot.textStyle)) {
      loadOptions.media.textTrackStyle = TextStyleConverter.toCastTextStyle(snapshot.textStyle);
    }
    loadOptions.media.customData = {
      audioLanguage: this._playerConfig.playback.audioLanguage,
      textLanguage: this._playerConfig.playback.textLanguage
    };
    if (snapshot.advertising && snapshot.advertising.adTagUrl) {
      this._adsController = new CastAdsController();
      const castAdvertising = this._castConfig.advertising;
      if (!castAdvertising || !castAdvertising.vast) {
        loadOptions.media.vmapAdsRequest = this._getAdsRequest(snapshot.advertising);
      } else {
        const breakClipId = Utils.Generator.uniqueId(5);
        const breakId = Utils.Generator.uniqueId(5);
        const breakClips = [
          {
            id: breakClipId,
            position: 0,
            vastAdsRequest: this._getAdsRequest(snapshot.advertising)
          }
        ];
        const breaks = [
          {
            breakClipIds: [breakClipId],
            id: breakId,
            position: 0
          }
        ];
        loadOptions.media.breakClips = breakClips;
        loadOptions.media.breaks = breaks;
      }
    }
    return loadOptions;
  }

  _getAdsRequest(advertising: Object): Object {
    const adsRequest = {};
    if (advertising.adTagUrl) {
      adsRequest.adTagUrl = advertising.adTagUrl;
    }
    if (advertising.adsResponse) {
      adsRequest.adsResponse = advertising.adsResponse;
    }
    return adsRequest;
  }

  _onCustomMessage(customChannel: string, customMessage: CustomMessage): void {
    try {
      const parsedCustomMessage = JSON.parse(customMessage);
      this._logger.debug('Custom message received', parsedCustomMessage);
      switch (parsedCustomMessage.type) {
        case CustomMessageType.EVENT:
          this._handleCustomEvent(parsedCustomMessage);
          break;
      }
    } catch (e) {
      this.dispatchEvent(
        new FakeEvent(EventType.ERROR, new Error(Error.Severity.RECOVERABLE, Error.Category.CAST, Error.Code.CAST_CUSTOM_MESSAGE_PARSING_ERROR, e))
      );
    }
  }

  _handleCustomEvent(customEvent: CustomEventMessage): void {
    this.dispatchEvent(new FakeEvent(customEvent.event, customEvent.payload));
  }
}

export {CastPlayer};
