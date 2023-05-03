import {
  describe,
  it,
  jest,
  expect,
  beforeEach
} from '@jest/globals'

class Service {
  static async getTalks({ skip, limit }) {
    const items = await fetch('https://tml-api.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
        {
          getTalks (skip: ${skip}, limit: ${limit}) {
            totalCount,
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

describe('Stub Test Suite', () => {
  beforeEach(() => jest.restoreAllMocks())

  it('should stub APIs', async () => {
    jest.spyOn(
      Service,
      Service.getTalks.name,
    ).mockResolvedValue([
      {
        _id: '63865750c839dbaacd8116e1',
        title: 'The Journey About How I Fixed a Bug in the Node.js Core That Affected Thousands of Packages'
      }
    ])

    const result = await run({ limit: 1 })
    const expected = `[0] id: 63865750c839dbaacd8116e1, title: The Journey About How I Fixed a Bug in the Node.js Core That Affected Thousands of Packages`
    
    expect(Service.getTalks).toHaveBeenCalledTimes(1)
    expect(Service.getTalks).toHaveBeenCalledWith({ skip: 0, limit: 1})
    expect(result).toEqual(expected)
  })

  it('should stub different values for API calls', async () => {
    jest.spyOn(
      Service,
      Service.getTalks.name,
    )
    
    .mockResolvedValueOnce([
      {
        _id: '63865750c839dbaacd8116e1',
        title: 'The Journey About How I Fixed a Bug in the Node.js Core That Affected Thousands of Packages'
      }
    ])
    .mockResolvedValueOnce([
      {
        _id: '01',
        title: 'Mock 01'
      }
    ])
    .mockResolvedValueOnce([
      {
        _id: '02',
        title: 'Mock 02'
      }
    ])

    {
      const result = await run({ skip: 0, limit: 1 })
      const expected = `[0] id: 63865750c839dbaacd8116e1, title: The Journey About How I Fixed a Bug in the Node.js Core That Affected Thousands of Packages`
      expect(result).toEqual(expected)
    }
    {
      const result = await run({ skip: 1, limit: 1 })
      const expected = `[0] id: 01, title: Mock 01`
      expect(result).toEqual(expected)
    }
    {
      const result = await run({ skip: 2, limit: 1 })
      const expected = `[0] id: 02, title: Mock 02`
      expect(result).toEqual(expected)
    }

    expect(Service.getTalks).toHaveBeenCalledTimes(3)
    expect(Service.getTalks).toHaveBeenNthCalledWith(1, { skip: 0, limit: 1 })
    expect(Service.getTalks).toHaveBeenNthCalledWith(2, { skip: 1, limit: 1 })
    expect(Service.getTalks).toHaveBeenNthCalledWith(3, { skip: 2, limit: 1 })
    
    // 
  })
})