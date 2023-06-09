import {
  describe,
  it,
  beforeEach,
  mock
} from 'node:test'
import assert from 'node:assert'

class Service {

  static async getTalks({ skip = 0, limit = 10 }) {
    const items = await fetch('https://tml-api.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
      {
        getTalks (skip: ${skip}, limit: ${limit}) {
          totalCount
          talks {
            _id
            title
          }
        }
      }
      `
      })
    })

    return (await items.json()).data.getTalks.talks
  }

}

function mapResponse(data) {
  return data
    .map(({ _id, title }, index) => `[${index}] id: ${_id}, title: ${title}`)
    .join('\n')
}

async function run({ skip = 0, limit = 10 }) {
  const talks = mapResponse(await Service.getTalks({ skip, limit }))
  return talks
}

describe('Spies Test Suite', () => {
  beforeEach(() => mock.restoreAll())

  it('should stub APIs', async () => {
    mock.method(
      Service,
      Service.getTalks.name,
    ).mock.mockImplementation(async () => [
      {
        _id: '63fcda9dc4c49bb4e9dbe7b7',
        title: 'Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente'
      }
    ])

    const result = await run({ limit: 1 })
    const expected = "[0] id: 63fcda9dc4c49bb4e9dbe7b7, title: Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente"
    assert.deepStrictEqual(Service.getTalks.mock.callCount(), 1)
    assert.deepStrictEqual(Service.getTalks.mock.calls[0].arguments[0], { skip: 0, limit: 1 })
    assert.strictEqual(result, expected)
  })

  it('should stub different values for calls ', async (context) => {

    const m = context.mock.method(
      Service,
      Service.getTalks.name,
    ).mock

    m.mockImplementationOnce(async () => [
      {
        _id: '63fcda9dc4c49bb4e9dbe7b7',
        title: 'Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente'
      }
    ], 0)
    m.mockImplementationOnce(async () => [
      {
        _id: '01',
        title: 'Mocked Title 01'
      }
    ], 1)

    m.mockImplementationOnce(async () => [
      {
        _id: '02',
        title: 'Mocked Title 02'
      }
    ], 2)


    {
      const result = await run({ limit: 1 })
      const expected = "[0] id: 63fcda9dc4c49bb4e9dbe7b7, title: Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente"
      assert.strictEqual(result, expected)
    }
    {
      const result = await run({ skip: 1, limit: 1 })
      const expected = "[0] id: 01, title: Mocked Title 01"
      assert.strictEqual(result, expected)
    }
    {
      const result = await run({ skip: 2, limit: 1 })
      const expected = "[0] id: 02, title: Mocked Title 02"
      assert.strictEqual(result, expected)
    }
    const calls = Service.getTalks.mock.calls
    assert.deepStrictEqual(calls.length, 3)
    assert.deepStrictEqual(calls[0].arguments[0], { skip: 0, limit: 1 })
    assert.deepStrictEqual(calls[1].arguments[0], { skip: 1, limit: 1 })
    assert.deepStrictEqual(calls[2].arguments[0], { skip: 2, limit: 1 })
  })
})