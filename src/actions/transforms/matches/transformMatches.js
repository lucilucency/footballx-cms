import _ from 'lodash';

function transformMatches(data) {
  const matches = data.matches;
  const matchClubs = data.clubs;

  data.matches = _.map(matches, (match) => {
    matchClubs.filter(o => o.match_id === match.id).map((club) => {
      if (club.home) {
        match.home = club;
      } else {
        match.away = club;
      }
    });

    return match;
  }).filter(o => o.home && o.away);

  delete data.clubs;
  return data;
}

export default transformMatches;
