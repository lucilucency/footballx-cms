/* eslint-disable camelcase */
import * as transform from 'actions/transforms';
import {
  action, fxActionPost, fxActionGet, fxActionPut, fxActionDelete, fxActionAuth, fxDispatch,
  dispatchPost, dispatchGet, dispatchPut,
} from 'actions/dispatchAction';
import leagues from 'fxconstants/leaguesObj.json';
import { setCookie, getCookie, eraseCookie } from '../utils';

const __blankTransforms = () => ([]);

export * from 'actions/ajax';

export const getLocalMetadata = (params = {}) => (dispatch) => {
  const getDataStart = payload => ({
    type: 'OK/metadata',
    payload,
  });

  const accessToken = params.access_token || getCookie('access_token');
  const user = params.user || JSON.parse(getCookie('user'));
  const cuser = params.cuser || JSON.parse(getCookie('cuser'));
  const guser = params.guser || JSON.parse(getCookie('guser'));
  const huser = params.huser || JSON.parse(getCookie('huser'));
  // const accountUser = params.account_user || JSON.parse(localStorage.getItem('account_user'));
  // const accountHotspot = params.account_hotspot || JSON.parse(localStorage.getItem('account_hotspot'));
  let payload = {};
  if (accessToken && user) {
    payload = {
      access_token: accessToken,
      user,
      cuser,
      guser,
      huser,
      // hotspot: accountHotspot,
    };
  }
  dispatch(getDataStart(payload));
};

