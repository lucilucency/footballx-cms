/* global FX_API */
import React from 'react';
import { Link } from 'react-router-dom';
/* data */
import strings from 'lang';
import items from 'dotaconstants/build/items.json';
import itemIds from 'dotaconstants/build/item_ids.json';
import Clubs from 'fxconstants/build/clubsObj.json';
/* css */
// import styles from 'components/palette.css';
// import styled from 'styled-components';
import subTextStyle from 'components/Visualizations/Table/subText.css';
/* components */
import { TableLink } from 'components/Table';
import {
  TableXUserImage,
  TableClubImage,
  TableClubVsClubImage,
  FromNowTooltip,
} from 'components/Visualizations';
/* helpers */
// import findLast from 'lodash.findlast';
// import _ from 'lodash/fp';
import * as timeHelper from './time';

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
      <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
        <FromNowTooltip timestamp={row.start_time + row.duration} />
      </span>}
    </div>
  ),

  game_mode: (row, col, field) => (strings[`game_mode_${field}`]),

  lobby_type: (row, col, field) => (strings[`lobby_type_${field}`]),

  match_id: (row, col, field) => <Link to={`/matches/${field}`}>{field}</Link>,
  match_id_with_time: (row, col, field) => (<div>
    <TableLink to={`/matches/${field}`}>{field}</TableLink>
    <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
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
      return <Link to={`/events/${field}`}>{`${homeName} vs ${awayName}`}</Link>;
    }
    return <Link to={`/events/${field}`}>{'Go to event >'}</Link>;
  },
  th_event_club_vs_club_image: row => (
    <div>
      <Link to={`/events/${row.event_id}`}>
        <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TableClubVsClubImage
            image={Clubs[row.home] && Clubs[row.home].icon}
            title={<span>{Clubs[row.home] && Clubs[row.home].name}</span>}
            subtitle={Clubs[row.home] && Clubs[row.home].name}
            clubName={Clubs[row.home] && Clubs[row.home].name}
          />
          <span style={{ marginTop: 5 }}>vs</span>
          <TableClubVsClubImage
            image={Clubs[row.away] && Clubs[row.away].icon}
            title={<span>{Clubs[row.away] && Clubs[row.away].name}</span>}
            subtitle={Clubs[row.away] && Clubs[row.away].name}
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

const transformMatchItem = ({
  field,
}) => {
  if (field === 0) {
    return false;
  }
  return `${FX_API}${items[itemIds[field]].img}`;
};

for (let i = 0; i < 6; i += 1) {
  transformations[`item_${i}`] = transformMatchItem;
}

export const defaultSort = (array, sortState, sortField, sortFn) =>
  array.sort((a, b) => {
    const sortFnExists = typeof sortFn === 'function';
    const aVal = (sortFnExists ? sortFn(a) : a[sortField]) || 0;
    const bVal = (sortFnExists ? sortFn(b) : b[sortField]) || 0;
    const desc = aVal < bVal ? 1 : -1;
    const asc = aVal < bVal ? -1 : 1;
    return sortState === 'desc' ? desc : asc;
  });

export const SORT_ENUM = {
  0: 'asc',
  1: 'desc',
  asc: 0,
  desc: 1,
  next: state => SORT_ENUM[(state >= 1 ? 0 : state + 1)],
};

export function getObsWardsPlaced(pm) {
  if (!pm.obs_log) {
    return 0;
  }

  return pm.obs_log.filter(l => !l.entityleft).length;
}

export const sum = (a, b) => a + b;

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export const hsvToRgb = (h, s, v) => {
  let r;
  let g;
  let b;

  const i = Math.floor(h * 6);
  const f = (h * 6) - i;
  const p = v * (1 - s);
  const q = v * (1 - (f * s));
  const t = v * (1 - ((1 - f) * s));

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = v;
      g = t;
      b = p;
  }

  return [r * 255, g * 255, b * 255];
};
