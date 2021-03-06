import {ChildrenFlags, VNode, VnodeFlags} from './vnode'

// Fragment / PORTAL
const FRAGMENT = Symbol('FRAGMENT')
const PORTAL = Symbol('PORTAL')

// 创建文本节点
const createTextNode = (text: string):VNode => {
  return {
    el: null,
    _isVNode: true,
    tag: null,
    data: null,
    key: null,
    children: text,
    flags: VnodeFlags.TEXT,
    childrenFlags: ChildrenFlags.NO_CHILDREN
  }
}

// 待优化：规范化 children，如果没有key则给其添加key
const formatChildrenKey = (children:any[]):any[] => {
  const newChildren = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key === null) {
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  return newChildren
}

// 创建 VNode 辅助函数
const h = (tag: string | symbol | null | Function, data: any, ...args: any[]):VNode => {
  // 确定 flags 的值
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VnodeFlags.SVG : VnodeFlags.HTML
  } else if (tag === FRAGMENT) {
    flags = VnodeFlags.FRAGMENT
  } else if (tag === PORTAL) {
    flags = VnodeFlags.PORTAL
    tag = data && data.target
  } else if (typeof tag === 'function') {
    if (tag.prototype && tag.prototype.render) {
      flags = VnodeFlags.COMPONENT_STATEFUL
    } else {
      flags = VnodeFlags.COMPONENT_FUNCTIONAL
    }
  }

  // 确定 children
  let children = []
  for (let i = 0; i < args.length; i++) {
    let vnode = args[i]
    let tp = typeof vnode
    if (tp === 'string' || tp === 'number') {
      children.push(createTextNode(vnode))
    } else if (vnode === null || vnode === true || vnode === false) {}
    else {
      children.push(vnode)
    }
  }

  // 确定 childrenFlags 的值
  let childrenFlags = null
  let len = children.length
  if (len === 0) {
    // 无子节点
    childrenFlags = ChildrenFlags.NO_CHILDREN
  } else if (len === 1) {
    // 单子节点
    childrenFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 多个子节点，无 key 则添加key
    childrenFlags = ChildrenFlags.MULTIFUL_VNODES
    children = formatChildrenKey(children)
  }

  children = children.length === 1 ? children[0] : children

  return {
    el: null,
    _isVNode: true,
    tag,
    data,
    children,
    key: null,
    flags,
    childrenFlags
  }
}

export {
  h,
  createTextNode,
  FRAGMENT,
  PORTAL
}
