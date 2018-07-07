import React from 'react';
import strings from 'lang';
import OverviewPage from './Overview/OverviewPage';
import EventsPage from './Events/EventsPage';
import HUsersPage from './HUsers/HUsersPage';
import ImportedMembersPage from './ImportedMembers/ImportedMembersPage';
import XUsersPage from './XUsers/XUsersPage';
import GroupMemberships from './GroupMemberships/index';

const pages = [{
  name: strings.tab_hotspot_overview,
  key: 'overview',
  content: (groupId, routeParams, location) => (
    <OverviewPage groupId={groupId} routeParams={routeParams} location={location} />),
}, {
  name: strings.tab_group_events,
  key: 'events',
  content: (groupId, routeParams, location) => (
    <EventsPage groupId={groupId} routeParams={routeParams} location={location} />),
}, false && {
  name: strings.tab_group_husers,
  key: 'husers',
  content: (groupId, routeParams, location) => (
    <HUsersPage groupId={groupId} routeParams={routeParams} location={location} />),
}, {
  name: strings.tab_group_xusers,
  key: 'xusers',
  content: (groupId, routeParams, location) => (
    <XUsersPage groupId={groupId} routeParams={routeParams} location={location} />),
}, null && {
  name: strings.tab_group_members,
  key: 'imported_members',
  content: (groupId, routeParams, location) => (
    <ImportedMembersPage groupId={groupId} routeParams={routeParams} location={location} />),
}, {
  name: 'Group membership',
  key: 'memberships',
  content: (groupId, routeParams, location) => (
    <GroupMemberships groupId={groupId} routeParams={routeParams} location={location} />),
}].filter(Boolean);

export default groupId => pages.map(page => ({
  ...page,
  route: `/group/${groupId}/${page.key}`,
}));
