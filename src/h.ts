import {ChildrenFlags, VNode, VnodeFlags} from './vnode'

// Fragment / PORTAL
const FRAGMENT = Symbol('FRAGMENT')
const PORTAL = Symbol('PORTAL')

// 创建文本节点
const createTextNode = (text: string):VNode => {
  return {
    el: null,
    _isVNode: true,
    type: 'text',
    props: { nodeValue: text },
    key: null,
    ref: null,
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
const h = (type: string | symbol | null | Function, attrs: any, ...args: any[]):VNode => {
  let props = attrs || {}
  let ref = props.ref || null
  let key = props.key || null
  let children = []

  // 确定 flags，标示 vnode 类型
  let flags = null
  if (typeof type === 'string') {
    flags = type === 'svg' ? VnodeFlags.SVG : (type === 'text' ? VnodeFlags.TEXT : VnodeFlags.HTML)
  } else if (type === FRAGMENT) {
    flags = VnodeFlags.FRAGMENT
  } else if (type === PORTAL) {
    flags = VnodeFlags.PORTAL
    type = props && props.target
  } else if (typeof type === 'function') {
    if (type.prototype && type.prototype.render) {
      flags = VnodeFlags.COMPONENT_STATEFUL
    } else {
      flags = VnodeFlags.COMPONENT_FUNCTIONAL
    }
  }

  // 确定 children
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
  // 如果子节点只有一个，那就直接取，否则为数组形势保存
  if (len) {
    props.children = children.length === 1 ? children[0] : children
  }
  if (len === 0) {
    // 无子节点
    childrenFlags = ChildrenFlags.NO_CHILDREN
  } else if (len === 1) {
    // 单子节点
    childrenFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 多个子节点
    childrenFlags = ChildrenFlags.MULTIFUL_VNODES
  }

  return {
    el: null,
    _isVNode: true,
    type,
    props,
    key,
    ref,
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
