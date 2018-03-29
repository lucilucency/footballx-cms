import { combineReducers } from 'redux';
import fxReducer from 'reducers/fxReducer';
import request from 'reducers/request';
import form from 'reducers/form';
import leagues from 'fxconstants/build/leaguesArr.json';


const leaguesReducer = leagues.reduce((__prev, cur) => {
  const prev = __prev;
  prev[`league[${cur.name}]`] = fxReducer(`league[${cur.name}]`, []);
  return prev;
}, {});

export default combineReducers({
  metadata: fxReducer('metadata'),
  auth: fxReducer('auth', {}),

  clubs: fxReducer('clubs', []),
  // leagues: fxReducer('leagues', []),
  ...leaguesReducer,
  matches: fxReducer('matches', []),
  matchesLeague: fxReducer('matchesLeague', { matches: [] }),

  groups: fxReducer('groups', []),
  group: fxReducer('group', []),
  groupEvents: fxReducer('groupEvents', []),
  groupHUsers: fxReducer('groupHUsers', []),
  groupMembers: fxReducer('groupMembers', []),
  groupXUsers: fxReducer('groupXUsers', []),
  groupMembershipPackages: fxReducer('groupMembershipPackages', []),

  hotspots: fxReducer('hotspots', []),
  hotspot: fxReducer('hotspot', {}),
  hotspotEvents: fxReducer('hotspotEvents', []),
  hotspotHUsers: fxReducer('hotspotHUsers', []),
  hotspotUpcomingEvents: fxReducer('hotspotUpcomingEvents', []),

  events: fxReducer('events', []),
  event: fxReducer('event', {}),
  eventXUsers: fxReducer('eventXUsers', []),
  eventXUser: fxReducer('eventXUser', {}),

  cardIssues: fxReducer('cardIssues', []),
  cardPackages: fxReducer('cardPackages', []),
  cardLabels: fxReducer('cardLabels', []),
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
