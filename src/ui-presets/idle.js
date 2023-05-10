//@flow
/** @jsx h */
import {ui} from '@playkit-js/kaltura-player-js';

// eslint-disable-next-line no-unused-vars
const {style, Components, h} = ui;
// eslint-disable-next-line no-unused-vars
const PRESET_NAME = 'Idle';

/**
 * Idle ui interface component
 *
 * @returns {React$Element} player ui tree
 */
function IdleUI(): React$Element<any> {
  return (
    <div className={style.playbackGuiWrapper}>
      <Components.Loading />
      <Components.CastOverlay />
    </div>
  );
}

IdleUI.displayName = PRESET_NAME;

/**
 * Idle ui interface
 *
 * @export
 * @param {*} props component props
 * @returns {React$Element} player ui tree
 */
export function idleUI(props: any): React$Element<any> {
  return <IdleUI {...props} />;
}
