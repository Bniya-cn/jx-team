import React from 'react';
import { Link } from 'react-router-dom';
import {
    getLocalizedGameTitle,
    getPriceLabel,
    getOriginalPriceLabel,
    getDiscountLabel,
    getTitleCardImage,
} from '../../../util/game_helpers';
import { t, genreLabel } from '../../../util/i18n';

class PersonalRecommendations extends React.Component {
    render() {
        const { games, locale = 'zh' } = this.props;
        if (!games || games.length === 0) return null;

        return (
            <div className="personal-recommendations-container stage-panel" style={{ '--enter-delay': '110ms' }}>
                <div className="rec-header">
                    <h2>{t('for_you', locale)}</h2>
                    <Link to="/recommendations" className="see-more-btn">{t('see_more', locale).replace('：', '')}</Link>
                </div>

                <div className="recommendations-row">
                    {games.map((game) => {
                        const titleCard = getTitleCardImage(game);
                        const imageUrl = titleCard ? titleCard.img_url : game.headerImage;
                        const originalPriceLabel = getOriginalPriceLabel(game);
                        const discountLabel = getDiscountLabel(game);
                        const primaryGenre = (game.genres && game.genres[0]) || game.genre;

                        return (
                            <Link to={`/api/games/${game.id}`} key={`rec-${game.id}`} className="rec-card">
                                <div className="image-box">
                                    <img src={imageUrl} alt={game.title} />
                                    {discountLabel && <div className="card-discount-badge">{discountLabel}</div>}
                                </div>
                                <div className="card-info">
                                    <h4 className="no-translate">{getLocalizedGameTitle(game, locale)}</h4>
                                    <p className="card-genre">{genreLabel(primaryGenre, locale)}</p>
                                    <div className="card-price-row">
                                        {originalPriceLabel && (
                                            <span className="card-original-price">{originalPriceLabel}</span>
                                        )}
                                        <span className="card-current-price">{getPriceLabel(game, '¥', locale)}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default PersonalRecommendations;
