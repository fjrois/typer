import Config from './Config';
import Footer from './Footer';
import Header from './Header';
import Panel from './Panel';
// import Panel2 from './Panel2';
import React from 'react';
import ScoresPanel from './ScoresPanel';

class Typer extends React.Component {
  panelRef = React.createRef();

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

    this.applyConfig = this.applyConfig.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.updateWpm = this.updateWpm.bind(this);
  }

  applyConfig(event) {
    event.preventDefault();
    console.log('Applying config...');
    const panelElement = this.panelRef.current;
    panelElement.regenerateText().then(() => {
      const textareaElement = panelElement.textareaRef.current;
      textareaElement.focus();
    });
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
        <Panel
          ref={this.panelRef}
          config={this.state.config}
          updateWpm={this.updateWpm}
        />
        {/* <br />
        <Panel2 config={this.state.config} updateWpm={this.updateWpm} /> */}
        <br />
        <Config
          applyConfig={this.applyConfig}
          config={this.state.config}
          handleOnChange={this.handleConfigChange}
        />
        <br />
        <Footer />
      </>
    );
  }
}

export default Typer;
