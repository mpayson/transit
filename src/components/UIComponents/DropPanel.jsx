import React from 'react';
import ReactDOM from 'react-dom';
import RotateButton from './RotateButton'
import './DropPanel.css';

// A util component that creates a dropdown panel
class DropPanel extends React.Component {
  constructor(props, context) {
    super(props, context);

    if(typeof this.props.open === 'undefined'){
      this.state = {open: false}
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  _updateOpen(open){
    if(typeof this.props.controlToggle === 'undefined'){
      this.setState({open: open})
    } else {
      this.props.controlToggle(open)
    }
  }

  _getOpen(){
    if(typeof this.props.open === 'undefined'){
      return this.state.open
    }
    return this.props.open
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(event.target))) {
      this._updateOpen(false)
    }
  }

  handleClick(e) {
    e.preventDefault();
    this._updateOpen(!this._getOpen())
  }

  render() {
    const open = this._getOpen()
    const className = this.props.className
    const isRight = this.props.isRight
    const ddClass = (isRight ? "dropdown-content-right" : "dropdown-content")
    return (
      <div className="dropdown">
        <RotateButton 
          label={this.props.label}
          onClick={this.handleClick}
          isOpen={open}
          isActive={this.props.active}
          className={className}
          isRight={isRight}
          />

        {open &&
          <div className={ddClass}>
            {this.props.children}
          </div>
        }
      </div>
    );
  }
}

export default DropPanel