import './App.css';
import Typer from './components/Typer';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Typer />
      </div>
    );
  }
}

export default App;
