import React from 'react';
import strings from 'lang';
import OverviewPage from './OverviewPage';
import EventsPage from './GroupEventsPage';
import HUsersPage from './HusersPage';
import _ from 'lodash';

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
}].filter(o => o);

export default groupId => pages.map(page => ({
  ...page,
  route: `/group/${groupId}/${page.key}`,
}));
