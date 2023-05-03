import {
  describe,
  expect,
  beforeEach,
  jest,
  it
} from '@jest/globals'

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
  beforeEach(() => jest.restoreAllMocks())

  it('should stub APIs', async () => {

    jest.spyOn(
      Service,
      Service.getTalks.name,
    ).mockResolvedValue([
      {
        _id: '63fcda9dc4c49bb4e9dbe7b7',
        title: 'Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente'
      }
    ])

    const result = await run({ limit: 1 })
    const expected = "[0] id: 63fcda9dc4c49bb4e9dbe7b7, title: Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente"
    expect(Service.getTalks).toHaveBeenCalledTimes(1)
    expect(Service.getTalks).toHaveBeenCalledWith({ skip: 0, limit: 1 })
    expect(result).toEqual(expected)
  })

  it('should stub different values for calls ', async () => {

    jest.spyOn(
      Service,
      Service.getTalks.name,
    )
      .mockResolvedValueOnce([
        {
          _id: '63fcda9dc4c49bb4e9dbe7b7',
          title: 'Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente'
        }
      ])

      .mockResolvedValueOnce([
        {
          _id: '01',
          title: 'Mocked Title 01'
        }
      ])

      .mockResolvedValueOnce([
        {
          _id: '02',
          title: 'Mocked Title 02'
        }
      ])

    {
      const result = await run({ limit: 1 })
      const expected = "[0] id: 63fcda9dc4c49bb4e9dbe7b7, title: Como resolvi um bug no Node.js que afetou milhares de pacotes mundialmente"
      expect(result).toEqual(expected)
    }
    {
      const result = await run({ skip: 1, limit: 1 })
      const expected = "[0] id: 01, title: Mocked Title 01"
      expect(result).toEqual(expected)
    }
    {
      const result = await run({ skip: 2, limit: 1 })
      const expected = "[0] id: 02, title: Mocked Title 02"
      expect(result).toEqual(expected)
    }

    expect(Service.getTalks).toHaveBeenCalledTimes(3)
    expect(Service.getTalks).toHaveBeenNthCalledWith(1, { skip: 0, limit: 1 })
    expect(Service.getTalks).toHaveBeenNthCalledWith(2, { skip: 1, limit: 1 })
    expect(Service.getTalks).toHaveBeenNthCalledWith(3, { skip: 2, limit: 1 })
  })
})