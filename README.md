# PlayKit JS Cast Sender

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

PlayKit JS Cast Sender integrates the [Cast Chrome Sender Framework API] with the [Kaltura Player JS].

PlayKit JS Cast Sender uses the _Remote Framework_ of the [Kaltura Player JS] to implement the neccesary APIs to control the player while casting.

PlayKit JS Cast Sender is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[cast chrome sender framework api]: https://developers.google.com/cast/docs/chrome_sender_setup
[kaltura player js]: https://github.com/kaltura/kaltura-player-js
[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-cast-sender.git
cd playkit-js-cast-sender
yarn install
```

### Building

Then, build the sender

```javascript
yarn run build
```

## Documentation

- [**Configuration & API**](./docs/configuration-api.md)
