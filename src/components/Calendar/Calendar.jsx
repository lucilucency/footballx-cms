import PropTypes from 'prop-types';
import React from 'react';
import uncontrollable from 'uncontrollable';
import cn from 'classnames';
import omit from 'lodash/omit';
import defaults from 'lodash/defaults';
import transform from 'lodash/transform';
import mapValues from 'lodash/mapValues';
import styled from 'styled-components';
import constants from 'components/constants';
import { lighten, darken, percentage } from 'utils';

import {
  accessor,
  elementType,
  dateFormat,
  dateRangeFormat,
  views as componentViews,
} from './utils/propTypes';

import { notify } from './utils/helpers';
import { navigate, views } from './utils/constants';
import defaultFormats from './formats';
import message from './utils/messages';
import moveDate from './utils/move';
import VIEWS from './Views';
import Toolbar from './Toolbar';
import EventWrapper from './EventWrapper';
import BackgroundWrapper from './BackgroundWrapper';

const CalendarStyled = styled.div`
.rbc-calendar {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 80vh;
  //background-color: white;
  color: rgb(245, 245, 245);
  padding: 5px;
}

.rbc-calendar *,
.rbc-calendar *:before,
.rbc-calendar *:after {
  box-sizing: inherit;
}

.rbc-abs-full {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.rbc-ellipsis {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rbc-rtl {
  direction: rtl;
}

.rbc-off-range {
  // color: ${constants['out-of-range-color']};
}

.rbc-off-range-bg {
  //background: ${constants['out-of-range-bg-color']};
}

.rbc-header {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 3px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  font-size: 90%;
  min-height: 0;

  > a {
    &, &:active, &:visited {
      color: inherit;
      text-decoration: none;
    }
  }
}

.rbc-row-content {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  z-index: 4;
}

.rbc-today {
  background-color: ${constants['today-highlight-bg']};
}

/* month.less */
.rbc-month-view {
  position: relative;
  border: 1px solid ${constants['calendar-border']};
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  width: 100%;
  user-select: none;
  -webkit-user-select: none;

  height: 100%; // ie-fix
}

.rbc-header {
  border-bottom: 1px solid ${constants['cell-border']};
}

.rbc-header + .rbc-header {
  border-left: 1px solid ${constants['cell-border']};
}

.rbc-rtl & .rbc-header + .rbc-header {
  border-left-width: 0;
  border-right: 1px solid ${constants['cell-border']};
}

.rbc-row {
  display: flex;
  flex-direction: row;
}

.rbc-row-segment {
  padding: 0 1px 1px 1px;

  .rbc-event-content {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.rbc-selected-cell {
  background-color: ${constants['date-selection-bg-color']};
}


.rbc-show-more {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: ${constants['event-zindex']};
  font-weight: bold;
  font-size: 85%;
  height: auto;
  line-height: normal;
}

.rbc-month-header {
  display: flex;
  flex-direction: row;
}

.rbc-month-row {
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1 0 0; // postcss will remove the 0px here hence the duplication below
  flex-basis: 0px;
  overflow: hidden;

  height: 100%; // ie-fix
  
  border-top: 1px solid ${constants['cell-border']};
  & + & {
    border-top: 1px solid ${constants['cell-border']};
  }
}

.rbc-date-cell {
  padding-right: 5px;
  text-align: right;

  &.rbc-now {
    font-weight: bold;
  }

  > a {
    &, &:active, &:visited {
      color: inherit;
      text-decoration: none;
    }
  }
}

.rbc-row-bg {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  flex: 1 0 0;
}

.rbc-day-bg {
  border-left: 1px solid ${constants['cell-border']};
  & + & {
    border-left: 1px solid ${constants['cell-border']};
  }

  .rbc-rtl & + & {
    border-left-width: 0;
    border-right: 1px solid ${constants['cell-border']};
  }
}

.rbc-overlay {
  position: absolute;
  z-index: ${constants['event-zindex']} + 1;
  border: 1px solid #e5e5e5;
  background-color: #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,.25);
  padding: 10px;

  > * + * {
    margin-top: 1px;
  }
}

.rbc-overlay-header {
  border-bottom: 1px solid #e5e5e5;
  margin: -10px -10px 5px -10px ;
  padding: 2px 10px;
}

/* event.less */
.rbc-event {
  cursor: pointer;
  padding: ${constants['event-padding']};
  background-color: ${constants['event-bg']};
  // border-radius: ${constants['event-border-radius']};
  color: ${constants['event-color']};
  //opacity: 0.5;
  text-align: center;

  &.rbc-selected {
    background-color: ${darken(constants['event-bg'], 0.1)};
  }
}

.rbc-event-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 80%;
}

.rbc-event-overlaps {
  box-shadow: -1px 1px 5px 0px rgba(51,51,51,.5);
}

.rbc-event-continues-prior {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.rbc-event-continues-after {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}


.rbc-event-continues-earlier {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.rbc-event-continues-later {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.rbc-event-continues-day-after {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.rbc-event-continues-day-prior {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}


/* agenda.less */
.rbc-agenda-view {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  overflow: auto;

  table {
    width: 100%;
    border: 1px solid ${constants['cell-border']};

    tbody > tr > td {
      padding: 5px 10px;
      vertical-align: top;

    }

    .rbc-agenda-time-cell {
      padding-left: 15px;
      padding-right: 15px;
      text-transform: lowercase;
    }

    tbody > tr > td + td {
      border-left: 1px solid ${constants['cell-border']};
    }

    .rbc-rtl & {
      tbody > tr > td + td {
        border-left-width: 0;
        border-right: 1px solid ${constants['cell-border']};
      }
    }

    tbody > tr + tr {
      border-top: 1px solid ${constants['cell-border']};
    }

    thead > tr > th {
      padding: 3px 5px;
      text-align: left;
      border-bottom: 1px solid ${constants['cell-border']};

      .rbc-rtl & {
        text-align: right;
      }
    }
  }
}

.rbc-agenda-time-cell {
  text-transform: lowercase;

  .rbc-continues-after:after {
    content: ' »'
  }
  .rbc-continues-prior:before {
    content: '« '
  }
}

.rbc-agenda-date-cell,
.rbc-agenda-time-cell {
  white-space: nowrap;
}



.rbc-agenda-event-cell {
  width: 100%
}


/* timegrid.less */
.rbc-slot-selection {
  z-index: 10;
  position: absolute;
  cursor: default;
  background-color: ${constants['time-selection-bg-color']};
  color: ${constants['time-selection-color']};
  font-size: 75%;
  padding: 3px;
}

.rbc-time-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  border: 1px solid ${constants['calendar-border']};
  min-height: 0;

  .rbc-time-gutter {
    white-space: nowrap;
  }

  .rbc-allday-cell {
    box-sizing: content-box;
    width: 100%;
    position: relative;
  }

  .rbc-allday-events {
    position: relative;
    z-index: 4;
  }

  .rbc-row {
    box-sizing: border-box;
    min-height: 20px;
  }
}


.rbc-time-header {
  display: flex;
  flex: 0 0 auto; // should not shrink below height
  flex-direction: column;

  &.rbc-overflowing {
    border-right: 1px solid ${constants['cell-border']};
  }

  .rbc-rtl &.rbc-overflowing {
    border-right-width: 0;
    border-left: 1px solid ${constants['cell-border']};
  }

  > .rbc-row > * + * {
    border-left: 1px solid ${constants['cell-border']};
  }

  .rbc-rtl & > .rbc-row > * + * {
    border-left-width: 0;
    border-right: 1px solid ${constants['cell-border']};
  }

  > .rbc-row:first-child {
    border-bottom: 1px solid  ${constants['cell-border']};
  }

  > .rbc-row.rbc-row-resource {
    border-bottom: 1px solid  ${constants['cell-border']};
  }

  .rbc-gutter-cell {
    flex: none;
  }

  > .rbc-gutter-cell + * {
    width: 100%;
  }
}

.rbc-time-content {
  display: flex;
  flex: 1 0 0%;
  align-items: flex-start;
  width: 100%;
  border-top: 2px solid ${constants['calendar-border']};
  overflow-y: auto;
  position: relative;

  > .rbc-time-gutter {
    flex: none;
  }

  > * + * > * {
    border-left: 1px solid ${constants['cell-border']};
  }

  .rbc-rtl & > * + * > * {
    border-left-width: 0;
    border-right: 1px solid ${constants['cell-border']};
  }

  > .rbc-day-slot {
    width: 100%;
    user-select: none;
    -webkit-user-select: none;
  }
}

.rbc-current-time-indicator {
  position: absolute;
  left: 0;
  height: 1px;

  background-color: ${constants['current-time-color']};
  pointer-events: none;

  &::before {
    display: block;

    position: absolute;
    left: -3px;
    top: -3px;

    content: ' ';
    background-color: ${constants['current-time-color']};

    border-radius: 50%;
    width: 8px;
    height: 8px;
  }

  .rbc-rtl &::before {
    left: 0;
    right: -3px;
  }
}

/* time-column.less */
.rbc-time-column {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .rbc-timeslot-group {
    flex: 1;
  }
}


.rbc-timeslot-group {
  border-bottom: 1px solid ${constants['cell-border']};
  min-height: 6vh;
  display: flex;
  flex-flow: column nowrap;
}

.rbc-time-gutter,
.rbc-header-gutter {
  flex: none;
}

.rbc-label {
  padding: 0 5px;
}

.rbc-day-slot {
  position: relative;

  .rbc-events-container {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 10px;
    top: 0;

    &.rtl {
      left: 10px;
      right: 0;
    }
  }

  .rbc-event {
    border: 1px solid ${constants['event-border']};
    display: flex;
    max-height: 100%;
    min-height: 20px;
    flex-flow: column wrap;
    align-items: flex-start;
    overflow: hidden;
    position: absolute;
  }

  .rbc-event-label {
    flex: none;
    padding-right: 5px;
    width: auto;
  }

  .rbc-event-content {
    width: 100%;
    flex: 1 1 0;
    word-wrap: break-word;
    line-height: 1;
    height: 100%;
    min-height: 1em;
  }

  .rbc-time-slot {
    border-top: 1px solid lighten(${constants['cell-border']}, 10%);
  }
}

.rbc-time-slot {
  flex: 1 0 0;

  &.rbc-now {
    font-weight: bold;
  }
}

.rbc-day-header {
  text-align: center;
}

/* reset.less */
.rbc-btn {
  color: inherit;
  font: inherit;
  margin: 0;
}

button.rbc-btn {
  overflow: visible;
  text-transform: none;
  -webkit-appearance: button;
  cursor: pointer;
}

button[disabled].rbc-btn {
  cursor: not-allowed;
}

button.rbc-input::-moz-focus-inner {
  border: 0;
  padding: 0;
}

`;

