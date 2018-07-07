function transformEvent(o) {
  const event = o.event;
  const hotspot = o.hotspot;
  const match = o.match;

  const eventObj = event ? {
    ...event,
    event_id: event.id,
    price_after_discount: event.discount ? event.price * (100 - event.discount) / 100 : event.price,
  } : {};

  const clubs = (match && match.cache_clubs) ? match.cache_clubs.split(',') : [];
  const matchObj = match ? {
    match_id: match.id,
    match_date: match.date,
    match_season: match.season_id,
    home: clubs[0],
    away: clubs[1],
    clubs,
  } : {};

  const hotspotObj = hotspot ? {
    hotspot_id: hotspot.id,
    hotspot_name: hotspot.name,
    hotspot_address: hotspot.address,
    hotspot_coordinate: hotspot.coordinate,
    hotspot_phone: hotspot.phone,
    hotspot_wifi: hotspot.wifi,
  } : {};

  return {
    ...eventObj,
    ...matchObj,
    ...hotspotObj,
  };
}

export default transformEvent;
