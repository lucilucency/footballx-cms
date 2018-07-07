import transformEvent from './transformEvent';

function transformEvents(resp) {
  return resp.data && resp.data.length && resp.data.map(o => transformEvent(o));
}

export default transformEvents;
