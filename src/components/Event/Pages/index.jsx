import React from 'react';
import strings from 'lang';
import OverviewPage from './Overview';
import MatchLogPage from './Records';

const pages = [{
  name: strings.tab_hotspot_overview,
  key: 'overview',
  content: props => (<OverviewPage props={props} />),

}, {
  name: strings.tab_records,
  key: 'records',
  parsed: true,
  content: props => (<MatchLogPage {...props} />),
}];

export default eventId => pages.map(page => ({
  ...page,
  route: `/event/${eventId}/${page.key.toLowerCase()}`,
  disabled: false,
}));
