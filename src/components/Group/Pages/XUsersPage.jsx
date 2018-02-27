import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGroupMembers } from 'actions';
import { Row, Col, subTextStyle } from 'utils';
import strings from 'lang';
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container';
import XUsersImportForm from './XUsersImportForm';

const MembershipsTableCols = (browser) => ([{
  displayName: strings.th_name,
  field: 'name',
  displayFn: (row, col, field) => (<div>
    {row.xuser_id ?
      <TableLink to={`/xuser/${row.xuser_id}`}>{field && field.toUpperCase()}</TableLink> :
      <b>{field && field.toUpperCase()}</b>
    }
    {browser.greaterThan.small && <div>
      <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
        {row.dob}
      </span>
    </div>}
  </div>),
}, {
  displayName: strings.th_phone,
  field: 'phone',
  displayFn: (row, col, field) => (<div>
    {field}
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
      {row.email}
    </span>}
  </div>),
}, {
  displayName: strings.th_address,
  field: 'address',
  displayFn: (row, col, field) => (<div>
    <b>{row.city}</b>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
      {field}
    </span>}
  </div>),
}, {
  displayName: strings.th_gender,
  field: 'gender',
}, {
  displayName: strings.th_membership_t_shirt_size,
  field: 'size',
}, {
  displayName: strings.th_membership_joined_year,
  field: 'joined_year',
}, {
  displayName: strings.th_membership_is_purchase,
  field: 'is_purchase',
  displayFn: (row, col, field) => (<div>
    {field && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />}
  </div>),
}, {
  displayName: strings.th_membership_code,
  field: 'membership_code',
  displayFn: (row, col, field) => (<span style={{textDecoration: row.xuser_id ? 'line-through' : 'none'}}>
    {field}
  </span>)
}]);

const getData = (props) => {
  props.getGroupMembers(props.groupId);
};

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupMembers: PropTypes.shape([]),
  };

  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.groupId !== nextProps.groupId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  render() {
    const props = this.props;
    // const { routeParams } = this.props;
    // const subInfo = routeParams.subInfo;

    return (<div>
      <Container title={strings.title_group_memberships} error={props.groupMembers.error} loading={this.props.groupMembers.loading}>
        <Table paginated columns={MembershipsTableCols(props.browser)} data={this.props.groupMembers.data} error={false} loading={this.props.groupMembers.loading} />
      </Container>
      <Container title={strings.title_group_import_membership}>
        <XUsersImportForm groupId={this.props.groupId} />
      </Container>
    </div>);
  }
}

const mapStateToProps = state => ({
  groupMembers: state.app.groupMembers,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getGroupMembers: groupId => dispatch(getGroupMembers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
