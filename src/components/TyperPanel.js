import PropTypes from 'prop-types';
import React from 'react';
import { capitalizeFirstLetter } from '../helpers';

const initialText = 'next';

class TyperPanel extends React.Component {
  textareaRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      cursorIndex: 0,
      keyStrokesCount: 0,
      isTextareaOnFocus: true,
      text: initialText,
      textareaValue: '',
      timeFromStart: 0,
      timerId: null,
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.resetKeyStrokesCount = this.resetKeyStrokesCount.bind(this);
    this.selectCharAtIndex = this.selectCharAtIndex.bind(this);

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.tickTimer = this.tickTimer.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.stopTimer();
  }

  async fetchRandomText() {
    console.log('Generating a new text...');
    try {
      const {
        lowercase,
        numberOfParagraphs,
        maxWords,
        minWords,
        textType,
      } = this.props.config;

      const baseUrl = 'https://www.randomtext.me/api';
      const fullUrl = `${baseUrl}/${textType}/p-${numberOfParagraphs}/${minWords}-${maxWords}`;
      console.log('fullUrl:', fullUrl);

      const response = await fetch(fullUrl);
      const json = await response.json();
      console.log('json:', json);

      let randomText = json.text_out;
      const regex = /\<p\>|\<\/p\>/g;
      randomText = randomText.replaceAll(regex, '').trim();
      console.log('randomText.length:', randomText.length);
      randomText = randomText.substring(0, randomText.length - 1); // Remove ending period
      if (lowercase) {
        randomText = randomText.toLowerCase();
      }
      console.log('randomText:', randomText);
      console.log('randomText.length:', randomText.length);

      return randomText;
    } catch (err) {
      console.log(err);
      return initialText;
    }
  }

  handleKeydown(keyboardEvent) {
    if (this.state.cursorIndex === 0 && !this.state.timerId) {
      this.startTimer();
      this.resetKeyStrokesCount();
    }

    const pressedKey = keyboardEvent.key;
    console.log('pressedKey:', pressedKey);

    this.setState((state) => {
      return {
        keyStrokesCount: state.keyStrokesCount + 1,
      };
    });

    const selectedChar = this.state.textareaValue[this.state.cursorIndex];
    console.log('selectedChar:', selectedChar);
    if (pressedKey === selectedChar) {
      this.moveCursor();
    }
  }

  handleOnBlur(event) {
    console.log('handleOnBlur');
    this.stopTimer();

    const targetName = event.target.name;
    console.log('targetName:', targetName);

    this.setState({
      [`is${capitalizeFirstLetter(targetName)}OnFocus`]: false,
      cursorIndex: 0,
    });

    console.log('Removing keydown event listener...');
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleOnChange(event) {
    this.moveCursor();
    console.log(event.target.name);
    const propertyName = event.target.name;
    const updatedValue = event.target.value;
    this.setState({ [`${propertyName}Value`]: updatedValue });
  }

  handleOnFocus(event) {
    const targetName = event.target.name;
    console.log('targetName:', targetName);

    this.setState(
      (state) => {
        return {
          [`is${capitalizeFirstLetter(targetName)}OnFocus`]: true,
          [`${targetName}Value`]: state.text,
        };
      },
      () => {
        this.resetKeyStrokesCount();
        this.selectCharAtIndex(targetName, this.state.cursorIndex);
      }
    );

    console.log('Adding keydown event listener...');
    document.addEventListener('keydown', this.handleKeydown);
  }

  calculateResults() {
    const {
      keyStrokesCount,
      text,
      timeFromStart: timeInMilliseconds,
    } = this.state;
    const timeInSeconds = timeInMilliseconds / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const textLength = text.length;
    const grossWordsPerMinute = timeInMinutes / 5 / keyStrokesCount;
    console.log('');
    console.log('SAMPLE RESULTS');
    console.log('- timeInMilliseconds:', timeInMilliseconds);
    console.log('- timeInSeconds:', timeInSeconds);
    console.log('- timeInMinutes:', timeInMinutes);
    console.log('- textLength:', textLength);
    console.log('- keyStrokesCount:', keyStrokesCount);
    console.log('- grossWordsPerMinute:', grossWordsPerMinute);
    console.log('- text:', text);
    console.log('');
  }

  moveCursor() {
    console.log('Moving cursor...');

    // Sample finished
    if (this.state.cursorIndex + 1 >= this.state.textareaValue.length) {
      this.stopTimer();
      this.calculateResults();
    }

    this.setState(
      (state) => {
        const cursorIndex =
          state.cursorIndex + 1 < state.textareaValue.length
            ? state.cursorIndex + 1
            : 0;
        return {
          cursorIndex,
        };
      },
      async () => {
        const cursorIndex = this.state.cursorIndex;
        if (cursorIndex === 0) {
          await this.regenerateText();
          // this.resetKeyStrokesCount();
        }
        this.selectCharAtIndex('textarea', this.state.cursorIndex);
      }
    );
  }

  resetKeyStrokesCount() {
    this.setState({ keyStrokesCount: 0 });
  }

  async regenerateText() {
    const generatedText = await this.fetchRandomText();
    console.log('generatedText:', generatedText);

    const text = generatedText || initialText;
    this.setState({ text, textareaValue: text });
  }

  selectCharAtIndex(name, index) {
    const element = this[`${name}Ref`].current;
    element.setSelectionRange(index, index + 1);
  }

  startTimer() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
    this.setState({ timeFromStart: 0 }, () => {
      const intervalId = setInterval(() => this.tickTimer(), 1);
      this.setState({ timerId: intervalId });
    });
  }

  stopTimer() {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
      this.setState({ timerId: null });
    }
  }

  resetTimer() {
    this.setState({ timeFromStart: 0 });
    this.stopTimer();
  }

  tickTimer() {
    this.setState((state) => {
      return { timeFromStart: state.timeFromStart + 1 };
    });
  }

  render() {
    return (
      <>
        <div>{this.state.timeFromStart}</div>
        <div>{this.state.keyStrokesCount}</div>
        <div>
          <textarea
            ref={this.textareaRef}
            name="textarea"
            value={this.state.textareaValue}
            onChange={this.handleOnChange}
            autoFocus
            readOnly
            placeholder={initialText}
            rows={10}
            cols={40}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            onClick={() =>
              this.selectCharAtIndex('textarea', this.state.cursorIndex)
            }
          />
        </div>
        <div>
          <p></p>
          <button onClick={this.startTimer}>Start Timer</button>
          <button onClick={this.stopTimer}>Stop Timer</button>
          <button onClick={this.resetTimer}>Reset Timer</button>
        </div>
      </>
    );
  }
}

TyperPanel.propTypes = {
  config: PropTypes.object.isRequired,
};

export default TyperPanel;
