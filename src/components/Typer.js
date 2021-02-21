import Config from './Config';
import Header from './Header';
import Panel from './Panel';
import React from 'react';
import ScoresPanel from './ScoresPanel';

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

  handleConfigChange(configUpdates) {
    console.log('configUpdates:', configUpdates);
    this.setState((state) => {
      const config = { ...state.config, ...configUpdates };
      return { config };
    });
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

  render() {
    // const { last: lastWpm, best: bestWpm } = this.state.wpm;

    return (
      <>
        <Header />
        <div>
          <ScoresPanel wpm={this.state.wpm} />
        </div>
        <Panel config={this.state.config} updateWpm={this.updateWpm} />
        <br />
        <Config
          config={this.state.config}
          handleOnChange={this.handleConfigChange}
        />
        <br />
      </>
    );
  }
}

export default Typer;
