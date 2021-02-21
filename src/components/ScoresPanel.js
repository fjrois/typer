import PropTypes from 'prop-types';
import Score from './Score';
import { formatDecimalNumber } from '../helpers';

export default function ScoresPanel(props) {
  const { last: lastWpm, best: bestWpm } = props.wpm;
  return (
    <>
      <div className="scores-panel">
        {/* <p>This is the score</p>
      <br />
      Last GROSS WPM: {formatDecimalNumber(lastWpm.gross)}
      <br />
      Last NET WPM: {formatDecimalNumber(lastWpm.net)}
      Accuracy (GWPM/NWPM):{' '}
      {lastWpm.net && lastWpm.gross
        ? formatDecimalNumber((lastWpm.net / lastWpm.gross) * 100) + '%'
        : ''}
      <br />
      Best GROSS WPM: {formatDecimalNumber(bestWpm.gross)}
      <br />
      Best NET WPM: {formatDecimalNumber(bestWpm.net)}
      <br /> */}
        <Score name={'last'} value={formatDecimalNumber(lastWpm.net)} />
        <Score name={'best'} value={formatDecimalNumber(bestWpm.net)} />
      </div>
    </>
  );
}

Score.propTypes = {
  wpm: PropTypes.object.isRequired,
};
