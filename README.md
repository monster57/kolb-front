#KBITS Application Frontend
The frontend application uses AngularJS source code which can be minified and viewed as static files. Gulp is used for watch/build tasks

## Download
### from bitbucket repository (Needs credentials)
```bash
git clone https://eqtribe1@bitbucket.org/eqtribe1/KBITS-frontend.git
```
or
```unzip the folder containing the KBITS-frontend.zip```

## 1. Setup
```bash
npm install
```
- install all npm and bower dependencies

**Note:** If `npm install` fails during dependency installation it will be likely caused by `gulp-imagemin`. In that case remove `gulp-imagemin` dependency from `package.json`, run `npm install` again and then install `gulp-imagemin` separately with following command: `npm install gulp-imagemin --save-dev`

## 2. Watch files
```bash
gulp
```
- all SCSS/HTML will be watched for changes and injected into browser thanks to LiveReload

## 3. Build production version
```bash
gulp dist
```
- this will process following tasks:
* clean dist folder
* compile config.js depending upon the environment variable APP_ENV (set to 'development' or 'production')
* copy and optimize images
* minify and copy all HTML files into $templateCache
* build index.html
* minify and copy all JS files
* copy fonts
* show build folder size

## 4. Start webserver without watch task
```bash
gulp production
```
or
```bash
cd dist
python -m SimpleHTTPServer
```
## 5. Start webserver from build folder
```bash
gulp serve
```

## Contact
Copyright (C) 2016 EQTribe<br>
[EQTribe](http://www.eqtribe.com)<br>

## Changelog
### 1.0.0
- initial release<br>
03.08.2016
