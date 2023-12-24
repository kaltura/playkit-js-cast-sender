//@flow
/** @jsx h */
import {ui} from '@playkit-js/kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components, h, preact} = ui;
// eslint-disable-next-line no-unused-vars
const {Fragment, Component} = preact;
const PRESET_NAME = 'Live';
const withKeyboardEvent = ui.components.withKeyboardEvent;

@withKeyboardEvent(PRESET_NAME)
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
                leftControls={[Components.PlaybackControls, Components.LiveTag]}
                //todo:missing component.LanguageControl
                rightControls={[Components.VolumeControl, Components.SettingsControl, Components.CastControl, Components.FullscreenControl]}>
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
