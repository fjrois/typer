import TyperConfig from './TyperConfig';
import React from 'react';
import { capitalizeFirstLetter } from '../helpers';

const initialText = 'next';

class Typer extends React.Component {
  inputRef = React.createRef();
  textareaRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      cursorIndex: 0,
      config: {
        lowercase: false,
        numberOfParagraphs: 1,
        maxWords: 2,
        minWords: 1,
        textType: 'gibberish', // 'gibberish' or 'lorem';
      },
      inputValue: '',
      isInputOnFocus: false,
      isTextareaOnFocus: true,
      text: initialText,
      textareaValue: '',
    };

    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.selectCharAtIndex = this.selectCharAtIndex.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown(keyboardEvent) {
    const pressedKey = keyboardEvent.key;
    console.log('pressedKey:', pressedKey);

    const selectedChar = this.state.textareaValue[this.state.cursorIndex];
    console.log('selectedChar:', selectedChar);
    if (pressedKey === selectedChar) {
      this.moveCursor();
    }
  }

  moveCursor() {
    console.log('moving cursor');

    this.setState(
      (state) => {
        console.log('state.cursorIndex + 1:', state.cursorIndex + 1);
        console.log('state.text:', state.text);
        console.log('state.textareaValue.length:', state.textareaValue.length);
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
        }
        console.log('this.state.cursorIndex:', this.state.cursorIndex);
        this.selectCharAtIndex('textarea', this.state.cursorIndex);
      }
    );
  }

  async regenerateText() {
    const generatedText = await this.fetchRandomText();
    console.log('generatedText:', generatedText);
    // console.log('JSON.parse(generatedText):', JSON.parse(generatedText));

    const text = generatedText || initialText;
    this.setState({ text, textareaValue: text });
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
      } = this.state.config;

      const baseUrl = 'http://www.randomtext.me/api';
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

  handleConfigChange(configUpdates) {
    console.log('configUpdates:', configUpdates);
    this.setState((state) => {
      const config = { ...state.config, ...configUpdates };
      return { config };
    });
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
        this.selectCharAtIndex(targetName, this.state.cursorIndex);
      }
    );

    console.log('Adding keydown event listener...');
    document.addEventListener('keydown', this.handleKeydown);
  }

  handleOnBlur(event) {
    const targetName = event.target.name;
    console.log('targetName:', targetName);

    this.setState(
      (state) => {
        return {
          [`is${capitalizeFirstLetter(targetName)}OnFocus`]: false,
          // [`${targetName}Value`]: state.text,
        };
      },
      () => {
        // this.selectCharAtIndex(targetName, 0);
      }
    );

    console.log('Removing keydown event listener...');
    document.removeEventListener('keydown', this.handleKeydown);
  }

  selectCharAtIndex(name, index) {
    // console.log('selectCharAtIndex name:', name);
    // console.log('selectCharAtIndex index:', index);
    const element = this[`${name}Ref`].current;
    // console.log('element.value:', element.value);
    element.setSelectionRange(index, index + 1);
  }

  render() {
    return (
      <>
        <p>Typer</p>
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
            // onClick={() => this.selectCharAtIndex('textarea', 0)}
          />
        </div>
        <div>
          <TyperConfig
            config={this.state.config}
            handleOnChange={this.handleConfigChange}
          />
        </div>
        <div>
          <input
            ref={this.inputRef}
            name="input"
            type="text"
            size="23"
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            // autoFocus
            placeholder={initialText}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            onClick={() => this.selectCharAtIndex('input', 0)}
          />
        </div>
      </>
    );
  }
}

export default Typer;
