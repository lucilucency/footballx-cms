import PropTypes from 'prop-types';
import React from 'react';

import Week from './Week.jsx';
import TimeGrid from './TimeGrid';
import localizer from './localizer';

function workWeekRange(date, options) {
  return Week.range(date, options).filter(
    d => [6, 0].indexOf(d.getDay()) === -1,
  );
}

class WorkWeek extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
  }

  static defaultProps = TimeGrid.defaultProps

  render() {
    const { date, ...props } = this.props;
    const range = workWeekRange(date, this.props);

    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

WorkWeek.navigate = Week.navigate;

WorkWeek.title = (date, { formats, culture }) => {
  const [start, ...rest] = workWeekRange(date, { culture });
  return localizer.format(
    { start, end: rest.pop() },
    formats.dayRangeHeaderFormat,
    culture,
  );
};

export default WorkWeek;
