import React from 'react';
import {
  connect,
} from 'react-redux';
import { getHotspotHUsers } from 'actions';
import Table from 'components/Table';
import Container from 'components/Container';
import { transformations } from 'utility';
import CreateHotspotHUserForm from 'components/Hotspot/Forms/CreateHotspotHUser';

import strings from 'lang';

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

const Husers = ({
  data,
  error = false,
  loading = false,
}) => (
  <Container title={strings.hotspot_husers} error={error} loading={loading}>
    <Table paginated columns={HUsersColumns} data={data} error={false} loading={loading} />
  </Container>
);

const getData = (props) => {
  props.getHotspotHUsers(props.hotspotId);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.hotspotId !== nextProps.hotspotId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  render() {
    const { routeParams } = this.props;
    const subInfo = routeParams.subInfo;


    return (<div>
      {subInfo && subInfo === 'add' && <CreateHotspotHUserForm hotspotId={Number(this.props.hotspotId)} />}
      <Husers {...this.props.hotspotHUsers} />
    </div>);
  }
}

const mapStateToProps = state => ({
  hotspotHUsers: state.app.hotspotHUsers,
});

const mapDispatchToProps = dispatch => ({
  getHotspotHUsers: hotspotId => dispatch(getHotspotHUsers(hotspotId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
