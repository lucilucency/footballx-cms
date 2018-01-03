import { combineReducers } from 'redux';
import reducer from 'reducers/reducer';
import fxReducer from 'reducers/fxReducer';
import request from 'reducers/request';
import form from 'reducers/form';

export default combineReducers({
  metadata: reducer('metadata'),

  search: reducer('search'),
  distributions: reducer('distributions'),
  leagues: reducer('leagues'),
  teams: reducer('teams'),
  clubs: reducer('clubs'),
  records: reducer('records'),
  /*-------------------------*/
  auth: fxReducer('auth', {}),
  matchesLeague: reducer('matchesLeague'),
  matchesNation: reducer('matchesNation'),

  groups: fxReducer('groups', []),
  group: fxReducer('group', []),
  groupEvents: fxReducer('groupEvents', []),
  groupHUsers: fxReducer('groupHUsers', []),

  hotspots: fxReducer('hotspots', []),
  hotspot: fxReducer('hotspot', {}),
  hotspotEvents: fxReducer('hotspotEvents', []),
  hotspotHUsers: fxReducer('hotspotHUsers', []),
  hotspotUpcomingEvents: fxReducer('hotspotUpcomingEvents', []),

  events: fxReducer('events', []),
  event: fxReducer('event', {}),
  eventXUsers: fxReducer('eventXUsers', []),
  /*--------------------------*/
  formCreateEvents: form('createEvent'),
  formCreateEvent: form('createEvent'),
  formEditEvent: form('editEvent'),

  formEditHotspot: form('editHotspot'),
  formEditGroup: form('editGroup'),
  formGenerateQR: form('generateQR'),
  formSendNotification: form('sendNotification'),
  formFilter: form('filter'),
  /*--------------------------*/
  // form,
  request,
});
