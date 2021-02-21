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
      <div className="config">
        <form>
          <fieldset>
            <legend>Configuration</legend>
            <div className="config-row">
              <label htmlFor="lowercase">lowercase</label>
              <input
                type="checkbox"
                name="lowercase"
                value={lowercase}
                onChange={handleOnChange}
              />
            </div>
            <br />

            <div className="config-row">
              <label htmlFor="paragraphs">paragraphs</label>
              <input
                type="range"
                name="numberOfParagraphs"
                value={numberOfParagraphs}
                onChange={handleOnChange}
                min="1"
                max="20"
              />
              <input
                type="number"
                name="numberOfParagraphs"
                value={numberOfParagraphs}
                onChange={handleOnChange}
                min="1"
                max="20"
                disabled
              />
            </div>
            <br />

            {/* <label htmlFor="maxWords">maxWords</label>
            <input
              type="number"
              name="maxWords"
              value={maxWords}
              onChange={handleOnChange}
            />
            <br /> */}
            <div className="config-row">
              <label htmlFor="maxWords">maxWords</label>
              <input
                type="range"
                name="maxWords"
                value={maxWords}
                onChange={handleOnChange}
                min="1"
                max="99"
              />
              <input
                type="number"
                name="maxWords"
                value={maxWords}
                onChange={handleOnChange}
                min="1"
                max="99"
                disabled
              />
            </div>
            <br />

            {/* <label htmlFor="minWords">minWords</label>
            <input
              type="number"
              name="minWords"
              value={minWords}
              onChange={handleOnChange}
            />
            <br /> */}
            <div className="config-row">
              <label htmlFor="minWords">minWords</label>
              <input
                type="range"
                name="minWords"
                value={minWords}
                onChange={handleOnChange}
                min="1"
                max="99"
              />
              <input
                type="number"
                name="minWords"
                value={minWords}
                onChange={handleOnChange}
                min="1"
                max="99"
                disabled
              />
            </div>
            <br />

            <label htmlFor="textType">textType</label>
            <select name="textType" value={textType} onChange={handleOnChange}>
              <option value="gibberish">Gibberish</option>
              <option value="lorem">Lorem</option>
            </select>
            <br />
            <br />

            <button type="submit">Apply</button>
          </fieldset>
        </form>
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
