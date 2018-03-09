function transformEvent(o) {
  const event = o.event;
  const hotspot = o.hotspot;
  const match = o.match;

  /* {
    away_color:"#000000",
    checkin_total:0,
    created_user_id:3,
    created_user_type:1,
    deposit:5000,
    end_time_checkin:1519851600,
    end_time_register:1519851600,
    free_folk_color:"#ffffff",
    group_id:2,
    home_color:"#ffffff",
    hotspot_id:0,
    id:192,
    is_charged:true,
    is_fan2friend_minigame:false,
    match_id:0,
    notes:"",
    price:25000,
    register_total:0,
    seats:20,
    start_time_checkin:1519721796,
    start_time_register:1519721796,
    status:1,
  } */

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