function viewNames(_views) {
  return !Array.isArray(_views) ? Object.keys(_views) : _views;
}

function isValidView(view, { views: _views }) {
  const names = viewNames(_views);
  return names.indexOf(view) !== -1;
}

/**
 * react-big-calendar is a full featured Calendar component for managing events and dates. It uses
 * modern `flexbox` for layout, making it super responsive and performant. Leaving most of the layout heavy lifting
 * to the browser. __note:__ The default styles use `height: 100%` which means your container must set an explicit
 * height (feel free to adjust the styles to suit your specific needs).
 *
 * Big Calendar is unopiniated about editing and moving events, preferring to let you implement it in a way that makes
 * the most sense to your app. It also tries not to be prescriptive about your event data structures, just tell it
 * how to find the start and end datetimes and you can pass it whatever you want.
 *
 * One thing to note is that, `react-big-calendar` treats event start/end dates as an _exclusive_ range.
 * which means that the event spans up to, but not including, the end date. In the case
 * of displaying events on whole days, end dates are rounded _up_ to the next day. So an
 * event ending on `Apr 8th 12:00:00 am` will not appear on the 8th, whereas one ending
 * on `Apr 8th 12:01:00 am` will. If you want _inclusive_ ranges consider providing a
 * function `endAccessor` that returns the end date + 1 day for those events that end at midnight.
 */
