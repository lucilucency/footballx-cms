import dates from '../utils/dates';
import { set } from '../formats';
import { set as setLocalizer } from '../localizer';

const dateRangeFormat = ({ start, end }, culture, local) =>
  `${local.format(start, 'd', culture)} — ${local.format(end, 'd', culture)}`;

const timeRangeFormat = ({ start, end }, culture, local) =>
  `${local.format(start, 't', culture)} — ${local.format(end, 't', culture)}`;

const timeRangeStartFormat = ({ start, end }, culture, local) =>
  `${local.format(start, 't', culture)} — `;

const timeRangeEndFormat = ({ start, end }, culture, local) =>
  ` — ${local.format(end, 't', culture)}`;

const weekRangeFormat = ({ start, end }, culture, local) =>
  `${local.format(start, 'MMM dd', culture)
  } - ${
    local.format(end, dates.eq(start, end, 'month') ? 'dd' : 'MMM dd', culture)}`;

export const formats = {
  dateFormat: 'dd',
  dayFormat: 'ddd dd/MM',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 't',

  monthHeaderFormat: 'Y',
  dayHeaderFormat: 'dddd MMM dd',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM dd',
  agendaTimeFormat: 't',
  agendaTimeRangeFormat: timeRangeFormat,
};

export default function (globalize) {
  function getCulture(culture) {
    return culture ? globalize.findClosestCulture(culture) : globalize.culture();
  }

  function firstOfWeek(culture) {
    culture = getCulture(culture);
    return (culture && culture.calendar.firstDay) || 0;
  }

  set(formats);

  return setLocalizer({
    firstOfWeek,

    parse(value, format, culture) {
      return globalize.parseDate(value, format, culture);
    },

    format(value, format, culture) {
      return globalize.format(value, format, culture);
    },
  });
}
