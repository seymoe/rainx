import {ChildrenFlags, VNode, VnodeFlags} from "./vnode"
import {mount} from './render'

// 检测是否是 包含大写字母\value\checked\selected\muted 属性
export const domPropsRegExp = /\[A-Z]|^(?:value|checked|selected|muted)$/

/**
 * diff 新旧vnode
 * 1. 不同类型的vnode比对无意义，直接新替换旧
 * 2. 相同类型根据vnode的flags相应进行比对
 * @param prevVNode
 * @param vnode
 * @param container
 */
export function patch(prevVNode:VNode, nextVnode:VNode, container:any) {
  console.log('patch')
  const prevFlags = prevVNode.flags
  const nextFlags = nextVnode.flags
  if (prevFlags !== nextFlags) {
    replaceVnode(prevVNode, nextVnode, container)
  } else {
    if (nextFlags === VnodeFlags.HTML) {
      patchElement(prevVNode, nextVnode, container)
    } else if (nextFlags === VnodeFlags.TEXT) {
      patchText(prevVNode, nextVnode)
    } else if (nextFlags === VnodeFlags.FRAGMENT) {
      patchFragment(prevVNode, nextVnode, container)
    } else if (nextFlags === VnodeFlags.PORTAL) {
      patchPortal(prevVNode, nextVnode)
    } else if (nextFlags === VnodeFlags.COMPONENT_STATEFUL) {
      patchStatefulComponent(prevVNode, nextVnode, container)
    }
  }
}

// 替换旧vnode
export function replaceVnode(prevVNode: any, nextVNode:any, container:any) {
  container.removeChild(prevVNode.el)
  // 如果将要被移除的 VNode 类型是组件，则需要调用该组件实例的 unmounted 钩子函数
  if (prevVNode.flags & VnodeFlags.COMPONENT_STATEFUL) {
    // 类型为有状态组件的 VNode，其 children 属性被用来存储组件实例对象
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  mount(nextVNode, container)
}

// 对比html元素
// 1. 如果标签不同，直接新换旧
// 2. 如果标签相同，则对比data和children
// 3. 对比data时，将新data属性全部加上去，然后旧data属性如果在新data中没有，就移除掉
export function patchElement(prevVnode: VNode, nextVnode: VNode, container:any) {
  if (prevVnode.tag !== nextVnode.tag) {
    replaceVnode(prevVnode, nextVnode, container)
    return
  }

  const el = (nextVnode.el = prevVnode.el)
  // 拿到新旧data
  const prevData = prevVnode.data
  const nextData = nextVnode.data
  if (nextData) {
    // 如果旧vnode的data存在，则取至，否则为null
    for (let key in nextData) {
      let prevValue = null
      let nextValue = nextData[key]
      if (prevData) {
        prevValue = prevData[key]
      }
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的vnodeData，如果新的已经不存在了，则移除掉
    for(let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 递归更新子节点
  patchChildren(prevVnode.childrenFlags, nextVnode.childrenFlags, prevVnode.children, nextVnode.children, el)
}

// patch 标签节点
export function patchData(el:any, key:string, prevValue:any, nextValue:any) {
  console.log(el, key, prevValue, nextValue)
  switch (key) {
    case 'style':
      // 将新样式应用到元素
      for (let k in nextValue) {
        el.style[k] = nextValue[k]
      }
      // 移除不存在的样式
      if (prevValue !== null) {
        for (let k in prevValue) {
          if (!nextValue.hasOwnProperty(k)) {
            el.style[k] = ''
          }
        }
      }
      break
    case 'class':
      if (nextValue && typeof nextValue === 'string') {
        el.className = nextValue
        // 如果新的class不存在了，则置空（日后改进）
      } else {
        el.className = ''
      }
      break
    default:
      // 处理其他属性
      if (domPropsRegExp.test(key)) {
        if (nextValue) {
          // 直接替换为新属性
          el[key] = nextValue
        } else {
          el[key] = ''
        }
      } else {
        if (nextValue) {
          el.setAttribute(key, nextValue)
        } else {
          el.setAttribute(key, '')
        }
      }
      break
  }
}

// 递归patch子节点
export function patchChildren(prevChildrenFlags:ChildrenFlags, nexChildrenFlags:ChildrenFlags, prevChildren:any, nextChildren:any, container:any) {
  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  switch (prevChildrenFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      switch (nexChildrenFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          container.removeChild(prevChildren.el)
          break
        default:
          // 移除旧的单子节点
          container.removeChild(prevChildren.el)
          // 循环mount新的子节点
          for(let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    case ChildrenFlags.NO_CHILDREN:
      switch (nexChildrenFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 什么也不做
          break
        default:
          // 循环mount新的子节点
          for(let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    default:
      switch (nexChildrenFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 核心diff算法，暂且用移除更新的方法进行比对
          // 遍历旧的子节点，将其全部移除
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          // 遍历新的子节点，将其全部添加
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
  }
}

// patch 文本节点
export function patchText(prevVNode:any, nextVNode:any) {
  const el = (nextVNode.el = prevVNode.el)
  if (prevVNode.children !== nextVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

// patch Fragment
export function patchFragment(prevVNode:any, nextVNode:any, container:any) {
  // Fragment本身没有节点，直接patch子节点
  patchChildren(prevVNode.childrenFlags, nextVNode.childrenFlags, prevVNode.children, nextVNode.children, container)

  switch (nextVNode.childrenFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
      break
  }
}

// patch Portal
export function patchPortal(prevVNode:any, nextVNode:any) {
  // 容器元素为旧的container
  patchChildren(prevVNode.childrenFlags, nextVNode.childrenFlags, prevVNode.children, nextVNode.children, prevVNode.tag)

  nextVNode.el = prevVNode.el

  // 如果新旧容器不同，则需要搬运，因为children都是挂载在prevVnode.tag中的
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器
    const container = typeof nextVNode.tag === 'string' ? document.querySelector(nextVNode.tag) : nextVNode.tag

    switch (nextVNode.childrenFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        break
      case ChildrenFlags.MULTIFUL_VNODES:
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}

// patch stateful component
export function patchStatefulComponent(prevVNode:any, nextVNode:any, container:any) {
  // tag 属性的值是组件类，通过比较新旧组件类是否相等来判断是否是相同的组件
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVnode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VnodeFlags.COMPONENT_STATEFUL) {
    // 获取组件实例
    const instance = (nextVNode.children = prevVNode.children)
    // 更新 props
    instance.$props = nextVNode.data
    // 更新组件
    instance._update()
  }
}