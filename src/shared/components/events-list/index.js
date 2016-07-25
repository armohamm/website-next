// Display list of events
// You can request only displaying events of past or future
// with the `timeline` prop

import React, { PropTypes } from 'react';
import styles from './style.css';
import EventsTimelineTitle from '../events-timeline-title';
import EventsListEntry from '../events-list-entry';
import { splitEvents } from '../../util/events';

const EventsList = ({
  events,
  timeline,
}) => {
  const relevantEvents =
    timeline
    ? splitEvents({
      events,
      timeline,
      reverse: timeline === 'future',
    })
    : events;

  if (relevantEvents.length > 0) {
    return (
      <div className={styles.eventsListTimelineSection}>
          <EventsTimelineTitle timeline={timeline} />
        <ul className={styles.eventsList}>
          {
            relevantEvents.map((event) => (
              <EventsListEntry
                event={event}
                timeline={timeline}
                key={`key_${event.id}`}
              />
            ))
          }
        </ul>
      </div>
    );
  }

  return (<noscript />);
};

EventsList.propTypes = {
  events: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  timeline: EventsTimelineTitle.propTypes.timeline,
};

export default EventsList;
