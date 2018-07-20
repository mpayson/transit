import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarWindow.css';
import {observer} from 'mobx-react';
import Utils from '../utils/Utils';

import {Button, ButtonGroup} from 'reactstrap';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToWeek = () => {
    toolbar.onViewChange('week');
  }
  const goToMonth = () => {
    toolbar.onViewChange('month');
  }

  const label = () => {
    return (
      <strong>{toolbar.label}</strong>
    );
  };

  return (

    <div className="mb-1 mt-1 text-center">
      
      <ButtonGroup className="float-left">
        <Button size="sm" outline onClick={goToBack}>Back</Button>
        <Button size="sm" outline onClick={goToCurrent}>Today</Button>
        <Button size="sm" outline onClick={goToNext}>Next</Button>
      </ButtonGroup>

      <label className="text-center">{label()}</label>

      <ButtonGroup className="float-right">
        <Button size="sm" outline={!(toolbar.view === "month")} onClick={goToMonth}>Month</Button>
        <Button className="d-none d-lg-inline" size="sm" outline={!(toolbar.view === "week")} onClick={goToWeek}>Week</Button>
      </ButtonGroup>
    </div >
  );
};


// Initialize the calendar
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const CalendarWindow = observer(class CalendarObserver extends Component{
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this.onCalendarEvent = this.onCalendarEvent.bind(this);
  }

  onCalendarEvent(e) {
    const idMap = this.featureStore.emailIdMap;
    if(idMap.has(e.title)){
      const id = idMap.get(e.title);
      this.props.history.push(`/browse/${id}`);
    }
  }

  render(){
    const id = this.props.match.params.id;

    let events;
    if(id){
      let idemail = this.featureStore.getEmailFromId(id);
      const idEvents = this.featureStore.emailEventMap.get(idemail);
      events = idEvents ? idEvents : [];
    } else {
      events = this.featureStore.filteredEvents;
    }

    const dateEvents = events.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start.toDate(),
      end: e.end.toDate()
    }));  
  
    const minTime = new Date();
    minTime.setHours(6,30,0);
    const maxTime = new Date();
    maxTime.setHours(20,30,0);
  
    return (
      <BigCalendar
        events={dateEvents}
        views={['month', 'week']}
        defaultDate={new Date()}
        components={{
          toolbar: CustomToolbar
        }}
        min={minTime}
        max={maxTime}
        onSelectEvent={this.onCalendarEvent}
      />
    )
  }

})

export default CalendarWindow;