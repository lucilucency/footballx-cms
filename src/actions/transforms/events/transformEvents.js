import transformEvent from './transformEvent';

function transformEvents(data) {
  return data.map(o => transformEvent(o));
}

export default transformEvents;
