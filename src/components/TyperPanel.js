import PropTypes from 'prop-types';
import React from 'react';
import { capitalizeFirstLetter } from '../helpers';

const initialText = 'next';
let startTime = null;
let realKeyStrokesCount = 0;

let currentWordIndex = 0;
let currentWordTyped = '';
let wordsWithUncorrectedErrors = 0;

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

      textWords: initialText.split(' '),
    };

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.resetKeyStrokesCount = this.resetKeyStrokesCount.bind(this);
    this.restartSample = this.restartSample.bind(this);
    this.selectCharAtIndex = this.selectCharAtIndex.bind(this);

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.tickTimer = this.tickTimer.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.stopTimer();
    this.resetTimer();
  }

  calculateResults() {
    const {
      keyStrokesCount,
      text,
      textWords,
      timeFromStart: timeInSeconds,
    } = this.state;
    const timeInMinutes = timeInSeconds / 60;
    const textLength = text.length;

    // Calculate WPMs
    const grossWordsPerMinute = keyStrokesCount / 5 / timeInMinutes;
    const netWordsPerMinute =
      (keyStrokesCount / 5 - wordsWithUncorrectedErrors) / timeInMinutes;

    // Update Word Per Minute in higher level component
    this.props.updateWpm({
      last: { gross: grossWordsPerMinute, net: netWordsPerMinute },
    });

    // Print results summary
    console.log('');
    console.log('SAMPLE RESULTS');
    console.log('- timeInSeconds:', timeInSeconds);
    console.log('- timeInMinutes:', timeInMinutes);
    console.log('- textLength:', textLength);
    console.log('- keyStrokesCount:', keyStrokesCount);
    console.log('- wordsWithUncorrectedErrors:', wordsWithUncorrectedErrors);
    console.log('- realKeyStrokesCount:', realKeyStrokesCount);
    console.log('- grossWordsPerMinute:', grossWordsPerMinute);
    console.log('- netWordsPerMinute:', netWordsPerMinute);
    console.log('- text:', text);
    console.log('- textWords:', textWords);
    console.log('');
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
    const pressedKey = keyboardEvent.key;
    console.log('pressedKey:', pressedKey);

    // Restart sample with Escape
    if (pressedKey === 'Escape') {
      this.restartSample();
      return;
    }

    // Consider backspace in word errors tracking
    if (pressedKey === 'Backspace') {
      currentWordTyped = currentWordTyped.substring(
        0,
        currentWordTyped.length - 1
      );
      console.log('currentWordTyped:', currentWordTyped);
    }

    const keysNotToCount = [
      'Alt',
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Backspace',
      'CapsLock',
      'Control',
      'Delete',
      'Meta',
      'Shift',
      'Tab',
    ];

    // Skip special keys
    if (keysNotToCount.includes(pressedKey)) return;

    if (this.state.cursorIndex === 0 && !this.state.timerId) {
      this.startTimer();
      this.resetKeyStrokesCount();
      this.resetErrorsCount();
    }

    realKeyStrokesCount++;
    this.setState((state) => {
      return {
        keyStrokesCount: state.keyStrokesCount + 1,
      };
    });

    const selectedChar = this.state.textareaValue[this.state.cursorIndex];
    // console.log('selectedChar:', selectedChar);

    // Keep track of current word typed, to spot word errors
    currentWordTyped += pressedKey;
    console.log('currentWordTyped:', currentWordTyped);

    if (pressedKey === selectedChar) {
      // Start tracking new word for errors
      const isSampleEnd =
        this.state.cursorIndex + 1 >= this.state.textareaValue.length;
      if (pressedKey === ' ' || isSampleEnd) {
        // Count error if any
        const targetWord = this.state.textWords[currentWordIndex];
        console.log('targetWord:', targetWord);
        if (currentWordTyped.trim() !== targetWord) {
          wordsWithUncorrectedErrors++;
        }

        // Continue to next word
        currentWordIndex++;
        currentWordTyped = '';
      }

      // Move cursor if right char typed
      this.moveCursor();
    }
  }

  restartSample() {
    this.resetKeyStrokesCount();
    this.resetErrorsCount();
    this.resetWordTyped();
    this.selectCharAtIndex('textarea', 0);
    this.setState({
      cursorIndex: 0,
    });
    this.stopTimer();
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
        this.resetErrorsCount();
        this.selectCharAtIndex(targetName, this.state.cursorIndex);
      }
    );

    console.log('Adding keydown event listener...');
    document.addEventListener('keydown', this.handleKeydown);
  }

  moveCursor() {
    console.log('Moving cursor...');

    // Sample finished
    if (this.state.cursorIndex + 1 >= this.state.textareaValue.length) {
      this.stopTimer({ sampleFinished: true });
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
          // Start tracking new word for errors
          currentWordTyped = '';
          currentWordIndex = 0;

          await this.regenerateText();
          // this.resetKeyStrokesCount();
        }
        this.selectCharAtIndex('textarea', this.state.cursorIndex);
      }
    );
  }

  async regenerateText() {
    const generatedText = await this.fetchRandomText();
    console.log('generatedText:', generatedText);

    const text = generatedText || initialText;
    const textWords = text.split(' ');
    this.setState({ text, textareaValue: text, textWords });
  }

  resetErrorsCount() {
    wordsWithUncorrectedErrors = 0;
  }

  resetKeyStrokesCount() {
    realKeyStrokesCount = 0;
    this.setState({ keyStrokesCount: 0 });
  }

  resetTimer() {
    startTime = null;
    this.setState({ timeFromStart: 0 });
    this.stopTimer();
  }

  resetWordTyped() {
    currentWordIndex = 0;
    currentWordTyped = '';
  }

  selectCharAtIndex(name, index) {
    const element = this[`${name}Ref`].current;
    element.setSelectionRange(index, index + 1);
  }

  startTimer() {
    startTime = Date.now();
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
    }
    this.setState({ timeFromStart: 0 }, () => {
      const intervalId = setInterval(() => this.tickTimer(), 1000);
      this.setState({ timerId: intervalId });
    });
  }

  stopTimer(sampleFinished) {
    const realTimeElapsedInMilliseconds = Date.now() - startTime;
    const realTimeElapsedInSeconds = realTimeElapsedInMilliseconds / 1000;
    console.log('realTimeElapsedInSeconds:', realTimeElapsedInSeconds);
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
      this.setState(
        {
          keyStrokesCount: realKeyStrokesCount,
          timeFromStart: realTimeElapsedInSeconds,
          timerId: null,
        },
        () => {
          if (sampleFinished) {
            this.calculateResults();
          }
        }
      );
    }
  }

  tickTimer() {
    this.setState((state) => {
      return { timeFromStart: state.timeFromStart + 1 };
    });
  }

  render() {
    return (
      <>
        <div>
          time: {this.state.timeFromStart} | strokes:{' '}
          {this.state.keyStrokesCount} | errors:{wordsWithUncorrectedErrors}
        </div>
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
      </>
    );
  }
}

TyperPanel.propTypes = {
  config: PropTypes.object.isRequired,
  updateWpm: PropTypes.func.isRequired,
};

export default TyperPanel;
