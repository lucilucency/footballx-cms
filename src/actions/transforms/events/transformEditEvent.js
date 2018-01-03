import update from 'react-addons-update';

function transformEditEvent(event) {
  return update(event, {
    event_id: { $set: event.id },
  });
}

export default transformEditEvent;
