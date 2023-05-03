import {
  describe,
  it,
  mock
} from 'node:test'
import assert from 'node:assert'

function run({ fn, times }) {
  for (let i = 0; i < times; i++) {
    fn({ current: i * 5 })
  }
}

describe('Spies Test Suite', () => {
  it('should verify calls in a mock', () => {
    const spy = mock.fn()
    run({ fn: spy, times: 2 })
    
    assert.strictEqual(spy.mock.callCount(), 2)
    const calls = spy.mock.calls
    assert.deepStrictEqual(calls[0].arguments[0], { current: 0 })
    assert.deepStrictEqual(calls[1].arguments[0], { current: 5 })
  })
})