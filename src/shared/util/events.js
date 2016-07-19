import dateFns from 'date-fns';

export function splitEvents({
  events,              // array of events
  timeline,            // one of 'past', 'today', 'future'
  reverse = false,     // optionally reverse final list of events
  todayDateTime = new Date(),  // iso string representing today date
}) {
  let relevantEvents = events.filter(event => {
    const startDateTime = dateFns.parse(event.startDateTime.iso);
    const endDateTime = dateFns.parse(event.endDateTime.iso);

    // In a rare case of user error we omit this event from the output list
    if (!dateFns.isSameDay(startDateTime, endDateTime) &&
      !dateFns.isBefore(startDateTime, endDateTime)) {
      return false;
    }

    switch (timeline) {
      case 'today':
        if (dateFns.isSameDay(startDateTime, endDateTime)) {
          return dateFns.isSameDay(startDateTime, todayDateTime);
        } else { // eslint-disable-line no-else-return
          return dateFns.isWithinRange(todayDateTime, startDateTime, endDateTime);
        }
      case 'past':
        return (!dateFns.isWithinRange(todayDateTime, startDateTime, endDateTime) && dateFns.isBefore(endDateTime, todayDateTime) && !dateFns.isSameDay(endDateTime, todayDateTime));
      case 'future':
        return (!dateFns.isSameDay(startDateTime, todayDateTime) &&
          dateFns.isAfter(startDateTime, todayDateTime));
      default:
        return false;
    }
  }, this);

  if (relevantEvents.length > 1 && reverse === true) {
    relevantEvents = relevantEvents.reverse();
  }

  return relevantEvents;
}

// Helper function for displaying date range for multi day events
// Date range would only be displayed if end date is set on the
// child component
export function setEndDate(timeline, startDateTime, endDateTime) {
  if (timeline === 'today' &&
    startDateTime.date !== endDateTime.date) {
    return endDateTime;
  }
  return null;
}
