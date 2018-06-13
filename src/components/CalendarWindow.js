import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarWindow.css';
import {observer} from 'mobx-react';

// Defines a custom-styled event
const Event = ({title}) => (
  <div className="panel panel-no-padding panel-dark-blue panel-no-border">
    <p style={{margin: 0}} className="font-size--3">{title}</p>
  </div>
)

// Initialize the calendar
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

  // {
  //   id: 0,
  //   title: 'All Day Event very long title',
  //   allDay: true,
  //   start: new Date(2015, 3, 0),
  //   end: new Date(2015, 3, 1),
  // }

// Loads a calendar based on events from the features
let CalendarWindow = observer(({featureStore}) => {
  const events = featureStore.events;

  return (
    <BigCalendar
      events={events}
      views={['month', 'week', 'agenda']}
      defaultDate={new Date()}
      components={{event: Event}}
      onSelectEvent={featureStore.onCalendarEvent}
    />
  )
})

export default CalendarWindow;