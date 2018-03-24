/* eslint-disable no-param-reassign */

function transformsMatchEvent(data) {
  let matches = data;
  matches = matches.map((match) => {
    const clubs = (match && match.clubs) ? match.clubs.split(',') : [];
    match.home = clubs[0];
    match.away = clubs[1];
    match.clubs = clubs;

    return match;
  });

  return matches;
}

export default transformsMatchEvent;
