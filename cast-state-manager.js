//@flow
import {core} from 'kaltura-player-js';

const {State, FakeEvent, EventType, FakeEventTarget, StateType} = core;

class CastStateManager extends FakeEventTarget {
  _currentState: State;
  _previousState: State;
  _remotePlayer: Object;
  _remotePlayerController: Object;
  _updateState: Function;

  constructor(remotePlayer: Object, remotePlayerController: Object) {
    super();
    this._remotePlayer = remotePlayer;
    this._remotePlayerController = remotePlayerController;
    this._currentState = new State(StateType.IDLE);
    this._previousState = new State(StateType.IDLE);
    this._updateState = this._updateState.bind(this);
    this._remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED, this._updateState);
  }

  _updateState(): void {
    if (this._remotePlayer.playerState) {
      this._currentState.duration = Date.now() / 1000;
      this._previousState = this._currentState;
      this._currentState = new State(this._remotePlayer.playerState.toLowerCase());
      this.dispatchEvent(
        new FakeEvent(EventType.PLAYER_STATE_CHANGED, {
          oldState: this.previousState,
          newState: this.currentState
        })
      );
    }
  }

  reset(): void {
    this._currentState = new State(StateType.IDLE);
    this._previousState = new State(StateType.IDLE);
  }

  destroy(): void {
    this._remotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED, this._updateState);
    this._currentState = new State(StateType.IDLE);
    this._previousState = new State(StateType.IDLE);
  }

  get currentState(): State {
    return this._currentState;
  }

  get previousState(): State {
    return this._previousState;
  }
}

export {CastStateManager};
