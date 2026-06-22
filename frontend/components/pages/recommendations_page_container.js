import { connect } from 'react-redux';
import { RECEIVE_GAMES } from '../../actions/games_actions';
import RecommendationsPage from './recommendations_page';

const MSTP = (state) => ({ games: Object.values(state.entities.games), locale: state.locale });
const MDTP = (d) => ({
    receiveGames: (games) => d({ type: RECEIVE_GAMES, games }),
});

export default connect(MSTP, MDTP)(RecommendationsPage);
