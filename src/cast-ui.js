// @flow
import {cast, ui} from 'kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components} = ui;
const {RemotePlayerUI} = cast;

class CastUi extends RemotePlayerUI {
  playbackUI(props: Object): any {
    return (
      <div className={style.playbackGuiWWrapper}>
        <Components.CastOverlay player={props.player} />
        <Components.KeyboardControl player={props.player} config={props.config} />
        <Components.Loading player={props.player} />
        <div className={style.playerGui} id="player-gui">
          <Components.OverlayPortal />
          <Components.OverlayAction player={props.player} />
          <Components.BottomBar>
            <Components.SeekBarPlaybackContainer showFramePreview showTimeBubble player={props.player} playerContainer={props.playerContainer} />
            <div className={style.leftControls}>
              <Components.PlayPauseControl player={props.player} />
              <Components.RewindControl player={props.player} step={10} />
              <Components.TimeDisplayPlaybackContainer format="current / total" />
            </div>
            <div className={style.rightControls}>
              <Components.VolumeControl player={props.player} />
              <Components.LanguageControl player={props.player} />
              <Components.ChromecastControl player={props.player} />
              <Components.FullscreenControl player={props.player} />
            </div>
          </Components.BottomBar>
        </div>
        <Components.PrePlaybackPlayOverlay player={props.player} />
      </div>
    );
  }

  liveUI(props: Object): any {
    return (
      <div className={style.playbackGuiWWrapper}>
        <Components.CastOverlay player={props.player} />
        <Components.KeyboardControl player={props.player} config={props.config} />
        <Components.Loading player={props.player} />
        <div className={style.playerGui} id="player-gui">
          <Components.OverlayPortal />
          <Components.OverlayAction player={props.player} />
          <Components.BottomBar>
            <Components.SeekBarLivePlaybackContainer showFramePreview showTimeBubble player={props.player} playerContainer={props.playerContainer} />
            <div className={style.leftControls}>
              <Components.PlayPauseControl player={props.player} />
              <Components.LiveTag player={props.player} />
            </div>
            <div className={style.rightControls}>
              <Components.VolumeControl player={props.player} />
              <Components.LanguageControl player={props.player} />
              <Components.ChromecastControl player={props.player} />
              <Components.FullscreenControl player={props.player} />
            </div>
          </Components.BottomBar>
        </div>
        <Components.PrePlaybackPlayOverlay player={props.player} />
      </div>
    );
  }
}

export {CastUi};
