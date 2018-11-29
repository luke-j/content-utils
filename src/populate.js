const contentful = require('contentful-management')
const faker = require('faker')
const chalk = require('chalk')
const Queue = require('promise-queue')

const getFieldContent = async ({ type, items }, space) => {
  switch (type) {
    case 'Symbol':
      return faker.lorem.sentence()
    case 'Text':
      return faker.lorem.paragraphs()
    case 'Link':
      const asset = await space.createAsset({
        fields: {
          title: {
            'en-US': faker.lorem.word()
          },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: `${faker.lorem.slug()}.jpg`,
              upload: 'https://picsum.photos/200/300/?random'
            }
          }
        }
      })
      const processedAsset = await asset.processForLocale('en-US', {
        processingCheckWait: 2000,
        processingCheckRetries: 10
      })
      const publishedAsset = await processedAsset.publish()

      return {
        sys: {
          id: publishedAsset.sys.id,
          linkType: 'Asset',
          type: 'Link'
        }
      }
    case 'Date':
      return faker.date.past()
    case 'Array':
      return items.validations.in
    default:
      return faker.lorem.sentence()
  }
}

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
    const contentType = await environment.getContentType(cmd.contentType)

    for (let i = 0; i < cmd.number; i++) {
      queue.add(async () => {
        const fields = await contentType.fields
          // Strip author from fields
          .filter(({ linkType }) => linkType !== 'Entry')
          .reduce(async (acc, field) => {
            const accum = await acc

            return {
              ...accum,
              [field.id]: { 'en-US': await getFieldContent(field, space) }
            }
          }, Promise.resolve({}))

        const entry = await environment.createEntryWithId(
          cmd.contentType,
          faker.random.uuid(),
          { fields }
        )
        await entry.publish()

        console.log(
          chalk.green(
            `✅ ${i + 1}/${cmd.number} Entry ${entry.sys.id} published`
          )
        )
      })
    }
  } catch (e) {
    console.log(chalk.red(e))
  }
}
