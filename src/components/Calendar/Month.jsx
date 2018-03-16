import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import cn from 'classnames';
import getPosition from 'dom-helpers/query/position';
import raf from 'dom-helpers/util/requestAnimationFrame';
import chunk from 'lodash/chunk';
import styled, { css } from 'styled-components';
import constants from 'components/constants';

import Overlay from 'react-overlays/lib/Overlay';
import { navigate, views } from './utils/constants';
import { notify } from './utils/helpers';
import dates from './utils/dates';
import localizer from './localizer';
import Popup from './Popup';
import DateContentRow from './DateContentRow';
import Header from './Header';
import DateHeader from './DateHeader';

import { accessor, dateFormat } from './utils/propTypes';
import { segStyle, inRange, sortEvents } from './utils/eventLevels';

const MonthStyled = styled.div`
  position: relative;
  border: 1px solid ${constants['calendar-border']};
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  width: 100%;
  user-select: none;
  -webkit-user-select: none;

  height: 100%; // ie-fix

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
`;

const eventsForWeek = (evts, start, end, props) =>
  evts.filter(e => inRange(e, start, end, props));

const propTypes = {
  events: PropTypes.array.isRequired,
  date: PropTypes.instanceOf(Date),

  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),

  step: PropTypes.number,
  getNow: PropTypes.func.isRequired,

  scrollToTime: PropTypes.instanceOf(Date),
  eventPropGetter: PropTypes.func,
  dayPropGetter: PropTypes.func,

  culture: PropTypes.string,
  dayFormat: dateFormat,

  rtl: PropTypes.bool,
  width: PropTypes.number,

  titleAccessor: accessor.isRequired,
  tooltipAccessor: accessor.isRequired,
  allDayAccessor: accessor.isRequired,
  startAccessor: accessor.isRequired,
  endAccessor: accessor.isRequired,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onNavigate: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onShowMore: PropTypes.func,
  onDrillDown: PropTypes.func,
  getDrilldownView: PropTypes.func.isRequired,

  dateFormat,

  weekdayFormat: dateFormat,
  popup: PropTypes.bool,

  messages: PropTypes.object,
  components: PropTypes.object.isRequired,
  popupOffset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
};

class MonthView extends React.Component {
  static displayName = 'MonthView'
  static propTypes = propTypes

  constructor(...args) {
    super(...args);

    this._bgRows = [];
    this._pendingSelection = [];
    this.state = {
      rowLimit: 5,
      needLimitMeasure: true,
    };
  }

  componentWillReceiveProps({ date }) {
    this.setState({
      needLimitMeasure: !dates.eq(date, this.props.date),
    });
  }

  componentDidMount() {
    let running;

    if (this.state.needLimitMeasure) this.measureRowLimit(this.props);

    window.addEventListener(
      'resize',
      (this._resizeListener = () => {
        if (!running) {
          raf(() => {
            running = false;
            this.setState({ needLimitMeasure: true }) //eslint-disable-line
          });
        }
      }),
      false,
    );
  }

  componentDidUpdate() {
    if (this.state.needLimitMeasure) this.measureRowLimit(this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener, false);
  }

  getContainer = () => findDOMNode(this)

  render() {
    let { date, culture, weekdayFormat, className } = this.props,
      month = dates.visibleDays(date, culture),
      weeks = chunk(month, 7);

    this._weekCount = weeks.length;

    return (<MonthStyled className={cn('rbc-month-view', className)}>
      <div className="rbc-row rbc-month-header">
        {this.renderHeaders(weeks[0], weekdayFormat, culture)}
      </div>
      {weeks.map(this.renderWeek)}
      {this.props.popup && this.renderOverlay()}
    </MonthStyled>);
  }

  renderWeek = (week, weekIdx) => {
    let {
      events,
      components,
      selectable,
      titleAccessor,
      tooltipAccessor,
      startAccessor,
      endAccessor,
      allDayAccessor,
      getNow,
      eventPropGetter,
      dayPropGetter,
      messages,
      selected,
      date,
      longPressThreshold,
    } = this.props;

    const { needLimitMeasure, rowLimit } = this.state;

    events = eventsForWeek(events, week[0], week[week.length - 1], this.props);
    events.sort((a, b) => sortEvents(a, b, this.props));

    return (
      <DateContentRow
        key={weekIdx}
        ref={weekIdx === 0 ? 'slotRow' : undefined}
        container={this.getContainer}
        className="rbc-month-row"
        getNow={getNow}
        date={date}
        range={week}
        events={events}
        maxRows={rowLimit}
        selected={selected}
        selectable={selectable}
        messages={messages}
        titleAccessor={titleAccessor}
        tooltipAccessor={tooltipAccessor}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        allDayAccessor={allDayAccessor}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        renderHeader={this.readerDateHeading}
        renderForMeasure={needLimitMeasure}
        onShowMore={this.handleShowMore}
        onSelect={this.handleSelectEvent}
        onDoubleClick={this.handleDoubleClickEvent}
        onSelectSlot={this.handleSelectSlot}
        eventComponent={components.event}
        eventWrapperComponent={components.eventWrapper}
        dateCellWrapper={components.dateCellWrapper}
        longPressThreshold={longPressThreshold}
      />
    );
  }

