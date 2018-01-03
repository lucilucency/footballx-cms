import React from 'react';
import PropTypes from 'prop-types';
import strings from 'lang';
import Table from 'components/Table';
import Container from 'components/Container';

const searchColumns = [{
  displayName: strings.th_name,
  field: 'personaname',
}];

const proColumns = [{
  displayName: strings.th_name,
  field: 'name',
}, {
  displayName: strings.th_team_name,
  field: 'team_name',
}];

const Search = ({
  players,
  playersLoading,
  playersError,
  pros,
  prosLoading,
  prosError,
}) => (
  <div>
    <Container
      loading={prosLoading}
      error={prosError}
      title={strings.app_pro_players}
      hide={!pros || pros.length === 0}
    >
      <Table
        paginated
        pageLength={5}
        data={pros}
        columns={proColumns}
      />
    </Container>
    <Container
      loading={playersLoading}
      error={playersError}
      title={strings.app_public_players}
      subtitle={`${players.length} ${strings.app_results}`}
    >
      <Table
        paginated
        data={players}
        columns={searchColumns}
      />
    </Container>
  </div>
);

Search.propTypes = {
  players: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  playersLoading: PropTypes.bool,
  playersError: PropTypes.string,
  pros: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  prosLoading: PropTypes.bool,
  prosError: PropTypes.string,
};

export default Search;
