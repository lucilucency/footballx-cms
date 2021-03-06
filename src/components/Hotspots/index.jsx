import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
/* actions & helpers */
import { getHotspots } from 'actions';
import { subTextStyle } from 'utils';
/* data & components */
import strings from 'lang';
import Table, { TableLink } from 'components/Table';
import TabBar from 'components/TabBar';
import Hotspot from 'components/Hotspot';
import CreateHotspotForm from 'components/Hotspot/Forms/CreateEditHotspotForm';

const hotspotsTableTh = [{
  displayName: strings.th_name,
  tooltip: strings.tooltip_hotspot_name,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/hotspot/${field}`}>{row.name}</TableLink>
    <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
      {row.short_name}
    </span>
  </div>),
}, {
  displayName: strings.th_phone,
  field: 'phone',
}, {
  displayName: strings.th_address,
  field: 'address',
}];

const getData = (props) => {
  const route = props.match.params.info || 'all';
  if (!Number.isInteger(Number(route))) {
    props.dispatchHotspots();
  }
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  render() {
    const { user, history } = this.props;
    const route = this.props.match.params.info || 'all';

    if (!user) {
      history.push('/login');
      return false;
    }

    if (Number.isInteger(Number(route))) {
      return <Hotspot {...this.props} hotspotId={route} />;
    }

    if (user.type === 2 && user.type === 'hotspot') {
      history.push('/');
      return false;
    }

    const Tabs = [{
      name: strings.tab_hotspots_all,
      key: 'all',
      content: props => (<div>
        <Table
          data={props.hotspots}
          columns={hotspotsTableTh}
          loading={props.loading}
          error={props.error}
        />
      </div>),
      route: '/hotspots/all',
    }, user.type === 1 && {
      name: strings.tab_hotspots_add,
      key: 'add',
      content: () => (<div style={{ paddingBottom: 20 }}>
        <CreateHotspotForm />
      </div>),
      route: '/hotspots/add',
    }].filter(o => o);

    const tab = Tabs.find(tab => tab.key === route);

    return (<div>
      <Helmet title={strings.title_hotspots} />
      <div>
        <TabBar
          info={route}
          tabs={Tabs}
        />
        {tab && tab.content(this.props)}
      </div>
    </div>);
  }
}

RequestLayer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      info: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  hotspots: state.app.hotspots.data.sort((a, b) => b.id - a.id),
  loading: state.app.hotspots.loading || false,
  error: state.app.hotspots.error || false,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  dispatchHotspots: () => dispatch(getHotspots()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
