// @flow
import {CastPlayer} from './cast-player';
import {cast} from 'kaltura-player-js';

const {registerRemotePlayer} = cast;

declare var __VERSION__: string;
declare var __NAME__: string;
export {CastPlayer as RemotePlayer};
export {__VERSION__ as VERSION, __NAME__ as NAME};

if (CastPlayer.isSupported()) {
  registerRemotePlayer(CastPlayer.Type, CastPlayer);
}
