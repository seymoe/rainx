import { h, Component } from 'rainx'

const boxStyle = {
  background: '#31cd89',
  padding: '15px',
  color: '#fff'
}

export default class Application extends Component{
  constructor(props) {
    super(props)
    this.state = {
      title: 'Hello, Rainx'
    }
  }

  componentDidMount() {
    console.log('✅ Application didMount！')
    // const timer = setTimeout(() => {
    //   this.setState({
    //     title: Date.now()
    //   }, () => {console.log('更新时间')})
    // }, 2000)
  }

  render() {
    const { title } = this.state
    return (
      <div className={'box'} style={boxStyle}>
        <h1>{ title }</h1>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          <li>1. React & Vue like.</li>
          <li>2. JSX</li>
        </ul>
      </div>
    )
  }
}