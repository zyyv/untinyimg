import { describe, expect, test } from 'vitest'
import { a } from '../src'

describe('test', () => {
  test('one', () => {
    expect(a).toBe(1)
  })
})
