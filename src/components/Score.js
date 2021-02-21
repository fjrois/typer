import PropTypes from 'prop-types';

export default function Score(props) {
  return (
    <fieldset className="score">
      <legend>{props.name}</legend>
      <span className={`score-value score-value-${props.name}`}>
        {props.value}
      </span>
    </fieldset>
  );
}

Score.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
