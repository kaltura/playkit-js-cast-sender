// @flow
/** @jsx h */
import {cast} from '@playkit-js/kaltura-player-js';
import * as presets from './ui-presets';

const {RemotePlayerUI} = cast;

class CastUI extends RemotePlayerUI {
  playbackUI(props: Object): any {
    return presets.playbackUI(props);
  }

  liveUI(props: Object): any {
    return presets.liveUI(props);
  }

  idleUI(): any {
    return presets.idleUI();
  }

  adsUI(props: Object): any {
    return presets.adsUI(props);
  }
}

export {CastUI};
