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
      isTextareaOnFocus: true,
      text: initialText,
      textareaValue: '',
    };

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

    const selectedChar = this.state.textareaValue[this.state.cursorIndex];
    console.log('selectedChar:', selectedChar);
    if (pressedKey === selectedChar) {
      this.moveCursor();
    }
  }

  handleOnBlur(event) {
    const targetName = event.target.name;
    console.log('targetName:', targetName);

    this.setState({
      [`is${capitalizeFirstLetter(targetName)}OnFocus`]: false,
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
        this.selectCharAtIndex(targetName, this.state.cursorIndex);
      }
    );

    console.log('Adding keydown event listener...');
    document.addEventListener('keydown', this.handleKeydown);
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

  selectCharAtIndex(name, index) {
    const element = this[`${name}Ref`].current;
    element.setSelectionRange(index, index + 1);
  }

  render() {
    return (
      <>
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
      </>
    );
  }
}

TyperPanel.propTypes = {
  config: PropTypes.object.isRequired,
};

export default TyperPanel;
