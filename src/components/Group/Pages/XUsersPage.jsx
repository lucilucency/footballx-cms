import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGroupHUsers } from 'actions';
import { transformations } from 'utils';
import strings from 'lang';
import Table from 'components/Table';
import Container from 'components/Container';
import CreateGroupHUserForm from 'components/Group/Forms/CreateGroupHUser';
import XUsersImportForm from './XUsersImportForm';

const HUsersColumns = [{
  displayName: strings.th_account,
  field: 'username',
  displayFn: transformations.th_huser_link,
}, {
  displayName: strings.th_name,
  field: 'fullname',
}, {
  displayName: strings.th_phone,
  field: 'phone',
}, {
  displayName: strings.th_email,
  field: 'email',
}];

const Husers = (propsVar) => {
  const {
    data,
    error = false,
    loading = false,
  } = propsVar;
  return (
    <Container title={strings.title_group_xusers} error={error} loading={loading}>
      <Table paginated columns={HUsersColumns} data={data} error={false} loading={loading} />
    </Container>
  );
};

const getData = (props) => {
  props.getGroupHUsers(props.groupId);
};

class RequestLayer extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({}),
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupHUsers: PropTypes.shape([]),
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
    const { routeParams } = this.props;
    const subInfo = routeParams.subInfo;

    return (<div>
      {subInfo && subInfo === 'add' && <CreateGroupHUserForm groupId={this.props.groupId} />}
      {/*<Container title={strings.title_group_xusers} error={this.props.groupHUsers.error} loading={this.props.groupHUsers.loading}>*/}
        {/*<Table paginated columns={HUsersColumns} data={this.props.groupHUsers.data} error={false} loading={this.props.groupHUsers.loading} />*/}
      {/*</Container>*/}
      <Container>
        <XUsersImportForm groupId={this.props.groupId} />
      </Container>
    </div>);
  }
}

const mapStateToProps = state => ({
  groupHUsers: state.app.groupHUsers,
});

const mapDispatchToProps = dispatch => ({
  getGroupHUsers: groupId => dispatch(getGroupHUsers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