  readerDateHeading = ({ date, className, ...props }) => {
    const {
      date: currentDate,
      getDrilldownView,
      dateFormat,
      culture,
    } = this.props;

    const isOffRange = dates.month(date) !== dates.month(currentDate);
    const isCurrent = dates.eq(date, currentDate, 'day');
    const drilldownView = getDrilldownView(date);
    const label = localizer.format(date, dateFormat, culture);
    const DateHeaderComponent = this.props.components.dateHeader || DateHeader;

    return (
      <div
        {...props}
        className={cn(
          className,
          isOffRange && 'rbc-off-range',
          isCurrent && 'rbc-current',
        )}
      >
        <DateHeaderComponent
          label={label}
          date={date}
          drilldownView={drilldownView}
          isOffRange={isOffRange}
          onDrillDown={e => this.handleHeadingClick(date, drilldownView, e)}
        />
      </div>
    );
  }

  renderHeaders(row, format, culture) {
    const first = row[0];
    const last = row[row.length - 1];
    const HeaderComponent = this.props.components.header || Header;

    return dates.range(first, last, 'day').map((day, idx) => (
      <div key={`header_${idx}`} className="rbc-header" style={segStyle(1, 7)}>
        <HeaderComponent
          date={day}
          label={localizer.format(day, format, culture)}
          localizer={localizer}
          format={format}
          culture={culture}
        />
      </div>
    ));
  }

  renderOverlay() {
    const overlay = (this.state && this.state.overlay) || {};
    const { components } = this.props;

    return (
      <Overlay
        rootClose
        placement="bottom"
        container={this}
        show={!!overlay.position}
        onHide={() => this.setState({ overlay: null })}
      >
        <Popup
          {...this.props}
          eventComponent={components.event}
          eventWrapperComponent={components.eventWrapper}
          position={overlay.position}
          events={overlay.events}
          slotStart={overlay.date}
          slotEnd={overlay.end}
          onSelect={this.handleSelectEvent}
          onDoubleClick={this.handleDoubleClickEvent}
        />
      </Overlay>
    );
  }

  measureRowLimit() {
    this.setState({
      needLimitMeasure: false,
      rowLimit: this.refs.slotRow.getRowLimit(),
    });
  }

  handleSelectSlot = (range, slotInfo) => {
    this._pendingSelection = this._pendingSelection.concat(range);

    clearTimeout(this._selectTimer);
    this._selectTimer = setTimeout(() => this.selectDates(slotInfo));
  }

  handleHeadingClick = (date, view, e) => {
    e.preventDefault();
    this.clearSelection();
    notify(this.props.onDrillDown, [date, view]);
  }

  handleSelectEvent = (...args) => {
    this.clearSelection();
    notify(this.props.onSelectEvent, args);
  }

  handleDoubleClickEvent = (...args) => {
    this.clearSelection();
    notify(this.props.onDoubleClickEvent, args);
  }

  handleShowMore = (events, date, cell, slot) => {
    const { popup, onDrillDown, onShowMore, getDrilldownView } = this.props;
    // cancel any pending selections so only the event click goes through.
    this.clearSelection();

    if (popup) {
      const position = getPosition(cell, findDOMNode(this));

      this.setState({
        overlay: { date, events, position },
      });
    } else {
      notify(onDrillDown, [date, getDrilldownView(date) || views.DAY]);
    }

    notify(onShowMore, [events, date, slot]);
  }

  selectDates(slotInfo) {
    const slots = this._pendingSelection.slice();

    this._pendingSelection = [];

    slots.sort((a, b) => +a - +b);

    notify(this.props.onSelectSlot, {
      slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
    });
  }

  clearSelection() {
    clearTimeout(this._selectTimer);
    this._pendingSelection = [];
  }
}

MonthView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'month');

    case navigate.NEXT:
      return dates.add(date, 1, 'month');

    default:
      return date;
  }
};

MonthView.title = (date, { formats, culture }) =>
  localizer.format(date, formats.monthHeaderFormat, culture);

export default MonthView;
