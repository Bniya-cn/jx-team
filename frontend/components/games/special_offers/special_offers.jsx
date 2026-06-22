import React from 'react';
import { Link } from 'react-router-dom';
import {
    getLocalizedGameTitle,
    getPriceLabel,
    getOriginalPriceLabel,
    getDiscountLabel,
    getTitleCardImage,
} from '../../../util/game_helpers';
import { t } from '../../../util/i18n';

class SpecialOffers extends React.Component {
    render() {
        const { games, locale = 'zh' } = this.props;
        if (!games || games.length < 3) return null;

        const mainGame = games[0];
        const rightGames = games.slice(1, 3);

        const mainTitleCard = getTitleCardImage(mainGame);
        const mainImageUrl = mainTitleCard ? mainTitleCard.img_url : mainGame.headerImage;

        return (
            <div className="special-offers-container stage-panel" style={{ '--enter-delay': '100ms' }}>
                <div className="special-offers-header">
                    <h2>{t('today_deals', locale)}</h2>
                    <Link to="/browse/specials" className="see-more-btn">{t('see_more', locale).replace('：', '')}</Link>
                </div>
                
                <div className="special-offers-grid">
                    {/* Left side: Large featured card */}
                    <div className="offers-left">
                        <Link to={`/api/games/${mainGame.id}`} className="large-offer-card">
                            <div className="image-wrapper">
                                <img src={mainImageUrl} alt={mainGame.title} />
                                <div className="promo-badge">{t('today_deals', locale)}</div>
                            </div>
                            <div className="offer-details">
                                <h3 className="no-translate">{getLocalizedGameTitle(mainGame, locale)}</h3>
                                <div className="price-row">
                                    <div className="discount-pct">{getDiscountLabel(mainGame)}</div>
                                    <div className="price-group">
                                        <span className="original-price">{getOriginalPriceLabel(mainGame)}</span>
                                        <span className="current-price">{getPriceLabel(mainGame, '¥', locale)}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right side: Two stacked horizontal items */}
                    <div className="offers-right">
                        {rightGames.map((game) => {
                            const titleCard = getTitleCardImage(game);
                            const imageUrl = titleCard ? titleCard.img_url : game.headerImage;
                            return (
                                <Link to={`/api/games/${game.id}`} key={`offer-sub-${game.id}`} className="small-offer-card">
                                    <div className="image-wrapper">
                                        <img src={imageUrl} alt={game.title} />
                                    </div>
                                    <div className="offer-info">
                                        <h3 className="no-translate">{getLocalizedGameTitle(game, locale)}</h3>
                                        <div className="price-row">
                                            <div className="discount-pct">{getDiscountLabel(game)}</div>
                                            <div className="price-group">
                                                <span className="original-price">{getOriginalPriceLabel(game)}</span>
                                                <span className="current-price">{getPriceLabel(game, '¥', locale)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SpecialOffers;
