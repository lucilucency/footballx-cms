import React from 'react';
import strings from 'lang';
import OverviewPage from './Overview';
import EventsPage from './Events';

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

export default id => pages.map((page) => {
  console.log('page', page);
  return {
    ...page,
    route: `/user/${id}/${page.key}`,
  };
});
