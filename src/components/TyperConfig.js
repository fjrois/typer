import React from 'react';
import PropTypes from 'prop-types';

function TyperConfig(props) {
  const handleOnChange = (event) => {
    const target = event.target;
    console.log('target:', target);
    const name = target.name;
    console.log('name:', name);

    let value = target.type === 'checkbox' ? target.checked : target.value;
    if (target.type === 'number') {
      value = parseInt(value);
    }
    console.log('value:', value);

    props.handleOnChange({ [name]: value });
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
      <div>
        <input
          type="checkbox"
          name="lowercase"
          value={lowercase}
          onChange={handleOnChange}
        />
        <label htmlFor="lowercase">lowercase</label>
      </div>
      <div>
        <input
          type="number"
          name="numberOfParagraphs"
          value={numberOfParagraphs}
          onChange={handleOnChange}
        />
        <label htmlFor="paragraphs">paragraphs</label>
      </div>
      <div>
        <input
          type="number"
          name="maxWords"
          value={maxWords}
          onChange={handleOnChange}
        />
        <label htmlFor="maxWords">maxWords</label>
      </div>
      <div>
        <input
          type="number"
          name="minWords"
          value={minWords}
          onChange={handleOnChange}
        />
        <label htmlFor="minWords">minWords</label>
      </div>
      <div>
        <select name="textType" value={textType} onChange={handleOnChange}>
          <option value="gibberish">Gibberish</option>
          <option value="lorem">Lorem</option>
        </select>
        <label htmlFor="textType">textType</label>
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
