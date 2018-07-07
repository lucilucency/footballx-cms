import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGroupHUsers } from 'actions';
import Table from 'components/Table/index';
import Container from 'components/Container/index';
import { transformations } from 'utils';
import strings from 'lang';
import CreateGroupHUserForm from 'components/Group/Forms/CreateGroupHUser';

const HUsersColumns = [{
  displayName: strings.th_account,
  field: 'username',
  displayFn: transformations.th_user_link,
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
    <Container title={strings.title_group_husers} error={error} loading={loading}>
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
    const { routeParams, groupHUsers } = this.props;
    const subInfo = routeParams.subInfo;

    return (<div>
      {subInfo && subInfo === 'add' && <CreateGroupHUserForm groupId={this.props.groupId} />}
      <Husers {...groupHUsers} />
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
