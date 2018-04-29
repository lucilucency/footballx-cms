import React from 'react';
import strings from 'lang';
import OverviewPage from './Overview';

const pages = [
  {
    name: strings.tab_hotspot_overview,
    key: 'overview',
    content: (hotspotId, routeParams, location) => (
      <OverviewPage hotspotId={hotspotId} routeParams={routeParams} location={location} />),
  },
  // {
  //   name: strings.tab_hotspot_events,
  //   key: 'events',
  //   content: (hotspotId, routeParams, location) => (
  //     <EventsPage hotspotId={hotspotId} routeParams={routeParams} location={location} />),
  // },
];

export default id => pages.map(page => ({
  ...page,
  route: `/user/${id}/${page.key}`,
}));
