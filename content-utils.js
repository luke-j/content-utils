#!/usr/bin/env node
const commander = require('commander')

const populate = require('./src/populate')
const deleteAll = require('./src/delete')

commander.version('1.0.2-aplha')

commander
  .command('populate')
  .description('Populate space with fake entries')
  .option('--apikey <key>', 'Contentful management API key')
  .option('--space <id>', 'Space id')
  .option('--content-type <id>', 'Content type id - eg. blogPost')
  .option('--number [int]', 'Number of entries to publish', 1)
  .option('--environment [id]', 'Environment id', 'master')
  .option('--concurrency [int]', 'Concurrent jobs to process', 6)
  .action(populate)

commander
  .command('delete')
  .description('Delete all entries within a space')
  .option('--apikey <key>', 'Contentful management API key')
  .option('--space <id>', 'Space id')
  .option('--environment [id]', 'Environment id', 'master')
  .option('--concurrency [int]', 'Concurrent jobs to process', 6)
  .action(deleteAll)

commander.on('--help', () => {
  console.log('')
  console.log('Examples:')
  console.log(
    '  $ content-utils populate --apikey ... --space XXXXXXXXXXX --content-type blogPost'
  )
  console.log(
    '  $ content-utils populate --apikey ... --space XXXXXXXXXXX --content-type blogPost --number 100 --environment staging'
  )
  console.log('  $ content-utils delete --apikey ... --space XXXXXXXXXXX')
  console.log(
    '  $ content-utils delete --apikey ... --space XXXXXXXXXXX --environment staging --concurrency 10'
  )
})

commander.parse(process.argv)

if (commander.args.length === 0) {
  commander.help()
}
