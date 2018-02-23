import transformGroupMember from './transformGroupMember';

function transformGroupMembers(data) {
  return data.map(o => transformGroupMember(o));
}

export default transformGroupMembers;
