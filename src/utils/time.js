import strings from 'lang';
import util from 'util';

const moment = require('moment');

const second = 1;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30;
const year = month * 12;

const timeUnits = [{
  name: strings.time_s,
  plural: strings.time_ss,
  limit: minute,
  in_seconds: second,
}, {
  name: strings.time_m,
  plural: strings.time_mm,
  limit: hour,
  in_seconds: minute,
}, {
  name: strings.time_h,
  plural: strings.time_hh,
  limit: day,
  in_seconds: hour,
}, {
  name: strings.time_d,
  plural: strings.time_dd,
  limit: month,
  in_seconds: day,
}, {
  name: strings.time_M,
  plural: strings.time_MM,
  limit: year,
  in_seconds: month,
}, {
  name: strings.time_y,
  plural: strings.time_yy,
  limit: null,
  in_seconds: year,
}];

export function pad(n, width, z = '0') {
  const str = `${n}`;
  return str.length >= width ? str : new Array((width - str.length) + 1).join(z) + n;
}

export function fromNow(time) {
  const diff = (new Date() - new Date(time * 1000)) / 1000;

  if (diff > 0) {
    if (diff < 5) {
      return strings.time_just_now;
    }

    for (let i = 0; i < timeUnits.length; i += 1) {
      const unit = timeUnits[i];

      if (diff < unit.limit || !unit.limit) {
        const val = Math.floor(diff / unit.in_seconds);
        return util.format(strings.time_past, val > 1 ? util.format(unit.plural, val) : unit.name);
      }
    }
  } else {
    const negativeDiff = -diff;
    for (let i = 0; i < timeUnits.length; i += 1) {
      const unit = timeUnits[i];

      if (negativeDiff < unit.limit || !unit.limit) {
        const val = Math.floor(negativeDiff / unit.in_seconds);
        return util.format(strings.time_next, val > 1 ? util.format(unit.plural, val) : unit.name);
      }
    }
  }


  return '';
}

export function formatSeconds(input) {
  if (!Number.isNaN(parseFloat(input)) && Number.isFinite(Number(input))) {
    const absTime = Math.abs(input);
    const minutes = Math.floor(absTime / 60);
    const seconds = pad(Math.floor(absTime % 60), 2);

    let time = ((input < 0) ? '-' : '');
    time += `${minutes}:${seconds}`;

    return time;
  }

  return null;
}

export function formatHoursSeconds(input) {
  if (!isNaN(parseFloat(input)) && isFinite(input)) {
    const absTime = Math.abs(input);
    const minutes = Math.floor(absTime / 60);
    const seconds = pad(Math.floor(absTime % 60), 2);

    let time = ((input < 0) ? '-' : '');
    time += `${minutes}:${seconds}`;

    return time;
  }

  return null;
}

export function toDateTimeString(input) {
  if (!input) {
    return '';
  }
  const inputParse = isNaN(input) ? input : Number(input);
  return new Date(inputParse).toLocaleDateString(window.localStorage.getItem('localization') || 'en-US', {
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    // month: 'short',
    month: 'numeric',
    year: 'numeric',
  });
}

export function toDateString(input) {
  if (!input) {
    return '';
  }

  const inputParse = isNaN(input) ? input : Number(input);
  return new Date(inputParse).toLocaleDateString(window.localStorage.getItem('localization') || 'en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

export function toTimeString(input) {
  return moment(input).format('HH:mm');
  // return new Date(Number(input)).toLocaleDateString(window.localStorage.getItem('localization') || 'en-US', {
  //     minute: 'numeric',
  //     hour: 'numeric',
  // })
}
