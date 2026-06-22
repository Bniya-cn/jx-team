export const fetchAdminDashboard = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/admin/dashboard',
    });
};

export const fetchAdminGames = (query = '') => {
    return $.ajax({
        method: 'GET',
        url: '/api/admin/games',
        data: query ? { query } : {},
    });
};

export const updateAdminGame = (gameId, game) => {
    return $.ajax({
        method: 'PATCH',
        url: `/api/admin/games/${gameId}`,
        data: { game },
    });
};

export const fetchAdminGenres = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/admin/genres',
    });
};

export const fetchAdminNewsItems = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/admin/news_items',
    });
};

export const updateAdminNewsItem = (id, news_item) => {
    return $.ajax({
        method: 'PATCH',
        url: `/api/admin/news_items/${id}`,
        data: { news_item },
    });
};

export const fetchAdminCuratorPicks = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/admin/curator_picks',
    });
};

export const updateAdminCuratorPick = (id, curator_pick) => {
    return $.ajax({
        method: 'PATCH',
        url: `/api/admin/curator_picks/${id}`,
        data: { curator_pick },
    });
};
