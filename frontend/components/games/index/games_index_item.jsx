import React from 'react';
import { Link } from 'react-router-dom';
import {
    getDiscountLabel,
    getOriginalPriceLabel,
    getPriceLabel,
    getScreenshotImages,
    getTitleCardImage,
    getLocalizedGameTitle,
} from '../../../util/game_helpers';
import { genreLabel, t } from '../../../util/i18n';
import GameIndexDetail from './games_index_detail';

class GamesIndexItem extends React.Component {
    render() {
        const { game, isActive, compact, reviewCount = 0, locale = 'zh' } = this.props;
        const titleCard = getTitleCardImage(game);
        const previewImages = getScreenshotImages(game, 3);
        const priceLabel = getPriceLabel(game, '¥', locale);
        const originalPriceLabel = getOriginalPriceLabel(game);
        const discountLabel = getDiscountLabel(game);
        const primaryGenre = (game.genres && game.genres[0]) || game.genre;

        return (
            <div className={isActive ? 'active' : 'inactive'} style={{ position: 'relative' }}>
                <Link to={`/api/games/${game.id}`}>
                    <div className="games-index-item">
                        <div className="games-index-item-left">
                            <div className="titleCard-box">
                                {titleCard && <img src={titleCard.img_url} alt={game.title} />}
                            </div>
                            <div className="games-index-item-words">
                                <h4 id="index-title">{game.title}</h4>
                                <i className="fab fa-windows"></i>
                                <p>{genreLabel(primaryGenre, locale)}</p>
                                {!compact && (
                                    <p className="game-summary">{game.shortDescription || game.description}</p>
                                )}
                                {!compact && (
                                    <div className="game-preview-strip">
                                         {previewImages.map((image) => {
                                             return (
                                                 <img key={image.id} src={image.img_url} alt={`${getLocalizedGameTitle(game, locale)} ${t('cover_alt', locale)}`} />
                                             );
                                         })}
                                     </div>
                                )}
                            </div>
                        </div>
                        <div className="games-index-item-price">
                            <p id="price">{priceLabel}</p>
                            {(originalPriceLabel || discountLabel) && (
                                <div className="price-meta">
                                    {originalPriceLabel && <span className="original-price">{originalPriceLabel}</span>}
                                    {discountLabel && <span className="discount-badge">{discountLabel}</span>}
                                </div>
                            )}
                        </div>
                        <div className={`${isActive ? 'index-bridge-active' : 'index-bridge-hidden'}`}></div>
                    </div>
                </Link>
                
                {/* Render the details preview panel next to the item when active */}
                {isActive && (
                    <div className="index-right-side">
                        <GameIndexDetail
                            isActive={true}
                            game={game}
                            reviewCount={reviewCount}
                            locale={locale}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default GamesIndexItem;
