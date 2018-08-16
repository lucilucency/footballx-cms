/* eslint-disable no-restricted-syntax,guard-for-in,react/no-did-mount-set-state */
import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { getGroupXUsers, getGroupMemberships, getGroupMembershipPacks } from 'actions';
import { subTextStyle, transformations, toDateString, bindAll } from 'utils';
import strings from 'lang';
import groups from 'fxconstants/groupsObj.json';
import dsProvince from 'fxconstants/provincesObj.json';
import dsDistrict from 'fxconstants/districtsObj.json';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import styled from 'styled-components';
import constants from 'components/constants';
import MrSuicideGoatQRCode from 'components/Visualizations/QRCode';
import { FlatButton, TextField, SelectField, MenuItem } from 'material-ui';

let groupXUsers = {};
const updateGroupXusers = (data) => {
  groupXUsers = {};
  data.forEach((o) => {
    groupXUsers[o.id] = o;
  });
};
const fileHeader = {
  name: strings.th_name,
  fullname: strings.th_name,
  email: strings.th_email,
  phone: strings.th_phone,
  dob: strings.th_dob,
  city: strings.th_city,
  district: strings.th_district,
  address: strings.th_address,
  gender: strings.th_gender,
  size: strings.th_membership_t_shirt_size,
  joined_year: strings.th_membership_joined_year,
  is_purchase: strings.th_membership_is_purchase,
  membership_code: strings.th_membership_code,
  membership_pack: strings.th_membership_pack,
  status: strings.th_status,
};

const Status = styled.div`
  //filter: drop-shadow(0 0 5px green);
  color: ${constants.colorGreen}
`;

const MembersTableCols = browser => ([{
  displayName: 'STT',
  displayFn: (row, col, field, index) => index + 1,
}, {
  displayName: strings.th_xuser,
  tooltip: strings.tooltip_hero_id,
  field: 'username',
  displayFn: transformations.th_xuser_image,
  sortFn: true,
}, {
  displayName: strings.th_address,
  field: 'address',
  displayFn: (row, col, field) => {
    const province = dsProvince[row.province_id] && dsProvince[row.province_id].name;
    const district = dsDistrict[row.district_id] && dsDistrict[row.district_id].name;
    return (
      <div>
        <b>{field}</b>
        {browser.greaterThan.small &&
        <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
          {district} - {province}
        </span>}
      </div>
    );
  },
},
/* {
  displayName: '',
  field: 'facebook_id',
  displayFn: (row, col, field) => (<div>
    <a href={`https://www.facebook.com/${field}`} rel="noopener noreferrer" target="_blank"><IconFacebook width={24} height={24} /></a>
  </div>),
}, */
{
  displayName: strings.th_membership_code,
  field: 'code',
  displayFn: (row, col, field) => (<div>
    <b>{field}</b>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
      {row.is_activated && <Status>{'Activated'}</Status>}
    </span>}
  </div>),
}, {
  displayName: 'Ngày hết hạn',
  field: 'expire_date',
  displayFn: (row, col, field) => (<div>
    {toDateString(field * 1000)}
  </div>),
  sortFn: true,
}, {
  displayName: 'Mã giao dịch',
  field: 'process_id',
  displayFn: (row, col, field) => (<div>
    <b>{field}</b>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
      {row.is_complete && <Status>{'Đã thanh toán'}</Status>}
    </span>}
  </div>),
}, {
  displayName: '',
  field: 'membership_code',
  displayFn: row => (<span style={{ display: 'none' }}>
    <MrSuicideGoatQRCode
      size={640}
      value={JSON.stringify({
        object: 'xuser',
        data: {
          xuser_id: row.xuser_id,
          code: row.code,
          group_id: row.group_id,
          group_membership_id: row.group_membership_id,
          expire_date: row.expire_date,
        },
      })}
      getCanvas={(canvas) => {
        groupXUsers[row.id].canvas = canvas;
      }}
    />
  </span>),
}]);

