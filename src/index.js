// @flow
import {CastPlayer} from './cast-player';
import {cast} from 'kaltura-player-js';

const {registerRemotePlayer} = cast;

declare var __VERSION__: string;
declare var __NAME__: string;

const NAME = __NAME__;
const VERSION = __VERSION__;

export {CastPlayer as RemotePlayer};
export {VERSION, NAME};

if (CastPlayer.isSupported()) {
  registerRemotePlayer(CastPlayer.Type, CastPlayer);
}
