const TOGGLE_SHOW_FORM = 'form/TOGGLE_SHOW_FORM';

export const formActions = {
  TOGGLE_SHOW_FORM,
};

export const toggleShowForm = (formName, state) => ({
  type: TOGGLE_SHOW_FORM,
  formName,
  state,
});
