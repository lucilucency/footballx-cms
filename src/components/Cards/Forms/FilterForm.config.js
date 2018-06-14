import strings from 'lang';
import Clubs from 'fxconstants/clubsObj.json';

export const dateList = [{
  text: strings.filter_last_week,
  value: 7,
}, {
  text: strings.filter_last_month,
  value: 30,
}, {
  text: strings.filter_last_3_months,
  value: 90,
}, {
  text: strings.filter_last_6_months,
  value: 180,
}];

export const placeList = [{
  text: 'Hà Nội',
  value: 'Hà Nội',
}, {
  text: 'Hồ Chí Minh',
  value: 'Hồ Chí Minh',
}];

export const statusList = [{
  text: strings.event_status_0,
  value: 0,
}, {
  text: strings.event_status_1,
  value: 1,
}, {
  text: strings.event_status_2,
  value: 2,
}, {
  text: strings.event_status_3,
  value: 3,
}];

export const clubList = Object.keys(Clubs).map(id => ({
  text: Clubs[id] && Clubs[id].name,
  value: id,
})).sort((a, b) => a.text.localeCompare(b.text));
