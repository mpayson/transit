import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Rheostat from 'rheostat';
import './SlideFilter.css';

import {Button} from 'reactstrap';

const SlideFilter = observer(class SlideFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;

    this.handle = this.handle.bind(this);
    this.onClear = this.onClear.bind(this);

  }

  handle(e) {
    this.filterObj.setMinMax(e.values);
  }

  onClear(){
    this.filterObj.clear();
  }

  render() {

    return (
      <div>
        <div
          style={{width:"15rem", height:"5rem"}}
          className="pt-2 pr-4 pl-4 pb-2 mw-25">
          <Rheostat
            min={this.filterObj.low}
            max={this.filterObj.high}
            values={[this.filterObj.min, this.filterObj.max]}
            onValuesUpdated={this.handle}
          />
            <div className="float-left">{`${this.filterObj.low} years`}</div>
            <div className="float-right">{`${this.filterObj.high} years`}</div>
        </div>
        <Button onClick={this.onClear} outline size="sm" className="float-right mr-2 mb-2">Clear range</Button>
      </div>
    );
  }


})

export default SlideFilter;