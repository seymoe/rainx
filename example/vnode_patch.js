window.onload = function () {
  let rainx = window.rainx
  let app = document.querySelector('#app')

  // 测试1：如果有新的vnode，没有旧的vnode，则挂载新的vnode
  let test1_no_old_vnode = rainx.h('h1', null, '测试：如果有新的vnode，没有旧的vnode，则挂载新的vnode')
  rainx.render(test1_no_old_vnode, app)

  // 测试2：如果有旧的vnode，但没有新的vnode，则移除掉
  // 定时1秒后render一个空的vnode
  // setTimeout(() => {
  //   rainx.render(null, app)
  // }, 1000)

  // 测试3：如果新的vnode的flags类型与旧的不一样，则替换掉旧的vnode
  // let test3_new_vnode = rainx.h(() => {
  //   return rainx.h('h2', null, '旧的为标签类型，新的为函数式组件类型')
  // }, null, null)
  // setTimeout(() => {
  //   rainx.render(test3_new_vnode, app)
  // }, 1000)

  // 测试4：如果类型一样且为html标签类型，对比其tag、data、children
  // 不同tag对比没有意义，tag不一样，直接替换
  // let test4_new_vnode_tag = rainx.h('p', null, '新vnode为p标签')
  // setTimeout(() => {
  //   rainx.render(test4_new_vnode_tag, app)
  // }, 1000)
  // --- 4.1 data不一样，则要进行对比更新 ---
  // let test4_new_vnode_data = rainx.h('h1', {
  //   style: {
  //     color: 'red',
  //     fontSize: '30px'
  //   }
  // }, 'h1标签应该添加data里面的style属性')
  // setTimeout(() => {
  //   rainx.render(test4_new_vnode_data, app)
  // }, 1000)
  // --- 4.2 旧vnode的data有值，新vnode的data也有值，对比
  // let test42_old_vnode_data = rainx.h('input', {
  //   style: {
  //     color: 'red',
  //     fontSize: '30px'
  //   },
  //   placeholder: '请输入'
  // }, null)
  // let test42_new_vnode_data = rainx.h('input', {
  //   style: {
  //     color: 'blue',
  //     fontSize: '14px'
  //   },
  //   value: '12323',
  //   'data-set': 'name'
  // }, null)
  // rainx.render(test42_old_vnode_data, app)
  // setTimeout(() => {
  //   rainx.render(test42_new_vnode_data, app)
  // }, 1000)

}
