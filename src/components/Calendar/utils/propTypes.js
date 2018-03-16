import PropTypes from 'prop-types';
import localizer from '../localizer';
import elementType from 'react-prop-types/lib/elementType';
import all from 'react-prop-types/lib/all';
import { views as Views } from './constants';

import createChainableTypeChecker from 'react-prop-types/lib/utils/createChainableTypeChecker';

export { elementType };

// export contextShape = React.PropTypes.shape({
//   formats: React.PropTypes.object.isRequired,
//   messages: React.PropTypes.object.isRequired,
//   accessors: React.PropTypes.shape({
//     titleAccessor: accessor,
//     startAccessor: accessor,
//     endAccessor: accessor,
//     allDayAccessor: accessor,
//   }).isRequired,
// }).isRequired,

export const eventComponent = PropTypes.oneOfType([
  elementType,
  PropTypes.shape({
    month: elementType,
    week: elementType,
    day: elementType,
    agenda: elementType,
  }),
]);

const viewNames = Object.keys(Views).map(k => Views[k]);

export const accessor = PropTypes.oneOfType([PropTypes.string, PropTypes.func]);

export const dateFormat = createChainableTypeChecker(
  (...args) => localizer.propType && localizer.propType(...args),
);

export const dateRangeFormat = PropTypes.func;

/**
 * accepts either an array of builtin view names:
 *
 * ```
 * views={['month', 'day', 'agenda']}
 * ```
 *
 * or an object hash of the view name and the component (or boolean for builtin)
 *
 * ```
 * views={{
 *   month: true,
 *   week: false,
 *   workweek: WorkWeekViewComponent,
 * }}
 * ```
 */
export const views = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.oneOf(viewNames)),
  all(PropTypes.object, (props, name, ...args) => {
    let prop = props[name],
      err;

    Object.keys(prop).every((key) => {
      const isBuiltinView =
        viewNames.indexOf(key) !== -1 && typeof prop[key] === 'boolean';

      return isBuiltinView || !(err = elementType(prop, key, ...args));
    });

    return err || null;
  }),
]);
