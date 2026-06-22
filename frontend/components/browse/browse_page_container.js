import { connect } from 'react-redux';
import { requestBrowseGames } from '../../actions/games_actions';
import BrowsePage from './browse_page';

const MSTP = (state, ownProps) => {
    const filter = ownProps.match.params.filter || '';
    const allGames = Object.values(state.entities.games);

    let filteredGames = allGames;

    if (filter === 'new') {
        filteredGames = allGames.slice().sort((a, b) => {
            const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
            const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
            return dateB - dateA;
        });
    } else if (filter === 'featured') {
        filteredGames = allGames.filter(game => game.featured);
    } else if (filter === 'upcoming') {
        filteredGames = allGames.filter(game => game.release_date && new Date(game.release_date) > new Date());
    } else if (filter === 'specials') {
        filteredGames = allGames.filter(game => game.sale_price !== null && game.sale_price !== undefined);
    } else if (filter === 'controller') {
        filteredGames = allGames.filter(game => game.controller_support);
    } else if (filter === 'vr') {
        filteredGames = allGames.filter(game => {
            const gameGenre = (game.genre || '').toLowerCase();
            const gameGenres = (game.genres || []).map(g => g.toLowerCase());
            return gameGenre === 'vr' || gameGenres.includes('vr');
        });
    } else if (filter.startsWith('tag-')) {
        const tagSlug = filter.slice(4).toLowerCase();
        filteredGames = allGames.filter(game => {
            const gameTags = (game.tags || []).map(t => t.toLowerCase());
            return gameTags.includes(tagSlug);
        });
    } else if (filter.startsWith('dev-')) {
        const developer = decodeURIComponent(filter.slice(4)).toLowerCase();
        filteredGames = allGames.filter(game => (game.developer || '').toLowerCase() === developer);
    } else if (filter.startsWith('pub-')) {
        const publisher = decodeURIComponent(filter.slice(4)).toLowerCase();
        filteredGames = allGames.filter(game => (game.publisher || '').toLowerCase() === publisher);
    } else {
        // It's a category/genre slug
        const filterLower = filter.toLowerCase();
        filteredGames = allGames.filter(game => {
            const gameGenre = (game.genre || '').toLowerCase();
            const gameGenres = (game.genres || []).map(g => g.toLowerCase());
            return gameGenre === filterLower || gameGenres.includes(filterLower);
        });
    }

    return {
        games: filteredGames,
        locale: state.locale,
    };
};

const MDTP = (dispatch) => ({
    requestBrowseGames: (filter) => dispatch(requestBrowseGames(filter)),
});

export default connect(MSTP, MDTP)(BrowsePage);