const getData = (props) => {
  props.getGroupMembers(props.groupId);

  Promise.all([props.getGroupMemberships(props.groupId)]).then((res) => {
    props.getGroupMembershipPacks(res[0].payload.membership.id);
  });
};

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

const downloadMembers = (from, to, packs) => {
  const data = [
    [
      'STT', fileHeader.name, fileHeader.fullname, fileHeader.phone, fileHeader.email,
      fileHeader.city, fileHeader.district, fileHeader.address,
      fileHeader.membership_code, fileHeader.membership_pack, fileHeader.status,
      'File',
    ],
  ];

  const ids = Object.keys(groupXUsers);
  ids.forEach((id, index) => {
    const o = groupXUsers[id];
    const province = dsProvince[o.province_id] && dsProvince[o.province_id].name;
    const district = dsDistrict[o.district_id] && dsDistrict[o.district_id].name;
    const pack = packs && packs.find(p => Number(p.id) === Number(o.group_membership_pack_id));
    const status = o.is_complete ? 'Đã thanh toán' : '';
    if (o && o.canvas) {
      const fileName = `${Number(index) + 1}_${o.username}_${o.phone}.png`;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = groupXUsers[id].canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      document.body.appendChild(a);
      wait(200);
      a.click();
      wait(200);
      document.body.removeChild(a);

      data.push([
        index + 1, o.username, o.fullname, o.phone, o.email,
        province, district, o.address,
        o.code, pack && pack.name, status,
        fileName,
      ]);
    } else {
      // console.log(id);
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(wb, `Members of MUSVN (${from} - ${to}).xlsx`);
};

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupXUsersData: PropTypes.shape([]),
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    routeParams: PropTypes.shape({ subInfo: PropTypes.string }),
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      createPackageFormData: {},
    };

    bindAll([
      'export2xlsxAll',
    ], this);
  }

  componentDidMount() {
    getData(this.props);

    const printing = this.props.routeParams.subInfo === 'printing';
    if (printing) {
      const params = queryString.parse(this.props.location.search.replace('?', ''));
      this.setState({
        from: params.from,
        to: params.to,
      });
    }
  }

  componentWillReceiveProps(newProps) {
    let dataSource = newProps.groupXUsersData;
    const { routeParams } = this.props;
    const printing = routeParams.subInfo === 'printing';
    let params = {};
    if (printing) {
      params = queryString.parse(this.props.location.search.replace('?', ''));
      dataSource = dataSource.slice(params.from - 1, params.to);
    }
    updateGroupXusers(dataSource);
  }

  export2xlsxAll() {
    const groupName = groups[this.props.groupId] && groups[this.props.groupId].short_name;
    const data = [
      [fileHeader.name, fileHeader.fullname, fileHeader.phone, fileHeader.email, fileHeader.membership_code, fileHeader.is_activated],
    ];

    this.props.groupXUsersData.length && this.props.groupXUsersData.forEach((member) => {
      data.push([member.username, member.fullname, member.phone, member.email, member.membership_code, member.is_activated ? 'true' : 'false']);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `Members of ${groupName}-(${this.state.from} - ${this.state.to}).xlsx`);
  }

  render() {
    const props = this.props;
    const { routeParams, loading, error, group } = this.props;
    let { groupXUsersData } = this.props;

    // filter
    if (groupXUsersData && this.state.code) {
      groupXUsersData = groupXUsersData.filter(el => Number(el.process_id) === Number(this.state.code));
    }
    if (groupXUsersData && this.state.membership_code) {
      groupXUsersData = groupXUsersData.filter(el => el.code === this.state.membership_code);
    }
    if (groupXUsersData && this.state.phone) {
      groupXUsersData = groupXUsersData.filter(el => el.phone === this.state.phone);
    }
    if (groupXUsersData && this.state.email) {
      groupXUsersData = groupXUsersData.filter(el => el.email === this.state.email);
    }
    if (groupXUsersData && this.state.pack) {
      groupXUsersData = groupXUsersData.filter(el => Number(el.group_membership_pack_id) === Number(this.state.pack));
    }
    if (groupXUsersData && this.state.is_complete) {
      groupXUsersData = groupXUsersData.filter((el) => {
        if (this.state.is_complete === -1) return !el.is_complete || el.is_complete === false || el.is_complete === 'false';
        else if (this.state.is_complete === 1) return el.is_complete || el.is_complete === 'true';
        return true;
      });
    }
    if (groupXUsersData && this.state.is_activated) {
      groupXUsersData = groupXUsersData.filter((el) => {
        if (this.state.is_activated === -1) return !el.is_activated || el.is_activated === false || el.is_activated === 'false';
        else if (this.state.is_activated === 1) return el.is_activated || el.is_activated === 'true';
        return true;
      });
    }

    // slice to export
    const printing = routeParams.subInfo === 'printing';
    let params = {};
    if (printing) {
      params = queryString.parse(this.props.location.search.replace('?', ''));
      groupXUsersData = groupXUsersData.slice(params.from - 1, params.to);
    }

    updateGroupXusers(groupXUsersData);

    return (<div>
      {!printing && (
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
            <SelectField
              floatingLabelText="Trạng thái giao dịch"
              value={this.state.is_complete || 0}
              onChange={(event, index, value) => this.setState({ is_complete: value })}
            >
              <MenuItem value={0} primaryText="All" />
              <MenuItem value={-1} primaryText="Chưa thanh toán" />
              <MenuItem value={1} primaryText="Đã thanh toán" />
            </SelectField>
            <SelectField
              floatingLabelText="Trạng thái kích hoạt"
              value={this.state.is_activated || 0}
              onChange={(event, index, value) => this.setState({ is_activated: value })}
            >
              <MenuItem value={0} primaryText="All" />
              <MenuItem value={-1} primaryText="Chưa kích hoạt" />
              <MenuItem value={1} primaryText="Đã kích hoạt" />
            </SelectField>
          </div>
        </Container>
      )}
      <Container title="Export data">
        <div>
          {!printing && (
            <div>
              <div>
                <TextField
                  floatingLabelText="From"
                  hintText="From"
                  type="number"
                  onChange={e => this.setState({ from: e.target.value })}
                  value={this.state.from}
                />
                <TextField
                  floatingLabelText="To"
                  hintText="To"
                  type="number"
                  onChange={e => this.setState({ to: e.target.value })}
                  value={this.state.to}
                />
                <FlatButton
                  label="Generate QR Code"
                  onClick={(e) => {
                    e.preventDefault();
                    if (this.state.from && this.state.to) {
                      this.props.history.push(`/group/${group.id}/xusers/printing?from=${this.state.from}&to=${this.state.to}`);
                    } else {
                      this.props.history.push(`/group/${group.id}/xusers`);
                    }
                  }}
                />
              </div>
            </div>
          )}
          {printing && (
            <div>
              <FlatButton
                label="Export data with QR Code"
                onClick={() => downloadMembers(params.from, params.to, group.packs)}
              />
              <FlatButton
                label="Reset"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push(`/group/${group.id}/xusers`);
                }}
              />
            </div>
          )}
        </div>
      </Container>
      <Container
        title={strings.title_group_memberships}
        error={error}
        loading={loading}
        actions={!printing ? [{
          title: 'Export all',
          icon: <IconDownload />,
          onClick: this.export2xlsxAll,
        }] : null}
      >
        <div>
          <Table
            paginated={!printing}
            hidePaginatedTop
            columns={MembersTableCols(props.browser)}
            data={groupXUsersData}
            error={false}
            loading={loading}
            pageLength={50}
          />
        </div>
      </Container>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  group: state.app.group.data || {},
  groupXUsersData: state.app.groupXUsers.data,
  loading: state.app.groupXUsers.loading,
  error: state.app.groupXUsers.error,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getGroupMembers: groupId => dispatch(getGroupXUsers(groupId)),
  getGroupMemberships: groupId => dispatch(getGroupMemberships(groupId)),
  getGroupMembershipPacks: groupId => dispatch(getGroupMembershipPacks(groupId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestLayer));
