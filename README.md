## Install

Install with `npm i -g content-utils`. For information on obtaining a content management API key, [read here](https://www.contentful.com/developers/docs/references/authentication/#the-content-management-api).

## Usage

Invoke locally with `./index.js [command] [options]`. Invoke globally with `content-utils [command] [options]`.

**General**

```
Usage: content-utils [options] [command]

Options:
  -V, --version       output the version number
  -h, --help          output usage information

Commands:
  populate [options]  Populate space with fake entries
  delete [options]    Delete all entries within a space

Examples:
  $ content-utils populate --apikey ... --space XXXXXXXXXXX --content-type blogPost
  $ content-utils populate --apikey ... --space XXXXXXXXXXX --content-type blogPost --number 100 --environment staging
  $ content-utils delete --apikey ... --space XXXXXXXXXXX
  $ content-utils delete --apikey ... --space XXXXXXXXXXX --environment staging --concurrency 10
```

**`populate`**

```
Usage: populate [options]

Populate space with fake entries

Options:
  --apikey <key>       content management API key
  --space <id>         Space id
  --content-type <id>  Content type id - eg. blogPost
  --number [int]       Number of entries to publish (default: 1)
  --environment [id]   Environment id (default: "master")
  --concurrency [int]  Concurrent jobs to process (default: 6)
  -h, --help           output usage information
```

**`delete`**

```
Usage: delete [options]

Delete all entries within a space

Options:
  --apikey <key>       content management API key
  --space <id>         Space id
  --environment [id]   Environment id (default: "master")
  --concurrency [int]  Concurrent jobs to process (default: 6)
  -h, --help           output usage information
```
