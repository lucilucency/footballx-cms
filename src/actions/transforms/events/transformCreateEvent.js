function transformCreateEvent(event) {
  return {
    event_id: event.id,
    status: event.status,
    notes: event.notes,
    price: event.price,
    discount: event.discount,
    seats: event.seats,

    start_time_checkin: event.start_time_checkin,
    start_time_register: event.start_time_register,
    end_time_checkin: event.end_time_checkin,
    end_time_register: event.end_time_register,
    register_total: event.register_total,
    checkin_total: event.checkin_total,

    // home: match.clubs ? match.clubs.split(",")[0].trim() : null,
    // away: match.clubs ? match.clubs.split(",")[1].trim() : null,
    // match_date: match.date,
    // match_id: match.id,
    // match_season: match.season_id,
  };
}

export default transformCreateEvent;
