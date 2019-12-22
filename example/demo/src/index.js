import { h, render } from 'rainx'

const boxStyle = {
  background: '#31cd89',
  padding: '15px',
  color: '#fff'
}

class App {
  render() {
    return (
      <div className={'box'} style={boxStyle}>
        <h1>Hello, Rainx!</h1>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>1. React & Vue like.</li>
          <li>2. JSX</li>
        </ul>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))

