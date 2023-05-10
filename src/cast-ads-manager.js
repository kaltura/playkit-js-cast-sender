// @flow
import {CastPlayer} from './cast-player';
import {core} from '@playkit-js/kaltura-player-js';

const {EventManager, EventType, FakeEventTarget} = core;

class CastAdsManager extends FakeEventTarget {
  _castPlayer: CastPlayer;
  _adBreak: boolean = false;
  _allAdsCompleted: boolean = true;
  _eventManager: EventManager;

  constructor(castPlayer: CastPlayer) {
    super();
    this._castPlayer = castPlayer;
    this._eventManager = new EventManager();
    this._attachListeners();
  }

  _attachListeners(): void {
    this._eventManager.listen(this._castPlayer, EventType.AD_MANIFEST_LOADED, () => {
      this._allAdsCompleted = false;
    });

    this._eventManager.listen(this._castPlayer, EventType.AD_BREAK_START, () => {
      this._adBreak = true;
    });

    this._eventManager.listen(this._castPlayer, EventType.AD_BREAK_END, () => {
      this._adBreak = false;
    });

    this._eventManager.listen(this._castPlayer, EventType.ALL_ADS_COMPLETED, () => {
      this._allAdsCompleted = true;
    });
  }

  get adBreak(): boolean {
    return this._adBreak;
  }

  get allAdsCompleted(): boolean {
    return this._allAdsCompleted;
  }

  reset(): void {
    this._eventManager.removeAll();
    this._adBreak = false;
    this._allAdsCompleted = true;
    this._attachListeners();
  }

  destroy(): void {
    this._adBreak = false;
    this._allAdsCompleted = true;
    this._eventManager.destroy();
  }
}

export {CastAdsManager};
