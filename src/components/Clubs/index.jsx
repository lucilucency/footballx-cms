import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import strings from 'lang';
import Table from 'components/Table';

import clubs from 'fxconstants/build/clubsArr.json';
import { transformations, getOrdinal } from 'utility';

const clubsColumns = [{
  displayName: strings.th_no,
  displayFn: (row, col, field, index) => getOrdinal(index + 1),
}, {
  displayName: strings.th_club_name,
  field: 'id',
  sortFn: true,
  sortClick: 'name',
  displayFn: transformations.th_club_image,
}];

const getData = (props) => {
  const route = props.match.params.clubId || 'premierleague';
  if (!Number.isInteger(Number(route))) {
    //
  }
};

class RequestLayer extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        clubId: PropTypes.number,
      }),
    }),
  };
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.clubId !== nextProps.match.params.clubId) {
      getData(nextProps);
    }
  }

  render() {
    const route = this.props.match.params.clubId || 'premierleague';

    if (Number.isInteger(Number(route))) {
      return (
        <div>
          <h1>{strings.clubs_detail}</h1>
        </div>
      );
    }

    return (
      <div>
        <Helmet title={strings.title_clubs} />
        <div>
          <Table data={clubs.sort((x, y) => x.id > y.id)} columns={clubsColumns} loading={false} error={false} />
        </div>
      </div>
    );
  }
}

RequestLayer.propTypes = {

};

const mapStateToProps = state => ({
  clubData: state.app.clubs.data,
  loading: state.app.clubs.loading,
});

export default connect(mapStateToProps, null)(RequestLayer);
