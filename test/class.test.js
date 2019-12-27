import rainx from "../src"

describe('Test class Component', () => {
  it('Simple class extend baseClass', () => {
    class App extends rainx.Component {
      constructor(props) {
        super(props)
        this.state = {
          title: 'Hello Rainx!'
        }
      }
      render() {
        const { title } = this.state
        return (
          <div>
            <h1>{{title}}</h1>
          </div>
        )
      }
    }
  })
})
