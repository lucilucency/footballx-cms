import React from 'react';
import strings from 'lang';
import Heading from 'components/Heading/index';
import OverviewPage from './Overview';

const pages = [{
  name: strings.tab_hotspot_overview,
  key: 'overview',
  content: props => (<OverviewPage props={props} />),

}, {
  name: strings.tab_log,
  key: 'log',
  parsed: true,
  content: () => (<div>
    <Heading title={strings.heading_log} />
  </div>),
}];

export default eventId => pages.map(page => ({
  ...page,
  route: `/events/${eventId}/${page.key.toLowerCase()}`,
  disabled: false,
}));
