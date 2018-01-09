import React from 'react';
import strings from 'lang';
import { IconGithub, IconDiscord } from '../Icons';

const links = [{
  tooltip: strings.app_github,
  path: '//ci.ttab.me/web/footballx-ui',
  icon: <IconGithub />,
}, {
  tooltip: strings.app_discord,
  path: '//www.pivotaltracker.com/n/projects/2136932',
  icon: <IconDiscord />,
}];

export default () => (<div>
  {links.map((link, index) => (
    <a
      key={index}
      target="_blank"
      rel="noopener noreferrer"
      data-hint-position="top"
      data-hint={link.tooltip}
      href={link.path}
    >
      {link.icon}
    </a>
  ))}
</div>);
