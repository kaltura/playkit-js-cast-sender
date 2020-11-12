//@flow
/** @jsx h */
import {ui} from 'kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components, h, preact} = ui;
// eslint-disable-next-line no-unused-vars
const {Fragment, Component} = preact;
const PRESET_NAME = 'Playback';

@Components.withKeyboardEvent(PRESET_NAME)
class PlaybackUI extends Component {
  /**
   * @returns {void}
   */
  componentDidMount(): void {
    const props = this.props;
    props.updateIsKeyboardEnabled(true);
  }

  /**
   * render component
   *
   * @returns {React$Element} - component element
   * @memberof PlaybackUI
   */
  render() {
    return (
      <div className={style.playbackGuiWrapper}>
        <Components.Loading />
        <div className={style.playerGui} id="player-gui">
          <Components.GuiArea>
            <Fragment>
              <Components.OverlayPortal />
              <Components.CastOverlay />
              <Components.OverlayAction />
              <Components.PlaybackControls className={style.centerPlaybackControls} />
            </Fragment>
            <Fragment>
              <Components.BottomBar
                leftControls={
                  <Fragment>
                    <Components.PlaybackControls />
                    <Components.RewindControl step={10} />
                    <Components.ForwardControl step={10} />
                    <Components.TimeDisplayPlaybackContainer format="current / total" />
                  </Fragment>
                }
                rightControls={
                  <Fragment>
                    <Components.VolumeControl />
                    <Components.LanguageControl />
                    <Components.CastControl />
                    <Components.FullscreenControl />
                  </Fragment>
                }>
                <Components.SeekBarPlaybackContainer showFramePreview showTimeBubble playerContainer={this.props.playerContainer} />
              </Components.BottomBar>
            </Fragment>
          </Components.GuiArea>
        </div>
        <Components.PrePlaybackPlayOverlay />
        <Components.CastAfterPlay />
      </div>
    );
  }
}

PlaybackUI.displayName = PRESET_NAME;

/**
 * Playback ui interface
 *
 * @export
 * @param {*} props component props
 * @returns {React$Element} player ui tree
 */
export function playbackUI(props: any): React$Element<any> {
  return <PlaybackUI {...props} />;
}
