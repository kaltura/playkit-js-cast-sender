//@flow
/** @jsx h */
import {ui} from 'kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components, h, preact} = ui;
// eslint-disable-next-line no-unused-vars
const {Fragment, Component} = preact;

const PRESET_NAME = 'Live';

@Components.withKeyboardEvent(PRESET_NAME)
class LiveUI extends Component {
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
   * @memberof LiveUI
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
                    <Components.LiveTag />
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
                <Components.SeekBarLivePlaybackContainer showFramePreview showTimeBubble playerContainer={this.props.playerContainer} />
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

LiveUI.displayName = PRESET_NAME;

/**
 * Live ui interface
 *
 * @export
 * @param {*} props component props
 * @returns {React$Element<any>} player ui tree
 */
export function liveUI(props: any): React$Element<any> {
  return <LiveUI {...props} />;
}
