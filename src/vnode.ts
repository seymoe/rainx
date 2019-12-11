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
  UNKNOW_CHILDREN,
  NO_CHILDREN,
  SINGLE_VNODE,
  KEYED_VNODES,
  NONE_KEYED_VNODES
}
