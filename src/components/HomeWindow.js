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

            <h1 className="display-3 jumbo-text">
              <svg className="mr-2" width="96px" height="50px" viewBox="0 0 192 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="page1" transform="translate(-395.000000, -25.000000)" fill="#9457FF" fillRule="nonzero">
                    <g id="e-bloc_logo-purple" transform="translate(395.000000, 25.000000)">
                      <path d="M191.1451,20.4241911 C190.409233,17.6738633 188.871491,12.1833214 148.961174,19.2822499 C150.227511,21.432817 151.358803,23.6603058 152.348474,25.9517697 C168.414564,23.2051373 177.376092,22.7157697 181.552226,23.006923 C176.805012,26.3143291 164.371751,31.8716649 145.27915,38.4663889 C145.15429,37.931427 145.083869,37.3957705 144.938505,36.8614754 C137.683917,10.3166862 110.392912,-5.38750482 83.8370031,1.70155193 L83.6283212,1.75756539 C70.8489067,5.24415225 59.9761261,13.6716102 53.4019937,25.1858965 C46.8278613,36.7001827 45.0909277,50.3580512 48.5733186,63.1547676 C48.6811695,63.5505572 48.8349131,63.9201738 48.9514764,64.31124 C29.1343846,68.1567754 15.5988917,69.5673645 9.83840084,69.0803586 C13.3098006,66.7372398 21.3153765,62.6741243 36.6010391,57.0088181 C36.3105352,54.5304302 36.1741661,52.0363556 36.1927207,49.5410231 C-1.90419263,63.373459 -0.494722931,68.8965644 0.241171306,71.6468921 C2.1865658,78.9167784 26.6564781,76.0608142 51.5473335,71.1353803 C61.7946818,93.0936531 86.2828502,104.542654 109.673794,98.3113569 L109.882448,98.2553434 C126.967739,93.5708863 140.294197,80.17043 144.900936,63.0424072 L136.277028,65.3563801 C131.427984,77.0469865 121.457485,85.8387213 109.263201,89.1764945 L109.095389,89.221422 C90.683074,94.1272056 71.3190258,85.7086555 62.3263445,68.8885069 C77.4636185,65.5854352 91.5471614,61.9396144 99.385925,59.8363311 C121.77984,53.8278313 194.571966,33.2312695 191.1451,20.4241911 Z M59.4930046,62.1549161 C59.298085,61.5505209 59.0696476,60.9655747 58.9011705,60.3467593 C56.0395892,49.8352911 57.4655297,38.6160144 62.865255,29.1574067 C68.2649803,19.698799 77.1961005,12.7757875 87.6935805,9.91158089 L87.8613917,9.86665342 C109.675395,4.04251223 132.094287,16.94042 138.056609,38.744678 C138.240847,39.4221742 138.296423,40.100365 138.436737,40.7785002 C126.777633,44.6346493 113.099995,48.7608078 97.5396689,52.9359224 C83.4353994,56.7203599 70.7144345,59.7554505 59.4930046,62.1549161 Z" id="Shape"></path>
                    </g>
                  </g>
                </g>
              </svg>
              Office Hours
            </h1>
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