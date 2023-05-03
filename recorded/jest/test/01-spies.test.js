import {
  describe,
  it,
  jest,
  expect
} from '@jest/globals'

function run({ fn, times }) {
  for (let i = 0; i < times; i++) {
    fn({ current: i * 5 })
  }
}

describe('Spies Test Suite', () => {
  it('should verify calls in a mock', () => {
    const spy = jest.fn()
    run({ fn: spy, times: 2 })
    expect(spy).toHaveBeenNthCalledWith(1, { current: 0 })
    expect(spy).toHaveBeenNthCalledWith(2, { current: 5 })
  })
})