import React from 'react';
import { connect } from 'react-redux';
import queryString from 'querystring';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { TextField, SelectField, MenuItem } from 'material-ui';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import dsProvince from 'fxconstants/provincesObj.json';
import dsDistrict from 'fxconstants/districtsObj.json';
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
  displayName: strings.th_registered_at,
  field: 'created_at',
  displayFn: (row, col, field) => toDateTimeString(field),
}, {
  displayName: strings.th_purchased_at,
  field: 'purchased_at',
  displayFn: (row, col, field) => toDateTimeString(field),
}, {
  displayName: strings.th_membership_code,
  field: 'code',
}, {
  displayName: strings.th_status,
  field: 'is_complete',
  displayFn: (row, col, field) => (field === 'true' || field === true) && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />,
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => ((!row.is_complete || row.is_complete === 'false' || field === false) ? <ConfirmBeMember membershipID={Number(row.group_membership_id)} userName={row.fullname} processID={field} /> : null),
}];

const getData = (props) => {
  props.getGroupMemberships(props.groupId);
};

const fileHeader = {
  name: strings.th_name,
  nickname: strings.th_nickname,
  email: strings.th_email,
  phone: strings.th_phone,
  dob: strings.th_dob,
  city: strings.th_city,
  district: strings.th_district,
  address: strings.th_address,
  gender: strings.th_gender,
  size: strings.th_membership_t_shirt_size,
  is_purchase: strings.th_membership_is_purchase,
  membership_code: strings.th_membership_code,
  membership_pack: strings.th_membership_pack,
  status: strings.th_status,
};

const downloadMembers = (dsMember, packs) => {
  const data = [
    [
      'CODE',
      fileHeader.name, fileHeader.nickname, fileHeader.phone, fileHeader.email,
      fileHeader.city, fileHeader.district, fileHeader.address,
      fileHeader.membership_code, fileHeader.membership_pack, fileHeader.status,
      'Thanh toán qua',
    ],
  ];

  dsMember.forEach((o) => {
    const province = dsProvince[o.province_id] && dsProvince[o.province_id].name;
    const district = dsDistrict[o.district_id] && dsDistrict[o.district_id].name;
    const pack = packs && packs.find(p => Number(p.id) === Number(o.group_membership_pack_id));
    const status = o.is_complete ? 'Đã thanh toán' : '';
    const via = o.purchased_at ? 'FootballX' : '';

    data.push([o.id, o.fullname, o.nickname, o.phone, o.email, province, district, o.address, o.code, pack && pack.name, status, via]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(wb, 'Members.xlsx');
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
    const { group, error, routeParams } = this.props;

    let { processes } = group;

    const printing = routeParams.subInfo === 'printing';
    let params = {};
    if (printing) {
      params = queryString.parse(this.props.location.search.replace('?', ''));
      processes = processes.slice(params.from - 1, params.to);
    }

    // for filter
    if (processes && this.state.code) {
      processes = processes.filter(el => Number(el.id) === Number(this.state.code));
    }
    if (processes && this.state.membership_code) {
      processes = processes.filter(el => el.code === this.state.membership_code);
    }
    if (processes && this.state.phone) {
      processes = processes.filter(el => el.phone === this.state.phone);
    }
    if (processes && this.state.email) {
      processes = processes.filter(el => el.email === this.state.email);
    }
    if (processes && this.state.pack) {
      processes = processes.filter(el => Number(el.group_membership_pack_id) === Number(this.state.pack));
    }

    if (processes && this.state.is_complete) {
      processes = processes.filter((el) => {
        if (this.state.is_complete === -1) return !el.is_complete || el.is_complete === false || el.is_complete === 'false';
        else if (this.state.is_complete === 1) return el.is_complete || el.is_complete === 'true';
        return true;
      });
    }

    const purchasedProcesses = processes && processes.length && processes.filter(el => el.is_complete === 'true' || el.is_complete === true);
    const fxPurchasedProcesses = purchasedProcesses && purchasedProcesses.length && purchasedProcesses.filter(el => el.purchased_at);
    const fxPurchased =
      group.packs &&
      group.packs.length &&
      fxPurchasedProcesses &&
      fxPurchasedProcesses.length &&
      group.packs.map(pack => fxPurchasedProcesses.filter(el => Number(el.group_membership_pack_id) === pack.id).length);
    let total = 0;
    if (processes) {
      group.packs.forEach((pack, index) => {
        total += (Number(pack.price) * fxPurchased[index]);
      });
    }

    return (<div>
      <Container
        title={strings.title_group_memberships}
        actions={[{
          title: 'Export',
          icon: <IconDownload />,
          onClick: () => downloadMembers(processes, group.packs),
        }]}
      >
        <div>
          {processes && (
            <Table
              paginated
              hidePaginatedTop
              columns={columns(group.packs)}
              data={processes}
              error={error}
            />
          )}
        </div>
      </Container>
      <Container
        title="Summary"
      >
        <div>
          {processes && (
            <ul>
              <li>Tổng đăng kí: {processes.length}</li>
              <ul>
                {group.packs.map(pack => (
                  <li>Gói {pack.name}: {processes.filter(el => Number(el.group_membership_pack_id) === pack.id).length}</li>
                ))}
              </ul>
              <li>Tổng thanh toán: {purchasedProcesses.length}</li>
              {purchasedProcesses && purchasedProcesses.length && (
                <ul>
                  {group.packs.map(pack => (
                    <li>Gói {pack.name}: {purchasedProcesses.filter(el => Number(el.group_membership_pack_id) === pack.id).length}</li>
                  ))}
                </ul>
              )}
              <li>Tổng thanh toán qua FootballX: {fxPurchasedProcesses.length}</li>
              {fxPurchasedProcesses && fxPurchasedProcesses.length && (
                <ul>
                  {group.packs.map((pack, index) => (
                    <li>Gói {pack.name}: {fxPurchased[index]}</li>
                  ))}
                  <li>Tổng tiền: {total.toLocaleString()}VND</li>
                </ul>
              )}
            </ul>
          )}
        </div>
      </Container>
      <Container title="Filter">
        <div>
          <TextField
            floatingLabelText="Code"
            hintText="Find code"
            type="number"
            onChange={e => this.setState({ code: e.target.value })}
          />
          <TextField
            floatingLabelText="Mã thành viên"
            hintText="Mã thành viên"
            onChange={e => this.setState({ membership_code: e.target.value })}
          />
          <TextField
            floatingLabelText={strings.th_phone}
            hintText={strings.th_phone}
            onChange={e => this.setState({ phone: e.target.value })}
          />
          <TextField
            floatingLabelText={strings.th_email}
            hintText={strings.th_email}
            onChange={e => this.setState({ email: e.target.value })}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupMemberships));
