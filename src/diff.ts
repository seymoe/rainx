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
    }
  }
}

// 替换旧vnode
export function replaceVnode(prevVnode: VNode, nextVnode:VNode, container:any) {
  container.removeChild(prevVnode.el)
  mount(nextVnode, container)
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