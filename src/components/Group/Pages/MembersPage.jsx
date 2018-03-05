/* eslint-disable no-restricted-syntax,guard-for-in */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { getGroupImportedMembers } from 'actions';
import { subTextStyle, renderDialog } from 'utils';
import strings from 'lang';
import IconPrint from 'material-ui/svg-icons/action/print';
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container';
// import QRCode from 'qrcode.react';
import MrSuicideGoatQRCode from './MrSuicideGoatQRCode';
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

const downloadMembers = () => {
  const data = [
    [fileHeader.name, fileHeader.email, fileHeader.phone, fileHeader.dob, fileHeader.city, fileHeader.address, fileHeader.membership_code, ''],
  ];

  for (const id in groupMembers) {
    const o = groupMembers[id];
    if (o) {
      const fileName = `${o.name}_${o.membership_code}.png`;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = groupMembers[id].canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      data.push([o.name, o.email, o.phone, o.dob, o.city, o.address, o.membership_code, fileName]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(wb, 'Group Membership QR.xlsx');
};

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupMembers: PropTypes.shape([]),
    routeParams: PropTypes.shape({ subInfo: PropTypes.string }),
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      createPackageFormData: {},
    };

    // bindAll([
    //   'downloadMembers',
    // ], this);
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

  render() {
    const props = this.props;
    const { routeParams } = this.props;
    const subInfo = routeParams.subInfo === 'printing';

    const PrintingMembersTableCols = [{
      displayName: strings.th_name,
      field: 'name',
      displayFn: (row, col, field) => (<div>
        {row.xuser_id ?
          <TableLink to={`/xuser/${row.xuser_id}`}>{field && field.toUpperCase()}</TableLink> :
          <b>{field && field.toUpperCase()}</b>
        }
      </div>),
    }, {
      displayName: strings.th_membership_code,
      field: 'membership_code',
      displayFn: (row, col, field) => (<span style={{ textDecoration: row.xuser_id ? 'line-through' : 'none' }}>
        {field}
      </span>),
    }, {
      displayName: strings.th_membership_code,
      field: 'membership_code',
      displayFn: (row, col, field) => (<span style={{ display: 'none' }}>
        <MrSuicideGoatQRCode
          size={1500}
          value={field}
          getCanvas={(canvas) => {
            groupMembers[row.id].canvas = canvas;
          }}
        />
      </span>),
    }];


    return (<div>
      <Container
        title={strings.title_group_memberships}
        error={props.groupMembers.error}
        loading={this.props.groupMembers.loading}
        actions={!subInfo ? [{
          title: 'View Members QRCode',
          icon: <IconPrint />,
          link: `${props.location.pathname}/printing`,
        }] : [{
          title: 'Download Members QRCode',
          icon: <IconPrint />,
          onClick: downloadMembers,
        }]}
      >
        <Table
          paginated={!subInfo}
          hidePaginatedTop
          columns={subInfo ? PrintingMembersTableCols : MembersTableCols(props.browser)}
          data={this.props.groupMembers.data}
          error={false}
          loading={this.props.groupMembers.loading}
        />
      </Container>
      {props.user.user_type === 1 && <Container title={strings.title_group_import_membership}>
        <XUsersImportForm groupId={this.props.groupId} groupMembers={this.props.groupMembers.data} />
      </Container>}
      {renderDialog(this.state.dialogConstruct, this.state.openDialog)}
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
