import React from 'react';
import PropTypes from 'prop-types';

function TyperConfig(props) {
  const handleOnChange = (event) => {
    const target = event.target;

    let value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.type === 'number') {
      value = parseInt(value);
    }
    console.log('value:', value);

    props.handleOnChange({ [target.name]: value });
  };

  const {
    lowercase,
    numberOfParagraphs,
    maxWords,
    minWords,
    textType,
  } = props.config;
  return (
    <>
      <div className="typer-config-panel">
        <div>
          <label htmlFor="lowercase">lowercase</label>
          <input
            type="checkbox"
            name="lowercase"
            value={lowercase}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="paragraphs">paragraphs</label>
          <input
            type="number"
            name="numberOfParagraphs"
            value={numberOfParagraphs}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="maxWords">maxWords</label>
          <input
            type="number"
            name="maxWords"
            value={maxWords}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="minWords">minWords</label>
          <input
            type="number"
            name="minWords"
            value={minWords}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="textType">textType</label>
          <select name="textType" value={textType} onChange={handleOnChange}>
            <option value="gibberish">Gibberish</option>
            <option value="lorem">Lorem</option>
          </select>
        </div>
      </div>
    </>
  );
}

TyperConfig.propTypes = {
  config: PropTypes.shape({
    lowercase: PropTypes.bool.isRequired,
    numberOfParagraphs: PropTypes.number.isRequired,
    maxWords: PropTypes.number.isRequired,
    minWords: PropTypes.number.isRequired,
    textType: PropTypes.string.isRequired,
  }),
  handleOnChange: PropTypes.func.isRequired,
};

export default TyperConfig;
