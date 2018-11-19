// @flow
import {cast, ui} from 'kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components} = ui;
const {RemotePlayerUI} = cast;

class CastUI extends RemotePlayerUI {
  playbackUI(props: Object): any {
    return (
      <div className={style.playbackGuiWWrapper}>
        <Components.KeyboardControl player={props.player} config={props.config} />
        <Components.Loading player={props.player} />
        <div className={style.playerGui} id="player-gui">
          <Components.OverlayPortal />
          <Components.BottomBar>
            <Components.SeekBarPlaybackContainer showFramePreview showTimeBubble player={props.player} playerContainer={props.playerContainer} />
            <div className={style.leftControls}>
              <Components.PlaybackControls player={props.player} />
              <Components.RewindControl player={props.player} step={10} />
              <Components.TimeDisplayPlaybackContainer format="current / total" />
            </div>
            <div className={style.rightControls}>
              <Components.VolumeControl player={props.player} />
              <Components.LanguageControl player={props.player} />
              <Components.CastControl player={props.player} />
              <Components.FullscreenControl player={props.player} />
            </div>
          </Components.BottomBar>
          <Components.CastOverlay player={props.player} />
          <Components.OverlayAction player={props.player} />
          <Components.PlaybackControls player={props.player} />
        </div>
        <Components.PrePlaybackPlayOverlay player={props.player} />
        <Components.CastAfterPlay player={props.player} />
      </div>
    );
  }

  liveUI(props: Object): any {
    return (
      <div className={style.playbackGuiWWrapper}>
        <Components.KeyboardControl player={props.player} config={props.config} />
        <Components.Loading player={props.player} />
        <div className={style.playerGui} id="player-gui">
          <Components.OverlayPortal />
          <Components.BottomBar>
            <Components.SeekBarLivePlaybackContainer showFramePreview showTimeBubble player={props.player} playerContainer={props.playerContainer} />
            <div className={style.leftControls}>
              <Components.PlaybackControls player={props.player} />
              <Components.LiveTag player={props.player} />
            </div>
            <div className={style.rightControls}>
              <Components.VolumeControl player={props.player} />
              <Components.LanguageControl player={props.player} />
              <Components.CastControl player={props.player} />
              <Components.FullscreenControl player={props.player} />
            </div>
          </Components.BottomBar>
          <Components.CastOverlay player={props.player} />
          <Components.OverlayAction player={props.player} />
          <Components.PlaybackControls player={props.player} />
        </div>
        <Components.PrePlaybackPlayOverlay player={props.player} />
        <Components.CastAfterPlay player={props.player} />
      </div>
    );
  }

  idleUI(props: Object): any {
    return (
      <div className={style.playbackGuiWWrapper}>
        <Components.Loading player={props.player} />
        <Components.CastOverlay player={props.player} />
      </div>
    );
  }

  adsUI(props: Object): any {
    return (
      <div className={style.adGuiWrapper}>
        <Components.KeyboardControl player={props.player} config={props.config} />
        <Components.Loading player={props.player} />
        <div className={style.playerGui} id="player-gui">
          <Components.CastOverlay player={props.player} />
          <Components.OverlayAction player={props.player} />
          <div>
            <Components.TopBar>
              <div className={style.leftControls}>
                <Components.AdNotice />
              </div>
              <div className={style.rightControls}>
                <Components.AdLearnMore />
              </div>
            </Components.TopBar>
            <Components.AdSkip player={props.player} />
          </div>
          <Components.BottomBar>
            <div className={style.leftControls}>
              <Components.PlaybackControls player={props.player} />
              <Components.TimeDisplayAdsContainer />
            </div>
            <div className={style.rightControls}>
              <Components.VolumeControl player={props.player} />
              <Components.CastControl player={props.player} />
              <Components.FullscreenControl player={props.player} />
            </div>
          </Components.BottomBar>
        </div>
      </div>
    );
  }
}

export {CastUI};
