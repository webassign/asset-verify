# asset-verify

Tool for verifying format of HTML/JS/CSS assets for use in WebAssign questions

## Getting started

You need to have [NodeJS](http://nodejs.org/download/) installed to run asset-verify.

After downloading the repository (via zip and extracting or cloning), install the tool with: `npm install`

You are now setup and good to go! Try running `grunt all --target examples/astro`

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