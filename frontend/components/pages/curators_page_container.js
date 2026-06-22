import { connect } from 'react-redux';
import { requestAllGames } from '../../actions/games_actions';
import CuratorsPage from './curators_page';

const MSTP = (state) => ({ games: Object.values(state.entities.games), locale: state.locale });
const MDTP = (d) => ({ requestAllGames: () => d(requestAllGames()) });

export default connect(MSTP, MDTP)(CuratorsPage);
