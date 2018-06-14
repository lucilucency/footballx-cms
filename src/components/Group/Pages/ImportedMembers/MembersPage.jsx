/* eslint-disable no-restricted-syntax,guard-for-in */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { getGroupImportedMembers } from 'actions';
import { subTextStyle, bindAll } from 'utils';
import strings from 'lang';
import groups from 'fxconstants/groupsObj.json';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import Table, { TableLink } from 'components/Table/index';
import Container from 'components/Container/index';
import XUsersImportForm from './MembersImportForm';

const groupMembers = {};
const fileHeader = {
  name: strings.th_name,
  email: strings.th_email,
  phone: strings.th_phone,
  dob: strings.th_dob,
  city: strings.th_city,
  address: strings.th_address,
  gender: strings.th_gender,
  size: strings.th_membership_t_shirt_size,
  joined_year: strings.th_membership_joined_year,
  is_purchase: strings.th_membership_is_purchase,
  is_activated: strings.th_membership_is_activated,
  membership_code: strings.th_membership_code,
};

const MembersTableCols = browser => ([{
  displayName: strings.th_name,
  field: 'xuser_id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    {field ?
      <TableLink to={`/xuser/${field}`}>{row.name && row.name.toUpperCase()}</TableLink> :
      <b>{row.name && row.name.toUpperCase()}</b>
    }
    {browser.greaterThan.small && <div>
      <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
        {row.dob}
      </span>
    </div>}
  </div>),
}, {
  displayName: strings.th_contact,
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
}, false && {
  displayName: strings.th_membership_t_shirt_size,
  field: 'size',
}, false && {
  displayName: strings.th_membership_joined_year,
  field: 'joined_year',
}, false && {
  displayName: strings.th_membership_is_purchase,
  field: 'is_purchase',
  displayFn: (row, col, field) => (<div>
    {field && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />}
  </div>),
}, {
  displayName: strings.th_membership_code,
  field: 'membership_code',
  displayFn: (row, col, field) => (<span style={{ textDecoration: row.xuser_id ? 'line-through' : 'none' }}>
    {field}
  </span>),
}]);

const getData = (props) => {
  props.getGroupMembers(props.groupId);
};

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupMembers: PropTypes.shape([]),
    // routeParams: PropTypes.shape({ subInfo: PropTypes.string }),
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      createPackageFormData: {},
    };

    bindAll([
      'export2xlsx',
    ], this);
  }

  componentDidMount() {
    getData(this.props);
  }

  componentWillReceiveProps(newProps) {
    newProps.groupMembers.data.forEach((o) => {
      groupMembers[o.id] = o;
    });
  }

  componentWillUpdate(nextProps) {
    if (this.props.groupId !== nextProps.groupId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  export2xlsx() {
    const groupName = groups[this.props.groupId] && groups[this.props.groupId].short_name;
    const data = [
      [fileHeader.name, fileHeader.nickname, fileHeader.city, fileHeader.address, fileHeader.phone, fileHeader.email, fileHeader.membership_code, fileHeader.is_activated],
    ];

    this.props.groupMembers.data.length && this.props.groupMembers.data.forEach((member) => {
      data.push([member.name, member.nickname, member.city, member.address, member.phone, member.email, member.membership_code, member.xuser_id ? 'true' : 'false']);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `${groupName}-old-members.xlsx`);
  }

  render() {
    const props = this.props;

    return (<div>
      <Container
        title={strings.title_group_memberships}
        error={props.groupMembers.error}
        loading={this.props.groupMembers.loading}
        actions={[{
          title: 'Export to XLSX',
          icon: <IconDownload />,
          onClick: this.export2xlsx,
        }]}
      >
        <Table
          paginated
          pageLength={100}
          hidePaginatedTop
          columns={MembersTableCols(props.browser)}
          data={this.props.groupMembers.data}
          error={false}
          loading={this.props.groupMembers.loading}
        />
      </Container>
      {props.user.user_type === 1 ? <Container title={strings.title_group_imported_members}>
        <XUsersImportForm groupId={this.props.groupId} groupMembers={this.props.groupMembers.data} />
      </Container> : null}
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  groupMembers: state.app.groupMembers,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getGroupMembers: groupId => dispatch(getGroupImportedMembers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
