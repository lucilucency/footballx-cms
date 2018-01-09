import React from 'react';
import strings from 'lang';

const links = [{
  name: strings.app_about,
  path: '//about.ttab.me',
}, {
  name: strings.app_privacy_terms,
  path: '//privacy.ttab.me',
}, {
  name: strings.app_on_store,
  path: 'http://onelink.to/83qfds',
}];

export default () => (
  <div>
    {links.map(link => (
      <a href={link.path} key={link.name} target="_blank" rel="noopener noreferrer">{link.name}</a>
    ))}
  </div>
);
