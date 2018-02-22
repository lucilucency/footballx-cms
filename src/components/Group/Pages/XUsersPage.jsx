import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGroupHUsers } from 'actions';
import { transformations, Row, Col } from 'utils';
import strings from 'lang';
import Table from 'components/Table';
import Container from 'components/Container';
import XUsersImportForm from './XUsersImportForm';

const Memberships = [{
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

const getData = (props) => {
  props.getGroupHUsers(props.groupId);
};

class RequestLayer extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({}),
    location: PropTypes.shape({ key: PropTypes.string }),
    groupId: PropTypes.number,
    groupMembers: PropTypes.shape([]),
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

      <Row>
        {/* memberships list area */}
        {/*<Col flex={6}>*/}
          {/*<Container title={strings.title_group_memberships} error={this.props.groupMembers.error} loading={this.props.groupMembers.loading}>*/}
            {/*<Table paginated columns={Memberships} data={this.props.groupMembers.data} error={false} loading={this.props.groupMembers.loading} />*/}
          {/*</Container>*/}
        {/*</Col>*/}

        {/* import memberships area */}
        <Col flex={6}>
          <Container title={strings.title_group_import_membership}>
            <XUsersImportForm groupId={this.props.groupId} />
          </Container>
        </Col>
      </Row>

    </div>);
  }
}

const mapStateToProps = state => ({
  // groupMembers: state.app.groupMembers,
});

const mapDispatchToProps = dispatch => ({
  getGroupHUsers: groupId => dispatch(getGroupHUsers(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
