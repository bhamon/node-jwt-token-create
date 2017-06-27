'use strict';

const fs = require('fs');
const joi = require('joi');
const minimist = require('minimist');
const jwt = require('jsonwebtoken');

const VALIDATOR_PRIVATE_KEY = joi.string().min(1).max(1000).label('privateKey');
const VALIDATOR_PAYLOAD = joi.string().min(1).max(1000).label('payload');
const VALIDATOR_OPTIONS = joi.string().min(1).max(1000).label('options');

function printUsage() {
	console.log(`
NAME
	jwt-token-create - Token creation tool.
SYNOPSIS
	node jwt-token-create -k PRIVATE_KEY [-p PAYLOAD] [-o OPTIONS]
DESCRIPTION
	When invoked, this tool creates a unique token signed with the provided
	PRIVATE_KEY.
	By default, this token doesn't hold any rights and expires in 30 days.
OPTIONS
	-h, --help
		Prints this page.
	-k, --privateKey PRIVATE_KEY
		Path to the private key file.
	-p, --payload PAYLOAD
		Arbitrary data to inject into the token.
		It must comply with the JSON format.
		Defaults to {"rights":{}}.
	-o, --options OPTIONS
		Token options as specified in the [node-jsonwebtoken] NodeJS module (
		https://github.com/auth0/node-jsonwebtoken).
		Common options are "algorithm", "expiresIn" and "issuer".
		It must comply with the JSON format.
		Defaults to {"algorithm":"ES256", "expiresIn":"30 days"}.
EXIT VALUES
	0	Success.
	1	Unspecified error.
	2	Invalid parameter.
`);
}

(function() {
	let args = minimist(process.argv.slice(2), {
		alias:{
			h:'help',
			k:'privateKey',
			p:'payload',
			o:'options'
		},
		boolean:['help'],
		string:['privateKey', 'payload', 'options'],
		default:{
			help:false,
			payload:'{"rights":{}}',
			options:'{"algorithm":"ES256", "expiresIn":"30 days"}'
		}
	});

	if(args.help) {
		printUsage();
		return;
	}

	try {
		args.privateKey = joi.attempt(args.privateKey, VALIDATOR_PRIVATE_KEY.required());
		args.payload = joi.attempt(args.payload, VALIDATOR_PAYLOAD.required());
		args.options = joi.attempt(args.options, VALIDATOR_OPTIONS.required());

		args.privateKey = fs.readFileSync(args.privateKey);
		args.payload = JSON.parse(args.payload);
		args.options = JSON.parse(args.options);
	} catch(p_error) {
		console.error('ERROR: invalid arguments');
		console.error();
		console.error(p_error.stack);

		printUsage();

		process.exitCode = 2;
		return;
	}

	try {
		console.log(jwt.sign(args.payload, args.privateKey, args.options));
	} catch(p_error) {
		console.error('ERROR: error while creating the token');
		console.error();
		console.error(p_error.stack);
		console.error();

		process.exitCode = 1;
		return;
	}
})();
