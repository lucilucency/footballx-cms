import PropTypes from 'prop-types';
import React from 'react';
import EventRowMixin from './EventRowMixin';
import { eventLevels } from './utils/eventLevels';
import message from './utils/messages';
import range from 'lodash/range';

const isSegmentInSlot = (seg, slot) => seg.left <= slot && seg.right >= slot;
const eventsInSlot = (segments, slot) =>
  segments.filter(seg => isSegmentInSlot(seg, slot)).length;

class EventEndingRow extends React.Component {
  static propTypes = {
    segments: PropTypes.array,
    slots: PropTypes.number,
    messages: PropTypes.object,
    onShowMore: PropTypes.func,
    ...EventRowMixin.propTypes,
  }
  static defaultProps = {
    ...EventRowMixin.defaultProps,
  }

  render() {
    const { segments, slots: slotCount } = this.props;
    const rowSegments = eventLevels(segments).levels[0];

    let current = 1,
      lastEnd = 1,
      row = [];

    while (current <= slotCount) {
      const key = `_lvl_${current}`;

      const { event, left, right, span } =
        rowSegments.filter(seg => isSegmentInSlot(seg, current))[0] || {} //eslint-disable-line

      if (!event) {
        current++;
        continue;
      }

      const gap = Math.max(0, left - lastEnd);

      if (this.canRenderSlotEvent(left, span)) {
        const content = EventRowMixin.renderEvent(this.props, event);

        if (gap) {
          row.push(EventRowMixin.renderSpan(this.props, gap, `${key}_gap`));
        }

        row.push(EventRowMixin.renderSpan(this.props, span, key, content));

        lastEnd = current = right + 1;
      } else {
        if (gap) {
          row.push(EventRowMixin.renderSpan(this.props, gap, `${key}_gap`));
        }

        row.push(
          EventRowMixin.renderSpan(
            this.props,
            1,
            key,
            this.renderShowMore(segments, current),
          ),
        );
        lastEnd = current += 1;
      }
    }

    return <div className="rbc-row">{row}</div>;
  }

  canRenderSlotEvent(slot, span) {
    const { segments } = this.props;

    return range(slot, slot + span).every((s) => {
      const count = eventsInSlot(segments, s);

      return count === 1;
    });
  }

  renderShowMore(segments, slot) {
    const messages = message(this.props.messages);
    const count = eventsInSlot(segments, slot);

    return count ? (
      <a
        key={`sm_${slot}`}
        href="#"
        className={'rbc-show-more'}
        onClick={e => this.showMore(slot, e)}
      >
        {messages.showMore(count)}
      </a>
    ) : (
      false
    );
  }

  showMore(slot, e) {
    e.preventDefault();
    this.props.onShowMore(slot);
  }
}

export default EventEndingRow;
