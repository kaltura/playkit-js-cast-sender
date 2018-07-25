// @flow
import {cast as remote, core} from 'kaltura-player-js';

const {TextStyleConverter} = remote;
const {Track, TextStyle, AudioTrack, VideoTrack, TextTrack, Utils, TrackType, EventType, FakeEvent, FakeEventTarget} = core;

class CastTracksManager extends FakeEventTarget {
  _remotePlayer: Object;
  _castSession: Object;
  _onMediaStatusUpdate: Function;
  _textStyle: TextStyle;
  _activeTrackIds: Array<number> = [];
  _tracks: Array<Track> = [];
  _typeToInstanceMap: {[type: string]: Track} = {
    [TrackType.AUDIO]: AudioTrack,
    [TrackType.VIDEO]: VideoTrack,
    [TrackType.TEXT]: TextTrack
  };

  constructor(remotePlayer: Object) {
    super();
    this._remotePlayer = remotePlayer;
    this._textStyle = new TextStyle();
    this._onMediaStatusUpdate = this._onMediaStatusUpdate.bind(this);
    return new Proxy(this, {
      get: (obj: CastTracksManager, prop: string) => {
        if (!this._castSession) {
          this._castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        }
        return obj[prop];
      }
    });
  }

  parseTracks(): void {
    const tracks = this._remotePlayer.mediaInfo.tracks;
    if (tracks.length > 0) {
      const castTextTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.TEXT);
      const castVideoTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.VIDEO);
      const castAudioTracks = tracks.filter(t => t.type === chrome.cast.media.TrackType.AUDIO);
      const textTracks = this._parseTextTracks(castTextTracks);
      const videoTracks = this._parseVideoTracks(castVideoTracks);
      const audioTracks = this._parseAudioTracks(castAudioTracks);
      this._tracks = audioTracks.concat(videoTracks).concat(textTracks);
      this._addTextTrackOffOption();
    }
    this._castSession.getMediaSession().addUpdateListener(this._onMediaStatusUpdate);
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
    this._tracks = [];
    this._activeTrackIds = [];
  }

  destroy(): void {
    this._tracks = [];
    this._activeTrackIds = [];
    const mediaSession = this._castSession.getMediaSession();
    if (mediaSession) {
      mediaSession.removeUpdateListener(this._onMediaStatusUpdate);
    }
  }

  set textStyle(style: TextStyle): void {
    const textTrackStyle = TextStyleConverter.toCastTextStyle(style);
    const tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(null, textTrackStyle);
    this._castSession.getMediaSession().editTracksInfo(
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
    const currentTrack = this.getActiveTracks().video;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.VIDEO_TRACK_CHANGED, {selectedVideoTrack: track}));
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  _selectAudioTrack(track: AudioTrack): void {
    const currentTrack = this.getActiveTracks().audio;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.AUDIO_TRACK_CHANGED, {selectedAudioTrack: track}));
      },
      (/* e */) => {
        // TODO - Error handling
      }
    );
  }

  _selectTextTrack(track: TextTrack): void {
    const currentTrack = this.getActiveTracks().text;
    this._selectTrack(
      track,
      currentTrack,
      () => {
        this.dispatchEvent(new FakeEvent(EventType.TEXT_TRACK_CHANGED, {selectedTextTrack: track}));
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
    this._castSession.getMediaSession().editTracksInfo(
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
    if (textTracks && textTracks.length) {
      this._tracks.push(
        new TextTrack({
          active: true,
          index: textTracks.length,
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
          if (type && this._typeToInstanceMap[type]) {
            return track instanceof this._typeToInstanceMap[type];
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
        return !(
          localTextStyle.backgroundColor === remoteTextStyle.backgroundColor &&
          localTextStyle.fontFamily === remoteTextStyle.fontFamily &&
          localTextStyle.fontScale === remoteTextStyle.fontScale &&
          localTextStyle.foregroundColor === remoteTextStyle.foregroundColor
        );
      };
      const isActiveTrackIdsChanged = () => {
        return !(
          this._activeTrackIds.length === mediaSession.activeTrackIds.length &&
          this._activeTrackIds.every((value, index) => value === mediaSession.activeTrackIds[index])
        );
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
