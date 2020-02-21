import { h } from '../src/h'
import { VnodeFlags, ChildrenFlags } from '../src/vnode'

test('Create single div node with no attr and children', () => {
  const div = <div/>
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

test('Create single svg node with no attr and children', () => {
  const svg = <svg/>
  expect(svg).toStrictEqual({
    el: null,
    _isVNode: true,
    tag: 'svg',
    props: {},
    key: null,
    ref: null,
    flags: VnodeFlags.SVG,
    childrenFlags: ChildrenFlags.NO_CHILDREN
  })
})

describe('node with children', () => {
  it('node has a single text children', () => {
    const node = <p>text node</p>
    expect(node.props.children).toStrictEqual({
      el: null,
      _isVNode: true,
      tag: 'text',
      props: { children: 'text node' },
      key: null,
      ref: null,
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
    expect(node.props.children.length).toEqual(3)
    expect(node.props.children).toEqual(expect.arrayContaining([
      {
        el: null,
        _isVNode: true,
        tag: 'h1',
        props: { children: {
          el: null,
          _isVNode: true,
          tag: 'text',
          props: { children: 'title' },
          key: null,
          ref: null,
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        }},
        key: null,
        ref: null,
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      },
      {
        el: null,
        _isVNode: true,
        tag: 'p',
        key: null,
        ref: null,
        props:{ children: {
          el: null,
          _isVNode: true,
          tag: 'text',
          props: { children: 'description' },
          key: null,
          ref: null,
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        }},
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      },
      {
        el: null,
        _isVNode: true,
        tag: 'span',
        key: null,
        ref: null,
        props: { children: {
          el: null,
          _isVNode: true,
          tag: 'text',
          key: null,
          ref: null,
          props: { children: 'time' },
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
        }},
        flags: VnodeFlags.HTML,
        childrenFlags: ChildrenFlags.SINGLE_VNODE
      }
    ]))
  })
})

describe('node\'s props', () => {
  it('node has class、style、and other props', () => {
    const node = <div className={'wrap'} style={{color: 'red'}} key='1'></div>
    console.log(node.props)
    expect(node.props).toStrictEqual({
      className: 'wrap',
      style: {color: 'red'},
      key: '1'
    })
  })
})

// describe('component render node', () => {
//   it('functionial component', () => {
//     const Func = (txt) => <i label={txt}></i>
//     let node = <Func/>
//     expect(node).toStrictEqual({
//       el: null,
//       _isVNode: true,
//       tag: Func,
//       data: null,
//       key: null,
//       children: [],
//       flags: VnodeFlags.COMPONENT_FUNCTIONAL,
//       childrenFlags: ChildrenFlags.NO_CHILDREN
//     })
//   })
// })
