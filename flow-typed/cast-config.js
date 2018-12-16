// @flow

/**
 * @typedef {Object} CastConfigObject
 * @param {string} receiverApplicationId - Cast application id.
 * @param {string} [autoJoinPolicy=chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED] - Indicates if to join a running session on initialization.
 * @param {number} [liveEdgeThreshold=5] - Threshold from which you are not at the live edge.
 * @param {Object} [advertising={vast: false}] - The advertising options.
 * @param {boolean} [advertising.vast=false] - Whether using VAST ad tags (false means using VMAP ad tags).
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
