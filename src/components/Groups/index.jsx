import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
/* actions & helpers */
import { getGroups } from 'actions';
/* css */
import styled from 'styled-components';
/* data & components */
import strings from 'lang';
import Table, { TableLink } from 'components/Table';
import Group from 'components/Group';
import TabBar from 'components/TabBar';


import CreateGroupForm from './Forms/CreateGroup';

const SubText = styled.span`
    font-size: 12px !important;
    color: var(--colorMutedLight);
    /*text-overflow: initial !important;*/
    display: block;
    margin-top: 1px;

    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    /* @media only screen and (max-width: 1023px) {
        max-width: 200px;
    }

    @media only screen and (max-width: 400px) {
        max-width: 200px;
    } */
`;

const groupsTableTh = [{
  displayName: strings.th_group,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/group/${field}`}>{row.short_name}</TableLink>
    <SubText style={{ display: 'block', marginTop: 1 }}>
      {row.name}
    </SubText>
  </div>),
}];

const getData = (props) => {
  const route = props.match.params.groupId || 'all';
  if (!Number.isInteger(Number(route))) {
    props.dispatchGroups();
  }
};

class RequestLayer extends React.Component {
  static propTypes = {
    user: PropTypes.shape({}),
    history: PropTypes.shape({}),
    match: PropTypes.shape({
      params: PropTypes.shape({
        info: PropTypes.string,
      }),
    }),
  };

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
      return <Group {...this.props} groupId={route} />;
    }

    if (user.user_type === 2 && user.type === 'group') {
      history.push('/');
      return false;
    }

    const Tabs = [{
      name: strings.tab_hotspots_all,
      key: 'all',
      content: props => (<div>
        <Table
          data={props.groups}
          columns={groupsTableTh}
          loading={props.loading}
          error={props.error}
        />
      </div>),
      route: '/groups/all',
    }, user.user_type === 1 && {
      name: strings.tab_groups_add,
      key: 'add',
      content: () => (<div>
        <CreateGroupForm />
      </div>),
      route: '/groups/add',
    }].filter(o => o);

    const tab = Tabs.find(tab => tab.key === route);

    return (<div>
      <Helmet title={strings.title_groups} />
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
  groups: state.app.groups.data.sort((a, b) => b.id - a.id),
  loading: state.app.groups.loading || false,
  error: state.app.groups.error || false,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  dispatchGroups: () => dispatch(getGroups()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
