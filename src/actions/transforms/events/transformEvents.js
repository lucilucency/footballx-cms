import transformEvent from './transformEvent';

function transformEvents(resp) {
  return resp.events && resp.events.length && resp.events.map(o => transformEvent(o));
}

export default transformEvents;
