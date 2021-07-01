# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.2.0...v1.2.1) (2021-07-01)


### Bug Fixes

* **FEC-11374:** Live DVR starting to cast from beginning of the DVR instead of Live edge ([#67](https://github.com/kaltura/playkit-js-cast-sender/issues/67)) ([7d57ae9](https://github.com/kaltura/playkit-js-cast-sender/commit/7d57ae9))


### Build System

* **FEC-10700:** Improvement for CI/CD ([#65](https://github.com/kaltura/playkit-js-cast-sender/issues/65)) ([c7dccd5](https://github.com/kaltura/playkit-js-cast-sender/commit/c7dccd5))



## [1.2.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.1.1...v1.2.0) (2021-04-28)


### Bug Fixes

* **FEC-11144:** Casting doesn't work if you stop it and re-initiate ([#55](https://github.com/kaltura/playkit-js-cast-sender/issues/55)) ([2530aab](https://github.com/kaltura/playkit-js-cast-sender/commit/2530aab))


### Features

* **FEC-9236:** Add support for new live Alpha in cast SDK ([#56](https://github.com/kaltura/playkit-js-cast-sender/issues/56)) ([9496b3e](https://github.com/kaltura/playkit-js-cast-sender/commit/9496b3e))



### [1.1.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.1.0...v1.1.1) (2021-04-06)


### Bug Fixes

* **FEC-10281:** chromecast does not work after playing it once and trying it on another video ([#51](https://github.com/kaltura/playkit-js-cast-sender/issues/51)) ([dee35eb](https://github.com/kaltura/playkit-js-cast-sender/commit/dee35eb))
* **FEC-11073:** chromecast casting doesn't work on Player V7 when content is protected with KS ([#53](https://github.com/kaltura/playkit-js-cast-sender/issues/53)) ([d1c1fdf](https://github.com/kaltura/playkit-js-cast-sender/commit/d1c1fdf))



## [1.1.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.0.3...v1.1.0) (2021-01-28)


### Features

* **FEC-10686:** move startTime config from playback to sources ([#49](https://github.com/kaltura/playkit-js-cast-sender/issues/49)) ([8b4fd98](https://github.com/kaltura/playkit-js-cast-sender/commit/8b4fd98))



### [1.0.3](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.0.2...v1.0.3) (2020-12-07)


### Bug Fixes

* **FEC-10661:** Cast ui is missing ([#47](https://github.com/kaltura/playkit-js-cast-sender/issues/47)) ([555556e](https://github.com/kaltura/playkit-js-cast-sender/commit/555556e))



### [1.0.2](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.0.1...v1.0.2) (2020-11-03)


### Build System

* remove plugins that already exist on preset-env ([#46](https://github.com/kaltura/playkit-js-cast-sender/issues/46)) ([89d1817](https://github.com/kaltura/playkit-js-cast-sender/commit/89d1817))



### [1.0.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v1.0.0...v1.0.1) (2020-10-06)


### Bug Fixes

* logger changed on BaseRemotePlayer to static ([#45](https://github.com/kaltura/playkit-js-cast-sender/issues/45)) ([4c8efac](https://github.com/kaltura/playkit-js-cast-sender/commit/4c8efac))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.5.1...v1.0.0) (2020-09-08)


### Features

* **FEC-10347:** expose kaltura player as a global variable instead of UMD ([#41](https://github.com/kaltura/playkit-js-cast-sender/issues/41)) ([90a4cfa](https://github.com/kaltura/playkit-js-cast-sender/commit/90a4cfa))


### BREAKING CHANGES

* **FEC-10347:** This package is not UMD anymore

Solves FEC-10347



## [0.5.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.5.0...v0.5.1) (2020-08-06)



## [0.5.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.4...v0.5.0) (2020-08-05)


### Bug Fixes

* **FEC-10154:** cast preset is missing the font family ([#31](https://github.com/kaltura/playkit-js-cast-sender/issues/31)) ([9c81f0a](https://github.com/kaltura/playkit-js-cast-sender/commit/9c81f0a))
* **FEC-10156:** several text tracks are active in same time while casting ([#33](https://github.com/kaltura/playkit-js-cast-sender/issues/33)) ([19a73af](https://github.com/kaltura/playkit-js-cast-sender/commit/19a73af))


### Build System

* fix secure api_key in travis ([#37](https://github.com/kaltura/playkit-js-cast-sender/issues/37)) ([296c80a](https://github.com/kaltura/playkit-js-cast-sender/commit/296c80a))
* **FEC-10064:** add automatic release notes ([#30](https://github.com/kaltura/playkit-js-cast-sender/issues/30)) ([7ddf0e6](https://github.com/kaltura/playkit-js-cast-sender/commit/7ddf0e6))
* **FEC-9495:** add permission to script for jenkins ping ([#29](https://github.com/kaltura/playkit-js-cast-sender/issues/29)) ([4135ced](https://github.com/kaltura/playkit-js-cast-sender/commit/4135ced))


### Features

* **FEC-10290:** upgrade NPM packages ([#40](https://github.com/kaltura/playkit-js-cast-sender/issues/40)) ([f0442f3](https://github.com/kaltura/playkit-js-cast-sender/commit/f0442f3))
* **FEC-9631:** add support for out of band text tracks on cast sdk ([#32](https://github.com/kaltura/playkit-js-cast-sender/issues/32)) ([d4eb3d9](https://github.com/kaltura/playkit-js-cast-sender/commit/d4eb3d9))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.4.1...v0.4.2) (2020-07-07)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.4.0...v0.4.1) (2020-06-10)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.4...v0.4.0) (2020-06-10)


### Bug Fixes

* **FEC-10154:** cast preset is missing the font family ([#31](https://github.com/kaltura/playkit-js-cast-sender/issues/31)) ([9c81f0a](https://github.com/kaltura/playkit-js-cast-sender/commit/9c81f0a))
* **FEC-10156:** several text tracks are active in same time while casting ([#33](https://github.com/kaltura/playkit-js-cast-sender/issues/33)) ([19a73af](https://github.com/kaltura/playkit-js-cast-sender/commit/19a73af))


### Features

* **FEC-9631:** add support for out of band text tracks on cast sdk ([#32](https://github.com/kaltura/playkit-js-cast-sender/issues/32)) ([d4eb3d9](https://github.com/kaltura/playkit-js-cast-sender/commit/d4eb3d9))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.3...v0.3.4) (2020-03-10)


### Bug Fixes

* **FEC-9148:** ChromeCast is not available on ios mobile devices ([#28](https://github.com/kaltura/playkit-js-cast-sender/issues/28)) ([4406b51](https://github.com/kaltura/playkit-js-cast-sender/commit/4406b51))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.1...v0.3.3) (2020-02-06)


### Bug Fixes

* **FEC-9157:** cannot cast video on android chrome ([#26](https://github.com/kaltura/playkit-js-cast-sender/issues/26)) ([37fd899](https://github.com/kaltura/playkit-js-cast-sender/commit/37fd899))
* **FEC-9618:** when casting, LIVE indicator is not on PC (Device which performs the casting to TV) ([#25](https://github.com/kaltura/playkit-js-cast-sender/issues/25)) ([126bc43](https://github.com/kaltura/playkit-js-cast-sender/commit/126bc43))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.1...v0.3.2) (2020-01-29)


### Bug Fixes

* **FEC-9618:** when casting, LIVE indicator is not on PC (Device which performs the casting to TV) ([#25](https://github.com/kaltura/playkit-js-cast-sender/issues/25)) ([126bc43](https://github.com/kaltura/playkit-js-cast-sender/commit/126bc43))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.3.0...v0.3.1) (2019-12-09)


### Bug Fixes

* **FEC-9550:** Chromecast with external source - the casting failed when IMA configured ([#22](https://github.com/kaltura/playkit-js-cast-sender/issues/22)) ([3cc494d](https://github.com/kaltura/playkit-js-cast-sender/commit/3cc494d))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.6...v0.3.0) (2019-12-05)


### Features

* **FEC-9175:** cast content coming from external sources ([#21](https://github.com/kaltura/playkit-js-cast-sender/issues/21)) ([23752e6](https://github.com/kaltura/playkit-js-cast-sender/commit/23752e6))



<a name="0.2.6"></a>
## [0.2.6](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.5...v0.2.6) (2019-11-12)


### Bug Fixes

* **FEC-9407:** forward button is missing when casting ([#16](https://github.com/kaltura/playkit-js-cast-sender/issues/16)) ([44b2ae2](https://github.com/kaltura/playkit-js-cast-sender/commit/44b2ae2))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.4...v0.2.5) (2019-05-16)


### Bug Fixes

* **FEC-8879:** When no cast device is available, cast button appear but only before playback ([#15](https://github.com/kaltura/playkit-js-cast-sender/issues/15)) ([d79d732](https://github.com/kaltura/playkit-js-cast-sender/commit/d79d732))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.3...v0.2.4) (2019-01-31)


### Bug Fixes

* **FEC-8768:** seeking back on ended doesn't work when casting ([#14](https://github.com/kaltura/playkit-js-cast-sender/issues/14)) ([c124b36](https://github.com/kaltura/playkit-js-cast-sender/commit/c124b36))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.2...v0.2.3) (2019-01-24)


### Bug Fixes

* **FEC-8616:** When Seeking a video, the scrubber is jumping back before the seek is applied ([#13](https://github.com/kaltura/playkit-js-cast-sender/issues/13)) ([2357c0e](https://github.com/kaltura/playkit-js-cast-sender/commit/2357c0e))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.1...v0.2.2) (2018-12-27)


### Bug Fixes

* **FEC-8616): fix(FEC-8616:** When Seeking a video, the scrubber is jumping back before the seek is applied ([#11](https://github.com/kaltura/playkit-js-cast-sender/issues/11)) ([26a9714](https://github.com/kaltura/playkit-js-cast-sender/commit/26a9714))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.2.0...v0.2.1) (2018-12-17)


### Bug Fixes

* **FEC-8595:** disconnect from cast failed ([#9](https://github.com/kaltura/playkit-js-cast-sender/issues/9)) ([62a45ee](https://github.com/kaltura/playkit-js-cast-sender/commit/62a45ee))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.1.2...v0.2.0) (2018-12-12)


### Features

* **FEC-8682:** end screen ([#8](https://github.com/kaltura/playkit-js-cast-sender/issues/8)) ([9d1c007](https://github.com/kaltura/playkit-js-cast-sender/commit/9d1c007))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.1.1...v0.1.2) (2018-11-20)


### Bug Fixes

* cast ui & events ([#7](https://github.com/kaltura/playkit-js-cast-sender/issues/7)) ([ee2f395](https://github.com/kaltura/playkit-js-cast-sender/commit/ee2f395))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/kaltura/playkit-js-cast-sender/compare/v0.1.0...v0.1.1) (2018-10-21)


### Bug Fixes

* empty vast data structure is created when no ad tag ([#4](https://github.com/kaltura/playkit-js-cast-sender/issues/4)) ([470e19d](https://github.com/kaltura/playkit-js-cast-sender/commit/470e19d))



<a name="0.1.0"></a>
# 0.1.0 (2018-10-14)


### Bug Fixes

* use new ad-notice component in ads preset ([f241497](https://github.com/kaltura/playkit-js-cast-sender/commit/f241497))


### Features

* ads controller ([#3](https://github.com/kaltura/playkit-js-cast-sender/issues/3)) ([18a0998](https://github.com/kaltura/playkit-js-cast-sender/commit/18a0998))
* cast sender - 1st version ([#1](https://github.com/kaltura/playkit-js-cast-sender/issues/1)) ([44397c5](https://github.com/kaltura/playkit-js-cast-sender/commit/44397c5))
* error handling ([4fa7457](https://github.com/kaltura/playkit-js-cast-sender/commit/4fa7457))
