import {
  describe,
  expect,
  beforeEach,
  jest,
  it
} from '@jest/globals'
describe.skip('Spies Test Suite', () => {
  beforeEach(() => jest.restoreAllMocks())

  it('should use fakeTimers to prevent setTimeout being executed', async () => {
    jest.useFakeTimers()
    const fn = jest.fn(() => console.log('I was called!'))
    setTimeout(fn, 9000)
    jest.advanceTimersByTime(9000);
    expect(fn).toHaveBeenCalled()
  })
})