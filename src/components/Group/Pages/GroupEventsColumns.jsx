import React from 'react';
import { transformations } from 'utils';
import { fromNow, toDateString, toTimeString } from 'utils/time';
import { subTextStyle } from 'utils/style';
import strings from 'lang';
import constants from 'components/constants';
import { colors } from 'material-ui/styles';

const groupEventsColumns = (browser = {}) => [browser.greaterThan.medium && {
  displayName: strings.th_match_id,
  tooltip: strings.tooltip_match_id,
  field: 'match_id',
  sortFn: true,
  // displayFn: transformations.match_id_with_time,
}, {
  displayName: strings.th_match,
  field: 'event_id',
  displayFn: transformations.th_event_club_vs_club_image,
  sortFn: true,
  sortClick: 'home',
}, browser.greaterThan.medium && {
  displayName: strings.th_price,
  tooltip: strings.tooltip_price,
  field: 'price',
  sortFn: true,
  displayFn: (row, col, field) => (<div style={{ float: 'left', textAlign: 'left' }}>
    <span className="ellipsis" style={{ display: 'block', fontSize: '1.25em' }}>{field}</span>
    {row.discount && <span style={{ display: 'block', color: colors.green600, float: 'left' }}>-{row.discount}%</span>}
  </div>),
}, browser.greaterThan.medium && {
  displayName: strings.th_seats,
  tooltip: strings.tooltip_seats,
  field: 'seats',
  sortFn: true,
}, browser.greaterThan.medium && {
  displayName: strings.th_price,
  tooltip: strings.tooltip_price,
  field: 'price',
  sortFn: true,
}, {
  displayName: strings.th_date,
  field: 'match_date',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <span className="ellipsis" style={{ display: 'block', fontSize: '1.25em' }}>{toTimeString(field * 1000)}</span>
    <span style={{ display: 'block', color: constants.colorMutedLight }}>{toDateString(field * 1000)}</span>
  </div>),
}, {
  displayName: strings.th_status,
  field: 'status',
  displayFn: (row, col, field) => {
    let color;
    switch (field) {
      case 0:
        color = constants.colorDanger; break;
      case 1:
        color = constants.colorGreen; break;
      case 2:
        color = constants.colorMuted; break;
      case 3:
        color = constants.colorMutedLight; break;
      default:
        color = constants.colorMutedLight;
    }
    return (<div>
      <span style={{ color }}>{strings[`event_status_${field}`]}</span>
      <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
        {fromNow(row.match_date)}
      </span>
    </div>);
  },
}, {
  displayName: strings.th_note,
  tooltip: strings.tooltip_note,
  field: 'notes',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <div className={subTextStyle.subText}>{field}</div>
  </div>),
}, {
  displayName: strings.th_xusers,
  tooltip: strings.tooltip_xuser,
  field: 'checkin_total',
  sortFn: true,
  displayFn: row => (<div>
    {row.checkin_total} / {row.checkin_total + row.register_total}
  </div>),
}];

export default groupEventsColumns;
