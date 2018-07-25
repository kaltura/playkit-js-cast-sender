// @flow
import {core} from 'kaltura-player-js';

const {Utils, getLogger} = core;

const SENDER_SDK_URL: string = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

class CastLoader {
  static _logger: any = getLogger('CastLoader');

  static load(): Promise<*> {
    return new Promise((resolve, reject) => {
      window['__onGCastApiAvailable'] = isAvailable => CastLoader._onGCastApiAvailable(isAvailable, resolve);
      CastLoader._loadCastSDK()
        .then(() => CastLoader._logger.debug('Cast sender lib has been loaded successfully'))
        .catch(e => {
          CastLoader._logger.debug('Cast sender lib loading failed', e);
          reject(e);
        });
    });
  }

  static _loadCastSDK(): Promise<*> {
    if (window['cast'] && window['cast']['framework']) {
      return Promise.resolve();
    }
    return Utils.Dom.loadScriptAsync(SENDER_SDK_URL);
  }

  static _onGCastApiAvailable(isAvailable: boolean, resolve: Function): void {
    CastLoader._logger.debug(`onGCastApiAvailable, isAvailable: ${isAvailable.toString()}`);
    if (isAvailable) {
      resolve();
    } else {
      CastLoader._logger.debug(`Google cast API isn't available yet`);
    }
  }
}

export {CastLoader};
