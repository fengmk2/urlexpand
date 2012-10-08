urlexpand [![Build Status](https://secure.travis-ci.org/fengmk2/urlexpand.png)](http://travis-ci.org/fengmk2/urlexpand)
=========

Expand the shorten url, handle all the 30x http redirect, get the original url and html page title.

jscoverage: [91%](http://fengmk2.github.com/coverage/urlexpand.html) on nodejs 0.6.x.

## Install

```bash
$ npm install urlexpand
```

## Usage

```js
var urlexpand = require('urlexpand');

urlexpand('http://url.cn/8pBPLK', function (err, data) {
  // data.url: 'http://instagram.com/p/QhLtWhB_A1/'
  // data.title: 'Photo by sofishlin &bull; Instagram'
  console.log(data);
});
```

## License 

(The MIT License)

Copyright (c) 2012 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.