window.onload = function () {
  let rainx = window.rainx
  let app = document.querySelector('#app')
  let vnode = rainx.h(
    'ul',
    {
      id: 'list',
      style: {
        padding: '15px'
      }
    },
    [
      rainx.h('li', {
        class: 'text-node'
      }, '测试文本节点'),
      rainx.h('li', null, rainx.h('a', {
        href: 'https://www.e7fe.com'
      }, '趣技社区')),
      rainx.h('li', null, rainx.h('svg', null, [
        rainx.h('rect', {
          width: '200',
          height: '200',
          style: {
            fill: 'rgb(0,0,255)',
            strokeWidth: 1,
            stroke: 'rgb(0,0,0)'
          }
        }, null)
      ]))
    ]
  )
  let vnode_fragment = rainx.h('table', null, [
    rainx.h('tr', null, rainx.h(rainx.FRAGMENT, null, [
      rainx.h('td', null, '12345'), rainx.h('td', null, '67890')
    ]))
  ])
  let vnode_props = rainx.h('div', {id: 'portal'}, [
    rainx.h('input', {
      type: 'text',
      value: '',
      placeholder: '请输入'
    }, null),
    rainx.h('input', {
      type: 'checkbox',
      checked: false,
      custom: '1'
    }, null)
  ])
  // PORTAL
  let vnode_portal = rainx.h('div', null, rainx.h(rainx.PORTAL, {
    target: '#portal'
  }, [
    rainx.h('h1', null, 'Portal 标题'),
    rainx.h('p', null, 'Portal 内容')
  ]))

  // functional vnode
  let title = () => {
    return rainx.h('h2', null, '函数组件')
  }

  // stateful component
  class StateComponent {
    render() {
      return rainx.h('div', {
        class: 'component'
      }, [
        rainx.h('h2', null, '有状态的组件'),
        rainx.h(title, null, null)
      ])
    }
  }
  let state_component = rainx.h(StateComponent, null, null)
  console.log(state_component)
  rainx.render(state_component, app)

  // setTimeout(() => {
  //   console.log('excute')
  //   rainx.render(vnode_portal, app)
  // }, 4000)
}