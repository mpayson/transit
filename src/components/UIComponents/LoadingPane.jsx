import React from 'react';


const messages = [
  "Loading Data!",
  "Just a second...",
  "Building a cache...",
  "Promise will be faster next time...",
  "How's your day going?",
  "Mine's been great, thanks for asking!",
  "Still waiting huh?",
  "Don't worry, the payoff will be huge!",
  "Okay now even I'm getting impatient...",
  "Seen any good movies lately?",
  "Weather ok?",
  "Ever thought about the universe and its elemental building blocks as a probabilistic distribution of stochastic events?",
  "Yea me neither...",
]


class LoadingPane extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {currentCount: 0}
  }
  timer() {
    if(this.state.currentCount < (messages.length -1 )){
      this.setState({currentCount: this.state.currentCount + 1})
    }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 4500);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const message = messages[this.state.currentCount]
    return(
      <div className="loader is-active padding-leader-3 padding-trailer-3">
        <div className="loader-bars"></div>
        <div className="loader-text">{message}</div>
      </div>
    )

  }
}

export default LoadingPane