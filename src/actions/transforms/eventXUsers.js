import transformEventXUser from './eventXUsers';

function transformGroupMembers(dataSource) {
  return dataSource.filter(o => o.data).map(o => transformEventXUser(o));
}

export default transformGroupMembers;
