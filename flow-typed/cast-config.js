// @flow

/**
 * @typedef {Object} CastConfigObject
 * @property {string} [receiverApplicationId] - Cast application id.
 * @property {string} [autoJoinPolicy] - Indicates if to join a running session on initialization.
 * @property {number} [liveEdgeThreshold] - Threshold from which you are not at the live edge.
 * @property {Object} [advertising] - The advertising options.
 * @property {boolean} [advertising.vast] - Whether using VAST ad tags (false means using VMAP ad tags).
 * @example
 * // Default config
 * {
 *  receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
 *  autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
 *  liveEdgeThreshold: 5,
 *  advertising: {
 *    vast: false
 *    }
 *  }
 */
type _CastConfigObject = {
  receiverApplicationId: string,
  autoJoinPolicy: string,
  liveEdgeThreshold: number,
  advertising: {
    vast: boolean
  }
};

declare type CastConfigObject = _CastConfigObject;
