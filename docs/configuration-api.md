### Table of Contents

- [CastConfigObject](#castconfigobject)
- [CastAdsController](#castadscontroller)
  - [skipAd](#skipad)
- [CastPlayer](#castplayer)
  - [loadMedia](#loadmedia)
  - [getMediaInfo](#getmediainfo)
  - [ready](#ready)
  - [play](#play)
  - [pause](#pause)
  - [reset](#reset)
  - [destroy](#destroy)
  - [isLive](#islive)
  - [isDvr](#isdvr)
  - [seekToLiveEdge](#seektoliveedge)
  - [getStartTimeOfDvrWindow](#getstarttimeofdvrwindow)
  - [getTracks](#gettracks)
  - [enableAdaptiveBitrate](#enableadaptivebitrate)
  - [isAdaptiveBitrateEnabled](#isadaptivebitrateenabled)
  - [getActiveTracks](#getactivetracks)
  - [selectTrack](#selecttrack)
  - [hideTextTrack](#hidetexttrack)
  - [startCasting](#startcasting)
  - [isCastAvailable](#iscastavailable)
  - [stopCasting](#stopcasting)
  - [getCastSession](#getcastsession)
  - [ads](#ads)
  - [textStyle](#textstyle)
  - [textStyle](#textstyle-1)
  - [currentTime](#currenttime)
  - [currentTime](#currenttime-1)
  - [duration](#duration)
  - [volume](#volume)
  - [volume](#volume-1)
  - [paused](#paused)
  - [ended](#ended)
  - [seeking](#seeking)
  - [muted](#muted)
  - [muted](#muted-1)
  - [src](#src)
  - [poster](#poster)
  - [playbackRate](#playbackrate)
  - [engineType](#enginetype)
  - [type](#type)
  - [config](#config)
  - [Type](#type-1)
  - [isSupported](#issupported)
  - [defaultConfig](#defaultconfig)

## CastConfigObject

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Properties**

- `receiverApplicationId` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Cast application id.
- `autoJoinPolicy` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Indicates if to join a running session on initialization.
- `liveEdgeThreshold` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** Threshold from which you are not at the live edge.
- `advertising` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The advertising options.
  - `advertising.vast` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Whether using VAST ad tags (false means using VMAP ad tags).

**Examples**

```javascript
// Default config
{
receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
liveEdgeThreshold: 5,
advertising: {
  vast: false
  }
}
```

## CastAdsController

Cast Ads Controller.

### skipAd

Skips on an ad.

Returns **void**

## CastPlayer

**Extends BaseRemotePlayer**

Cast Sender Player.

**Parameters**

- `config` **[CastConfigObject](#castconfigobject)** The cast configuration.
- `remoteControl` **RemoteControl** The remote control.

### loadMedia

Loads a media to the receiver application.

**Parameters**

- `mediaInfo` **ProviderMediaInfoObject** The entry media info.
- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** The request options. See [chrome.cast.media.LoadRequest](https://developers.google.com/cast/docs/reference/chrome/chrome.cast.media.LoadRequest)

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;void>** Promise to indicate load succeed or failed.

### getMediaInfo

Gets the media Info.

Returns **ProviderMediaInfoObject** The media info.

### ready

The cast player readiness.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;any>** Promise which resolved when the cast player is ready.

### play

Start/resume playback.

Returns **void**

### pause

Pause playback.

Returns **void**

### reset

Stops and reset the cast player.

Returns **void**

### destroy

Destroys the cast player.

Returns **void**

### isLive

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the current playback is a live playback.

### isDvr

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the current live playback has DVR window. In case of non-live playback will return false.

### seekToLiveEdge

Seeks to the live edge.

Returns **void**

### getStartTimeOfDvrWindow

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The start time of the DVR window.

### getTracks

**Parameters**

- `type` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Track type.

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Track>** The cast player tracks.

### enableAdaptiveBitrate

Enables automatic adaptive bitrate switching.

Returns **void**

### isAdaptiveBitrateEnabled

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether adaptive bitrate is enabled.

### getActiveTracks

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The cast player active tracks.

### selectTrack

Select a certain track to be active.

**Parameters**

- `track` **Track** The track to activate.

Returns **void**

### hideTextTrack

Hides the active text track.

Returns **void**

### startCasting

Start casting.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;any>** A promise to indicate session is starting, or failed

### isCastAvailable

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether casting is available.

### stopCasting

Stops the current cast session.

Returns **void**

### getCastSession

Gets the current remote session.

Returns **RemoteSession** The remote session.

### ads

Returns **[CastAdsController](#castadscontroller)** The cast ads controller.

### textStyle

Setter.

**Parameters**

- `style` **TextStyle** The text style to set.

Returns **void**

### textStyle

Getter.

Returns **TextStyle** The current text style.

### currentTime

Setter.

**Parameters**

- `to` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The number to set in seconds.

Returns **void**

### currentTime

Getter.

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current time in seconds.

### duration

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The duration in seconds.

### volume

Setter.

**Parameters**

- `vol` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The volume to set in the range of 0-1.

Returns **void**

### volume

Getter.

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** The current volume in the range of 0-1.

### paused

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the cast player is in paused state.

### ended

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the cast player is in ended state.

### seeking

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the cast player is in seeking state.

### muted

Setter.

**Parameters**

- `mute` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** The mute value to set.

Returns **void**

### muted

Getter.

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** The muted state.

### src

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current playing source url.

### poster

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current poster url.

### playbackRate

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The current playback rate.

### engineType

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The active engine type.

### type

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The remote player type.

### config

Returns **[CastConfigObject](#castconfigobject)** The runtime cast config.

### Type

The remote player type.

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

### isSupported

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Whether the cast player is supported in the current runtime environment.

### defaultConfig

The cast player default configuration.

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
