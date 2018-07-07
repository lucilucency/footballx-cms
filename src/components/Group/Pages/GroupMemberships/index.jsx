import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import { getGroupMemberships, getGroupMembershipPacks, getGroupMembershipProcesses } from 'actions/index';
import { transformations, toDateTimeString } from 'utils/index';
import strings from 'lang/index';
import ConfirmBeMember from './ConfirmBeMember';

const columns = packs => [{
  displayName: strings.th_name,
  field: 'fullname',
  displayFn: transformations.th_xuser_link,
}, {
  displayName: strings.th_phone,
  field: 'phone',
}, {
  displayName: strings.th_email,
  field: 'email',
}, {
  displayName: strings.th_membership_pack,
  field: 'group_membership_pack_id',
  displayFn: (row, col, field) => {
    const pack = packs.find(p => Number(p.id) === Number(field));
    return (<span>{pack && pack.name}</span>);
  },
}, {
  displayName: strings.th_created_at,
  field: 'created_at',
  displayFn: (row, col, field) => toDateTimeString(field),
}, {
  displayName: strings.th_status,
  field: 'is_complete',
  displayFn: (row, col, field) => field && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />,
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => (row.is_complete === 'false' ? <ConfirmBeMember membershipID={row.group_membership_id} userName={row.fullname} processID={field} /> : null),
}];

const getData = (props) => {
  props.getGroupMemberships(props.groupId);
};

class GroupMemberships extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (!this.props.group.membership && nextProps.group.membership) {
      nextProps.getGroupMembershipPacks(nextProps.group.membership.id);
      nextProps.getGroupMembershipProcesses(nextProps.group.membership.id);
    }
  }

  render() {
    const { group, error } = this.props;

    return (<div>
      <Container title={strings.title_group_memberships}>
        <div>
          <Table paginated columns={columns(this.props.group.packs)} data={group.processes} error={error} />
        </div>
      </Container>
    </div>);
  }
}

GroupMemberships.propTypes = {
  group: PropTypes.object,
};

const mapStateToProps = state => ({
  group: state.app.group.data,
  loading: state.app.group.loading,
  error: state.app.group.error,
});

const mapDispatchToProps = dispatch => ({
  getGroupMemberships: groupId => dispatch(getGroupMemberships(groupId)),
  getGroupMembershipPacks: groupId => dispatch(getGroupMembershipPacks(groupId)),
  getGroupMembershipProcesses: groupId => dispatch(getGroupMembershipProcesses(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupMemberships);
