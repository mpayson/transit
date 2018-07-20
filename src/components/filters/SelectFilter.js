import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Utils from '../../utils/Utils';
import WeCan from '../../resources/WeCanLogo_Red.svg';

import {
  Button, ButtonGroup, DropdownItem, Input } from 'reactstrap';

const SelectFilter = observer(class SelectFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;

    this.onTextChange = this.onTextChange.bind(this);
    this.onClearClicked = this.onClearClicked.bind(this);
    this.onAndClicked = this.onAndClicked.bind(this);
    this.onOrClicked = this.onOrClicked.bind(this);

    this.onClick = this.onClick.bind(this);
    this.state = {
      filterStr: ''
    };

  }

  onClick(e){
    const v = e.target.id;
    const isChecked = this.filterObj.optionMap.has(v);
    this.filterObj.setMultiOption(v, !isChecked);
  }

  onTextChange(e){
    this.setState({filterStr: e.target.value});
  }

  onAndClicked(e){
    this.filterObj.setIsAnd(true);
  }
  onOrClicked(e){
    this.filterObj.setIsAnd(false);
  }
  onClearClicked(e){
    this.filterObj.clear();
  }

  render() {
    const f = this.filterObj;

    const field = f.fieldName;
    const label = f.label;
    const lf = this.props.filterStr
      ? this.props.filterStr.toLowerCase()
      : this.state.filterStr.toLowerCase();
    
    const options = f.options.filter(o => {
      const lo = o[0].toLowerCase();
      return lo.includes(lf);
    })

    const optionViews = options.map(o => {
      const isChecked = f.optionMap.has(o[0]);
      const optionStr = Utils.formatSurveyStr(o[0]);
      const svg = optionStr.includes('WeCan')
        ? <svg className="float-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="#ff4040" d="M166.25252,488h-17.8289l-14.7654-50.53092h-.31644L118.56964,488H100.63975L79.43763,413H98.84878l11.80963,50.00049h.31645L124.26573,413H143.044l13.39861,50.00049h.31645L168.78412,413h18.77825Zm72.8061-26.33308v2.10742a18.90064,18.90064,0,0,1-.10773,2.00642H200.86922a9.13911,9.13911,0,0,0,1.31967,4.00612,11.36711,11.36711,0,0,0,2.848,3.11063,13.61245,13.61245,0,0,0,3.90512,2.06029,13.78609,13.78609,0,0,0,4.47743.74063,14.49675,14.49675,0,0,0,6.96189-1.53512,13.79185,13.79185,0,0,0,4.64574-3.95225l12.02508,7.59478a24.34469,24.34469,0,0,1-9.75607,8.28156,32.331,32.331,0,0,1-14.08537,2.9019,33.59911,33.59911,0,0,1-11.18345-1.85156,26.9864,26.9864,0,0,1-9.2309-5.37964,24.91979,24.91979,0,0,1-6.22127-8.699,29.10657,29.10657,0,0,1-2.269-11.81636,29.6,29.6,0,0,1,2.21515-11.65476,26.39414,26.39414,0,0,1,6.01254-8.86059,26.78414,26.78414,0,0,1,8.96831-5.64223,30.58506,30.58506,0,0,1,11.18346-2.00642,28.317,28.317,0,0,1,10.65156,1.95256,23.27048,23.27048,0,0,1,8.33541,5.64223,26.171,26.171,0,0,1,5.43351,8.96831A34.54588,34.54588,0,0,1,239.05862,461.66692Zm-14.80645-6.64544a10.37334,10.37334,0,0,0-2.58546-7.06962q-2.58546-2.949-7.75638-2.95577a13.18138,13.18138,0,0,0-4.639.79449,12.00668,12.00668,0,0,0-3.68967,2.16128,10.66352,10.66352,0,0,0-2.5316,3.21836,9.39893,9.39893,0,0,0-1.05707,3.85126Zm79.71547,31.65243A40.0045,40.0045,0,0,1,287.19582,490a43.76652,43.76652,0,0,1-15.98407-2.84805,36.90629,36.90629,0,0,1-21.14825-20.56921,43.704,43.704,0,0,1,.05386-32.28458,36.19827,36.19827,0,0,1,8.59127-12.3954,38.19961,38.19961,0,0,1,12.87344-7.85737,46.16625,46.16625,0,0,1,31.49009.05386,29.84012,29.84012,0,0,1,12.38866,8.17383L303.227,434.51361a15.15292,15.15292,0,0,0-6.64543-5.17092,22.0431,22.0431,0,0,0-8.43641-1.69,21.43394,21.43394,0,0,0-8.70573,1.74384,20.33816,20.33816,0,0,0-6.8003,4.8006,21.76265,21.76265,0,0,0-4.43029,7.22448,25.45589,25.45589,0,0,0-1.58225,9.12317,26.2218,26.2218,0,0,0,1.58225,9.28476,21.51827,21.51827,0,0,0,4.37643,7.22448,19.58625,19.58625,0,0,0,6.6993,4.69287,21.2905,21.2905,0,0,0,8.54414,1.69,19.87548,19.87548,0,0,0,9.38575-2.10742,18.27947,18.27947,0,0,0,6.43672-5.48737l12.55025,11.81636A35.57892,35.57892,0,0,1,303.96764,486.67391Zm19.45721-45.65652A30.26094,30.26094,0,0,1,334.238,434.372a37.09856,37.09856,0,0,1,12.60411-2.21514,33.68442,33.68442,0,0,1,11.23732,1.63611,16.76971,16.76971,0,0,1,7.4332,5.06319,22.33751,22.33751,0,0,1,4.16771,8.85186A50.93711,50.93711,0,0,1,371,460.10337v26.674H355.17753V480.989h-.31645a13.01762,13.01762,0,0,1-6.06641,5.06319,21.6119,21.6119,0,0,1-8.80672,1.791,27.09537,27.09537,0,0,1-6.53771-.84162,19.21153,19.21153,0,0,1-6.17413-2.74705,14.75063,14.75063,0,0,1-4.58515-5.06319,15.57486,15.57486,0,0,1-1.79771-7.80351,13.25978,13.25978,0,0,1,3.11063-9.177,20.3811,20.3811,0,0,1,8.019-5.37965,42.56989,42.56989,0,0,1,10.92087-2.53159,111.21326,111.21326,0,0,1,11.70863-.6329v-.84835a6.42483,6.42483,0,0,0-2.74705-5.74323,11.78225,11.78225,0,0,0-6.74643-1.85156,16.86869,16.86869,0,0,0-7.12348,1.58224,22.84972,22.84972,0,0,0-5.851,3.7974Zm31.75268,22.66792h-2.21515q-2.84805,0-5.75.26258a23.97673,23.97673,0,0,0-5.16418,1.00321,9.58749,9.58749,0,0,0-3.75027,2.16129,4.97954,4.97954,0,0,0-1.47452,3.75026,4.54984,4.54984,0,0,0,.68677,2.5316,5.31567,5.31567,0,0,0,1.7371,1.68324,7.36146,7.36146,0,0,0,2.4306.89548,13.44119,13.44119,0,0,0,2.6326.26932q5.282,0,8.07282-2.90191a10.83513,10.83513,0,0,0,2.79419-7.85737ZM416.04188,487V458.31082a23.56724,23.56724,0,0,0-.37031-4.22157,11.88729,11.88729,0,0,0-1.21194-3.53481,6.321,6.321,0,0,0-2.37673-2.42386,7.88655,7.88655,0,0,0-3.95126-.90222,8.71816,8.71816,0,0,0-4.06.90222,8.16818,8.16818,0,0,0-2.90191,2.47773,11.15932,11.15932,0,0,0-1.73711,3.6358,15.56571,15.56571,0,0,0-.579,4.27544V487H381.14215V434h16.77856v7.74772h.20872a19.77911,19.77911,0,0,1,2.47773-3.72608,14.79,14.79,0,0,1,3.58868-2.79419,22.00539,22.00539,0,0,1,4.48415-1.89869,16.99408,16.99408,0,0,1,5.06419-.74063,19.43989,19.43989,0,0,1,8.96831,1.8987,17.17461,17.17461,0,0,1,5.95868,4.90833,21.33675,21.33675,0,0,1,3.27222,7.308,31.38479,31.38479,0,0,1,1.00321,7.81024V487ZM139.11768,23,77,85.11761V375H366.88232L429,312.88232V23ZM408,112.20825,381.854,86.06091,354.89478,113H408v68.22784l-26.146-26.14691L354.89478,182H408v68.24786L381.854,224.101l-54.567,54.567L311.3717,262.75262l20.05713-20.05627L312.83435,224.101l-54.567,54.567-15.91528-15.91529,20.0564-20.05627L243.8147,224.101l-54.5669,54.567-15.91528-15.91529,54.56689-54.56695L201.75244,182h52.29224l42.87439-42.83435L270.77222,113h52.292l42.87451-42.85437L339.79175,44H408ZM338,181.9591,311.04091,155l-26.9591,26.9591Zm0-.00722c0,3.699.0004,57.01668.0004,53.9182l26.9591-26.9591Zm.0409-69.41077L365,139.49979l-26.9591,26.9591ZM270,234.87432l26.9591-26.9591L270,180.95654Z"/></svg>
        : <svg className="float-right" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="#47BCAD" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>

      if(isChecked){
        return <DropdownItem style={{whiteSpace: "normal"}}
          key={o[0]} id={o[0]} onClick={this.onClick}>
          {optionStr}
          {svg}
        </DropdownItem>
      }
      return <DropdownItem key={o[0]} id={o[0]} onClick={this.onClick}>{optionStr}</DropdownItem>;
    })

    if(optionViews.length < 1 && this.props.multi){
      return null;
    }

    if(!this.props.multi){
      let andOrSelect;
      if(this.filterObj.supportsAndOr){
        andOrSelect = (
          <ButtonGroup className="float-right mt-1 mr-2">
            <Button
              outline={!this.filterObj.isAnd}
              color={this.filterObj.isAnd ? 'primary' : 'secondary'}
              size="sm"
              style={{padding: '0.25rem', fontSize:'0.65rem'}}
              onClick={this.onAndClicked}>
              and
            </Button>
            <Button
              outline={this.filterObj.isAnd}
              color={this.filterObj.isAnd ? 'secondary': 'primary'}
              size="sm"
              style={{padding: '0.25rem', fontSize:'0.65rem'}}
              onClick={this.onOrClicked}>
              or
            </Button>
        </ButtonGroup>
        )
      }

      return (
        <div style={{minWidth:"15rem", maxHeight:"20rem", overflowY:"scroll"}}>
          <div className="mr-1 ml-1">
            <Input
              bsSize="sm"
              placeholder="search"
              value={this.state.filterStr}
              onChange={this.onTextChange}
              />
          </div>
          <Button
            className="ml-2 mt-1"
            size="sm"
            color="link"
            style={{padding: '0.25rem'}}
            onClick={this.onClearClicked}>
            Clear
          </Button>
          {andOrSelect}
          {optionViews}
        </div>
      )
    }


    return (
      <div>
        <DropdownItem key={field} header>{label}</DropdownItem>
          {optionViews}
        <DropdownItem divider />
      </div>
    );
  }


})

export default SelectFilter;