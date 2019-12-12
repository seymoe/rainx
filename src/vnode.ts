/**
 * vNode Types
 */
export interface VNode {
  el: any
  readonly _isVNode: boolean | null
  tag: any
  data: any
  children: VNode[] | VNode | string | null
  flags: VnodeFlags | null
  childrenFlags: ChildrenFlags
}

/**
 * vNode type Types
 */
export enum VnodeFlags {
  // 正常的html节点
  HTML,
  // svg节点
  SVG,
  // 文本节点
  TEXT,
  // 一系列节点
  FRAGMENT,
  // 传送门
  PORTAL,
  // 函数式组件
  COMPONENT_FUNCTIONAL,
  // 类组件
  COMPONENT_STATEFUL
}

/**
 * children types Type
 */
export enum ChildrenFlags {
  // 未知
  UNKNOW_CHILDREN,
  // 无子节点
  NO_CHILDREN,
  // 单子节点
  SINGLE_VNODE,
  // 用key标示的多子节点
  KEYED_VNODES,
  // 未用key标示的多子节点
  NONE_KEYED_VNODES,
  // 多子节点
  MULTIFUL_VNODES
}
