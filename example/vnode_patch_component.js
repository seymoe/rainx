window.onload = function () {
  let rainx = window.rainx
  let h = rainx.h
  let app = document.querySelector('#app')

  // 测试1：class
  class StateComponent {
    state = 1

    // mounted 生命周期函数
    mounted() {
      let timer = setInterval(() => {
        this.state = this.state += 1
        // 暂时手动调用 _update
        this._update()
        if (this.state > 10) {
          clearInterval(timer)
        }
      }, 1000)
    }
    render() {
      return h('div', {class: 'wrap'}, '组件状态 state: ' + this.state)
    }
  }
  let test_state_vnode = rainx.h(StateComponent, null, null)

  rainx.render(test_state_vnode, app)
}
