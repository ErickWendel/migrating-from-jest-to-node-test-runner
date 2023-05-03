import {
  describe,
  expect,
  jest,
  it
} from '@jest/globals'

function run({ fn, times }) {
  for (let i = 0; i <= times; i++) {
    fn({ current: i * 5 })
  }
}

describe('Spies Test Suite', () => {
  it('should verify calls in a mock', () => {
    const mock = jest.fn()
    run({ fn: mock, times: 2 })

    expect(mock).toHaveBeenNthCalledWith(1, { current: 0 })
    expect(mock).toHaveBeenNthCalledWith(2, { current: 5 })
    expect(mock).toHaveBeenNthCalledWith(3, { current: 10 })

    expect(mock).toReturnTimes(3)
  })
})