import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cn from 'classnames';
import { elementType } from './utils/propTypes';

export default class TimeSlot extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    value: PropTypes.instanceOf(Date).isRequired,
    isNow: PropTypes.bool,
    showLabel: PropTypes.bool,
    content: PropTypes.string,
    culture: PropTypes.string,
    slotPropGetter: PropTypes.func,
    resource: PropTypes.string,
  }

  static defaultProps = {
    isNow: false,
    showLabel: false,
    content: '',
  }

  render() {
    const { value, slotPropGetter, resource } = this.props;
    const Wrapper = this.props.dayWrapperComponent;
    const { className, style } = (slotPropGetter && slotPropGetter(value)) || {};

    return (
      <Wrapper value={value} resource={resource}>
        <div
          style={style}
          className={cn(
            'rbc-time-slot',
            className,
            this.props.showLabel && 'rbc-label',
            this.props.isNow && 'rbc-now',
          )}
        >
          {this.props.showLabel && <small>{this.props.content}</small>}
        </div>
      </Wrapper>
    );
  }
}
