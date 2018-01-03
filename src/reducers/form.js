import { formActions } from 'actions';

const initialFormState = {
  show: false,
};

export default type => (state = initialFormState, action) => {
  switch (action.type) {
    case formActions.TOGGLE_SHOW_FORM:
      if (action.formName === type) {
        return {
          ...state,
          show: action.state ? action.state : !state.show,
        };
      }
      return state;


    default:
      return state;
  }
};
