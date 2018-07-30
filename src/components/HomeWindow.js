import React from 'react';
import CardGallery from './CardGallery';
import {observer} from'mobx-react';
import { Link } from "react-router-dom";
import HomeCanvas from '../components/HomeCanvas';
import Utils from '../utils/Utils';
import './HomeWindow.css';
// import SelectFilter from './SelectFilter';
import {
Button,
Input,
Row,
Col,
Container,
Jumbotron} from 'reactstrap';

const ROTATEDELAY = 5000;

const HomeWindow = observer( class HomeWindow extends React.Component {
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this.canvasRef = React.createRef();
    this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.updateSuggest = this.updateSuggest.bind(this);
    this.state = {
      suggestIndex: null
    }

  }

  updateSuggest(){
    if(!this.featureStore.homeFilterOptions){
      this.timeout = window.setTimeout(this.updateSuggest, ROTATEDELAY);
      return;
    }
    const max = this.featureStore.homeFilterOptions.length;
    const newI = Math.floor(Math.random() * max);
    this.setState({suggestIndex: newI});
    this.timeout = window.setTimeout(this.updateSuggest, ROTATEDELAY);
  }

  componentDidMount(){
    this.homeCanvas = new HomeCanvas(this.canvasRef.current);
    this.timeout = window.setTimeout(this.updateSuggest, ROTATEDELAY);
  }

  onMouseMove(e){
    if(this.homeCanvas){
      this.homeCanvas.onMouseMove(e);
    }
  }

  componentWillUnmount(){
    if(this.homeCanvas){
      this.homeCanvas.unmount();
    }
    if(this.timeout){
      window.clearTimeout(this.timeout);
    }
  }

  onOptionClick(e){
    const id = e.target.id;
    const opt = this.featureStore.filteredHomeFilterOptions[id];
    this.featureStore.setFilterOption(opt[0], opt[1]);
    this.featureStore.setHomeSearchString('');
    this.props.history.push(`/browse`);
  }

  onSearchChange(e){
    this.featureStore.setHomeSearchString(e.target.value);
  }

  onSearchKeyDown(e){
    if (e.which === 13 || e.keyCode === 13) {
      this.featureStore.setGeneralSearchString(this.featureStore.homeSearchString);
      this.featureStore.setHomeSearchString('');
      this.props.history.push(`/browse`);
      return false;
    }
    return true;
  }

  render() {

    let optView;
    if(this.featureStore.homeSearchString && this.featureStore.filteredHomeFilterOptions.length > 0){
      let opts = this.featureStore.filteredHomeFilterOptions.slice(0, 5);
      const homeOptBtns = opts.map((o, i) => {
        const val = Utils.formatSurveyStr(o[1]);
        const filter = o[0];
        const label = filter.label;
        const str = `${label}: ${val}`;
        return <Button key={str} id={i} color="light" block className="text-left" onClick={this.onOptionClick}>{str}</Button>
      })
      optView = (
        <div className="search-dropdown">
          {homeOptBtns}
        </div>
      )
      
    }

    let suggestText = "Find a colleague! Try 'WeCan'";
    if(this.featureStore.homeFilterOptions
      && this.state.suggestIndex !== null
      && this.state.suggestIndex < this.featureStore.homeFilterOptions.length){
      const suggestFilter = this.featureStore.homeFilterOptions[this.state.suggestIndex];
      const suggestLabel = Utils.formatSurveyStr(suggestFilter[1]);
      suggestText = `Find a colleague! Try '${suggestLabel}'`
    }

    return (
      <div>
      <div style={{position:"relative"}}>
        <div style={{zIndex:-3, backgroundColor: '#343A40', width:"100%", height:"100%", overflow:"hidden", position:"absolute"}}>
          <canvas
            ref={this.canvasRef}
            style={{width:"90rem", minWidth:"100%", height:"100%", zIndex: -4}}>
          </canvas>
        </div>
        {/* <img alt='e-bloc' className="d-none d-md-block" style={{position:"absolute", top:0, right: "2vw"}} src={backImg}/> */}
        <Jumbotron
          fluid
          className="e-bloc-jumbo"
          onMouseMove={this.onMouseMove}
          >
  
          <Container fluid className="text-center">
            <h1 className="display-3 jumbo-text">Esri Office Hours</h1>
            <p className="pb-5 jumbo-text">Colleagues open their offices for you to <br/><span className="text-success"><strong>start a conversation</strong></span> and <span className="text-success"><strong>learn from their experiences</strong></span></p>
            <Row className="mb-5">
              <Col xs="1" md="3"/>
              <Col xs="10" md="6" className="p-0">
                <Input
                  id="search"
                  onChange={this.onSearchChange}
                  onKeyDown={this.onSearchKeyDown}
                  value={this.featureStore.homeSearchString}
                  className="mt-2"
                  bsSize="lg"
                  placeholder={suggestText}/>
                {optView}
                <Button tag={Link} to={'/browse'} color="link">Browse all volunteers</Button>
              </Col>
              <Col xs="1" md="3"/>
            </Row>
          </Container>
          
        </Jumbotron>
      </div>
      <div className="mb-4" style={{width:"100%", textAlign:"center"}}>
        <h2>Meet some of our volunteers</h2>
      </div>
      <CardGallery featureStore={this.featureStore}/>
      <Container className="mt-5 mb-5"> 
        <Row>
          <Col/>
          <Col sm="6">
            <Button tag={Link} to={'/browse'} outline color="secondary" size="lg" block>Browse all volunteers</Button>
          </Col>
          <Col/>
        </Row>
      </Container>
      <div style={{padding: "3.5rem 2.5rem", background:"#e9ecef", textAlign:"center"}}>
        <h2>Have thoughts or feedback?</h2>
        <Button color="success" href="mailto:e-bloc-admins@esri.com">Let us know!</Button>
      </div>
    </div>
    )
  }

})
  


export default HomeWindow;