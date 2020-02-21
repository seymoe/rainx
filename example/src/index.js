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

render(<div>
  <h1>h1<p>p</p></h1>
  <h2>h2</h2>
</div>, document.getElementById('app'))

