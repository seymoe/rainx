import { h, render } from 'rainx'
import Application from './components/app'

class App {
  componentDidMount() {
    console.log('✅ App didMount.')
  }
  render() {
    return <Application></Application>
  }
}

render(<App/>, document.getElementById('app'))

