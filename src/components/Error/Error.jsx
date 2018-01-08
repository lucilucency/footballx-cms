import React from 'react';
import reactCSS from 'reactcss';
import Clear from 'material-ui/svg-icons/content/clear';
import constants from 'components/constants';
import { IconButton } from 'material-ui';
import strings from 'lang';
import PropTypes from 'prop-types';

class Error extends React.Component {
  static propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    closeButton: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      show: false,
    });
  }

  render() {
    const styles = reactCSS({
      default: {
        error: {
          fontSize: '0.9em',
          color: 'red',
          transition: 'opacity 1s ease-out',
        },
        closeIcon: {
          fill: constants.colorDanger,
          width: '1em',
          height: '1em',
          display: 'inline-block',
        },
      },
    });

    const { closeButton = false } = this.props;

    return (<div>
      {this.state.show && <i style={styles.error}>
        {this.props.text || 'Whoops! Something went wrong.'}
        {closeButton && <IconButton tooltip={strings.error_clear} onClick={() => { this.setState({ show: false }); }}>
          <Clear style={styles.closeIcon} />
        </IconButton>}
      </i>}
    </div>);
  }
}

export default Error;
