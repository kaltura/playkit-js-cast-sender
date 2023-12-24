//@flow
/** @jsx h */
import {ui} from '@playkit-js/kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components, h, preact} = ui;
// eslint-disable-next-line no-unused-vars
const {Fragment} = preact;
const PRESET_NAME = 'Ads';

/**
 * Ads ui interface component
 *
 * @param {*} props component props
 * @returns {?HTMLElement} player ui tree
 */
function AdsUI(props: any): ?React$Element<any> {
  props.updateIsKeyboardEnabled(true);
  return (
    <div className={style.adGuiWrapper}>
      <Components.Loading />
      <div className={style.playerGui} id="player-gui">
        <Components.GuiArea>
          <Fragment>
            <Components.CastOverlay />
            <Components.OverlayAction />
            <Components.PlaybackControls className={style.centerPlaybackControls} />
            <Components.AdSkip />
          </Fragment>
          <Fragment>
            <Components.TopBar leftControls={[Components.AdNotice]} rightControls={[Components.AdLearnMore]} />
            <Components.BottomBar
              leftControls={[Components.PlaybackControls, Components.TimeDisplayAdsContainer]}
              rightControls={[Components.VolumeControl, Components.CastControl, Components.FullscreenControl]}
            />
          </Fragment>
        </Components.GuiArea>
      </div>
    </div>
  );
}

const AdsUIComponent = Components.withKeyboardEvent(PRESET_NAME)(AdsUI);
AdsUIComponent.displayName = PRESET_NAME;
/**
 * Ads ui interface
 *
 * @export
 * @param {*} props component props
 * @returns {?HTMLElement} player ui tree
 */
export function adsUI(props: any): ?React$Element<any> {
  return <AdsUIComponent {...props} />;
}
