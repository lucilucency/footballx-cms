import React from 'react';
import { Link } from 'react-router-dom';
/* data */
import strings from 'lang';
import Clubs from 'fxconstants/build/clubsObj.json';
/* components */
import { Dialog } from 'material-ui';
import { TableLink } from 'components/Table';
import { TableXUserImage, TableClubImage, FromNowTooltip } from 'components/Visualizations';

import * as timeHelper from './time';
import * as styleHelper from './style';

export * from './time';
export * from './style';
export * from './sort';
export * from './styledComponent';
export * from './misc';

export function toNumber(input) {
  return Number(input);
}

export function toUpperCase(input) {
  return input.toString().toUpperCase();
}

export function abbreviateNumber(num) {
  if (!num) {
    return '-';
  } else if (num >= 1000 && num < 1000000) {
    return `${Number((num / 1000).toFixed(1))}${strings.abbr_thousand}`;
  } else if (num >= 1000000 && num < 1000000000) {
    return `${Number((num / 1000000).toFixed(1))}${strings.abbr_million}`;
  } else if (num >= 1000000000 && num < 1000000000000) {
    return `${Number((num / 1000000000).toFixed(1))}${strings.abbr_billion}`;
  } else if (num >= 1000000000000) {
    return `${Number((num / 1000000000000).toFixed(1))}${strings.abbr_trillion}`;
  }

  return num.toFixed(0);
}

export const calculateDistance = (x1, y1, x2, y2) =>
  (((x2 - x1) ** 2) + ((y2 - y1) ** 2)) ** 0.5;

export const calculateRelativeXY = ({ clientX, clientY, currentTarget }) => {
  // const bounds = target.getBoundingClientRect();
  // const x = clientX - bounds.left;
  // const y = clientY - bounds.top;
  let x = clientX + document.body.scrollLeft;
  let y = clientY + document.body.scrollTop;

  if (currentTarget.offsetParent) {
    let off = currentTarget.offsetParent;

    do {
      x -= off.offsetLeft;
      y -= off.offsetTop;
      off = off.offsetParent;
    } while (off);
  }

  return { x, y };
};

export const jsonFn = json =>
  arrayFn =>
    fn =>
      json[Object.keys(json)[arrayFn]((key, index) => fn(json[key], index))];


export const getPercentWin = (wins, games) => (games ? Number(((wins * 100) / games).toFixed(2)) : 0);

export const camelToSnake = str =>
  str.replace(/\.?([A-Z]+)/g, (match, group) => `_${group.toLowerCase()}`).replace(/^_/, '');

export const getOrdinal = (n) => {
  // TODO localize strings
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const percentile = (pct) => {
  if (pct >= 0.8) {
    return {
      color: 'green',
      grade: 'A',
    };
  } else if (pct >= 0.6) {
    return {
      color: 'blue',
      grade: 'B',
    };
  } else if (pct >= 0.4) {
    return {
      color: 'golden',
      grade: 'C',
    };
  } else if (pct >= 0.2) {
    return {
      color: 'yelor',
      grade: 'D',
    };
  }
  return {
    color: 'red',
    grade: 'F',
  };
};


/**
 * Transformations of table cell data to display values.
 * These functions are intended to be used as the displayFn property in table columns.
 * This is why they all take (row, col, field)
 * */
// TODO - these more complicated ones should be factored out into components
export const transformations = {
  duration: (row, col, field) => (
    <div>
      <span>
        {timeHelper.formatHoursSeconds(field)}
      </span>
      {row &&
      <span style={{ ...styleHelper.subTextStyle, display: 'block', marginTop: 1 }}>
        <FromNowTooltip timestamp={row.start_time + row.duration} />
      </span>}
    </div>
  ),

  game_mode: (row, col, field) => (strings[`game_mode_${field}`]),

  lobby_type: (row, col, field) => (strings[`lobby_type_${field}`]),

  match_id: (row, col, field) => <Link to={`/matches/${field}`}>{field}</Link>,
  match_id_with_time: (row, col, field) => (<div>
    <TableLink to={`/matches/${field}`}>{field}</TableLink>
    <span style={{ ...styleHelper.subTextStyle, display: 'block', marginTop: 1 }}>
      {timeHelper.fromNow(row.start_time || row.start_time_checkin)}
    </span>
  </div>),

  region: (row, col, field) => (strings[`region_${field}`]),

  start_time: (row, col, field) => <div>{timeHelper.toDateTimeString(field * 1000)}</div>,
  start_time_from_now: (row, col, field) => <FromNowTooltip timestamp={field} />,
  th_club_image: (row, col, field) => (
    <div>
      <TableClubImage
        image={row.icon}
        title={<TableLink to={`/clubs/${field}`}>{row.name}</TableLink>}
        subtitle={row.name}
        clubName={row.name}
      />
    </div>
  ),
  th_event_name: (row, col, field) => {
    const homeName = Clubs[row.home] && Clubs[row.home].name;
    const awayName = Clubs[row.away] && Clubs[row.away].name;
    if (homeName && awayName) {
      return <Link to={`/event/${field}`}>{`${homeName} vs ${awayName}`}</Link>;
    }
    return <Link to={`/event/${field}`}>{'Go to event >'}</Link>;
  },
  th_event_club_vs_club_image: row => (
    <div>
      <Link to={`/event/${row.event_id}`}>
        <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TableClubImage
            image={Clubs[row.home] && Clubs[row.home].icon}
            title={<span>{Clubs[row.home] && Clubs[row.home].name}</span>}
            // subtitle={Clubs[row.home] && Clubs[row.home].name}
            clubName={Clubs[row.home] && Clubs[row.home].name}
          />
          <span style={{ marginTop: 5 }}>vs</span>
          <TableClubImage
            image={Clubs[row.away] && Clubs[row.away].icon}
            title={<span>{Clubs[row.away] && Clubs[row.away].name}</span>}
            // subtitle={Clubs[row.away] && Clubs[row.away].name}
            clubName={Clubs[row.away] && Clubs[row.away].name}
          />
        </span>
      </Link>

    </div>
  ),
  th_xuser_image: (row, col, field) => (
    <TableXUserImage
      image={row.avatar}
      checkedIn={row.status === 'checkin'}
      title={<TableLink to={`/user/${row.id}`}>{field}</TableLink>}
      subtitle={<img
        alt=""
        src={Clubs[row.favorite_club] && Clubs[row.favorite_club].icon}
        title={Clubs[row.favorite_club] && Clubs[row.favorite_club].name}
        height={14}
      />}
    />
  ),
  th_huser_link: (row, col, field) => (<Link to={`/user/${row.id}`}>{field}</Link>),

  winPercent: (row, col, field) => `${(field * 100).toFixed(2)}%`,
};

export function renderDialog(dialogConstruct = {}, trigger) {
  const defaultDialogCons = {
    title: 'Example Dialog',
    actions: [],
    view: <h1>Welcome!</h1>,
    onRequestClose: () => { console.log('Do close dialog'); },
  };
  const { title, actions, view, onRequestClose } = Object.assign(defaultDialogCons, dialogConstruct);

  return (
    <Dialog
      title={title}
      actions={actions}
      modal={false}
      open={trigger}
      onRequestClose={onRequestClose}
      autoScrollBodyContent
    >
      {view}
    </Dialog>
  );
}

export function bindAll(methods, self) {
  methods.forEach((item) => {
  // eslint-disable-next-line no-param-reassign
    self[item] = self[item].bind(self);
  });
}
