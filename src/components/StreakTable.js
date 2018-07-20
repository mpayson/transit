import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Link } from "react-router-dom";
import {Table, UncontrolledTooltip} from 'reactstrap';

const StreakTable = observer(class StreakTable extends Component{
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
  }

  render(){
    // const ftypes = layerConfig.fieldTypes;
    const emailMap = this.featureStore.emailIdMap;


    const streaks = this.featureStore.sortedStreaks;
    const tableEntries = streaks.map((streak, i) => {
      const [email, count] = streak;
      const id = emailMap.get(email);

      let h;
      if(i === 0){
        h = <h3 className="mb-0"><span role="img" aria-label="1">🥇</span></h3>
      } else if(i === 1){
        h = <h3 className="mb-0"><span role="img" aria-label="2">🥈</span></h3>
      } else if(i === 2){
        h = <h3 className="mb-0"><span role="img" aria-label="3">🥉</span></h3>
      } else if(count < 5){
        h = <h3 className="mb-0"><span role="img" aria-label="chic egg">🐣</span></h3>
      } else {
        h = <h3 className="mb-0"><span role="img" aria-label="chic">🐥</span></h3>
      }

      return (
        <tr key={id}>
          <th scope="row">{h}</th>
          <th><Link to={`/browse/${id}`}>{email}</Link></th>
          <th>{count}</th>
        </tr>
      )
      
    });

    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>email</th>
            <th><u id="streakcol" className="info">streak</u></th>
            <UncontrolledTooltip placement="bottom" target="streakcol">
              Number of months with continued participation
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>
          {tableEntries}
        </tbody>
      </Table>
    )
  }


})

export default StreakTable;