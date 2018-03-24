/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';
import strings from 'lang';
import queryString from 'querystring';
import update from 'react-addons-update';
import constants from 'components/constants';
import ChipList from './ChipList';

const { colorRed, colorBlue } = constants;

const addChipDefault = (name, input, limit, history) => {
  const query = queryString.parse(window.location.search.substring(1));
  const field = [input.value].concat(query[name] || []).slice(0, limit);
  const newQuery = {
    ...query,
    [name]: field,
  };
  if (history) {
    history.push(`${window.location.pathname}?${queryString.stringify(newQuery)}`);
  }
};

const deleteChipDefault = (name, index, history) => {
  const query = queryString.parse(window.location.search.substring(1));
  const field = [].concat(query[name] || []);
  const newQuery = {
    ...query,
    [name]: [
      ...field.slice(0, index),
      ...field.slice(index + 1),
    ],
  };
  if (!newQuery[name].length) {
    delete newQuery[name];
  }
  if (history) {
    history.push(`${window.location.pathname}?${queryString.stringify(newQuery)}`);
  }
};

const blankFn = () => {};

class FormField extends React.Component {
    static propTypes = {
      name: PropTypes.string,
      dataSource: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
      strict: PropTypes.bool,
      limit: PropTypes.number,
      formSelectionState: PropTypes.shape({}),
      history: PropTypes.shape({}),
      label: PropTypes.string,
      filter: PropTypes.string,
      className: PropTypes.string,
      maxSearchResults: PropTypes.string,
      addChip: PropTypes.func,
      deleteChip: PropTypes.func,
      onChange: PropTypes.func,
    };

    static defaultProps = {
      onChange: blankFn,
    };

    constructor(props) {
      super(props);
      this.state = {
        searchText: '',
        errorText: '',
        selectedElements: [],
      };
      this.handleSelect = this.handleSelect.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }

    handleChange() {
      const { selectedElements } = this.state;
      this.props.onChange({ selectedElements });
    }

    handleDelete(name, index) {
      const {
        formSelectionState,
        deleteChip = deleteChipDefault,
        history,
      } = this.props;

      const selectedElements = history ? formSelectionState && formSelectionState[name] : this.state.selectedElements;

      if (history) {
        deleteChip(name, index, history);
      } else {
        selectedElements.splice(index, 1);
        this.setState({ selectedElements }, this.handleChange);
      }
    }

    handleSelect(value, index) {
      const {
        name,
        dataSource,
        strict,
        limit,
        formSelectionState,
        addChip = addChipDefault,
        history,
      } = this.props;

      const selectedElements = history ? (formSelectionState && formSelectionState[name]) : this.state.selectedElements;

      if (selectedElements && Array.isArray(selectedElements)) {
        const isSelected = index > -1
          ? selectedElements.includes(value.value)
          : selectedElements.includes(value);
        if (isSelected) {
          // Handle inputs that are already selected
          this.handleUpdateInput('');
          return;
        }
      }

      let input = null;

      if (index > -1) {
        // User selected an element
        input = dataSource[index];
      } else if (!strict && index === -1) {
        // Direct free input
        input = {
          text: value,
          value,
        };
      } else {
        // Strict and not in dataSource
        this.setState({
          searchText: '',
          errorText: strings.filter_error,
        });
        return;
      }

      this.handleUpdateInput('');
      if (history) {
        addChip(name, input, limit, history);
      } else {
        this.setState({ selectedElements: update(selectedElements, {
          $push: [input.value],
        }) }, this.handleChange);
      }
    }

    handleUpdateInput(searchText) {
      this.setState({
        searchText,
        errorText: '', // clear error when user types
      });
    }

    render() {
      const {
        name,
        label,
        dataSource,
        className,
        maxSearchResults = 100,
        deleteChip = this.handleDelete,
        history,
        formSelectionState,
        filter,
        ...rest
      } = this.props;
      const {
        searchText,
        errorText,
      } = this.state;

      const selectedElements = history ? (formSelectionState && [].concat(formSelectionState[name] || [])) : this.state.selectedElements;

      const chipList = selectedElements ? selectedElements.map((element) => {
        const fromSource = dataSource.find(data => Number(data.value) === Number(element));
        return fromSource || { text: element, value: element };
      }) : [{}];

      return (
        <div className={className}>
          <AutoComplete
            {...rest}
            ref={(ref) => { this.autocomplete = ref; }}
            openOnFocus
            dataSource={dataSource}
            floatingLabelText={label}
            filter={filter || AutoComplete.fuzzyFilter}
            maxSearchResults={maxSearchResults}
            onNewRequest={this.handleSelect}
            onUpdateInput={this.handleUpdateInput}
            searchText={searchText}
            errorText={errorText}
            style={{ flex: '1 0 0' }}
            floatingLabelFocusStyle={{ color: errorText ? colorRed : colorBlue }}
            underlineFocusStyle={{ borderColor: colorBlue }}
            errorStyle={{ color: colorRed }}
            onClose={() => this.setState({ errorText: '' })}
            listStyle={{ maxHeight: '50vh', overflow: 'auto' }}
          />
          <ChipList name={name} chipList={chipList} deleteChip={deleteChip} history={history} />
        </div>);
    }
}

export default FormField;
