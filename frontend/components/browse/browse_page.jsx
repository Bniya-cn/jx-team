import React from 'react';
import { Link } from 'react-router-dom';
import GamesIndexItem from '../games/index/games_index_item';
import Sidebar from '../sidebar/sidebar';
import { genreLabel, t, tf } from '../../util/i18n';

const FILTER_TITLE_KEYS = {
    new: 'new_releases',
    featured: 'sidebar_top_sellers',
    upcoming: 'sidebar_upcoming',
    specials: 'sidebar_specials',
    controller: 'sidebar_controller',
};

class BrowsePage extends React.Component {
    componentDidMount() {
        this.props.requestBrowseGames(this.props.match.params.filter);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.filter !== this.props.match.params.filter) {
            this.props.requestBrowseGames(this.props.match.params.filter);
        }
    }

    render() {
        const { filter } = this.props.match.params;
        const locale = this.props.locale || 'zh';
        let title = FILTER_TITLE_KEYS[filter] ? t(FILTER_TITLE_KEYS[filter], locale) : genreLabel(filter, locale);

        if (!FILTER_TITLE_KEYS[filter] && !filter.startsWith('tag-') && !filter.startsWith('dev-') && !filter.startsWith('pub-')) {
            title = genreLabel(filter, locale);
        }
        if (filter.startsWith('tag-')) title = `${t('browse_tag_prefix', locale)}${filter.slice(4)}`;
        if (filter.startsWith('dev-')) title = `${t('browse_developer_prefix', locale)}${decodeURIComponent(filter.slice(4))}`;
        if (filter.startsWith('pub-')) title = `${t('browse_publisher_prefix', locale)}${decodeURIComponent(filter.slice(4))}`;
        const games = this.props.games || [];

        const mappedGames = games.map((game, idx) => {
            return (
                <li key={`browse-${game.id}`} className="stagger-item" style={{ '--stagger-index': idx }}>
                    <GamesIndexItem isActive={false} game={game} compact locale={locale} />
                </li>
            );
        });

        return (
            <div className="homepage browse-page">
                <Sidebar />
                <div className="main-content">
                    <div className="browse-header stage-panel" style={{ '--enter-delay': '50ms' }}>
                        <p>
                            <Link to="/">{t('nav_store', locale)}</Link> {'>'} {title}
                        </p>
                        <h2>{title || t('browse_default', locale)}</h2>
                        <p className="browse-count">{tf('browse_count', locale, { count: games.length })}</p>
                    </div>
                    {games.length > 0 ? (
                        <ul className="browse-list stagger-list" style={{ '--stagger-offset': '120ms' }}>
                            {mappedGames}
                        </ul>
                    ) : (
                        <p className="browse-empty stage-panel" style={{ '--enter-delay': '120ms' }}>
                            {t('browse_empty', locale)}
                        </p>
                    )}
                </div>
            </div>
        );
    }
}

export default BrowsePage;
