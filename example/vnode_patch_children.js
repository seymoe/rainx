window.onload = function () {
  const h = rainx.h
  let app = document.querySelector('#app')
  // 测试1：文本节点的更新
  // const prevVNode = h('p', null, '旧文本')
  // const nextVNode = h('p', null, '新文本')
  // rainx.render(prevVNode, app)
  // setTimeout(() => {
  //   rainx.render(nextVNode, app)
  // }, 2000)

  // 测试2：更新子节点，9种情况
  // --- 单 -》无
  // const prevVNode = h('p', null, '旧文本')
  // const nextVNode = h('p', null, h('span', null, 'haha'))
  // --- 单 -》单
  // const prevVNode = h('div', null, h('i', null, '旧'))
  // const nextVNode = h('p', null, h('span', null, '新'))
  // --- 单 -》多
  // const prevVNode = h('div', null, h('i', null, '旧节点'))
  // const nextVNode = h('p', null, [h('span', null, '1'), h('span', null, '2'), h('span', null, '3')])
  // --- 无 -》无
  // --- 无 -》单
  // const prevVNode = h('div', null, null)
  // const nextVNode = h('p', null, h('span', null, 'haha'))
  // --- 无 -》多
  // const prevVNode = h('div', null, null)
  // const nextVNode = h('div', null, [h('span', null, '1'), h('span', null, '2'), h('span', null, '3')])
  // --- 多 -》无
  // const prevVNode = h('div', null, [h('span', null, '1'), h('span', null, '2'), h('span', null, '3')])
  // const nextVNode = h('div', null, null)
  // --- 多 -》单
  // const prevVNode = h('div', null, [h('span', null, '1'), h('span', null, '2'), h('span', null, '3')])
  // const nextVNode = h('div', null, '单子节点')
  // --- 多 -》多
  const prevVNode = h('div', null, [h('span', null, '1'), h('span', null, '2'), h('span', null, '3')])
  const nextVNode = h('div', null, [h('i', null, '4'), h('i', null, '5'), h('i', null, '6')])

  rainx.render(prevVNode, app)
  setTimeout(() => {
    rainx.render(nextVNode, app)
  }, 2000)
}