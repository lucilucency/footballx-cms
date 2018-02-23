function transformGroupMember(o) {
  const groupData = JSON.parse(o.data);
  const __o = o;
  delete __o.data;

  return {
    ...__o,
    ...groupData,
  };
}

export default transformGroupMember;
