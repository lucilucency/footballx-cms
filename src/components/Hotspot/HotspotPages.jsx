import React from 'react';
import strings from 'lang';
import {
  OverviewPage,
  EventsPage,
  HUsersPage,
} from './Pages';

const pages = [{
  name: strings.tab_hotspot_overview,
  key: 'overview',
  content: (hotspotId, routeParams, location) => (
    <OverviewPage hotspotId={hotspotId} routeParams={routeParams} location={location} />),
}, {
  name: strings.tab_hotspot_events,
  key: 'events',
  content: (hotspotId, routeParams, location) => (
    <EventsPage hotspotId={hotspotId} routeParams={routeParams} location={location} />),
}, {
  name: strings.tab_hotspot_husers,
  key: 'husers',
  content: (hotspotId, routeParams, location) => (
    <HUsersPage hotspotId={hotspotId} routeParams={routeParams} location={location} />),
}];

export default hotspotId => pages.map(page => ({
  ...page,
  route: `/hotspot/${hotspotId}/${page.key}`,
}));
