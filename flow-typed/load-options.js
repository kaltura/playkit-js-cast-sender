// @flow
import {core} from 'kaltura-player-js';

const {TextStyle} = core;

declare type CastLoadOptions = {
  autoplay?: boolean,
  startTime?: number,
  textStyle?: TextStyle,
  audioLanguage?: string,
  textLanguage?: string,
  adsConfig?: ?Object
};
