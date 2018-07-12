import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, SelectField, MenuItem } from 'material-ui';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import { getGroupMemberships, getGroupMembershipPacks, getGroupMembershipProcesses } from 'actions/index';
import { transformations, toDateTimeString } from 'utils/index';
import strings from 'lang/index';
import ConfirmBeMember from './ConfirmBeMember';

const columns = packs => [{
  displayName: 'CODE',
  field: 'id',
}, {
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
    const pack = packs && packs.find(p => Number(p.id) === Number(field));
    return (<span>{pack && pack.name}</span>);
  },
}, {
  displayName: strings.th_created_at,
  field: 'created_at',
  displayFn: (row, col, field) => toDateTimeString(field),
}, {
  displayName: strings.th_status,
  field: 'is_complete',
  displayFn: (row, col, field) => (field === 'true' || field === true) && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />,
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => ((row.is_complete === 'false' || field === false) ? <ConfirmBeMember membershipID={Number(row.group_membership_id)} userName={row.fullname} processID={field} /> : null),
}];

const getData = (props) => {
  props.getGroupMemberships(props.groupId);
};

class GroupMemberships extends React.Component {
  state = {
    code: null,
  };

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

    let { processes } = group;
    if (processes && this.state.code) {
      processes = processes.filter(el => Number(el.id) === Number(this.state.code));
    }
    if (processes && this.state.pack) {
      processes = processes.filter(el => Number(el.group_membership_pack_id) === Number(this.state.pack));
    }
    if (processes && this.state.is_complete) {
      processes = processes.filter((el) => {
        if (this.state.is_complete === -1) return el.is_complete === false || el.is_complete === 'false';
        else if (this.state.is_complete === 1) return el.is_complete === true || el.is_complete === 'true';
        return true;
      });
    }

    return (<div>
      <Container title={strings.title_group_memberships}>
        <div>
          <div>
            <div>
              {group.processes && <div>Total registration: {group.processes.length}</div>}
              {group.processes && <div>Total paid: {group.processes.filter(el => el.is_complete === 'true' || el.is_complete === true).length}</div>}
            </div>
            <div>
              <TextField
                floatingLabelText="Code"
                hintText="Find code"
                type="number"
                onChange={e => this.setState({ code: e.target.value })}
              />
              <br />
              {group.packs && (
                <SelectField
                  floatingLabelText="Gói thành viên"
                  value={this.state.pack || 0}
                  onChange={(event, index, value) => this.setState({ pack: value })}
                >
                  <MenuItem value={0} primaryText="All" />
                  {group.packs.map(el => (
                    <MenuItem key={el.id} value={el.id} primaryText={el.name} />
                  ))}
                </SelectField>
              )}
              {group.processes && (
                <SelectField
                  floatingLabelText="Trạng thái"
                  value={this.state.is_complete || 0}
                  onChange={(event, index, value) => this.setState({ is_complete: value })}
                >
                  <MenuItem value={0} primaryText="All" />
                  <MenuItem value={-1} primaryText="Chưa thanh toán" />
                  <MenuItem value={1} primaryText="Đã thanh toán" />
                </SelectField>
              )}
            </div>
          </div>
          {group.processes && <Table paginated columns={columns(group.packs)} data={processes} error={error} />}
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
