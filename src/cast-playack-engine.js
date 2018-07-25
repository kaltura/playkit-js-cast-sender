// @flow
import {core} from 'kaltura-player-js';

const {EventType, FakeEvent, FakeEventTarget} = core;

class CastPlaybackEngine extends FakeEventTarget {
  _remotePlayer: Object;
  _remotePlayerController: Object;
  _muted: boolean = false;
  _volume: number = 1;
  _paused: boolean = false;
  _currentTime: number = 0;
  _duration: number = 0;
  _seeking: boolean = false;
  _onCurrentTimeChanged: Function;
  _onIsPausedChanged: Function;
  _onDurationChanged: Function;
  _onVolumeLevelChanged: Function;
  _onIsMutedChanged: Function;

  constructor(remotePlayer: Object, remotePlayerController: Object) {
    super();
    this._remotePlayer = remotePlayer;
    this._remotePlayerController = remotePlayerController;
    this._onCurrentTimeChanged = this._onCurrentTimeChanged.bind(this);
    this._onIsPausedChanged = this._onIsPausedChanged.bind(this);
    this._onDurationChanged = this._onDurationChanged.bind(this);
    this._onVolumeLevelChanged = this._onVolumeLevelChanged.bind(this);
    this._onIsMutedChanged = this._onIsMutedChanged.bind(this);
    this._toggleListeners(true);
  }

  reset(): void {
    this._resetFlags();
  }

  destroy(): void {
    this._toggleListeners(false);
    this._muted = false;
    this._volume = 1;
    this._resetFlags();
  }

  play(): void {
    this._remotePlayerController.playOrPause();
  }

  pause(): void {
    if (this._remotePlayer.canPause) {
      this._remotePlayerController.playOrPause();
    }
  }

  set muted(value: boolean) {
    if ((value && !this.muted) || (!value && this.muted)) {
      this._remotePlayerController.muteOrUnmute();
    }
  }

  set volume(value: number) {
    if (this._remotePlayer.canControlVolume) {
      this._remotePlayer.volumeLevel = value;
      this._remotePlayerController.setVolumeLevel();
    }
  }

  set currentTime(value: number) {
    if (this._remotePlayer.canSeek) {
      this._seeking = true;
      this._remotePlayer.currentTime = value;
      this._remotePlayerController.seek();
    }
  }

  get duration(): ?number {
    return this._duration;
  }

  get paused(): ?boolean {
    if (this._remotePlayer.savedPlayerState) {
      return this._remotePlayer.savedPlayerState.isPaused;
    }
    return this._paused;
  }

  get seeking(): ?boolean {
    return this._seeking;
  }

  get muted(): ?boolean {
    return this._muted;
  }

  get currentTime(): ?number {
    if (this._remotePlayer.savedPlayerState) {
      return this._remotePlayer.savedPlayerState.currentTime;
    }
    return this._currentTime;
  }

  get volume(): ?number {
    return this._volume;
  }

  _resetFlags(): void {
    this._paused = false;
    this._currentTime = 0;
    this._duration = 0;
    this._seeking = false;
  }

  _toggleListeners(listen: boolean): void {
    const listeners = {
      [cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED]: this._onCurrentTimeChanged,
      [cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED]: this._onIsPausedChanged,
      [cast.framework.RemotePlayerEventType.DURATION_CHANGED]: this._onDurationChanged,
      [cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]: this._onVolumeLevelChanged,
      [cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED]: this._onIsMutedChanged
    };
    if (listen) {
      Object.keys(listeners).forEach(e => this._remotePlayerController.addEventListener(e, listeners[e]));
    } else {
      Object.keys(listeners).forEach(e => this._remotePlayerController.removeEventListener(e, listeners[e]));
    }
  }

  _onCurrentTimeChanged(): void {
    this._currentTime = this._remotePlayer.currentTime;
    this._seeking = false;
    this.dispatchEvent(new FakeEvent(EventType.TIME_UPDATE));
    this._maybeEndPlayback();
  }

  _onIsPausedChanged(): void {
    this._paused = this._remotePlayer.isPaused;
    if (this._paused) {
      this.dispatchEvent(new FakeEvent(EventType.PAUSE));
    } else {
      this.dispatchEvent(new FakeEvent(EventType.PLAY));
    }
  }

  _onDurationChanged(): void {
    this._duration = this._remotePlayer.duration;
    this.dispatchEvent(new FakeEvent(EventType.DURATION_CHANGE));
  }

  _onVolumeLevelChanged(): void {
    this._volume = this._remotePlayer.volumeLevel;
    this.dispatchEvent(new FakeEvent(EventType.VOLUME_CHANGE));
  }

  _onIsMutedChanged(): void {
    this._muted = this._remotePlayer.isMuted;
    this.dispatchEvent(new FakeEvent(EventType.MUTE_CHANGE, {mute: this.muted}));
  }

  _maybeEndPlayback(): void {
    const delta = Math.round(this._duration - this._currentTime);
    if (this._currentTime !== 0 && this._duration !== 0 && delta <= 1) {
      this._currentTime = this._duration;
      this.dispatchEvent(new FakeEvent(EventType.ENDED));
    }
  }
}

export {CastPlaybackEngine};
