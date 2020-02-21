import {VNode, VnodeFlags} from './vnode'

export function createDom(fiber: any) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : fiber.type === VnodeFlags.SVG
      ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
      : document.createElement(fiber.type)

  Object.keys(fiber.props)
    .filter(key => key !== "children")
    .forEach(name => {
      dom[name] = fiber.props[name]
    })
  return dom
}

export function updateDom(dom: any, preProps = {}, nextProps = {}) {
  // 事件处理
  // 属性处理
  // 是否为新增属性
  // 是否为删除属性
}