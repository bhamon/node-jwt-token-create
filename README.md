# JWT token create

Command line JWT token creation tool.

## Usage

```shell
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
```
