import React from 'react';
import TyperConfig from './TyperConfig';
import TyperPanel from './TyperPanel';
import { formatDecimalNumber } from '../helpers';

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
    const { last: lastWpm, best: bestWpm } = this.state.wpm;

    return (
      <>
        <h2>&#62;Typer&#60;</h2>
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
        <div>Last GROSS WPM: {formatDecimalNumber(lastWpm.gross)}</div>
        <div>Last NET WPM: {formatDecimalNumber(lastWpm.net)}</div>
        <div>
          Accuracy (GWPM/NWPM):{' '}
          {lastWpm.net && lastWpm.gross
            ? formatDecimalNumber((lastWpm.net / lastWpm.gross) * 100) + '%'
            : ''}
        </div>
        <p></p>
        <div>Best GROSS WPM: {formatDecimalNumber(bestWpm.gross)}</div>
        <div>Best NET WPM: {formatDecimalNumber(bestWpm.net)}</div>
      </>
    );
  }
}

export default Typer;
