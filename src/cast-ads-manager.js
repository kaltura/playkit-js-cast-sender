// @flow
import {CastPlayer, CUSTOM_CHANNEL} from './cast-player';
import {cast as remote, core} from 'kaltura-player-js';

const {CustomMessageType} = remote;
const {FakeEvent} = core;

class CastAdsManager {
  _castPlayer: CastPlayer;

  constructor(castPlayer: CastPlayer) {
    this._castPlayer = castPlayer;
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    castSession.addMessageListener(CUSTOM_CHANNEL, (customChannel, customMessage) => this._handleCustomAdMessage(customChannel, customMessage));
  }

  _handleCustomAdMessage(customChannel: string, customMessage: string): void {
    try {
      const parsedCustomMessage = JSON.parse(customMessage);
      if (parsedCustomMessage.type === CustomMessageType.AD_EVENT) {
        this._castPlayer.dispatchEvent(new FakeEvent(parsedCustomMessage.event, parsedCustomMessage.payload));
      }
    } catch (e) {
      //TODO: log
    }
  }
}

export {CastAdsManager};