/**
 *
 *
 * @static
 * @memberof Calendar
 */
class Calendar extends React.Component {
  static propTypes = {
    /**
     * Props passed to main calendar `<div>`.
     *
     */
    elementProps: PropTypes.object,

    /**
     * The current date value of the calendar. Determines the visible view range.
     * If `date` is omitted then the result of `getNow` is used; otherwise the
     * current date is used.
     *
     * @controllable onNavigate
     */
    date: PropTypes.instanceOf(Date),

    /**
     * The current view of the calendar.
     *
     * @default 'month'
     * @controllable onView
     */
    view: PropTypes.string,

    /**
     * The initial view set for the Calendar.
     * @type Calendar.Views ('month'|'week'|'work_week'|'day'|'agenda')
     * @default 'month'
     */
    defaultView: PropTypes.string,

    /**
     * An array of event objects to display on the calendar. Events objects
     * can be any shape, as long as the Calendar knows how to retrieve the
     * following details of the event:
     *
     *  - start time
     *  - end time
     *  - title
     *  - whether its an "all day" event or not
     *  - any resource the event may be a related too
     *
     * Each of these properties can be customized or generated dynamically by
     * setting the various "accessor" props. Without any configuration the default
     * event should look like:
     *
     * ```js
     * Event {
     *   title: string,
     *   start: Date,
     *   end: Date,
     *   allDay?: boolean
     *   resource?: any,
     * }
     * ```
     */
    events: PropTypes.arrayOf(PropTypes.object),

    /**
     * Accessor for the event title, used to display event information. Should
     * resolve to a `renderable` value.
     *
     * ```js
     * string | (event: Object) => string
     * ```
     *
     * @type {(func|string)}
     */
    titleAccessor: accessor,

    /**
     * Accessor for the event tooltip. Should
     * resolve to a `renderable` value. Removes the tooltip if null.
     *
     * ```js
     * string | (event: Object) => string
     * ```
     *
     * @type {(func|string)}
     */
    tooltipAccessor: accessor,

    /**
     * Determines whether the event should be considered an "all day" event and ignore time.
     * Must resolve to a `boolean` value.
     *
     * ```js
     * string | (event: Object) => boolean
     * ```
     *
     * @type {(func|string)}
     */
    allDayAccessor: accessor,

    /**
     * The start date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * ```js
     * string | (event: Object) => Date
     * ```
     *
     * @type {(func|string)}
     */
    startAccessor: accessor,

    /**
     * The end date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * ```js
     * string | (event: Object) => Date
     * ```
     *
     * @type {(func|string)}
     */
    endAccessor: accessor,

    /**
     * Returns the id of the `resource` that the event is a member of. This
     * id should match at least one resource in the `resources` array.
     *
     * ```js
     * string | (event: Object) => Date
     * ```
     *
     * @type {(func|string)}
     */
    resourceAccessor: accessor,

    /**
     * An array of resource objects that map events to a specific resource.
     * Resource objects, like events, can be any shape or have any properties,
     * but should be uniquly identifiable via the `resourceIdAccessor`, as
     * well as a "title" or name as provided by the `resourceTitleAccessor` prop.
     */
    resources: PropTypes.arrayOf(PropTypes.object),

    /**
     * Provides a unique identifier for each resource in the `resources` array
     *
     * ```js
     * string | (resource: Object) => any
     * ```
     *
     * @type {(func|string)}
     */
    resourceIdAccessor: accessor,

    /**
     * Provides a human readable name for the resource object, used in headers.
     *
     * ```js
     * string | (resource: Object) => any
     * ```
     *
     * @type {(func|string)}
     */
    resourceTitleAccessor: accessor,

    /**
     * Determines the current date/time which is highlighted in the views.
     *
     * The value affects which day is shaded and which time is shown as
     * the current time. It also affects the date used by the Today button in
     * the toolbar.
     *
     * Providing a value here can be useful when you are implementing time zones
     * using the `startAccessor` and `endAccessor` properties.
     *
     * @type {func}
     * @default () => new Date()
     */
    getNow: PropTypes.func,

    /**
     * Callback fired when the `date` value changes.
     *
     * @controllable date
     */
    onNavigate: PropTypes.func,

    /**
     * Callback fired when the `view` value changes.
     *
     * @controllable view
     */
    onView: PropTypes.func,

    /**
     * Callback fired when date header, or the truncated events links are clicked
     *
     */
    onDrillDown: PropTypes.func,

    /**
     * A callback fired when a date selection is made. Only fires when `selectable` is `true`.
     *
     * ```js
     * (
     *   slotInfo: {
     *     start: Date,
     *     end: Date,
     *     slots: Array<Date>,
     *     action: "select" | "click" | "doubleClick"
     *   }
     * ) => any
     * ```
     */
    onSelectSlot: PropTypes.func,

    /**
     * Callback fired when a calendar event is selected.
     *
     * ```js
     * (event: Object, e: SyntheticEvent) => any
     * ```
     *
     * @controllable selected
     */
    onSelectEvent: PropTypes.func,

    /**
     * Callback fired when a calendar event is clicked twice.
     *
     * ```js
     * (event: Object, e: SyntheticEvent) => void
     * ```
     */
    onDoubleClickEvent: PropTypes.func,

    /**
     * Callback fired when dragging a selection in the Time views.
     *
     * Returning `false` from the handler will prevent a selection.
     *
     * ```js
     * (range: { start: Date, end: Date }) => ?boolean
     * ```
     */
    onSelecting: PropTypes.func,

    /**
     * The selected event, if any.
     */
    selected: PropTypes.object,

    /**
     * An array of built-in view names to allow the calendar to display.
     * accepts either an array of builtin view names,
     *
     * ```jsx
     * views={['month', 'day', 'agenda']}
     * ```
     * or an object hash of the view name and the component (or boolean for builtin).
     *
     * ```jsx
     * views={{
     *   month: true,
     *   week: false,
     *   myweek: WorkWeekViewComponent,
     * }}
     * ```
     *
     * Custom views can be any React component, that implements the following
     * interface:
     *
     * ```js
     * interface View {
     *   static title(date: Date, { formats: DateFormat[], culture: string?, ...props }): string
     *   static navigate(date: Date, action: 'PREV' | 'NEXT' | 'DATE'): Date
     * }
     * ```
     *
     * @type Calendar.Views ('month'|'week'|'work_week'|'day'|'agenda')
     * @View
     ['month', 'week', 'day', 'agenda']
     */
    views: componentViews,

    /**
     * The string name of the destination view for drill-down actions, such
     * as clicking a date header, or the truncated events links. If
     * `getDrilldownView` is also specified it will be used instead.
     *
     * Set to `null` to disable drill-down actions.
     *
     * ```js
     * <BigCalendar
     *   drilldownView="agenda"
     * />
     * ```
     */
    drilldownView: PropTypes.string,

    /**
     * Functionally equivalent to `drilldownView`, but accepts a function
     * that can return a view name. It's useful for customizing the drill-down
     * actions depending on the target date and triggering view.
     *
     * Return `null` to disable drill-down actions.
     *
     * ```js
     * <BigCalendar
     *   getDrilldownView={(targetDate, currentViewName, configuredViewNames) =>
     *     if (currentViewName === 'month' && configuredViewNames.includes('week'))
     *       return 'week'
     *
     *     return null;
     *   }}
     * />
     * ```
     */
    getDrilldownView: PropTypes.func,

    /**
     * Determines the end date from date prop in the agenda view
     * date prop + length (in number of days) = end date
     */
    length: PropTypes.number,

    /**
     * Determines whether the toolbar is displayed
     */
    toolbar: PropTypes.bool,

    /**
     * Show truncated events in an overlay when you click the "+_x_ more" link.
     */
    popup: PropTypes.bool,

    /**
     * Distance in pixels, from the edges of the viewport, the "show more" overlay should be positioned.
     *
     * ```jsx
     * <BigCalendar popupOffset={30}/>
     * <BigCalendar popupOffset={{x: 30, y: 20}}/>
     * ```
     */
    popupOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    ]),

    /**
     * Allows mouse selection of ranges of dates/times.
     *
     * The 'ignoreEvents' option prevents selection code from running when a
     * drag begins over an event. Useful when you want custom event click or drag
     * logic
     */
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),

    /** Determines whether you want events to be resizable */
    resizable: PropTypes.bool,

    /**
     * Specifies the number of miliseconds the user must press and hold on the screen for a touch
     * to be considered a "long press." Long presses are used for time slot selection on touch
     * devices.
     *
     * @type {number}
     * @default 250
     */
    longPressThreshold: PropTypes.number,

    /**
     * Determines the selectable time increments in week and day views
     */
    step: PropTypes.number,

    /**
     * The number of slots per "section" in the time grid views. Adjust with `step`
     * to change the default of 1 hour long groups, with 30 minute slots.
     */
    timeslots: PropTypes.number,

    /**
     *Switch the calendar to a `right-to-left` read direction.
     */
    rtl: PropTypes.bool,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the event node.
     *
     * ```js
     * (
     * 	event: Object,
     * 	start: Date,
     * 	end: Date,
     * 	isSelected: boolean
     * ) => { className?: string, style?: Object }
     * ```
     */
    eventPropGetter: PropTypes.func,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the time-slot node. Caution! Styles that change layout or
     * position may break the calendar in unexpected ways.
     *
     * ```js
     * (date: Date) => { className?: string, style?: Object }
     * ```
     */
    slotPropGetter: PropTypes.func,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the day background. Caution! Styles that change layout or
     * position may break the calendar in unexpected ways.
     *
     * ```js
     * (date: Date) => { className?: string, style?: Object }
     * ```
     */
    dayPropGetter: PropTypes.func,

    /**
     * Support to show multi-day events with specific start and end times in the
     * main time grid (rather than in the all day header).
     *
     * **Note: This may cause calendars with several events to look very busy in
     * the week and day views.**
     */
    showMultiDayTimes: PropTypes.bool,

    /**
     * Constrains the minimum _time_ of the Day and Week views.
     */
    min: PropTypes.instanceOf(Date),

    /**
     * Constrains the maximum _time_ of the Day and Week views.
     */
    max: PropTypes.instanceOf(Date),

    /**
     * Determines how far down the scroll pane is initially scrolled down.
     */
    scrollToTime: PropTypes.instanceOf(Date),

    /**
     * Specify a specific culture code for the Calendar.
     *
     * **Note: it's generally better to handle this globally via your i18n library.**
     */
    culture: PropTypes.string,

    /**
     * Localizer specific formats, tell the Calendar how to format and display dates.
     *
     * `format` types are dependent on the configured localizer; both Moment and Globalize
     * accept strings of tokens according to their own specification, such as: `'DD mm yyyy'`.
     *
     * ```jsx
     * let formats = {
     *   dateFormat: 'dd',
     *
     *   dayFormat: (date, culture, localizer) =>
     *     localizer.format(date, 'DDD', culture),
     *
     *   dayRangeHeaderFormat: ({ start, end }, culture, local) =>
     *     local.format(start, { date: 'short' }, culture) + ' — ' +
     *     local.format(end, { date: 'short' }, culture)
     * }
     *
     * <Calendar formats={formats} />
     * ```
     *
     * All localizers accept a function of
     * the form `(date: Date, culture: ?string, localizer: Localizer) -> string`
     */
    formats: PropTypes.shape({
      /**
       * Format for the day of the month heading in the Month view.
       * e.g. "01", "02", "03", etc
       */
      dateFormat,

      /**
       * A day of the week format for Week and Day headings,
       * e.g. "Wed 01/04"
       *
       */
      dayFormat: dateFormat,

      /**
       * Week day name format for the Month week day headings,
       * e.g: "Sun", "Mon", "Tue", etc
       *
       */
      weekdayFormat: dateFormat,

      /**
       * The timestamp cell formats in Week and Time views, e.g. "4:00 AM"
       */
      timeGutterFormat: dateFormat,

      /**
       * Toolbar header format for the Month view, e.g "2015 April"
       *
       */
      monthHeaderFormat: dateFormat,

      /**
       * Toolbar header format for the Week views, e.g. "Mar 29 - Apr 04"
       */
      dayRangeHeaderFormat: dateRangeFormat,

      /**
       * Toolbar header format for the Day view, e.g. "Wednesday Apr 01"
       */
      dayHeaderFormat: dateFormat,

      /**
       * Toolbar header format for the Agenda view, e.g. "4/1/2015 — 5/1/2015"
       */
      agendaHeaderFormat: dateRangeFormat,

      /**
       * A time range format for selecting time slots, e.g "8:00am — 2:00pm"
       */
      selectRangeFormat: dateRangeFormat,

      agendaDateFormat: dateFormat,
      agendaTimeFormat: dateFormat,
      agendaTimeRangeFormat: dateRangeFormat,

      /**
       * Time range displayed on events.
       */
      eventTimeRangeFormat: dateRangeFormat,

      /**
       * An optional event time range for events that continue onto another day
       */
      eventTimeRangeStartFormat: dateFormat,

      /**
       * An optional event time range for events that continue from another day
       */
      eventTimeRangeEndFormat: dateFormat,
    }),

    /**
     * Customize how different sections of the calendar render by providing custom Components.
     * In particular the `Event` component can be specified for the entire calendar, or you can
     * provide an individual component for each view type.
     *
     * ```jsx
     * let components = {
     *   event: MyEvent, // used by each view (Month, Day, Week)
     *   toolbar: MyToolbar,
     *   agenda: {
     *   	 event: MyAgendaEvent // with the agenda view use a different component to render events
     *   }
     * }
     * <Calendar components={components} />
     * ```
     */
    components: PropTypes.shape({
      event: elementType,
      eventWrapper: elementType,
      dayWrapper: elementType,
      dateCellWrapper: elementType,

      toolbar: elementType,

      agenda: PropTypes.shape({
        date: elementType,
        time: elementType,
        event: elementType,
      }),

      day: PropTypes.shape({
        header: elementType,
        event: elementType,
      }),
      week: PropTypes.shape({
        header: elementType,
        event: elementType,
      }),
      month: PropTypes.shape({
        header: elementType,
        dateHeader: elementType,
        event: elementType,
      }),
    }),

    /**
     * String messages used throughout the component, override to provide localizations
     */
    messages: PropTypes.shape({
      allDay: PropTypes.node,
      previous: PropTypes.node,
      next: PropTypes.node,
      today: PropTypes.node,
      month: PropTypes.node,
      week: PropTypes.node,
      day: PropTypes.node,
      agenda: PropTypes.node,
      date: PropTypes.node,
      time: PropTypes.node,
      event: PropTypes.node,
      showMore: PropTypes.func,
    }),
  }

  static defaultProps = {
    elementProps: {},
    popup: false,
    toolbar: true,
    view: views.MONTH,
    views: [views.MONTH, views.WEEK, views.DAY, views.AGENDA],
    step: 30,
    length: 30,

    drilldownView: views.DAY,

    titleAccessor: 'title',
    tooltipAccessor: 'title',
    allDayAccessor: 'allDay',
    startAccessor: 'start',
    endAccessor: 'end',
    resourceAccessor: 'resourceId',

    resourceIdAccessor: 'id',
    resourceTitleAccessor: 'title',

    longPressThreshold: 250,
    getNow: () => new Date(),
  }

  getViews = () => {
    const views = this.props.views;

    if (Array.isArray(views)) {
      return transform(views, (obj, name) => (obj[name] = VIEWS[name]), {});
    }

    if (typeof views === 'object') {
      return mapValues(views, (value, key) => {
        if (value === true) {
          return VIEWS[key];
        }

        return value;
      });
    }

    return VIEWS;
  }

  getView = () => {
    const views = this.getViews();

    return views[this.props.view];
  }

  getDrilldownView = (date) => {
    const { view, drilldownView, getDrilldownView } = this.props;

    if (!getDrilldownView) return drilldownView;

    return getDrilldownView(date, view, Object.keys(this.getViews()));
  };

  render() {
    let {
      view,
      toolbar,
      events,
      culture,
      components = {},
      formats = {},
      messages = {},
      style,
      className,
      elementProps,
      date: current,
      getNow,
      length,
      ...props
    } = this.props;

    current = current || getNow();

    formats = defaultFormats(formats);
    messages = message(messages);

    const View = this.getView();
    const names = viewNames(this.props.views);

    const viewComponents = defaults(
      components[view] || {},
      omit(components, names),
      {
        eventWrapper: EventWrapper,
        dayWrapper: BackgroundWrapper,
        dateCellWrapper: BackgroundWrapper,
      },
    );

    const CalToolbar = components.toolbar || Toolbar;
    const label = View.title(current, { formats, culture, length });

    return (<CalendarStyled>
      <div
        {...elementProps}
        className={cn('rbc-calendar', className, {
          'rbc-rtl': props.rtl,
        })}
        style={style}
      >
        {toolbar && (
          <CalToolbar
            date={current}
            view={view}
            views={names}
            label={label}
            onViewChange={this.handleViewChange}
            onNavigate={this.handleNavigate}
            messages={messages}
          />
        )}
        <View
          ref="view"
          {...props}
          {...formats}
          messages={messages}
          culture={culture}
          formats={undefined}
          events={events}
          date={current}
          getNow={getNow}
          length={length}
          components={viewComponents}
          getDrilldownView={this.getDrilldownView}
          onNavigate={this.handleNavigate}
          onDrillDown={this.handleDrillDown}
          onSelectEvent={this.handleSelectEvent}
          onDoubleClickEvent={this.handleDoubleClickEvent}
          onSelectSlot={this.handleSelectSlot}
          onShowMore={this._showMore}
        />
      </div>
    </CalendarStyled>);
  }

  handleNavigate = (action, newDate) => {
    let { view, date, getNow, onNavigate, ...props } = this.props;
    const ViewComponent = this.getView();

    date = moveDate(ViewComponent, {
      ...props,
      action,
      date: newDate || date,
      today: getNow(),
    });

    onNavigate(date, view, action);
  }

  handleViewChange = (view) => {
    if (view !== this.props.view && isValidView(view, this.props)) {
      this.props.onView(view);
    }
  }

  handleSelectEvent = (...args) => {
    notify(this.props.onSelectEvent, args);
  }

  handleDoubleClickEvent = (...args) => {
    notify(this.props.onDoubleClickEvent, args);
  }

  handleSelectSlot = (slotInfo) => {
    notify(this.props.onSelectSlot, slotInfo);
  }

  handleDrillDown = (date, view) => {
    const { onDrillDown } = this.props;
    if (onDrillDown) {
      onDrillDown(date, view, this.drilldownView);
      return;
    }
    if (view) this.handleViewChange(view);

    this.handleNavigate(navigate.DATE, date);
  }
}

export default uncontrollable(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent',
});
