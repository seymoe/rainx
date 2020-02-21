import { h } from '../src/h'
import { render } from '../src/reconciler'

test('Fiber: working in progress', () => {
  const div = <div><h1></h1><h2></h2></div>
  render(div)

  return false
  expect(div).toStrictEqual({
    el: null,
    _isVNode: true,
    tag: 'div',
    props: {},
    key: null,
    ref: null,
    flags: VnodeFlags.HTML,
    childrenFlags: ChildrenFlags.NO_CHILDREN
  })
})