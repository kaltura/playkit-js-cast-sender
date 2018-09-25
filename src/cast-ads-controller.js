// @flow
import {CUSTOM_CHANNEL} from './cast-player';
import {cast as remote} from 'kaltura-player-js';

const {CustomActionMessage, CustomActionType} = remote;

class CastAdsController {
  _castSession: Object;

  constructor() {
    this._castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  }

  skipAd(): void {
    this._castSession.sendMessage(CUSTOM_CHANNEL, new CustomActionMessage(CustomActionType.SKIP_AD));
  }
}

export {CastAdsController};
