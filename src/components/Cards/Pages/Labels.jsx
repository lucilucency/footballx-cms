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

/*
id
name
value
expense
xpoint
total_available_card
total_printed_card
total_card
*/


const tableCardLabelsColumns = browser => [browser.greaterThan.medium && {
  displayName: 'Label',
  field: 'name',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/labels/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: 'Value',
  field: 'value',
  sortFn: true,
}, {
  displayName: 'Expense',
  field: 'expense',
  sortFn: true,
}, {
  displayName: 'Number of uses',
  field: 'xpoint',
  sortFn: true,
}, browser.greaterThan.medium && {
  displayName: 'Number in warehouse',
  field: 'remaining',
  sortFn: true,
}, {
  displayName: '',
  displayFn: row => (<div>
    <span className="subText ellipsis" style={{ display: 'block', marginTop: 1 }}>
      +Add more
    </span>
  </div>),
}];


const getData = (props) => {
  props.dispatchEvents(props.location.search);
};

class Overview extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  render() {
    const events = [{
      id: 1,
      name: 'The 100.000',
      value: 75000,
      expense: 100000,
      xpoint: 3,
      remaining: 500,
    }, {
      id: 2,
      name: 'The 200.000',
      value: 150000,
      expense: 200000,
      xpoint: 10,
      remaining: 1500,
    }, {
      id: 1,
      name: 'The 500.000',
      value: 30000,
      expense: 500000,
      xpoint: 15,
      remaining: 80,
    }];

    return (<div>
      <Container title={strings.heading_card_labels}>
        <Table paginated columns={tableCardLabelsColumns(this.props.browser)} data={events} pageLength={30} />
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
