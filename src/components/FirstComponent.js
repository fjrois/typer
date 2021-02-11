import PropTypes from 'prop-types';
import React from 'react';

class FirstComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showAlert = () => {
    window.alert('Ok, this is an alert.\nNow what?');
  };

  redirectToMainSite = () => {
    window.open('https://www.fjrois.com');
  };
  render() {
    const { isBlogDisplayed } = this.props;
    return (
      <>
        <p>This is just the beginning.</p>
        <p>Por algo hay que empezar!!</p>

        <button onClick={this.redirectToMainSite}>Main site</button>
        <button onClick={this.showAlert}>Alert me</button>
        <button
          onClick={this.props.showHideBlog}
          style={{
            backgroundColor: isBlogDisplayed ? 'black' : 'white',
            color: isBlogDisplayed ? 'white' : 'black',
          }}
        >
          Blog
        </button>
      </>
    );
  }
}

FirstComponent.propTypes = {
  isBlogDisplayed: PropTypes.bool.isRequired,
  showHideBlog: PropTypes.func.isRequired,
};

export default FirstComponent;
