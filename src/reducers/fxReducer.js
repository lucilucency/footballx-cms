import update from 'react-addons-update';

export default (type, initialData) => (state = {
  loading: true,
  data: initialData || [],
}, action) => {
  switch (action.type) {
    /* get action */
    case `REQUEST/${type}`:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case `OK/${type}`:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: false,
      };
    case `FAIL/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      /* add action */
    case `REQUEST/ADD/${type}`:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case `OK/ADD/${type}`:
      return {
        ...state,
        loading: false,
        data: update(state.data, {
          $push: Array.isArray(action.payload) ? action.payload : [action.payload],
        }),
        error: false,
      };
    case `FAIL/ADD/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      /* edit action */
    case `REQUEST/EDIT/${type}`:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case `OK/EDIT/${type}`:
      return {
        ...state,
        loading: false,
        data: update(state.data, { $merge: action.payload }),
        error: false,
      };
    case `FAIL/EDIT/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case `REQUEST/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case `OK/EDIT_ARR/${type}`:
      console.log(type);
      console.log(state.data);
      console.log(action);
      return {
        ...state,
        loading: false,
        data: update(state.data, { $merge: action.payload }),
        error: false,
      };
    case `FAIL/EDIT_ARR/${type}`:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      /* query action */
    case `QUERY/${type}`:
      return {
        ...state,
        query: action.query,
      };

    default:
      return state;
  }
};
