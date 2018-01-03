import * as transform from 'actions/transforms';
import { action, fxActionPost, fxActionGet, fxActionPut, fxActionDelete } from 'actions/action';
import queryString from 'querystring';

export const getUserMetadata = (params = {}) => (dispatch) => {
  const getDataStart = payload => ({
    type: 'OK/metadata',
    payload,
  });

  const accessToken = params.access_token || localStorage.getItem('access_token');
  const accountUser = params.account_user || JSON.parse(localStorage.getItem('account_user'));
  const accountHotspot = params.account_hotspot || JSON.parse(localStorage.getItem('account_hotspot'));
  let payload = {};
  if (accessToken && accountUser) {
    payload = { user: accountUser, access_token: accessToken, hotspot: accountHotspot };
  }

  dispatch(getDataStart(payload));
};

// auth
export const huserLogin = (username, password) => fxActionPost('auth', 'huser/login', { username, password });
export const cuserLogin = (username, password) => fxActionPost('auth', 'cuser/login', { username, password });
/* huser */
export const getHUserHotspot = accountId => fxActionGet('hotspot', `huser/${accountId}/hotspot`);
/* matches */
export const getMatchesLeague = params => fxActionGet('matchesLeague', 'matches', params, transform.transformMatches);
export const getNationalMatches = params => action('nationalMatches', 'matches', params, transform.transformMatches);
/* hotspot */
export const getHotspots = () => fxActionGet('hotspots', 'hotspots');
export const createHotspot = params => fxActionPost('ADD/hotspots', 'hotspot', params);

export const getHotspot = hotspotId => fxActionGet('hotspot', `hotspot/${hotspotId}`);
export const editHotspot = (hotspotId, params) => fxActionPut('EDIT/hotspot', `hotspot/${hotspotId}`, params, transform.transformEditEvent);

export const getHotspotEvents = (hotspotId, params = {}) => fxActionGet('hotspotEvents', `hotspot/${hotspotId}/events`, params, transform.transformEvents);
export const getHotspotUpcomingEvents = (hotspotId, params = {}) => fxActionGet('hotspotUpcomingEvents', `hotspot/${hotspotId}/events`, params, transform.transformEvents);
export const createHotspotEvent = (params, payload) => fxActionPost('ADD/hotspotEvents', 'event', params, transform.transformCreateEvent, payload);

export const createHotspotHUser = (params, payload) => fxActionPost('ADD/hotspotHUsers', 'huser', params, transform.transformHUser, payload);
export const getHotspotHUsers = hotspotId => fxActionGet('hotspotHUsers', `hotspot/${hotspotId}/husers`);
/* group */
export const getGroups = () => fxActionGet('groups', 'groups');
export const createGroup = params => fxActionPost('ADD/groups', 'group', params);
export const getGroup = groupId => fxActionGet('group', `group/${groupId}`);
export const editGroup = (groupId, params) => fxActionPut('EDIT/group', `group/${groupId}`, params);
export const getGroupEvents = groupId => fxActionGet('groupEvents', `group/${groupId}/events`, {}, transform.transformEvents);
export const createGroupEvent = (params, payload) => fxActionPost('ADD/groupEvents', 'event', params, transform.transformCreateEvent, payload);
export const getGroupHUsers = groupId => fxActionGet('groupHUsers', `group/${groupId}/husers`);
// export const createGroup = (params) => fxActionPost('ADD/events', 'event', params, transform.transformCreateGroup);
/* event */
export const getEvents = params => fxActionGet('events', 'events', { ...queryString.parse(params.substring(1)) }, transform.transformEvents);
export const getEvent = eventId => fxActionGet('event', `event/${eventId}`, {}, transform.transformEvent);
export const getEventXUsers = (eventId, params) => fxActionGet('eventXUsers', `event/${eventId}/xusers`, params);
export const createEvent = params => fxActionPost('ADD/events', 'event', params, transform.transformCreateEvent);
export const editEvent = (eventId, params) => fxActionPut('EDIT/event', `event/${eventId}`, params, transform.transformEditEvent);
export const deleteEvent = eventId => fxActionDelete('DELETE/event', `event/${eventId}`);


/* notification */
export const sendNotificationTopic = (params = { topic: '', message: '' }) => fxActionPost('sendNotification', 'notification/topic', params);


export const getMetadata = () => action('metadata', API_HOST, 'api/metadata');
export const setSearchQuery = query => dispatch => dispatch(({ type: 'QUERY/search', query }));
export const getSearchResult = query => action('search', API_HOST, 'api/search', { q: query });
export const getSearchResultAndPros = query => dispatch => Promise.all([
  dispatch(setSearchQuery(query)),
  dispatch(getSearchResult(query)),
]);
export const getGithubPulls = merged => action('ghPulls', 'https://api.github.com', 'search/issues', {
  q: `repo:odota/ui type:pr base:production label:release merged:>${merged}`,
  order: 'desc',
  page: 1,
  per_page: 1,
});

export * from './postRequestMatch';
export * from './formActions';
