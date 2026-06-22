import { getDescriptionLocalized } from './game_descriptions_zh';

const normalizeGame = (game) => {
    if (!game) return game;

    const appid = game.appid || game.id;
    const genreList = Array.isArray(game.genres) && game.genres.length > 0 ? game.genres : game.genre ? [game.genre] : [];
    const primaryGenre = game.genre || genreList[0] || 'indie';
    const releaseDate = game.releaseDate || '';
    const shortDescription = game.shortDescription || game.description || '';
    const originalPrice = game.sale_price != null && game.sale_price < game.price ? game.price : null;
    const discount =
        game.sale_price != null && game.sale_price < game.price
            ? Math.round((1 - game.sale_price / game.price) * 100)
            : 0;

    return {
        ...game,
        appid,
        name: game.title,
        shortDescription,
        descriptionZh: getDescriptionLocalized(appid, 'zh'),
        descriptionJa: getDescriptionLocalized(appid, 'ja'),
        descriptionKo: getDescriptionLocalized(appid, 'ko'),
        developers: game.developer ? [game.developer] : [],
        publishers: game.publisher ? [game.publisher] : [],
        genre: primaryGenre,
        genres: genreList,
        releaseDate,
        originalPrice,
        discount,
    };
};

const normalizeGameMap = (games = {}) => {
    return Object.entries(games).reduce((acc, [id, game]) => {
        acc[id] = normalizeGame(game);
        return acc;
    }, {});
};

export const getAllGames = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/games',
    }).then(normalizeGameMap);
};

export const getOneGame = (gameId) => {
    return $.ajax({
        method: 'GET',
        url: `/api/games/${gameId}`,
    }).then(normalizeGame);
};

export const getFeaturedGames = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/games/featured',
    }).then(normalizeGameMap);
};

export const getFilteredGames = (params = {}) => {
    return $.ajax({
        method: 'GET',
        url: '/api/games',
        data: params,
    }).then(normalizeGameMap);
};
