abstract class Component {
  public props: any
  public context: any
  public state?: object
  public x_update?: Function
  public constructor(props: any, context: any, state?: object) {
    this.props = props
    this.context = context
    if (typeof state === 'object' && state !== null) {
      this.state = state
    }
  }

  /**
   * 更新局部状态
   * @param partialState
   */
  setState(partialState: object | Function, callback: Function) {
    console.log(partialState, typeof partialState)
    if (typeof partialState !== 'object' || typeof partialState !== 'function') {
      console.warn(`setState receive a object or a function...`)
    }
    // 更新partialState
    
  }

  /**
   * 强制更新
   * @param callback
   */
  forceUpdate(callback: Function) {
    console.log(callback)
  }
}

export default Component