import {ChildrenFlags, VNode, VnodeFlags} from './vnode'

/**
 * 渲染vnode挂载到html标签
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

function mount(vnode: any, container:any, isSvg:boolean = false) {
  let { flags } = vnode
  if (flags === VnodeFlags.HTML || flags === VnodeFlags.SVG) {
    mountElement(vnode, container, isSvg)
  } else if (flags === VnodeFlags.TEXT) {
    mountText(vnode, container)
  }
}

function patch(prevVNode:VNode, vnode:VNode, container:any) {

}

// 渲染 html 类型的 VNode
function mountElement(vnode:VNode, container:any, isSvg:boolean = false) {
  isSvg = isSvg || vnode.flags === VnodeFlags.SVG
  console.log('isSVG', vnode.flags, isSvg)
  const el = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  vnode.el = el

  const { children, childrenFlags, data } = vnode

  // 处理节点信息 vnode.data
  if (data && data !== null) {
    console.log(data)
    for (let key in data) {
      switch (key) {
        case 'style':
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        default:
          // 处理其他属性
          if (typeof data[key] === 'string') {
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 处理子节点
  if (childrenFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childrenFlags === ChildrenFlags.SINGLE_VNODE) {
      if (Array.isArray(children) && children.length === 1) {
        mount(children[0], el, isSvg)
      } else {
        mount(children, el, isSvg)
      }
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

export default render