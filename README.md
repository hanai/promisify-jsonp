# promisify-jsonp

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

Light and robust JSONP library.

## Installation

```sh
$ npm install --save promisify-jsonp
```

## Usage

```js
pjsonp(url, options);
```

### Options

| name               | type    | required | default value | description                                      |
| ------------------ | ------- | -------- | ------------- | ------------------------------------------------ |
| callbackName       | String  | false    | -             | name of jsonp callback function                  |
| callbackNamePrefix | String  | false    | \_\_jp        | prefix for `callbackName`                        |
| callbackParamName  | String  | false    | callback      | parameter name of `callbackName` in query string |
| timeout            | Number  | false    | 0             | request timeout(0 means no timeout)              |
| params             | Object  | false    | {}            | extend parameter to query string                 |
| encode             | Boolean | false    | true          | encode parameter in query string                 |

## Example

```js
var pjsonp = require("pjsonp");

pjsonp("https://www.example.com/jsonp")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/promisify-jsonp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/promisify-jsonp
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: ./LICENSE
