import { connect } from 'react-redux';
import { requestAllGames } from '../../actions/games_actions';
import { fetchUser } from '../../actions/user_actions';
import DiscoverPage from './discover_page';

const MSTP = (state) => {
    const userId = state.session.id;
    const ownedGames = userId && state.entities.users[userId] ? state.entities.users[userId].ownedGames : [];

    return {
        games: Object.values(state.entities.games),
        currentUserId: userId,
        ownedGameIds: ownedGames ? ownedGames.map((g) => g.id) : [],
        locale: state.locale,
    };
};

const MDTP = (dispatch) => ({
    requestAllGames: () => dispatch(requestAllGames()),
    fetchUser: (userId) => dispatch(fetchUser(userId)),
});

export default connect(MSTP, MDTP)(DiscoverPage);
