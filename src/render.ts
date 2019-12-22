import {ChildrenFlags, VNode, VnodeFlags} from './vnode'
import {createTextNode} from "./h"
import { patch, domPropsRegExp } from './diff'

/**
 * 渲染vnode挂载
 * @param vnode
 * @param container
 * 1. 如果没有旧的vnode，有新的vnode，则mount新的vnode
 * 2. 如果有旧的vnode，没有新的vnode,则移除旧的vnode
 * 3. 如果既有旧的vnode，又有新的vnode，则进行patch对比更新
 */
function render(vnode: VNode, container: any) {
  let prevVNode = container.vnode
  if (!prevVNode) {
    if (vnode) {
      mount(vnode, container)
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      patch(prevVNode, vnode, container)
    } else {
      // 使用浏览器中的 removeChild 函数，移除旧的节点
      container.removeChild(prevVNode.el)
    }
  }
}

export function mount(vnode: any, container:any, isSvg:boolean = false) {
  let { flags } = vnode
  if (flags === VnodeFlags.HTML || flags === VnodeFlags.SVG) {
    mountElement(vnode, container, isSvg)
  } else if (flags === VnodeFlags.TEXT) {
    mountText(vnode, container)
  } else if (flags === VnodeFlags.FRAGMENT) {
    mountFragment(vnode, container, isSvg)
  } else if (flags === VnodeFlags.PORTAL) {
    mountPortal(vnode, container)
  } else if (flags === VnodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSvg)
  } else if (flags === VnodeFlags.COMPONENT_FUNCTIONAL) {
    mountFunctionalComponent(vnode, container,isSvg)
  }
}

// 渲染html标签
function mountElement(vnode:VNode, container:any, isSvg:boolean = false) {
  isSvg = isSvg || vnode.flags === VnodeFlags.SVG
  console.log('isSVG', vnode.flags, isSvg)
  const el = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el

  const { children, childrenFlags, data } = vnode

  // 处理节点信息 vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case 'style':
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case 'className':
          el.className = data.className
          break
        default:
          // 处理其他属性
          if (domPropsRegExp.test(key)) {
            el[key] = data[key]
          } else {
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 处理子节点
  if (childrenFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childrenFlags === ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSvg)
    } else if (Array.isArray(children)) {
      console.log('CHILDREN', children)
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSvg)
      }
    }
  }
  container.appendChild(el)
}

// 挂载纯文本节点
function mountText(vnode:VNode, container:any) {
  if (typeof vnode.children === 'string') {
    const el = document.createTextNode(vnode.children)
    vnode.el = el
    container.appendChild(el)
  }
}

// 挂载代码片段 Fragment
function mountFragment(vnode:VNode, container:any, isSvg:boolean = false) {
  const { children, childrenFlags } = vnode
  switch(childrenFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      // 单子节点
      if (Array.isArray((children)) && children.length === 1) {
        mount(children[0], container, isSvg)
        vnode.el = children[0].el
      } else {
        mount(children, container, isSvg)
        vnode.el = children.el
      }
      break
    case ChildrenFlags.NO_CHILDREN:
      // 无子节点
      const placeholder = createTextNode('')
      mount(placeholder, container, isSvg)
      vnode.el = placeholder.el
      break
    default:
      if (Array.isArray((children))) {
        for(let i = 0; i < children.length; i++) {
          mount(children[i], container, isSvg)
        }
        vnode.el = children[0].el
      }
      break
  }
}

// 挂载 Portal
function mountPortal(vnode:VNode, container:any) {
  const { tag, children, childrenFlags } = vnode
  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag
  console.log('Portal挂载点', target)
  if (!target) {
    throw new Error('Portal need a target as a mount place.')
    return
  }
  console.log(childrenFlags, children)
  if (childrenFlags === ChildrenFlags.SINGLE_VNODE) {
    mount(children, target)
  } else if (childrenFlags === ChildrenFlags.MULTIFUL_VNODES) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], target)
      }
    }
  }
}

// 挂载有状态组件
function mountStatefulComponent(vnode:VNode, container:any, isSvg:boolean = false) {
  const { tag } = vnode
  // 创建组件实例
  const instance = new tag()

  // 定义一个update函数
  instance._update = function() {
    // 定义一个 _mounted 属性来判断此次为初次挂载还是后续pathc更新
    if (instance._mounted) {
      // patch
      console.log('patch')
      // 拿到旧vnode
      const prevVNode = instance.$vnode
      // 新vnode
      const nextVNode = (instance.$vnode = instance.render())
      // 进行比对
      patch(prevVNode, nextVNode, vnode.el.parentNode)
    } else {
      // 初次mount
      instance.$vnode = instance.render()
      // 挂载
      mount(instance.$vnode, container, isSvg)
      // 设置_mounted为真
      this._mounted = true
      instance.$el = vnode.el = instance.$vnode.el
      // mounted 钩子函数
      instance.mounted && instance.mounted()
    }
  }

  instance._update()
}

// 挂载无状态函数式组件
function mountFunctionalComponent(vnode:VNode, container:any, isSvg:boolean = false) {
  // 获取vnode
  const $vnode = vnode.tag()
  // 挂载
  mount($vnode, container, isSvg)
  vnode.el = $vnode.el
}

export default render