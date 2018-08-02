/* eslint-disable no-restricted-syntax,guard-for-in */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { getGroupXUsers } from 'actions';
import { subTextStyle, transformations, toDateString, bindAll } from 'utils';
import strings from 'lang';
import groups from 'fxconstants/groupsObj.json';
import { IconFacebook } from 'components/Icons';
import IconPrint from 'material-ui/svg-icons/action/print';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import styled from 'styled-components';
import constants from 'components/constants';
import MrSuicideGoatQRCode from 'components/Visualizations/QRCode';

const groupXUsers = {};
const fileHeader = {
  name: strings.th_name,
  nickname: strings.th_nickname,
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
  displayName: '',
  field: 'facebook_id',
  displayFn: (row, col, field) => (<div>
    <a href={`https://www.facebook.com/${field}`} rel="noopener noreferrer" target="_blank"><IconFacebook width={24} height={24} /></a>
  </div>),
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
};

const downloadMembers = () => {
  const data = [
    [fileHeader.name, fileHeader.nickname, fileHeader.phone, fileHeader.email, fileHeader.membership_code, ''],
  ];

  for (const id in groupXUsers) {
    const o = groupXUsers[id];
    if (o && o.canvas) {
      const fileName = `${o.fullname}_${o.phone}.png`;
      const a = document.createElement('a');
      a.download = fileName;
      a.href = groupXUsers[id].canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      document.body.appendChild(a);
      a.click();
      // setTimeout(document.body.removeChild(a), 500);
      // document.body.removeChild(a);

      data.push([o.fullname, o.nickname, o.phone, o.email, o.code, fileName]);
    } else {
      // console.log(id);
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
      'export2xlsx',
    ], this);
  }

  componentDidMount() {
    getData(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { routeParams } = this.props;
    const printing = routeParams.subInfo === 'printing';
    const dataSource = printing ? newProps.groupXUsersData.filter(o => !o.is_activated) : newProps.groupXUsersData;
    dataSource.forEach((o) => {
      groupXUsers[o.id] = o;
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
      [fileHeader.name, fileHeader.nickname, fileHeader.phone, fileHeader.email, fileHeader.membership_code, fileHeader.is_activated],
    ];

    this.props.groupXUsersData.length && this.props.groupXUsersData.forEach((member) => {
      data.push([member.fullname, member.nickname, member.phone, member.email, member.membership_code, member.is_activated ? 'true' : 'false']);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, `${groupName}-xusers.xlsx`);
  }

  render() {
    const props = this.props;
    const { routeParams, groupXUsersData, loading, error } = this.props;
    const printing = routeParams.subInfo === 'printing';

    return (<div>
      <Container
        title={strings.title_group_memberships}
        error={error}
        loading={loading}
        actions={!printing ? [{
          title: 'View & Download QRCode of NOT activated members',
          icon: <IconPrint />,
          link: `${props.location.pathname}/printing`,
        }, {
          title: 'Export to XLSX',
          icon: <IconDownload />,
          onClick: this.export2xlsx,
        }] : [{
          title: 'Download',
          icon: <IconPrint />,
          onClick: downloadMembers,
        }]}
      >
        <Table
          paginated={!printing}
          hidePaginatedTop
          columns={MembersTableCols(props.browser)}
          data={printing ? groupXUsersData.filter(o => !o.is_activated) : groupXUsersData}
          error={false}
          loading={loading}
        />
      </Container>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  groupXUsersData: state.app.groupXUsers.data,
  loading: state.app.groupXUsers.loading,
  error: state.app.groupXUsers.error,
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  getGroupMembers: groupId => dispatch(getGroupXUsers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
