/* eslint-disable no-param-reassign */
import _ from 'lodash';

function transformsMatch(data) {
  const matches = data.matches;

  return _.map(matches, (match) => {
    const clubs = (match && match.cache_clubs) ? match.cache_clubs.split(',') : [];
    const goals = (match && match.cache_goals) ? match.cache_goals.split(',') : [];

    return {
      ...match,
      home: clubs[0],
      away: clubs[1],
      home_goal: goals[0],
      away_goal: goals[0],
    };
  });
}

export default transformsMatch;
