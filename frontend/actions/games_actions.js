import * as GamesUtil from "../util/games_util"

export const RECEIVE_GAMES = "RECEIVE_GAMES";
export const RECEIVE_GAME = "RECEIVE_GAME";
export const RECEIVE_FEATURED_GAMES = "RECEIVE_FEATURED_GAMES";

const receiveGames = (games) => {
    return {
        type: RECEIVE_GAMES,
        games,
    }
}

const receiveGame = (game) => {
    return {
        type: RECEIVE_GAME,
        game,
    }
}

export const requestAllGames = () => dispatch => {
    return (
        GamesUtil.getAllGames().then((games) => dispatch(receiveGames(games)))
    )
}

export const requestOneGame = (gameId) => dispatch => {
    return (
        GamesUtil.getOneGame(gameId).then((game) => dispatch(receiveGame(game)))
    )
}

export const requestFeaturedGames = () => dispatch => {
    return (
        GamesUtil.getFeaturedGames().then((games) => dispatch(receiveGames(games)))
    )
}

// 浏览页 filter 映射为 API 查询参数
const BROWSE_FILTER_PARAMS = {
    new: { sort: 'new' },
    featured: { featured: 'true' },
    upcoming: { filter: 'upcoming' },
    specials: { filter: 'specials' },
    controller: { filter: 'controller' },
    vr: { genre: 'vr' },
};

export const requestBrowseGames = (filter) => (dispatch) => {
    let params;
    if (filter.startsWith('tag-')) {
        params = { tag: filter.slice(4) };
    } else if (filter.startsWith('dev-')) {
        params = { developer: decodeURIComponent(filter.slice(4)) };
    } else if (filter.startsWith('pub-')) {
        params = { publisher: decodeURIComponent(filter.slice(4)) };
    } else {
        params = BROWSE_FILTER_PARAMS[filter] || { genre: filter };
    }
    return GamesUtil.getFilteredGames(params).then((games) => dispatch(receiveGames(games)));
};