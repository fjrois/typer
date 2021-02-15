import TyperConfig from './TyperConfig';
import TyperPanel from './TyperPanel';
import React from 'react';

class Typer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        lowercase: true,
        numberOfParagraphs: 1,
        maxWords: 10,
        minWords: 2,
        textType: 'gibberish', // 'gibberish' or 'lorem';
      },
    };

    this.handleConfigChange = this.handleConfigChange.bind(this);
  }

  handleConfigChange(configUpdates) {
    console.log('configUpdates:', configUpdates);
    this.setState((state) => {
      const config = { ...state.config, ...configUpdates };
      return { config };
    });
  }

  render() {
    return (
      <>
        <p>Typer</p>
        <div>
          <TyperPanel config={this.state.config} />
        </div>
        <div>
          <TyperConfig
            config={this.state.config}
            handleOnChange={this.handleConfigChange}
          />
        </div>
      </>
    );
  }
}

export default Typer;
