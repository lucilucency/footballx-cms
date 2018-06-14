import strings from 'lang';
import Clubs from 'fxconstants/clubsObj.json';
import Leagues from 'fxconstants/leaguesObj.json';

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

export const leagueList = Object.keys(Leagues).map(id => ({
  text: Leagues[id] && Leagues[id].name,
  value: id,
})).sort((a, b) => a.text.localeCompare(b.text));

export const clubList = Object.keys(Clubs).map(id => ({
  text: Clubs[id] && Clubs[id].name,
  value: id,
})).sort((a, b) => a.text.localeCompare(b.text));
