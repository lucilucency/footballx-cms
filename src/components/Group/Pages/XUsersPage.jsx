/* eslint-disable no-restricted-syntax,guard-for-in */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { getGroupXUsers } from 'actions';
import { subTextStyle, renderDialog, transformations, toDateString } from 'utils';
import strings from 'lang';
import IconPrint from 'material-ui/svg-icons/action/print';
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container';
import styled from 'styled-components';
import constants from 'components/constants';
import MrSuicideGoatQRCode from './MrSuicideGoatQRCode';

const groupXUsers = {};
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

const Status = styled.div`
  //filter: drop-shadow(0 0 5px green);
  color: ${constants.colorGreen}
`;

const MembersTableCols = browser => ([{
  displayName: strings.th_xuser,
  tooltip: strings.tooltip_hero_id,
  field: 'nickname',
  displayFn: transformations.th_xuser_image,
  sortFn: true,
}, {
  displayName: strings.th_address,
  field: 'code',
  displayFn: (row, col, field) => (<div>
    <b>{field}</b>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
      {toDateString(row.expire_date * 1000)}
    </span>}
  </div>),
}, {
  displayName: strings.th_xuser_is_activated,
  field: 'is_activated',
  displayFn: (row, col, field) => (<div>
    {field && <Status>{'Activated'}</Status>}
  </div>),
  sortFn: true,
}, {
  displayName: '',
  field: 'membership_code',
  displayFn: (row, col, field) => (<span style={{ display: 'none' }}>
    <MrSuicideGoatQRCode
      size={1000}
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
};

const downloadMembers = () => {
  const data = [
    [fileHeader.name, fileHeader.email, fileHeader.phone, fileHeader.email, fileHeader.membership_code, ''],
  ];

  for (const id in groupXUsers) {
    const o = groupXUsers[id];
    if (o) {
      const fileName = `${o.fullname}_${o.email}.png`;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = groupXUsers[id].canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      data.push([o.fullname, o.email, o.phone, o.email, o.code, fileName]);
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
    groupXUsers: PropTypes.shape([]),
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
    newProps.groupXUsers.data.forEach((o) => {
      groupXUsers[o.id] = o;
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

    return (<div>
      <Container
        title={strings.title_group_memberships}
        error={props.groupXUsers.error}
        loading={this.props.groupXUsers.loading}
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
          columns={MembersTableCols(props.browser)}
          data={this.props.groupXUsers.data}
          error={false}
          loading={this.props.groupXUsers.loading}
        />
      </Container>

      {renderDialog(this.state.dialogConstruct, this.state.openDialog)}
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  groupXUsers: state.app.groupXUsers,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getGroupMembers: groupId => dispatch(getGroupXUsers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
