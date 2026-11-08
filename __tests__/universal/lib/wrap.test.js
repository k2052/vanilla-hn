import { beforeEach, describe, expect, it, vi } from 'vitest'
import root from 'window-or-global'
import wrap from '../../../src/universal/lib/wrap'

describe('wrap HOC', () => {
  beforeEach(() => {
    root.store = {
      state: {
        toggledComments: { 123: true },
        nested: { val: 42 },
      },
      dispatch: vi.fn(),
    }
  })

  it('maps state paths to component props and injects dispatch', () => {
    const FakeComponent = (props) => {
      props.dispatch({ type: 'TEST' })
      return `<div data-toggled="${props.isToggled}">${props.nestedVal}</div>`
    }

    const Wrapped = wrap(
      {
        isToggled: 'toggledComments.123',
        nestedVal: 'nested.val',
      },
      FakeComponent,
    )

    const html = Wrapped({ extra: 'hello' })
    expect(html).toBe('<div data-toggled="true">42</div>')
    expect(root.store.dispatch).toHaveBeenCalledWith({ type: 'TEST' })
  })
})
