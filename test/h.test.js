import { h } from '../src/h'
import { VnodeFlags, ChildrenFlags } from '../src/vnode'

test('Create single div node with no attr and children', () => {
  const div = <div/>
  expect(div).toStrictEqual({
    el: null,
    _isVNode: true,
    tag: 'div',
    data: null,
    key: null,
    children: [],
    flags: VnodeFlags.HTML,
    childrenFlags: ChildrenFlags.NO_CHILDREN
  })
})

test('Create single svg node with no attr and children', () => {
  const svg = <svg/>
  expect(svg).toStrictEqual({
    el: null,
    _isVNode: true,
    tag: 'svg',
    data: null,
    key: null,
    children: [],
    flags: VnodeFlags.SVG,
    childrenFlags: ChildrenFlags.NO_CHILDREN
  })
})

describe('node with children', () => {
  it('node has a single text children', () => {
    const node = <p>text node</p>
    expect(node.children).toStrictEqual({
      el: null,
      _isVNode: true,
      tag: null,
      data: null,
      key: null,
      children: 'text node',
      flags: VnodeFlags.TEXT,
      childrenFlags: ChildrenFlags.NO_CHILDREN
    })
  })

  it('node have muti children', () => {
    const node = <div>
      <h1>title</h1>
      <p>description</p>
      <span>time</span>
    </div>
    expect(node.children.length).toEqual(3)
    expect(node.children).toEqual(expect.arrayContaining([
      {
        el: null,
        _isVNode: true,
        tag: 'h1',
        data: null,
        key: '|0',
        children: {
          el: null,
          _isVNode: true,
          tag: null,
          data: null,
          key: null,
          children: 'title',
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        },
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      },
      {
        el: null,
        _isVNode: true,
        tag: 'p',
        data: null,
        key: '|1',
        children: {
          el: null,
          _isVNode: true,
          tag: null,
          data: null,
          key: null,
          children: 'description',
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        },
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      },
      {
        el: null,
        _isVNode: true,
        tag: 'span',
        data: null,
        key: '|2',
        children: {
          el: null,
          _isVNode: true,
          tag: null,
          data: null,
          key: null,
          children: 'time',
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        },
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      }
    ]))
  })
})

describe('node\'s props', () => {
  it('node has class、style、and other props', () => {
    const node = <div className={'wrap'} style={{color: 'red'}} key='1'></div>
    expect(node.data).toStrictEqual({
      className: 'wrap',
      style: {color: 'red'},
      key: '1'
    })
  })
})

describe('component render node', () => {
  it('functionial component', () => {
    const Func = (txt) => <i label={txt}></i>
    let node = <Func/>
    expect(node).toStrictEqual({
      el: null,
      _isVNode: true,
      tag: Func,
      data: null,
      key: null,
      children: [],
      flags: VnodeFlags.COMPONENT_FUNCTIONAL,
      childrenFlags: ChildrenFlags.NO_CHILDREN
    })
  })
})
