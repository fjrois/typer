import './App.css';
import Blog from './components/Blog';
import FirstComponent from './components/FirstComponent';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isBlogDisplayed: false };
    this.showHideBlog = this.showHideBlog.bind(this);
  }

  showHideBlog() {
    this.setState((state) => {
      return { isBlogDisplayed: !state.isBlogDisplayed };
    });
  }

  render() {
    return (
      <div className="App">
        <FirstComponent
          isBlogDisplayed={this.state.isBlogDisplayed}
          showHideBlog={this.showHideBlog}
        />
        {this.state.isBlogDisplayed ? <Blog /> : null}
      </div>
    );
  }
}

export default App;
