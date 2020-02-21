import {VNode, VnodeFlags} from './vnode'
import { createDom, updateDom } from './dom'

interface Fiber {
  type: any,
  props: any,
  node: any,
  parent: any,
  sibling: any,
  child: any
}
let updateQueue: any[] = []
// working in progress
let WIP: any = null

// -------------------------------------
// render初始化第一个任务，下一个任务单元
let nextUnitOfWork: any = null

function workLoop(deadline: any) {
  // 有下一个任务，并且浏览器剩余时间 > 1毫秒
  while(nextUnitOfWork && deadline.timeRemaining() > 1) {
    console.log('空余时间', deadline.timeRemaining() > 1)
    nextUnitOfWork = performanceUnitOfWork(nextUnitOfWork)
    console.log('下一个单元任务', nextUnitOfWork)
  }
  if (!nextUnitOfWork && WIP) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 提交到根节点
function commitRoot() {
  commitWork(WIP.child)
  WIP = null
}
// 更新DOM节点
function commitWork(fiber: any) {
  if (!fiber) return
  const parentElement = fiber.parent.node
  parentElement.appendChild(fiber.node)
  // 递归处理子节点和兄弟节点
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// 执行玩完当前任务之后，要返回下一个单元任务
function performanceUnitOfWork(fiber: any) {
  if (!fiber.node) {
    fiber.node = createDom(fiber)
  }

  // 每个子元素创建新的fiber
  let elements = fiber.props.children
  reconcileChildren(fiber, elements)

  // 返回下一个单元任务
  // 有子节点直接返回子节点
  if (fiber.child) {
    return fiber.child
  }
  // 没有子节点则找兄弟节点，兄弟节点也没有找父节点的兄弟节点，
  // 循环遍历直至找到为止
  let nextFiber = fiber
  while(nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function reconcileChildren(fiber: Fiber, elements: any) {
  if (Array.isArray(elements)) {
    let index = 0
    let prevSibling: any = null
    while(index < elements.length) {
      const element = elements[index]
      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        node: null
      }
      // 链表结构，rootFiber 只连接第一个子节点，其余的子节点通过sibling与兄弟节点相连
      if (index === 0) {
        fiber.child = newFiber
      } else {
        // 兄弟节点连接
        if (prevSibling !== null) {
          prevSibling.sibling = newFiber
        }
      }
      // index 为 0 时，prevSibling开始赋值
      prevSibling = newFiber
      index++
    }
  } else if (Object.prototype.toString.call(elements) === '[object Object]') {
    fiber.child = {
      type: elements.type,
      props: elements.props,
      parent: fiber,
      node: null
    }
  }
}

// -------------------------------------

export function render(element: VNode, node: any, done?: Function) {
  const rootFiber = {
    // 根节点类型，html
    type: VnodeFlags.HTML,
    node,
    props: { children: element },
    done
  }
  // scheduleWork(rootFiber)
  WIP = nextUnitOfWork = rootFiber
}

export function scheduleWork(fiber: any) {
  if (!fiber.dirty && (fiber.dirty = true)) {
    updateQueue.push(fiber)
  }
  scheduleCallback(reconcileWork)
}

function scheduleCallback(callback: Function) {
  callback()
}

function reconcileWork() {
  if (!WIP) WIP = updateQueue.shift()
  while (WIP) {
    try {
      // 将 vdom 转化为Fiber节点
      WIP = reconcile(WIP)
    } catch(e) {
      console.log(e)
    }
  }
  console.log(WIP)
}

function reconcile(fiber: any) {
  // 确定Fiber节点的tag值
  if (typeof(fiber.flags) === 'number') {
    fiber.tag = fiber.flags
    fiber.type = fiber.tag
  }

  // 构建fiber链表树
  if (fiber.tag === VnodeFlags.SVG || fiber.tag === VnodeFlags.TEXT || fiber.tag === VnodeFlags.HTML) {
    updateHost(fiber)
  }

  console.log('FIBER', fiber)
  return null

  // 如果当前fiber节点有child节点，则返回出去继续迭代
  if (fiber.child) return fiber.child
  while (fiber) {
    if (fiber.dirty === false) {
      return null
    }
    if (fiber.sibling) return fiber.sibling
    fiber = fiber.parent
  }
}

//  更新HOST节点（html）
function updateHost(WIP: any) {
  if (!WIP.node) {
    WIP.node = createDom(WIP)
  }

  // 子节点
  reconcileChildren(WIP, WIP.props.children)
}