// auth
export const login = (username, password) => fxActionAuth('metadata', 'user/login', { username, password });
export const auth = (username, password) => dispatchPost({
  reducer: 'metadata',
  path: 'user/login',
  params: { username, password },
  transform: (resp) => {
    const user = resp.data;
    const { cuser, guser, huser } = user;
    // if (cuser) {
    //   cuser.cuser_id = cuser.id;
    //   delete cuser.id;
    // }
    // if (guser) {
    //   guser.guser_id = guser.id;
    //   delete guser.id;
    // }
    // if (huser) {
    //   huser.huser_id = huser.id;
    //   delete huser.id;
    // }

    delete user.cuser; delete user.guser; delete user.huser;
    setCookie('access_token', user.access_token);
    setCookie('user', JSON.stringify(user));
    setCookie('cuser', JSON.stringify(cuser));
    setCookie('guser', JSON.stringify(guser));
    setCookie('huser', JSON.stringify(huser));

    return {
      user, cuser, guser, huser,
    };
  },
});
/* user */
export const getHUserHotspot = accountId => dispatchGet({ reducer: 'hotspot', path: `huser/${accountId}/hotspot` });
export const createUser = (params, payload) => fxActionPost('ADD/users', 'user', params, null, payload);
export const getUser = userID => dispatchGet({ reducer: 'user', path: `user/${userID}` });
export const editUser = (userID, params) => fxActionPut('EDIT/user', `user/${userID}`, params);
export const changePassword = (userID, params) => fxActionPut('user/change_password', `user/${userID}/change_password`, params);
export const resetPassword = (userID, params) => fxActionPut('user/reset_password', `user/${userID}/reset_password`, params);
export const editHUserProfile = (huserID, params) => fxActionPut('EDIT/user', `huser/${huserID}`, params);
export const editCUserProfile = (cuserID, params) => fxActionPut('EDIT/user', `cuser/${cuserID}`, params);
export const editGUserProfile = (guserID, params) => fxActionPut('EDIT/user', `guser/${guserID}`, params);
/* club & league */
export const getLeagueClubs = leagueID => dispatchGet({ reducer: `league[${leagues[leagueID] && leagues[leagueID].name}]`, path: `league/${leagueID}/clubs` });
export const editLeagueClub = (leagueID, clubID, params) => fxActionPut(`EDIT_ARR/league[${leagues[leagueID] && leagues[leagueID].name}]`, `club/${clubID}`, params);
/* matches */
export const getMatches = params => dispatchGet({ reducer: 'matches', path: 'matches/calendar', params, transform: transform.transformsMatchEvent });
export const getMatchesCompact = params => dispatchGet({ reducer: 'matchesCompact', path: 'matches', params, transform: transform.transformsMatch });
/* hotspot */
export const getHotspots = () => dispatchGet({
  reducer: 'hotspots',
  path: 'hotspots',
  transform: resp => resp.data,
});
export const createHotspot = params => fxActionPost('ADD/hotspots', 'hotspot', params);
export const deleteHotspot = hotspotID => fxActionDelete('DELETE/hotspot', `hotspot/${hotspotID}`);
export const getHotspot = hotspotId => dispatchGet({ reducer: 'hotspot', path: `hotspot/${hotspotId}` });
export const editHotspot = (hotspotId, params) => fxActionPut('EDIT/hotspot', `hotspot/${hotspotId}`, params, transform.transformEditEvent);
export const getHotspotEvents = (hotspotId, params = {}) => dispatchGet({ reducer: 'hotspotEvents', path: `hotspot/${hotspotId}/events`, params, transform: transform.transformEvents });
export const getHotspotUpcomingEvents = (hotspotId, params = {}) => fxActionGet('hotspotUpcomingEvents', `hotspot/${hotspotId}/events`, params, transform.transformEvents);
export const createHotspotEvent = (params, payload) => dispatchPost({
  version: 'v2',
  reducer: 'ADD/hotspotEvents',
  path: 'event',
  params,
  payload,
  transform: transform.transformCreateEvent,
});
export const createHotspotHUser = (params, payload) => fxActionPost('ADD/hotspotHUsers', 'huser', params, transform.transformHUser, payload);
export const getHotspotHUsers = hotspotId => dispatchGet({ reducer: 'hotspotHUsers', path: `hotspot/${hotspotId}/husers` });
/** group */
export const getGroups = () => dispatchGet({ reducer: 'groups', path: 'groups' });
export const createGroup = params => fxActionPost('ADD/groups', 'group', params);
export const getGroup = groupId => dispatchGet({ reducer: 'group', path: `group/${groupId}`, transform: el => el.data });
export const editGroup = (groupId, params) => fxActionPut('EDIT/group', `group/${groupId}`, params);
export const getGroupEvents = groupId => dispatchGet({ reducer: 'groupEvents', path: `group/${groupId}/events`, transform: resp => resp.data.map(el => transform.transformEvent(el)) });
export const createGroupEvent = (params, payload) => fxActionPost('ADD/groupEvents', 'event', params, transform.transformCreateEvent, payload);
export const getGroupHUsers = groupId => fxActionGet('groupHUsers', `group/${groupId}/husers`);
export const importGroupMembers = (groupId, params, payload) => fxActionPost('ADD/groupMembers', `group/${groupId}/membership`, params, __blankTransforms, payload);
export const getGroupImportedMembers = groupId => fxActionGet('groupMembers', `group/${groupId}/memberships`, {}, transform.transformGroupMembers);
export const getGroupXUsers = groupId => fxActionGet('groupXUsers', `group/${groupId}/xusers`, {});
export const getGroupMembershipPackages = groupId => fxActionGet('groupMembershipPackages', `group/${groupId}/membership_packages`);
export const getGroupMembershipPacks = membershipID => dispatchGet({
  version: 'v2',
  reducer: 'EDIT/group',
  path: `membership/${membershipID}/packs`,
  transform: (resp) => {
    const { group_membership_packs } = resp;
    if (group_membership_packs && group_membership_packs.length) {
      return {
        packs: group_membership_packs,
      };
    }
    return null;
  },
});
export const approveGroupMember = (membershipID, processID) => dispatchPut({
  version: 'v2',
  reducer: '',
  path: `membership/${membershipID}/complete-process`,
  params: { process_id: processID },
});
export const getGroupMembershipProcesses = membershipID => dispatchGet({
  version: 'v2',
  reducer: 'EDIT/group',
  path: `membership/${membershipID}/xuser-processes`,
  transform: (resp) => {
    const { xuser_membership_processes } = resp;
    if (xuser_membership_processes && xuser_membership_processes.length) {
      return {
        processes: xuser_membership_processes,
      };
    }
    return null;
  },
});
export const getGroupMemberships = groupID => dispatchGet({
  version: 'v2',
  reducer: 'EDIT/group',
  path: `group/${groupID}/memberships`,
  transform: (resp) => {
    const { group_membership } = resp;
    if (group_membership && group_membership.length) {
      return {
        membership: group_membership[group_membership.length - 1],
      };
    }
    return null;
  },
});
/* event */
export const getEvents = params => dispatchGet({
  version: 'v2',
  reducer: 'events',
  path: 'events',
  params,
  transform: transform.transformEvents,
});
export const getEvent = eventId => fxActionGet('event', `event/${eventId}`, {}, transform.transformEvent);
export const getEventXUsers = (eventId, params) => fxActionGet('eventXUsers', `event/${eventId}/xusers`, params);
export const addEventXUser = payload => fxDispatch('ADD/eventXUsers', payload);
export const dispatchNewXUserCheckin = payload => fxDispatch('eventXUser', payload);
export const createEvent = params => dispatchPost({
  version: 'v2',
  reducer: 'ADD/events',
  path: 'event',
  params,
  transform: transform.transformCreateEvent,
});
export const editEvent = (eventId, params) => fxActionPut('EDIT/event', `event/${eventId}`, params, transform.transformEditEvent);
export const deleteEvent = eventId => fxActionDelete('DELETE/event', `event/${eventId}`);
/* card */
export const getCardLabels = () => fxActionGet('cardLabels', 'card/labels', {});
export const createCardLabel = (params, payload) => fxActionPost('ADD/cardLabels', 'card/label', params, null, payload);
export const createCards = (params, payload) => fxActionPost('ADD/cardLabels', 'cards', params, null, payload);

export const getCardIssues = () => fxActionGet('cardIssues', 'issues');
export const createCardIssue = (params, payload) => fxActionPost('ADD/cardIssues', 'issue', params, null, payload);
export const closeCardIssue = issueId => fxActionPut('EDIT/cardIssue', `issue/${issueId}/close`);
export const returnCardToStockFromCardIssue = (issueId, number) => fxActionPut('EDIT_ARR/cardIssues', `issue/${issueId}/return-cards`, { issue_id: issueId, number_card: number });

export const getCardPackages = () => fxActionGet('cardPackages', 'packes');
export const createCardPackage = params => fxActionPost('ADD/cardPackages', 'pack', params);
export const confirmPrintedPackage = packageId => fxActionPut('EDIT/cardPackage', `pack/${packageId}/print-complete`, { pack_id: packageId });

/* notification */
export const sendNotificationTopic = (params = { topic: '', message: '' }) => fxActionPost('sendNotification', 'notification/topic', params);

export const setSearchQuery = query => dispatch => dispatch(({ type: 'QUERY/search', query }));
export const getSearchResult = query => action('search', 'https://api.opendota.com', 'api/search', { q: query });
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

export const logout = () => {
  console.warn('Logging out...');
  eraseCookie('access_token');
  eraseCookie('user_id');
  eraseCookie('user_data');
  console.warn('Cleared cookie');
};

export * from './dispatchForm';
export * from './request';
