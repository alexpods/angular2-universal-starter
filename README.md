# Angular2 Universal Starter Kit

[![Build Status](https://travis-ci.org/alexpods/angular2-universal-starter.svg?branch=master)](https://travis-ci.org/alexpods/angular2-universal-starter)
[![Dependency Status](https://david-dm.org/alexpods/angular2-universal-starter.svg)](https://david-dm.org/alexpods/angular2-universal-starter)
[![Issue Stats](http://issuestats.com/github/alexpods/angular2-universal-starter/badge/pr?style=flat-square)](http://issuestats.com/github/alexpods/angular2-universal-starter)
[![Issue Stats](http://issuestats.com/github/alexpods/angular2-universal-starter/badge/issue?style=flat)](http://issuestats.com/github/alexpods/angular2-universal-starter)
[![Join the chat at https://gitter.im/alexpods/angular2-universal-starter](https://badges.gitter.im/alexpods/angular2-universal-starter.svg)](https://gitter.im/alexpods/angular2-universal-starter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Enjoy Server Side rendering and Web Workers in your Angular2 Application



#What we've got here

- [Server Sider rendering](https://angularu.com/VideoSession/2015sf/angular-2-server-rendering) for instant page loading
- Entire Angular2 application is running in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) (UI always will be smooth)
- [Preboot](https://www.npmjs.com/package/preboot) to catch browser events before Angular2 is ready to work (you can experement with its options [here](https://github.com/alexpods/angular2-universal-starter/blob/master/src/server/app.ts#L18))
- [Express](http://expressjs.com/)
- [Typescript](http://www.typescriptlang.org/) with [Typings](https://github.com/typings/typings)
- [PM2](http://pm2.keymetrics.io/)
- [Webpack](https://webpack.github.io/)
- Unit testing with [Karma]()

#Quick start
```bash
# clone the repo without git history
git clone --depth 1 https://github.com/alexpods/angular2-universal-starter.git

# change current directory to angular2-universal-starter
cd angular2-universal-starter

# install dependencies
npm install

# run the server
npm start
```
Go to [http://localhost:3000](http://localhost:3000) in your browser.

You may want to stop or restart the server:
```bash
# stop the server
npm stop

# restart the server
npm restart
```

#Building
```bash
# build the probject
npm run buid

# build the project and start to watch for its changes
npm run build:watch
```

#Testing
```bash
# run all tests (single run)
npm test
```

##Unit Testing
```bash
# run unit tests (single run)
npm run test:unit

# run unit tests and start watch for changes
npm run test:unit:watch
```

#Cleaning
```bash
# remove "dist" and "logs" folders
npm run clean

# remove "dist" folder
npm run clean:dist

# remove "logs" folder
npm run clean:logs
```

#License
The MIT License (MIT)

Copyright (c) 2016 Aleksey Podskrebyshev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

