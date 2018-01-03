function transformEvent(o) {
  const event = o.event;
  const hotspot = o.hotspot;
  const match = o.match;

  const eventObj = event ? {
    event_id: event.id,
    start_time_register: event.start_time_register,
    end_time_register: event.end_time_register,
    start_time_checkin: event.start_time_checkin,
    end_time_checkin: event.end_time_checkin,
    seats: event.seats,
    price: event.price,
    discount: event.discount,
    created_user_id: event.created_user_id,
    created_user_type: event.created_user_type,
    status: event.status,
    notes: event.notes,
    checkin_total: event.checkin_total,
    register_total: event.register_total,
    home_color: event.home_color,
    away_color: event.away_color,
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
