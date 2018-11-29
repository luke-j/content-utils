const contentful = require('contentful-management')
const faker = require('faker')
const chalk = require('chalk')
const Queue = require('promise-queue')
const chunk = require('lodash.chunk')

module.exports = async cmd => {
  try {
    const maxConcurrent = cmd.concurrency
    const maxQueue = Infinity
    const queue = new Queue(maxConcurrent, maxQueue)
    const client = contentful.createClient({
      accessToken: cmd.apikey
    })
    const space = await client.getSpace(cmd.space)
    const environment = await space.getEnvironment(cmd.environment)
    const entries = await environment.getEntries()
    const entryChunk = chunk(entries, 100)
    const counter = 1

    for (let i = 0; i < entryChunk.length; i++) {
      for (let k = 0; k < entryChunk[i].length; k++) {
        queue.add(async () => {
          const entry = entryChunk[i].items[k]

          try {
            await entry.unpublish()
          } catch (e) {}

          await entry.delete()
          console.log(
            chalk.green(
              `✅ ${counter++}/${entries.total} Entry ${entry.sys.id} deleted`
            )
          )
        })
      }
    }

    const assets = await environment.getAssets()

    for (let i = 0; i < assets.total; i++) {
      queue.add(async () => {
        const asset = assets.items[i]

        try {
          await asset.unpublish()
        } catch (e) {}

        await asset.delete()
        console.log(
          chalk.green(
            `✅ ${i + 1}/${assets.total} Asset ${asset.sys.id} deleted`
          )
        )
      })
    }
  } catch (e) {
    console.log(chalk.red(e))
  }
}
