/* eslint-disable no-else-return,no-param-reassign */
import update from 'react-addons-update';

export default (type, initialData) => (state = {
  loading: false,
  data: initialData || [],
}, action) => {
  switch (action.type) {
    /* get action */
    case `REQUEST/${type}`:
      if (action.payload) {
        return {
          ...state,
          loading: true,
          data: action.payload,
          error: null,
        };
      }
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/${type}`:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };

    case `FAIL/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** add to array, server.response -> local.payload */
    case `REQUEST/ADD/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/ADD/${type}`:
      if (action.payload) {
        const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
        return {
          ...state,
          loading: false,
          data: update(newData, {
            $push: state.data,
          }),
          error: null,
        };
      }
      console.error(`error in merge payload OK/ADD/${type}`);
      return {
        ...state,
        loading: false,
        error: true,
      };
    case `FAIL/ADD/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** add to array, server.response -> local payload */
    case `REQUEST/FIRST_ADD/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/FIRST_ADD/${type}`:
      if (action.payload) {
        const payload = Array.isArray(action.payload) ? action.payload : [action.payload];
        return {
          ...state,
          loading: false,
          data: [...payload, ...state.data],
          error: null,
        };
      }
      console.error(`error in merge payload OK/ADD/${type}`);
      return {
        ...state,
        loading: false,
        error: true,
      };
    case `FAIL/FIRST_ADD/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** edit element: server.response -> local.payload */
    case `REQUEST/EDIT/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/EDIT/${type}`:
      if (action.payload) {
        return {
          ...state,
          loading: false,
          data: update(state.data, { $merge: action.payload }),
          error: null,
        };
      } else {
        return {
          ...state,
          loading: false,
          data: state.data,
          error: null,
        };
      }
    case `FAIL/EDIT/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** edit element in tree */
    case `REQUEST/EDIT_TREE/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/EDIT_TREE/${type}`:
      if (action.payload) {
        const { payload } = action;
        const currentComments = Object.assign([], state.data);
        const findAndUpdate = (branches) => {
          if (branches && (typeof branches === 'object') && branches.length) {
            branches.forEach((el) => {
              el.comments = el.comments || [];
              if (el.id === payload.parent_id) {
                if (el.comments && (typeof el.comments === 'object') && el.comments.length) {
                  el.comments.push(payload);
                } else {
                  el.comments = [payload];
                }
              } else {
                findAndUpdate(el.comments);
              }
            });
          }
        };
        findAndUpdate(currentComments);

        return {
          ...state,
          loading: false,
          data: currentComments || [],
          error: null,
        };
      } else {
        return {
          ...state,
          loading: false,
          data: state.data,
          error: null,
        };
      }
    case `FAIL/EDIT_TREE/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** edit element: local.payload -> server.response */
    case `REQUEST/LOCAL_EDIT/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/LOCAL_EDIT/${type}`:
      if (action.payload) {
        // console.log('payload', action.payload, 'state.data', state);
        return {
          ...state,
          loading: false,
          data: update(action.payload, { $merge: state.data }),
          error: null,
        };
      } else {
        return {
          ...state,
          loading: false,
          data: state.data,
          error: null,
        };
      }
    case `FAIL/LOCAL_EDIT/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** edit element in array */
    case `REQUEST/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case `OK/EDIT_ARR/${type}`:
      if (action.payload && action.payload.id) {
        return {
          ...state,
          loading: false,
          data: state.data.map((todo) => {
            if (todo.id === action.payload.id) {
              return Object.assign({}, todo, action.payload);
            }

            return todo;
          }),
          error: null,
        };
      }
      console.error(`error in merge payload OK/EDIT_ARR/${type}`);
      return {
        ...state,
        loading: false,
        error: true,
      };
    case `FAIL/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    /** query action */
    case `QUERY/${type}`:
      return {
        ...state,
        query: action.query,
      };

    default:
      return state;
  }
};
