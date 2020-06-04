#!/usr/bin/env node

const meow = require('meow');
const open = require('open');

const cli = meow(`
	Usage
	  $ javro <filename>
	Example
	  $ javro ~/Workspace/avro.avsc
`);

const filename = cli.input[0];

if (!filename) {
  console.error(cli.help);
  process.exit(1);
}

open(filename, { app: ['javro', `--path=${filename}`] });
