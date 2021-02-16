import TyperConfig from './TyperConfig';
import TyperPanel from './TyperPanel';
import React from 'react';

class Typer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        lowercase: true,
        maxWords: 5,
        minWords: 5,
        numberOfParagraphs: 1,
        textType: 'gibberish', // 'gibberish' or 'lorem';
      },
      wpm: {
        best: { gross: null, net: null },
        last: { gross: null, net: null },
      },
    };

    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.updateWpm = this.updateWpm.bind(this);
  }

  updateWpm(updates) {
    this.setState((state) => {
      const updatedWpm = { ...state.wpm, ...updates };
      if (updates.last && !updates.best) {
        const { gross: currentBestGross, net: currentBestNet } = state.wpm.best;

        const updatedBest = state.wpm.best;
        if (updates.last.gross > currentBestGross) {
          updatedBest.gross = updates.last.gross;
        }
        if (updates.last.net > currentBestNet) {
          updatedBest.net = updates.last.net;
        }
        updatedWpm.best = updatedBest;
      }
      return { wpm: updatedWpm };
    });
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
          <TyperPanel config={this.state.config} updateWpm={this.updateWpm} />
        </div>
        <p></p>
        <div>
          <TyperConfig
            config={this.state.config}
            handleOnChange={this.handleConfigChange}
          />
        </div>
        <p></p>
        <div>Last GROSS WPM: {this.state.wpm.last.gross}</div>
        <div>Last NET WPM: {this.state.wpm.last.net}</div>
        <p></p>
        <div>Best GROSS WPM: {this.state.wpm.best.gross}</div>
        <div>Best NET WPM: {this.state.wpm.best.net}</div>
      </>
    );
  }
}

export default Typer;
