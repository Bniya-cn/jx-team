import React from 'react';
import StaticPageLayout from '../shared/static_page_layout';
import GamesIndexItem from '../games/index/games_index_item';
import { t } from '../../util/i18n';

class RecommendationsPage extends React.Component {
    componentDidMount() {
        $.ajax({ method: 'GET', url: '/api/recommendations' }).done((games) => {
            this.props.receiveGames(games);
        });
    }

    render() {
        const games = this.props.games || [];
        const locale = this.props.locale || 'zh';
        return (
            <StaticPageLayout title={t('recommendations_title', locale)}>
                <p>{t('recommendations_description', locale)}</p>
                <ul className="browse-list">
                    {games.map((game) => {
                        const titleCard = Object.values(game.gameImages).filter((img) => img.img_type === 'title-card');
                        return (
                            <li key={game.id}>
                                <GamesIndexItem isActive={false} titleCard={titleCard} game={game} locale={locale} />
                            </li>
                        );
                    })}
                </ul>
                {games.length === 0 && <p>{t('recommendations_empty', locale)}</p>}
            </StaticPageLayout>
        );
    }
}

export default RecommendationsPage;
