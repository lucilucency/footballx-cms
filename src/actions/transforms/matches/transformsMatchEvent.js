/* eslint-disable no-param-reassign,camelcase */

function transformsMatchEvent(matches) {
  return matches.reduce((__prev, __cur) => {
    const prev = __prev;
    const ids = prev.map(o => o.id);
    const pos = ids.indexOf(__cur.id);
    if (pos === -1) {
      const clubs = (__cur && __cur.clubs) ? __cur.clubs.split(',') : [];
      __cur.home = clubs[0];
      __cur.away = clubs[1];
      __cur.clubs = clubs;

      const { hotspot_id, hotspot_address, hotspot_name, hotspot_short_name, checkin_total, register_total } = __cur;
      const cur = __cur;
      delete cur.hotspot_id;
      delete cur.hotspot_address;
      delete cur.hotspot_name;
      delete cur.hotspot_short_name;
      delete cur.checkin_total;
      delete cur.register_total;
      cur.hotspots = [{ hotspot_id, hotspot_address, hotspot_name, hotspot_short_name, checkin_total, register_total }];
      prev.push(cur);
    } else {
      const { hotspot_id, hotspot_address, hotspot_name, hotspot_short_name, checkin_total, register_total } = prev[pos];
      prev[pos].hotspots = prev[pos].hotspots || [];
      prev[pos].hotspots.push({ hotspot_id, hotspot_address, hotspot_name, hotspot_short_name, checkin_total, register_total });
    }
    return prev;
  }, []);
}

export default transformsMatchEvent;
