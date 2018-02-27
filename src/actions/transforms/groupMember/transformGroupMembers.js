import transformGroupMember from './transformGroupMember';

function transformGroupMembers(dataSource) {
  return dataSource.filter(o => o.data).map(o => transformGroupMember(o));
}

export default transformGroupMembers;
