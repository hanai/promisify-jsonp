# promisify-jsonp

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

Light and robust JSONP library.


## Installation

``` sh
$ npm install --save promisify-jsonp
```

## Usage

``` js
var pjsonp = require('pjsonp');

pjsonp('https://www.example.com/jsonp')
  .then(res => {
      console.log(res);
  })
  .catch(err => {
      console.log(err);
  });
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/promisify-jsonp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/promisify-jsonp
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: ./LICENSE
