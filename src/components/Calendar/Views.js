import { views } from './utils/constants';
import Month from './Month.jsx';
import Day from './Day.jsx';
import Week from './Week.jsx';
import WorkWeek from './WorkWeek.jsx';
import Agenda from './Agenda';

const VIEWS = {
  [views.MONTH]: Month,
  [views.WEEK]: Week,
  [views.WORK_WEEK]: WorkWeek,
  [views.DAY]: Day,
  [views.AGENDA]: Agenda,
};

export default VIEWS;
