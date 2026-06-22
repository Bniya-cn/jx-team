import React from 'react';
import { Link } from 'react-router-dom';
import { getScreenshotImages, getLocalizedGameTitle } from '../../../util/game_helpers';
import { t, genreLabel } from '../../../util/i18n';

export default (props) => {
    const { game, reviewCount = 0, locale = 'zh' } = props;
    const screenshots = getScreenshotImages(game, 4);
    const genreLabelText = genreLabel(game.genre, locale);

    return (
        <div className={props.isActive ? 'active' : 'hidden'}>
            <div className="game-detail-tab">
                <div className="top-part">
                    <h3 className="no-translate">{getLocalizedGameTitle(game, locale)}</h3>
                    <div className="review-box">
                        <p>{t('user_reviews', locale)}</p>
                        <p>
                            <span>
                                {reviewCount > 0 ? t('mostly_positive', locale) : t('no_reviews', locale)}{' '}
                            </span>
                            {reviewCount > 0 ? `(${reviewCount})` : ''}
                        </p>
                    </div>
                    {game.genre && (
                        <Link className="categories" to={`/browse/${game.genre}`}>
                            {genreLabelText}
                        </Link>
                    )}
                </div>
                <div className="image-list">
                    <ul>
                        {screenshots.map((pic) => {
                            return (
                                <li key={`index-img-${pic.id}`}>
                                    <div className="game-index-screenshots">
                                        <img src={pic.img_url} alt="" />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};
