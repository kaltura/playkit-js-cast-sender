var KalturaPlayer="object"==typeof KalturaPlayer?KalturaPlayer:{};KalturaPlayer.cast=KalturaPlayer.cast||{},KalturaPlayer.cast.sender=function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=KalturaPlayer},function(e,t,n){"use strict";n.r(t),n.d(t,"RemotePlayer",(function(){return Ve})),n.d(t,"VERSION",(function(){return Xe})),n.d(t,"NAME",(function(){return qe}));var a=n(0);function r(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var i,s=a.core.State,o=a.core.FakeEvent,c=a.core.EventType,l=a.core.FakeEventTarget,u=a.core.StateType,d=function(e){var t,n;function a(t,n){var a;return(a=e.call(this)||this)._remotePlayer=t,a._remotePlayerController=n,a._currentState=new s(u.IDLE),a._previousState=new s(u.IDLE),a._updateState=a._updateState.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(a)),a._remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,a._updateState),a}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var i,l,d,_=a.prototype;return _._updateState=function(){this._currentState.duration=Date.now()/1e3,this._previousState=this._currentState,this._remotePlayer.playerState?this._currentState=new s(this._remotePlayer.playerState.toLowerCase()):this._currentState=new s(u.IDLE),this.dispatchEvent(new o(c.PLAYER_STATE_CHANGED,{oldState:this.previousState,newState:this.currentState}))},_.reset=function(){this._currentState=new s(u.IDLE),this._previousState=new s(u.IDLE)},_.destroy=function(){this._remotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,this._updateState),this._currentState=new s(u.IDLE),this._previousState=new s(u.IDLE)},i=a,(l=[{key:"currentState",get:function(){return this._currentState}},{key:"previousState",get:function(){return this._previousState}}])&&r(i.prototype,l),d&&r(i,d),a}(l);function _(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var f=a.cast.TextStyleConverter,v=a.core.Track,p=a.core.getLogger,y=a.core.TextStyle,m=a.core.AudioTrack,E=a.core.VideoTrack,C=a.core.TextTrack,T=a.core.Utils,k=a.core.TrackType,S=a.core.EventType,A=a.core.FakeEvent,P=a.core.FakeEventTarget,b=a.core.Error,I=((i={})[k.AUDIO]=m,i[k.VIDEO]=E,i[k.TEXT]=C,i),w=function(e){var t,n;function a(t){var n;return g(h(n=e.call(this)||this),"_activeTrackIds",[]),g(h(n),"_tracks",[]),n._remotePlayer=t,n._logger=p("CastTracksManager"),n._castSession=cast.framework.CastContext.getInstance().getCurrentSession(),n._textStyle=new y,n._bindEvents(),n}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r,i,s,o=a.prototype;return o.parseTracks=function(){var e=this._remotePlayer.mediaInfo.tracks;if(e&&e.length>0){var t=e.filter((function(e){return e.type===chrome.cast.media.TrackType.TEXT})),n=e.filter((function(e){return e.type===chrome.cast.media.TrackType.VIDEO})),a=e.filter((function(e){return e.type===chrome.cast.media.TrackType.AUDIO})),r=this._parseTextTracks(t),i=this._parseVideoTracks(n),s=this._parseAudioTracks(a);this._tracks=s.concat(i).concat(r),this._addTextTrackOffOption()}this._logger.debug("Parse tracks",this._tracks),this._startOnMediaStatusUpdateInterval(),this.dispatchEvent(new A(S.TRACKS_CHANGED,{tracks:this._tracks}))},o.getTracks=function(e){return T.Object.copyDeep(this._getTracksByType(e))},o.getActiveTracks=function(){return T.Object.copyDeep({video:this._getTracksByType(k.VIDEO).find((function(e){return e.active})),audio:this._getTracksByType(k.AUDIO).find((function(e){return e.active})),text:this._getTracksByType(k.TEXT).find((function(e){return e.active}))})},o.selectTrack=function(e){e instanceof E?this._selectVideoTrack(e):e instanceof m?this._selectAudioTrack(e):e instanceof C&&this._selectTextTrack(e)},o.hideTextTrack=function(){var e=this._tracks.find((function(e){return"off"===e.language}));this.selectTrack(e)},o.reset=function(){this._stopOnMediaStatusUpdateInterval(),this._tracks=[],this._activeTrackIds=[]},o.destroy=function(){this._stopOnMediaStatusUpdateInterval(),this._tracks=[],this._activeTrackIds=[]},o._startOnMediaStatusUpdateInterval=function(){this._mediaStatusIntervalId||(this._mediaStatusIntervalId=setInterval(this._onMediaStatusUpdate,Be))},o._stopOnMediaStatusUpdateInterval=function(){this._mediaStatusIntervalId&&(clearInterval(this._mediaStatusIntervalId),this._mediaStatusIntervalId=null)},o._bindEvents=function(){this._onMediaStatusUpdate=this._onMediaStatusUpdate.bind(this)},o._parseTextTracks=function(e){var t=this,n=[],a=function(e){var t={id:e.trackId,index:e.trackId-1,label:e.name,language:e.language,kind:e.subType||"subtitles",active:!1};n.push(new C(t))},r=[],i=[];return e.forEach((function(e){e.trackContentId?i.push(e):r.push(e)})),r.forEach(a),i.forEach((function(e){r.some((function(t){return v.langComparer(e.language,t.language)}))?t._logger.warn("duplicated language, taking the inband option. Language: ",e.language):a(e)})),n},o._parseVideoTracks=function(e){var t=[];return e.forEach((function(e){var n={id:e.trackId,index:e.trackId-1,label:e.name,language:e.language,active:!1};t.push(new E(n))})),t},o._parseAudioTracks=function(e){var t=[];return e.forEach((function(e){var n={id:e.trackId,index:e.trackId-1,label:e.name,language:e.language,active:!1};t.push(new m(n))})),t},o._selectVideoTrack=function(e){var t=this;this._stopOnMediaStatusUpdateInterval();var n=this.getActiveTracks().video;this._selectTrack(e,n,(function(){t.dispatchEvent(new A(S.VIDEO_TRACK_CHANGED,{selectedVideoTrack:e})),t._startOnMediaStatusUpdateInterval()}),(function(e){t.dispatchEvent(new A(S.ERROR,new b(b.Severity.RECOVERABLE,b.Category.CAST,b.Code.EDIT_TRACKS_INFO_ERROR,e)))}))},o._selectAudioTrack=function(e){var t=this;this._stopOnMediaStatusUpdateInterval();var n=this.getActiveTracks().audio;this._selectTrack(e,n,(function(){t.dispatchEvent(new A(S.AUDIO_TRACK_CHANGED,{selectedAudioTrack:e})),t._startOnMediaStatusUpdateInterval()}),(function(e){t.dispatchEvent(new A(S.ERROR,new b(b.Severity.RECOVERABLE,b.Category.CAST,b.Code.CAST_EDIT_TRACKS_INFO_ERROR,e)))}))},o._selectTextTrack=function(e){var t=this;this._stopOnMediaStatusUpdateInterval();var n=this.getActiveTracks().text;this._selectTrack(e,n,(function(){t.dispatchEvent(new A(S.TEXT_TRACK_CHANGED,{selectedTextTrack:e})),t._startOnMediaStatusUpdateInterval()}),(function(e){t.dispatchEvent(new A(S.ERROR,new b(b.Severity.RECOVERABLE,b.Category.CAST,b.Code.EDIT_TRACKS_INFO_ERROR,e)))}))},o._selectTrack=function(e,t,n,a){var r=this;if(this._logger.debug("Select track",e,t,this._activeTrackIds),t){var i=this._activeTrackIds.indexOf(t.id);i>-1&&this._activeTrackIds.splice(i,1)}e.id&&"off"!==e.language&&this._activeTrackIds.push(e.id);var s=new chrome.cast.media.EditTracksInfoRequest(this._activeTrackIds);this._castSession.getMediaSession().editTracksInfo(s,(function(){r._logger.debug("Select track succeeded"),r._markActiveTrack(t,!1),r._markActiveTrack(e,!0),n()}),(function(e){r._logger.debug("Select track failed",e),a(e)}))},o._markActiveTrack=function(e,t){if(e){var n=e.id,a=e.language,r=this._tracks.find((function(e){return e.id===n||e.language===a&&"off"===a}));r&&(r.active=t)}},o._addTextTrackOffOption=function(){var e=this._getTracksByType(k.TEXT);e&&e.length&&this._tracks.push(new C({active:!0,index:e.length,kind:"subtitles",label:"Off",language:"off"}))},o._getTracksByType=function(e){return e?this._tracks.filter((function(t){return!e||!I[e]||t instanceof I[e]})):this._tracks},o._onMediaStatusUpdate=function(){var e,t,n=this,a=this._castSession.getMediaSession();if(a){if(!(!a.activeTrackIds||n._activeTrackIds.length===a.activeTrackIds.length&&n._activeTrackIds.every((function(e,t){return e===a.activeTrackIds[t]}))))a.activeTrackIds.filter((function(e){return!n._activeTrackIds.includes(e)})).forEach((function(e){var t=n._tracks.find((function(t){return t.id===e}));n.selectTrack(t)}));if(e=f.toCastTextStyle(n.textStyle),(t=a.media.textTrackStyle)&&(e.backgroundColor!==t.backgroundColor||e.fontFamily!==t.fontFamily||e.fontScale!==t.fontScale||e.foregroundColor!==t.foregroundColor)){var r=f.toPlayerTextStyle(a.media.textTrackStyle);this._textStyle=r,this.dispatchEvent(new A(S.TEXT_STYLE_CHANGED,{textStyle:r}))}}},r=a,(i=[{key:"textStyle",set:function(e){var t=this;this._logger.debug("Setting text style",e);var n=f.toCastTextStyle(e),a=new chrome.cast.media.EditTracksInfoRequest(null,n);this._castSession.getMediaSession().editTracksInfo(a,(function(){t._logger.debug("Setting text style succeed"),t._textStyle=e,t.dispatchEvent(new A(S.TEXT_STYLE_CHANGED,{textStyle:e}))}),(function(e){t._logger.debug("Setting text style failed",e),t.dispatchEvent(new A(S.ERROR,new b(b.Severity.RECOVERABLE,b.Category.CAST,b.Code.EDIT_TRACKS_INFO_ERROR,e)))}))},get:function(){return this._textStyle.clone()}}])&&_(r.prototype,i),s&&_(r,s),a}(P);function R(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function D(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var M,L=a.core.EventType,N=a.core.FakeEvent,x=function(e){var t,n;function a(t,n){var a;return O(D(a=e.call(this)||this),"_muted",!1),O(D(a),"_volume",1),O(D(a),"_paused",!1),O(D(a),"_currentTime",0),O(D(a),"_duration",0),O(D(a),"_seeking",!1),a._remotePlayer=t,a._remotePlayerController=n,a._bindEvents(),a._toggleListeners(!0),a}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r,i,s,o=a.prototype;return o.reset=function(){this._toggleListeners(!1),clearInterval(this._liveCurrentTimeIntervalId),this._resetFlags(),this._toggleListeners(!0)},o.destroy=function(){clearInterval(this._liveCurrentTimeIntervalId),this._toggleListeners(!1),this._muted=!1,this._volume=1,this._resetFlags()},o.play=function(){this._remotePlayerController.playOrPause()},o.pause=function(){this._remotePlayer.canPause&&this._remotePlayerController.playOrPause()},o._resetFlags=function(){this._paused=!1,this._currentTime=0,this._duration=0,this._seeking=!1},o._bindEvents=function(){this._onCurrentTimeChanged=this._onCurrentTimeChanged.bind(this),this._onIsPausedChanged=this._onIsPausedChanged.bind(this),this._onDurationChanged=this._onDurationChanged.bind(this),this._onVolumeLevelChanged=this._onVolumeLevelChanged.bind(this),this._onIsMutedChanged=this._onIsMutedChanged.bind(this),this._onIsMediaLoadedChanged=this._onIsMediaLoadedChanged.bind(this),this._onLiveCurrentTimeChanged=this._onLiveCurrentTimeChanged.bind(this)},o._toggleListeners=function(e){var t,n=this,a=((t={})[cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED]=this._onIsMediaLoadedChanged,t[cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED]=this._onIsPausedChanged,t[cast.framework.RemotePlayerEventType.DURATION_CHANGED]=this._onDurationChanged,t[cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]=this._onVolumeLevelChanged,t[cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED]=this._onIsMutedChanged,t);e?Object.keys(a).forEach((function(e){return n._remotePlayerController.addEventListener(e,a[e])})):(Object.keys(a).forEach((function(e){return n._remotePlayerController.removeEventListener(e,a[e])})),this._remotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,this._onCurrentTimeChanged))},o._onIsMediaLoadedChanged=function(e){var t=this;e.value&&this._remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,(function e(){t._remotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,e),t._remotePlayer.mediaInfo.streamType===chrome.cast.media.StreamType.LIVE?(t._mediaSession=cast.framework.CastContext.getInstance().getCurrentSession().getMediaSession(),t._liveCurrentTimeIntervalId=setInterval(t._onLiveCurrentTimeChanged,Be)):t._remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,t._onCurrentTimeChanged)}))},o._onCurrentTimeChanged=function(){this._currentTime=this._remotePlayer.currentTime,this._maybeDispatchTimeUpdate(),this._maybeEndPlayback()},o._onLiveCurrentTimeChanged=function(){this._currentTime=this._mediaSession.currentTime,this._maybeDispatchTimeUpdate(),this._maybeEndLivePlayback()},o._onIsPausedChanged=function(){this._paused=this._remotePlayer.isPaused,this._paused?this.dispatchEvent(new N(L.PAUSE)):this.dispatchEvent(new N(L.PLAY))},o._onDurationChanged=function(){this._duration=this._remotePlayer.duration,this.dispatchEvent(new N(L.DURATION_CHANGE))},o._onVolumeLevelChanged=function(){this._volume=this._remotePlayer.volumeLevel,this.dispatchEvent(new N(L.VOLUME_CHANGE))},o._onIsMutedChanged=function(){this._muted=this._remotePlayer.isMuted,this.dispatchEvent(new N(L.MUTE_CHANGE,{mute:this.muted}))},o._maybeDispatchTimeUpdate=function(){this._seeking?this._seekTargetTime&&(this._seekForward&&this.currentTime>=this._seekTargetTime||!this._seekForward&&this.currentTime<=this._seekTargetTime)&&(this._seeking=!1,this._seekTargetTime=null,this.dispatchEvent(new N(L.SEEKED)),this.dispatchEvent(new N(L.TIME_UPDATE))):this.dispatchEvent(new N(L.TIME_UPDATE))},o._maybeEndPlayback=function(){var e=Math.round(this._duration-this._currentTime);0!==this._currentTime&&0!==this._duration&&e<=1&&(this._currentTime=this._duration,this._paused=!0,this.dispatchEvent(new N(L.ENDED)))},o._maybeEndLivePlayback=function(){var e=this._mediaSession.liveSeekableRange;e&&e.isLiveDone&&(this._paused=!0,this.dispatchEvent(new N(L.ENDED)))},r=a,(i=[{key:"muted",set:function(e){(e&&!this.muted||!e&&this.muted)&&this._remotePlayerController.muteOrUnmute()},get:function(){return this._muted}},{key:"volume",set:function(e){this._remotePlayer.canControlVolume&&(this._remotePlayer.volumeLevel=e,this._remotePlayerController.setVolumeLevel())},get:function(){return this._volume}},{key:"currentTime",set:function(e){this._remotePlayer.canSeek&&(this._seeking=!0,this.dispatchEvent(new N(L.SEEKING)),this._remotePlayer.currentTime=this._seekTargetTime=e,this._seekForward=e>this.currentTime,this._remotePlayerController.seek())},get:function(){return this._remotePlayer.savedPlayerState?this._remotePlayer.savedPlayerState.currentTime:this._currentTime}},{key:"duration",get:function(){return this._duration}},{key:"paused",get:function(){return this._remotePlayer.savedPlayerState?this._remotePlayer.savedPlayerState.isPaused:this._paused}},{key:"seeking",get:function(){return this._seeking}}])&&R(r.prototype,i),s&&R(r,s),a}(a.core.FakeEventTarget),G=a.ui.style,U=a.ui.Components,H=a.ui.h;function j(){return H("div",{className:G.playbackGuiWrapper},H(U.Loading,null),H(U.CastOverlay,null))}j.displayName="Idle";var F=a.ui.style,B=a.ui.Components,K=a.ui.h,V=a.ui.preact,Y=V.Fragment,q=V.Component,X=(0,a.ui.components.withKeyboardEvent)("Playback")(M=function(e){var t,n;function a(){return e.apply(this,arguments)||this}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r=a.prototype;return r.componentDidMount=function(){this.props.updateIsKeyboardEnabled(!0)},r.render=function(){return K("div",{className:F.playbackGuiWrapper},K(B.Loading,null),K("div",{className:F.playerGui,id:"player-gui"},K(B.GuiArea,null,K(Y,null,K(B.OverlayPortal,null),K(B.CastOverlay,null),K(B.OverlayAction,null),K(B.PlaybackControls,{className:F.centerPlaybackControls})),K(Y,null,K(B.BottomBar,{leftControls:K(Y,null,K(B.PlaybackControls,null),K(B.RewindControl,{step:10}),K(B.ForwardControl,{step:10}),K(B.TimeDisplayPlaybackContainer,{format:"current / total"})),rightControls:K(Y,null,K(B.VolumeControl,null),K(B.LanguageControl,null),K(B.CastControl,null),K(B.FullscreenControl,null))},K(B.SeekBarPlaybackContainer,{showFramePreview:!0,showTimeBubble:!0,playerContainer:this.props.playerContainer}))))),K(B.PrePlaybackPlayOverlay,null),K(B.CastAfterPlay,null))},a}(q))||M;X.displayName="Playback";var W=a.ui.style,z=a.ui.Components,J=a.ui.h,Q=a.ui.preact.Fragment;var Z,$=z.withKeyboardEvent("Ads")((function(e){return e.updateIsKeyboardEnabled(!0),J("div",{className:W.adGuiWrapper},J(z.Loading,null),J("div",{className:W.playerGui,id:"player-gui"},J(z.GuiArea,null,J(Q,null,J(z.CastOverlay,null),J(z.OverlayAction,null),J(z.PlaybackControls,{className:W.centerPlaybackControls}),J(z.AdSkip,null)),J(Q,null,J(z.TopBar,{leftControls:J(Q,null,J(z.AdNotice,null)),rightControls:J(Q,null,J(z.AdLearnMore,null))}),J(z.BottomBar,{leftControls:J(Q,null,J(z.PlaybackControls,null),J(z.TimeDisplayAdsContainer,null)),rightControls:J(Q,null,J(z.VolumeControl,null),J(z.CastControl,null),J(z.FullscreenControl,null))})))))}));$.displayName="Ads";var ee=a.ui.style,te=a.ui.Components,ne=a.ui.h,ae=a.ui.preact,re=ae.Fragment,ie=ae.Component,se=(0,a.ui.components.withKeyboardEvent)("Live")(Z=function(e){var t,n;function a(){return e.apply(this,arguments)||this}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r=a.prototype;return r.componentDidMount=function(){this.props.updateIsKeyboardEnabled(!0)},r.render=function(){return ne("div",{className:ee.playbackGuiWrapper},ne(te.Loading,null),ne("div",{className:ee.playerGui,id:"player-gui"},ne(te.GuiArea,null,ne(re,null,ne(te.OverlayPortal,null),ne(te.CastOverlay,null),ne(te.OverlayAction,null),ne(te.PlaybackControls,{className:ee.centerPlaybackControls})),ne(re,null,ne(te.BottomBar,{leftControls:ne(re,null,ne(te.PlaybackControls,null),ne(te.LiveTag,null)),rightControls:ne(re,null,ne(te.VolumeControl,null),ne(te.LanguageControl,null),ne(te.CastControl,null),ne(te.FullscreenControl,null))},ne(te.SeekBarLivePlaybackContainer,{showFramePreview:!0,showTimeBubble:!0,playerContainer:this.props.playerContainer}))))),ne(te.PrePlaybackPlayOverlay,null),ne(te.CastAfterPlay,null))},a}(ie))||Z;se.displayName="Live";var oe=function(e){var t,n;function a(){return e.apply(this,arguments)||this}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r=a.prototype;return r.playbackUI=function(e){return function(e){return K(X,e)}(e)},r.liveUI=function(e){return function(e){return ne(se,e)}(e)},r.idleUI=function(){return H(j,e);var e},r.adsUI=function(e){return function(e){return J($,e)}(e)},a}(a.cast.RemotePlayerUI);var ce,le,ue,de=a.core.Utils,_e=a.core.getLogger,he=function(){function e(){}return e.load=function(){return new Promise((function(t,n){window.__onGCastApiAvailable=function(n){return e._onGCastApiAvailable(n,t)},e._loadCastSDK().then((function(){return e._logger.debug("Cast sender lib has been loaded successfully")})).catch((function(t){e._logger.debug("Cast sender lib loading failed",t),n(t)}))}))},e._loadCastSDK=function(){return window.cast&&window.cast.framework?Promise.resolve():de.Dom.loadScriptAsync("//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1")},e._onGCastApiAvailable=function(t,n){e._logger.debug("onGCastApiAvailable, isAvailable: "+t.toString()),t?n():e._logger.debug("Google cast API isn't available yet")},e}();ce=he,le="_logger",ue=_e("CastLoader"),le in ce?Object.defineProperty(ce,le,{value:ue,enumerable:!0,configurable:!0,writable:!0}):ce[le]=ue;var ge=a.cast.CustomActionMessage,fe=a.cast.CustomActionType,ve=function(){function e(){this._castSession=cast.framework.CastContext.getInstance().getCurrentSession()}return e.prototype.skipAd=function(){this._castSession.sendMessage(Ke,new ge(fe.SKIP_AD))},e}();function pe(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function ye(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function me(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Ee=a.core.EventManager,Ce=a.core.EventType,Te=function(e){var t,n;function a(t){var n;return me(ye(n=e.call(this)||this),"_adBreak",!1),me(ye(n),"_allAdsCompleted",!0),n._castPlayer=t,n._eventManager=new Ee,n._attachListeners(),n}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var r,i,s,o=a.prototype;return o._attachListeners=function(){var e=this;this._eventManager.listen(this._castPlayer,Ce.AD_MANIFEST_LOADED,(function(){e._allAdsCompleted=!1})),this._eventManager.listen(this._castPlayer,Ce.AD_BREAK_START,(function(){e._adBreak=!0})),this._eventManager.listen(this._castPlayer,Ce.AD_BREAK_END,(function(){e._adBreak=!1})),this._eventManager.listen(this._castPlayer,Ce.ALL_ADS_COMPLETED,(function(){e._allAdsCompleted=!0}))},o.reset=function(){this._eventManager.removeAll(),this._adBreak=!1,this._allAdsCompleted=!0,this._attachListeners()},o.destroy=function(){this._adBreak=!1,this._allAdsCompleted=!0,this._eventManager.destroy()},r=a,(i=[{key:"adBreak",get:function(){return this._adBreak}},{key:"allAdsCompleted",get:function(){return this._allAdsCompleted}}])&&pe(r.prototype,i),s&&pe(r,s),a}(a.core.FakeEventTarget);function ke(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function Se(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Ae(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var Pe=a.core.Env,be=(a.core.Track,a.core.TextStyle,a.core.EventType),Ie=a.core.StateType,we=a.core.FakeEvent,Re=a.core.Utils,De=a.core.EngineType,Oe=a.core.AbrMode,Me=a.core.Error,Le=a.cast.BaseRemotePlayer,Ne=a.cast.PlayerSnapshot,xe=(a.cast.RemoteControl,a.cast.RemoteConnectedPayload),Ge=a.cast.RemoteDisconnectedPayload,Ue=a.cast.RemoteAvailablePayload,He=a.cast.RemoteSession,je=a.cast.TextStyleConverter,Fe=a.cast.CustomMessageType,Be=(a.cast.CustomMessage,a.cast.CustomEventMessage,500),Ke="urn:x-cast:com.kaltura.cast.playkit",Ve=function(e){var t,n;function a(t,n){var r;return Ae(Se(r=e.call(this,"CastPlayer",t,n)||this),"_readyPromise",null),Ae(Se(r),"_mediaInfo",null),Ae(Se(r),"_firstPlay",!0),Ae(Se(r),"_ended",!1),Ae(Se(r),"_playbackStarted",!1),Ae(Se(r),"_reset",!0),Ae(Se(r),"_destroyed",!0),Ae(Se(r),"_isOnLiveEdge",!1),Ae(Se(r),"_sessionStateChangedHandler",(function(e){switch(e.sessionState){case cast.framework.SessionState.SESSION_STARTING:r._remoteControl.onRemoteDeviceConnecting();break;case cast.framework.SessionState.SESSION_RESUMED:Pe.browser.major>=73&&"Android"===Pe.os.name&&r._remoteControl.onRemoteDeviceConnecting();break;case cast.framework.SessionState.SESSION_ENDING:r._remoteControl.onRemoteDeviceDisconnecting();break;case cast.framework.SessionState.SESSION_START_FAILED:r._remoteControl.onRemoteDeviceConnectFailed()}})),Ae(Se(r),"_isConnectedHandler",(function(){r._castRemotePlayer.isConnected?r._setupRemotePlayer():r._setupLocalPlayer()})),new Promise((function(e,t){a._isAvailable?e():he.load().then((function(){a._isAvailable=!0,r._initializeCastApi(),e()})).catch(t)})).then((function(){return r._initializeRemotePlayer()})).catch((function(e){return a._logger.error("Cast initialized error",e)})),r}n=e,(t=a).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,a.isSupported=function(){return"Chrome"===Pe.browser.name&&"iOS"!==Pe.os.name};var r,i,s,o=a.prototype;return o.loadMedia=function(e,t){a._logger.debug("Load media",e,t);var n=Re.Object.getPropertyPath(this._playerConfig,"session.ks");return!e.ks&&n&&(e.ks=n),this._mediaInfo=e,this._castMedia({mediaInfo:e},t)},o.setMedia=function(e,t){a._logger.debug("Set media",e,t),this._castMedia({mediaConfig:e},t)},o.getMediaInfo=function(){return Re.Object.copyDeep(this._mediaInfo)},o.getMediaConfig=function(){var e={sources:this._playerConfig.sources,plugins:this._playerConfig.plugins};return Re.Object.copyDeep(e)},o.ready=function(){return this._readyPromise?this._readyPromise:Promise.resolve()},o.play=function(){!this.ended||this._adsManager.adBreak?this._engine.play():this._loadOrSetMedia({mediaInfo:this._mediaInfo,mediaConfig:this.getMediaConfig()})},o.pause=function(){this._engine.pause()},o.reset=function(){clearInterval(this._mediaInfoIntervalId),this._reset||(this._reset=!0,this._firstPlay=!0,this._ended=!1,this._isOnLiveEdge=!1,this._tracksManager.reset(),this._engine.reset(),this._adsManager.reset(),this._stateManager.reset(),this._readyPromise=this._createReadyPromise(),this.dispatchEvent(new we(be.PLAYER_RESET)))},o.destroy=function(){clearInterval(this._mediaInfoIntervalId),this._castRemotePlayerController.removeEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,this._isConnectedHandler),this._castContext.removeEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED,this._sessionStateChangedHandler),this._destroyed||(this._destroyed=!0,this._firstPlay=!0,this._ended=!1,this._isOnLiveEdge=!1,this._readyPromise=null,this._eventManager.destroy(),this._tracksManager.destroy(),this._engine.destroy(),this._adsManager.destroy(),this._stateManager.destroy(),this.dispatchEvent(new we(be.PLAYER_DESTROY)))},o.isLive=function(){var e=this._castRemotePlayer.mediaInfo;return!!e&&e.streamType===chrome.cast.media.StreamType.LIVE},o.isOnLiveEdge=function(){return this._isOnLiveEdge},o.isDvr=function(){if(this.isLive()){var e=this._castSession.getMediaSession();if(e){var t=e.liveSeekableRange;if(t){var n=t.start/60;return t.end/60-n>this._castConfig.liveEdgeThreshold}}}return!1},o.seekToLiveEdge=function(){var e=this._castSession.getMediaSession();if(e){var t=e.liveSeekableRange;t&&(this._engine.currentTime=t.end)}},o.getStartTimeOfDvrWindow=function(){var e=this._castSession.getMediaSession();if(e){var t=e.liveSeekableRange;if(t)return t.start}return 0},o.getTracks=function(e){return this._tracksManager.getTracks(e)},o.getActiveTracks=function(){return this._tracksManager.getActiveTracks()},o.selectTrack=function(e){this._tracksManager.selectTrack(e)},o.hideTextTrack=function(){this._tracksManager.hideTextTrack()},o.startCasting=function(){return cast&&cast.framework?cast.framework.CastContext.getInstance().requestSession():Promise.reject()},o.isCastAvailable=function(){return a._isAvailable},o.stopCasting=function(){this._castSession.endSession(!0)},o.getCastSession=function(){return Re.Object.copyDeep(this._remoteSession)},o._initializeCastApi=function(){var e=this,t={};t.receiverApplicationId=this._castConfig.receiverApplicationId||chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,t.autoJoinPolicy=this._castConfig.autoJoinPolicy||chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,a._logger.debug("Init cast API with options",t);var n=cast.framework.CastContext.getInstance();n.setOptions(t),n.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED,(function(t){var n=new Ue(e,t.castState!==cast.framework.CastState.NO_DEVICES_AVAILABLE);e._remoteControl.onRemoteDeviceAvailable(n)}))},o._initializeRemotePlayer=function(){this._castContext=cast.framework.CastContext.getInstance(),this._castContext.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED,this._sessionStateChangedHandler),this._castRemotePlayer=new cast.framework.RemotePlayer,this._castRemotePlayerController=new cast.framework.RemotePlayerController(this._castRemotePlayer),this._castRemotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,this._isConnectedHandler)},o._setupRemotePlayer=function(){var e=this;a._logger.debug("Setup remote player"),this._destroyed=!1,this._castSession=cast.framework.CastContext.getInstance().getCurrentSession(),this._castSession.addMessageListener(Ke,(function(t,n){return e._onCustomMessage(t,n)})),this._tracksManager=new w(this._castRemotePlayer),this._engine=new x(this._castRemotePlayer,this._castRemotePlayerController),this._stateManager=new d(this._castRemotePlayer,this._castRemotePlayerController),this._adsManager=new Te(this),this._ui=new oe,this._attachListeners();var t=this._remoteControl.getPlayerSnapshot();this._playerConfig=t.config,this._remoteSession=new He(this._castSession.getSessionId(),this._castSession.getCastDevice().friendlyName,this._castSession.getSessionState()!==cast.framework.SessionState.SESSION_STARTED);var n=new xe(this,this._remoteSession,this._ui);if(this._remoteControl.onRemoteDeviceConnected(n),!this._remoteSession.resuming||Pe.browser.major>=73&&"Android"===Pe.os.name){if(t){var r=this._getLoadOptions(t);this._loadOrSetMedia(t,r)}}else this._resumeSession()},o._loadOrSetMedia=function(e,t){var n=e.mediaInfo,a=e.mediaConfig;n?this.loadMedia(n,t):a&&this.setMedia({sources:e.mediaConfig.sources,plugins:{}},t)},o._castMedia=function(e,t){var n=this;this.reset(),this._remoteControl.getUIWrapper().reset(),this._playbackStarted&&this.dispatchEvent(new we(be.CHANGE_SOURCE_STARTED));var a=new chrome.cast.media.MediaInfo,r=new chrome.cast.media.LoadRequest(a);return t&&Object.keys(t).forEach((function(e){"media"!==e?r[e]=t[e]:Object.keys(t.media).forEach((function(e){a[e]=t.media[e]}))})),a.customData=a.customData||{},a.customData.mediaInfo=e.mediaInfo,a.customData.mediaConfig=e.mediaConfig,this._castSession.loadMedia(r).then((function(){return n._onLoadMediaSuccess()}),(function(e){return n._onLoadMediaFailed(e)}))},o._setupLocalPlayer=function(){a._logger.debug("Setup local player");var e=new Ne(this),t=new Ge(this,e);this.pause(),this.destroy(),this._remoteControl.onRemoteDeviceDisconnected(t)},o._createReadyPromise=function(){var e=this;this._readyPromise=new Promise((function(t){e._eventManager.listenOnce(e,be.TRACKS_CHANGED,(function(){e.dispatchEvent(new we(be.MEDIA_LOADED)),t()}))}))},o._attachListeners=function(){var e=this;this._eventManager.listen(this._engine,be.TIME_UPDATE,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.PAUSE,(function(t){return e._onPause(t)})),this._eventManager.listen(this._engine,be.PLAY,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.VOLUME_CHANGE,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.MUTE_CHANGE,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.DURATION_CHANGE,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.ENDED,(function(t){return e._onEnded(t)})),this._eventManager.listen(this._engine,be.SEEKING,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._engine,be.SEEKED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.TRACKS_CHANGED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.TEXT_TRACK_CHANGED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.VIDEO_TRACK_CHANGED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.AUDIO_TRACK_CHANGED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.TEXT_STYLE_CHANGED,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._tracksManager,be.ERROR,(function(t){return e.dispatchEvent(t)})),this._eventManager.listen(this._stateManager,be.PLAYER_STATE_CHANGED,(function(t){return e._onPlayerStateChanged(t)}))},o._onPause=function(e){var t=this;this._isOnLiveEdge=!1,this._eventManager.listenOnce(this._engine,be.PLAY,(function(){t._isOnLiveEdge=!0})),this.dispatchEvent(e)},o._onEnded=function(e){var t=this;this._ended=!0,this.dispatchEvent(e),this._adsManager.allAdsCompleted?this.dispatchEvent(new we(be.PLAYBACK_ENDED)):this._eventManager.listenOnce(this,be.ALL_ADS_COMPLETED,(function(){t.dispatchEvent(new we(be.PLAYBACK_ENDED))}))},o._onPlayerStateChanged=function(e){this._ended||(this._stateManager.currentState.type===Ie.PLAYING&&this.dispatchEvent(new we(be.PLAYING)),this.dispatchEvent(e))},o._handleFirstPlay=function(){this._playbackStarted&&this.dispatchEvent(new we(be.CHANGE_SOURCE_ENDED)),this.dispatchEvent(new we(be.PLAYBACK_START)),this.dispatchEvent(new we(be.PLAY)),this.dispatchEvent(new we(be.FIRST_PLAY)),this.dispatchEvent(new we(be.FIRST_PLAYING)),this.dispatchEvent(new we(be.PLAYING)),this.paused&&this.dispatchEvent(new we(be.PAUSE)),this._firstPlay=!1,this._playbackStarted=!0},o._resumeSession=function(){var e=this;this._readyPromise=this._createReadyPromise(),this._mediaInfoIntervalId=setInterval((function(){var t=e._castSession.getMediaSession();t&&t.customData&&(clearInterval(e._mediaInfoIntervalId),e._mediaInfo=t.customData.mediaInfo,a._logger.debug("Resuming session with media info",e._mediaInfo),e._onLoadMediaSuccess())}),Be)},o._onLoadMediaSuccess=function(){a._logger.debug("Load media success"),this._reset=!1,this._triggerInitialPlayerEvents(),this._tracksManager.parseTracks(),this._handleFirstPlay();var e=this._playerConfig.sources.startTime;this.isLive()&&(-1===e||"number"==typeof this.duration&&e>=this.duration-10)&&(this._isOnLiveEdge=!0)},o._triggerInitialPlayerEvents=function(){this.dispatchEvent(new we(be.SOURCE_SELECTED,{selectedSource:[{url:this._castRemotePlayer.mediaInfo.contentUrl,mimetype:this._castRemotePlayer.mediaInfo.contentType}]})),this.dispatchEvent(new we(be.LOADED_METADATA)),this.dispatchEvent(new we(be.ABR_MODE_CHANGED,{mode:Oe.AUTO}))},o._onLoadMediaFailed=function(e){a._logger.debug("Load media falied",e),this.dispatchEvent(new we(be.ERROR,new Me(Me.Severity.CRITICAL,Me.Category.CAST,Me.Code.CAST_LOAD_MEDIA_FAILED,e)))},o._getLoadOptions=function(e){var t={autoplay:this._playerConfig.playback.autoplay,currentTime:this._playerConfig.sources.startTime,media:{}};if(this.textStyle&&!this.textStyle.isEqual(e.textStyle)&&(t.media.textTrackStyle=je.toCastTextStyle(e.textStyle)),t.media.customData={audioLanguage:this._playerConfig.playback.audioLanguage,textLanguage:this._playerConfig.playback.textLanguage},e.advertising&&e.advertising.adTagUrl){this._adsController=new ve;var n=this._castConfig.advertising;if(n&&n.vast){var a=Re.Generator.uniqueId(5),r=Re.Generator.uniqueId(5),i=[{id:a,position:0,vastAdsRequest:this._getAdsRequest(e.advertising)}],s=[{breakClipIds:[a],id:r,position:0}];t.media.breakClips=i,t.media.breaks=s}else t.media.vmapAdsRequest=this._getAdsRequest(e.advertising)}var o=this._getExternalCaptions();return o.length&&(t.media.tracks=o),t},o._getExternalCaptions=function(){var e=[];return this._playerConfig.sources.captions&&this._playerConfig.sources.captions.length&&this._playerConfig.sources.captions.forEach((function(t,n){var r;"vtt"===t.type||t.url.endsWith(".vtt")?(r=new chrome.cast.media.Track(n+1,chrome.cast.media.TrackType.TEXT),Re.Object.mergeDeep(r,{trackContentId:t.url,trackContentType:"text/vtt",name:t.label,language:t.language}),e.push(r)):a._logger.warn("Text track type "+t.type+" is unsupported by Cast receiver")})),e},o._getAdsRequest=function(e){var t={};return e.adTagUrl&&(t.adTagUrl=e.adTagUrl),e.adsResponse&&(t.adsResponse=e.adsResponse),t},o._onCustomMessage=function(e,t){try{var n=JSON.parse(t);switch(a._logger.debug("Custom message received",n),n.type){case Fe.EVENT:this._handleCustomEvent(n)}}catch(e){this.dispatchEvent(new we(be.ERROR,new Me(Me.Severity.RECOVERABLE,Me.Category.CAST,Me.Code.CAST_CUSTOM_MESSAGE_PARSING_ERROR,e)))}},o._handleCustomEvent=function(e){this.dispatchEvent(new we(e.event,e.payload))},r=a,(i=[{key:"ads",get:function(){return this._adsController}},{key:"textStyle",set:function(e){this._tracksManager.textStyle=e},get:function(){return this._tracksManager.textStyle}},{key:"currentTime",set:function(e){this._engine.currentTime=e},get:function(){return this._engine.currentTime}},{key:"duration",get:function(){return this._engine.duration}},{key:"volume",set:function(e){this._engine.volume=e},get:function(){return this._engine.volume}},{key:"paused",get:function(){return this._engine.paused}},{key:"ended",get:function(){return this._ended}},{key:"seeking",get:function(){return this._engine.seeking}},{key:"muted",set:function(e){this._engine.muted=e},get:function(){return this._engine.muted}},{key:"src",get:function(){return this._castRemotePlayer.mediaInfo?this._castRemotePlayer.mediaInfo.contentUrl:""}},{key:"poster",get:function(){try{return this._castRemotePlayer.mediaInfo.metadata.images[0].url}catch(e){return""}}},{key:"playbackRate",get:function(){var e=this._castSession.getMediaSession();return e?e.playbackRate:null}},{key:"engineType",get:function(){return De.CAST}},{key:"type",get:function(){return a.Type}}])&&ke(r.prototype,i),s&&ke(r,s),a}(Le);Ae(Ve,"Type","chromecast"),Ae(Ve,"defaultConfig",{liveEdgeThreshold:5}),Ae(Ve,"_isAvailable",!1);var Ye=a.cast.registerRemotePlayer,qe="@playkit-js/playkit-js-cast-sender",Xe="1.1.1";Ve.isSupported()&&Ye(Ve.Type,Ve)}]);
//# sourceMappingURL=playkit-cast-sender.js.map