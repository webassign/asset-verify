# asset-verify

Tool for verifying format of HTML/JS/CSS assets for use in WebAssign questions

## Getting started

You need to have [NodeJS](http://nodejs.org/download/) and [grunt-cli](https://github.com/gruntjs/grunt-cli) installed to run asset-verify.

# Installing asset-verify

1. Install [NodeJS](http://nodejs.org/download/) by following the link

2. Install [grunt-cli](https://github.com/gruntjs/grunt-cli): `npm install grunt-cli --global`

3. Clone asset-verify repository or download as a .zip file and extract

4. Navigate to asset-verify root directory and install package dependencies: `npm install`

5. All done! Try running `grunt all --target examples/astro`

## Options

`target [path]`: specify a path to the target project to test: `--target [path_to_asset]`

`jshint` : perform JS lint checking only

`csslint` : perform CSS lint checking only

`namespace` : perform JS namespace checking only

`all` : perform all checks


## Todo

* parse target path for use in all tasks
* pass files to namespace task
* determine proper CSS linting rules
* add all config options to config file