import { connect } from 'react-redux';
import { requestAllGames } from '../../../actions/games_actions';
import GamesIndex from './games_index';

const MSTP = (state) => {
    const reviews = Object.values(state.entities.reviews);
    const reviewCounts = {};
    reviews.forEach((r) => {
        const gid = r.game_id;
        reviewCounts[gid] = (reviewCounts[gid] || 0) + 1;
    });

    return {
        games: Object.values(state.entities.games),
        reviewCounts,
        locale: state.locale,
    };
};

const MDTP = dispatch => {
    return {
        requestAllGames: () => dispatch(requestAllGames())
    }
}

export default connect(MSTP, MDTP)(GamesIndex)