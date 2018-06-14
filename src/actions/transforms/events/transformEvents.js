import transformEvent from './transformEvent';

function transformEvents(data) {
  return data.events && data.events.length && data.events.map(o => transformEvent(o));
}

export default transformEvents;
