function transformHUser(o) {
  const huser = o.huser;
  const hotspot = o.huser_hotspot;

  const huserObj = huser ? {
    user_id: huser.user_id,
    huser_id: huser.id,
    fullname: huser.fullname,
    phone: huser.phone,
    email: huser.email,
  } : {};

  const hotspotObj = hotspot ? {
    hotspot_id: hotspot.hotspot_id,
  } : {};

  return {
    ...huserObj,
    ...hotspotObj,
  };
}

export default transformHUser;
