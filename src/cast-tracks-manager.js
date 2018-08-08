// @flow
import {cast as remote, core} from 'kaltura-player-js';
import {INTERVAL_FREQUENCY} from './cast-player';

const {TextStyleConverter} = remote;
const {Track, TextStyle, AudioTrack, VideoTrack, TextTrack, Utils, TrackType, EventType, FakeEvent, FakeEventTarget} = core;
const TRACK_TYPE_TO_INSTANCE: {[type: string]: Track} = {
  [TrackType.AUDIO]: AudioTrack,
  [TrackType.VIDEO]: VideoTrack,
  [TrackType.TEXT]: TextTrack
};

class CastTracksManager extends FakeEventTarget {
  _remotePlayer: Object;
  _castSession: Object;
  _textStyle: TextStyle;
  _activeTrackIds: Array<number> = [];
  _tracks: Array<Track> = [];
  _mediaStatusIntervalId: number;
  _onMediaStatusUpdate: Function;

  constructor(remotePlayer: Object) {
    super();
    this._remotePlayer = remotePlayer;
    this._castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    this._textStyle = new TextStyle();
    this._bindEvents();
  }

  parseTracks(): void {
    const tracks = this._remotePlayer.mediaInfo.tracks;
    if (tracks && tracks.length > 0) {
      const castTextTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.TEXT);
      const castVideoTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.VIDEO);
      const castAudioTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.AUDIO);
      const textTracks = this._parseTextTracks(castTextTracks);
      const videoTracks = this._parseVideoTracks(castVideoTracks);
      const audioTracks = this._parseAudioTracks(castAudioTracks);
      this._tracks = audioTracks.concat(videoTracks).concat(textTracks);
      this._addTextTrackOffOption();
    }
    this._startOnMediaStatusUpdateInterval();
    this.dispatchEvent(new FakeEvent(EventType.TRACKS_CHANGED, {tracks: this._tracks}));
  }

  getTracks(type?: string): Array<Track> {
    return Utils.Object.copyDeep(this._getTracksByType(type));
  }

  getActiveTracks(): Object {
    return Utils.Object.copyDeep({
      video: this._getTracksByType(TrackType.VIDEO).find(track => track.active),
      audio: this._getTracksByType(TrackType.AUDIO).find(track => track.active),
      text: this._getTracksByType(TrackType.TEXT).find(track => track.active)
    });
  }

  selectTrack(track: ?Track): void {
    if (track instanceof VideoTrack) {
      this._selectVideoTrack(track);
    } else if (track instanceof AudioTrack) {
      this._selectAudioTrack(track);
    } else if (track instanceof TextTrack) {
      this._selectTextTrack(track);
    }
  }

  hideTextTrack(): void {
    const offTrack = this._tracks.find(t => t.language === 'off');
    this.selectTrack(offTrack);
  }

  reset(): void {
    this._stopOnMediaStatusUpdateInterval();
    this._tracks = [];
    this._activeTrackIds = [];
  }

  destroy(): void {
    this._stopOnMediaStatusUpdateInterval();
    this._tracks = [];
    this._activeTrackIds = [];
  }

  set textStyle(style: TextStyle): void {
    const textTrackStyle = TextStyleConverter.toCastTextStyle(style);
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(null, textTrackStyle);
    const mediaSession = this._castSession.getMediaSession();
    mediaSession.editTracksInfo(
      tracksInfoRequest,
      () => {
        this._textStyle = style;
        this.dispatchEvent(new FakeEvent(EventType.TEXT_STYLE_CHANGED, {textStyle: style}));
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  get textStyle(): ?TextStyle {
    return this._textStyle.clone();
  }

  _startOnMediaStatusUpdateInterval(): void {
    this._mediaStatusIntervalId = setInterval(this._onMediaStatusUpdate, INTERVAL_FREQUENCY);
  }

  _stopOnMediaStatusUpdateInterval(): void {
    if (this._mediaStatusIntervalId) {
      clearInterval(this._mediaStatusIntervalId);
      this._mediaStatusIntervalId = null;
    }
  }

  _bindEvents(): void {
    this._onMediaStatusUpdate = this._onMediaStatusUpdate.bind(this);
  }

  _parseTextTracks(castTextTracks: Array<Object>): Array<TextTrack> {
    const textTracks = [];
    castTextTracks.forEach(track => {
      const settings: Object = {
        id: track.trackId,
        index: track.trackId - 1,
        label: track.name,
        language: track.language,
        kind: track.subType || 'subtitles',
        active: false
      };
      textTracks.push(new TextTrack(settings));
    });
    return textTracks;
  }

  _parseVideoTracks(castVideoTracks: Array<Object>): Array<VideoTrack> {
    const videoTracks = [];
    castVideoTracks.forEach(track => {
      const settings: Object = {
        id: track.trackId,
        index: track.trackId - 1,
        label: track.name,
        language: track.language,
        active: false
      };
      videoTracks.push(new VideoTrack(settings));
    });
    return videoTracks;
  }

  _parseAudioTracks(castAudioTracks: Array<Object>): Array<AudioTrack> {
    const audioTracks = [];
    castAudioTracks.forEach(track => {
      const settings: Object = {
        id: track.trackId,
        index: track.trackId - 1,
        label: track.name,
        language: track.language,
        active: false
      };
      audioTracks.push(new AudioTrack(settings));
    });
    return audioTracks;
  }

  _selectVideoTrack(track: VideoTrack): void {
    this._stopOnMediaStatusUpdateInterval();
    const currentTrack = this.getActiveTracks().video;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.VIDEO_TRACK_CHANGED, {selectedVideoTrack: track}));
        this._startOnMediaStatusUpdateInterval();
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  _selectAudioTrack(track: AudioTrack): void {
    this._stopOnMediaStatusUpdateInterval();
    const currentTrack = this.getActiveTracks().audio;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.AUDIO_TRACK_CHANGED, {selectedAudioTrack: track}));
        this._startOnMediaStatusUpdateInterval();
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  _selectTextTrack(track: TextTrack): void {
    this._stopOnMediaStatusUpdateInterval();
    const currentTrack = this.getActiveTracks().text;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.TEXT_TRACK_CHANGED, {selectedTextTrack: track}));
        this._startOnMediaStatusUpdateInterval();
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  _selectTrack(newTrack: Track, currentTrack: ?Track, onSuccess: Function, onFailed: Function): void {
    if (currentTrack) {
      const index = this._activeTrackIds.indexOf(currentTrack.id);
      if (index > -1) {
        this._activeTrackIds.splice(index, 1);
      }
    }
    if (newTrack.id) {
      this._activeTrackIds.push(newTrack.id);
    }
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(this._activeTrackIds);
    const mediaSession = this._castSession.getMediaSession();
    mediaSession.editTracksInfo(
      tracksInfoRequest,
      () => {
        this._markActiveTrack(currentTrack, false);
        this._markActiveTrack(newTrack, true);
        onSuccess();
      },
      e => {
        onFailed(e);
      }
    );
  }

  _markActiveTrack(track: ?Track, active: boolean): void {
    if (track) {
      const id = track.id;
      const origTrack = this._tracks.find(t => t.id === id);
      if (origTrack) {
        origTrack.active = active;
      }
    }
  }

  _addTextTrackOffOption(): void {
    const textTracks = this._getTracksByType(TrackType.TEXT);
    const lastTrack = textTracks[textTracks.length - 1];
    if (textTracks && textTracks.length) {
      this._tracks.push(
        new TextTrack({
          id: lastTrack.id + 1,
          active: true,
          index: lastTrack.index + 1,
          kind: 'subtitles',
          label: 'Off',
          language: 'off'
        })
      );
    }
  }

  _getTracksByType(type?: string): Array<Track> {
    return !type
      ? this._tracks
      : this._tracks.filter(track => {
          if (type && TRACK_TYPE_TO_INSTANCE[type]) {
            return track instanceof TRACK_TYPE_TO_INSTANCE[type];
          }
          return true;
        });
  }

  _onMediaStatusUpdate(): void {
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      const isTextStyleChanged = () => {
        const localTextStyle = TextStyleConverter.toCastTextStyle(this.textStyle);
        const remoteTextStyle = mediaSession.media.textTrackStyle;
        if (remoteTextStyle) {
          return !(
            localTextStyle.backgroundColor === remoteTextStyle.backgroundColor &&
            localTextStyle.fontFamily === remoteTextStyle.fontFamily &&
            localTextStyle.fontScale === remoteTextStyle.fontScale &&
            localTextStyle.foregroundColor === remoteTextStyle.foregroundColor
          );
        }
        return false;
      };
      const isActiveTrackIdsChanged = () => {
        if (mediaSession.activeTrackIds) {
          return !(
            this._activeTrackIds.length === mediaSession.activeTrackIds.length &&
            this._activeTrackIds.every((value, index) => value === mediaSession.activeTrackIds[index])
          );
        }
        return false;
      };
      if (isActiveTrackIdsChanged()) {
        const diffIds = mediaSession.activeTrackIds.filter(i => !this._activeTrackIds.includes(i));
        diffIds.forEach(id => {
          const track = this._tracks.find(t => t.id === id);
          this.selectTrack(track);
        });
      }
      if (isTextStyleChanged()) {
        const style = TextStyleConverter.toPlayerTextStyle(mediaSession.media.textTrackStyle);
        this._textStyle = style;
        this.dispatchEvent(new FakeEvent(EventType.TEXT_STYLE_CHANGED, {textStyle: style}));
      }
    }
  }
}

export {CastTracksManager};
