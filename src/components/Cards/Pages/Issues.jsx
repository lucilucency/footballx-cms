import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

/* actions & helpers */
import { getEvents } from 'actions';
import { transformations } from 'utility';
import { toDateString, toTimeString, fromNow } from 'utility/time';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
/* data */
import strings from 'lang';
/* css */
import constants from 'components/constants';
import { colors } from 'material-ui/styles';
import { subTextStyle } from 'utility/style';
import { EventsSummary } from './CardsSummary';

// id: 1,
//   name: "CSSC - 20 the 100.000",
//   card_label_id: 1,
//   card_label_name: 'The 100.000',
//   card_number: 20,
//   user_id: 3,
//   user_type: 1,
//   user_name: 'Nguyen Huu Duc',
//   cost_one: 80000,
//   cost_total: 80000 * 20,
//   revenue: 0,
//   is_closed: false,

const tableCardLabelsColumns = browser => [browser.greaterThan.medium && {
  displayName: 'Name',
  field: 'name',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/labels/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: 'Card label',
  field: 'card_label_name',
  sortFn: true,
}, {
  displayName: 'Number',
  field: 'card_number',
  sortFn: true,
}, {
  displayName: 'User request',
  field: 'user_name',
}, browser.greaterThan.medium && {
  displayName: 'Cost',
  field: 'cost_one',
}, {
  displayName: 'Revenue',
  field: 'revenue',
}];


const getData = (props) => {
  props.dispatchEvents(props.location.search);
};

class Overview extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  render() {
    const issues = [{
      id: 1,
      name: 'CSSC - 20 the 100.000',
      card_label_id: 1,
      card_label_name: 'The 100.000',
      card_number: 20,
      user_id: 3,
      user_type: 1,
      user_name: 'Nguyen Huu Duc',
      cost_one: 80000,
      cost_total: 80000 * 20,
      revenue: 0,
      is_closed: false,
    }, {
      id: 1,
      name: 'Liv - 20 the 100.000',
      card_label_id: 1,
      card_label_name: 'The 100.000',
      card_number: 20,
      user_id: 4,
      user_type: 1,
      user_name: 'Le Duc Anh',
      cost_one: 80000,
      cost_total: 80000 * 20,
      revenue: 800000,
      is_closed: false,
    }, {
      id: 1,
      name: 'Liv - 20 the 100.000',
      card_label_id: 1,
      card_label_name: 'The 100.000',
      card_number: 20,
      user_id: 4,
      user_type: 1,
      user_name: 'Le Duc Anh',
      cost_one: 80000,
      cost_total: 80000 * 20,
      revenue: 800000,
      is_closed: false,
    }];

    return (<div>
      <Container title={strings.heading_card_labels}>
        <Table
          paginated
          columns={tableCardLabelsColumns(this.props.browser)}
          data={issues}
          pageLength={30}
        />
      </Container>
    </div>);
  }
}

Overview.propTypes = {
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
  events: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  dispatchEvents: options => dispatch(getEvents(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);

