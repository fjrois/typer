import React from 'react';

const initialText = 'This is the initial text';

class Typer extends React.Component {
  inputRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { textareaValue: '', inputValue: '', isInputOnFocus: true };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.selectFirstChar = this.selectFirstChar.bind(this);
  }

  handleValueChange(event) {
    console.log(event.target.name);
    const propertyName = event.target.name;
    const updatedValue = event.target.value;
    this.setState({ [`${propertyName}Value`]: updatedValue });
  }

  handleFocusChange(event) {
    const { type } = event;
    console.log(event);
    const updatedIsInputOnFocus = type === 'focus';
    const updatedInputValue = updatedIsInputOnFocus ? initialText : '';
    this.setState(
      {
        isInputOnFocus: updatedIsInputOnFocus,
        inputValue: updatedInputValue,
      },
      () => {
        console.log(event.target.selectionStart);
        this.selectFirstChar();
      }
    );
  }

  selectFirstChar() {
    // console.log('aqui');
    const input = this.inputRef.current;
    console.log('here', input.value);
    input.setSelectionRange(0, 1);
  }

  render() {
    return (
      <>
        <p>Typer</p>
        <textarea
          name="textarea"
          value={this.state.textareaValue}
          onChange={this.handleValueChange}
        />
        <input
          ref={this.inputRef}
          name="input"
          type="text"
          value={this.state.inputValue}
          onChange={this.handleValueChange}
          autoFocus
          placeholder={initialText}
          onFocus={this.handleFocusChange}
          onBlur={this.handleFocusChange}
          onClick={this.selectFirstChar}
          size="23"
        />
      </>
    );
  }
}

export default Typer;
