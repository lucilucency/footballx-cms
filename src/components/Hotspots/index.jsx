/* global API_HOST */
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
/* actions & helpers */
import { getHotspots } from 'actions';
/* data & components */
import strings from 'lang';
import Table, { TableLink } from 'components/Table';
import { RaisedButton } from 'material-ui';
import Hotspot from 'components/Hotspot';
import TabBar from 'components/TabBar';
import CreateHotspotForm from './Forms/CreateHotspot';
/* css */
import subTextStyle from 'components/Visualizations/Table/subText.css';

const hotspotsTableTh = [{
  displayName: strings.th_hotspot,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/hotspot/${field}`}>{row.name}</TableLink>
    <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
      {row.phone}
    </span>
  </div>),
}, {
  displayName: strings.th_address,
  tooltip: strings.tooltip_duration,
  field: 'address',
  sortFn: true,
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

    if (user.user_type === 2 && user.type === 'hotspot') {
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
    }, user.user_type === 1 && {
      name: strings.tab_hotspots_add,
      key: 'add',
      content: props => (<div>
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
