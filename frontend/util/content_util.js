export const fetchNewsItems = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/news_items',
    });
};

export const fetchCuratorPicks = () => {
    return $.ajax({
        method: 'GET',
        url: '/api/curator_picks',
    });
};
