import React from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import ShowFormToggle from 'components/Form/ShowFormToggle';

/* data */
import { toggleShowForm } from 'actions';
import strings from 'lang';
import { FORM_NAME_FILTER } from '../Forms/FilterForm';
/* css */
import styled from 'styled-components';

const HeaderButtons = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    font-size: 14px;
    justify-content: center;

    @media only screen and (max-width: 660px) {
        justify-content: center;

        & a {
            min-width: 50px !important;
        }

        & button {
            min-width: 50px !important;
        }
    
        & * {
            font-size: 0 !important;
            padding: 0 !important;
            margin: auto !important;
        }
    
        & span {
            margin: 0 !important;
        }
    }
`;


class HotspotHeaderButtons extends React.Component {
  componentWillMount() {
    this.setState({
      disableRefresh: false,
      disableEdit: false,
    });
  }

  render() {
    const {
      showFormFilter,
      toggleShowFormFilter = () => {},
    } = this.props;
    return (<HeaderButtons>
      <div
        data-hint={strings.app_refresh}
        data-hint-position="top"
      >
        <FlatButton
          icon={<ActionUpdate />}
          // disabled={this.state.disableRefresh}
          onClick={() => {
            // fetch(`${process.env.REACT_APP_API_HOST}/api/players/${playerId}/refresh`, { method: 'POST' });
            // this.setState({ disableRefresh: true });
          }}
          label={strings.app_refresh_label}
        />
      </div>
      <ShowFormToggle show={showFormFilter} onClick={toggleShowFormFilter} textToggle={strings.form_filter_close} />
    </HeaderButtons>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  showFormFilter: state.app.formFilter.show,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormFilter: () => dispatch(toggleShowForm(FORM_NAME_FILTER)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HotspotHeaderButtons);
