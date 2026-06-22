import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { getPriceLabel, getReleaseDateLabel, getScreenshotImages, getTitleCardImage, getLocalizedGameTitle } from '../../util/game_helpers';
import { t } from '../../util/i18n';

class ShoppingCartItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePicIdx: 0,
        };
        this.intervalId = null;
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({
                activePicIdx:
                    this.state.activePicIdx === Object.values(this.props.game.gameImages).length - 2
                        ? 0
                        : this.state.activePicIdx + 1,
            });
        }, 2 * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    render() {
        const { game, locale = 'zh' } = this.props;
        const titleCard = getTitleCardImage(game);
        const screenshots = getScreenshotImages(game);
        const reviewNum = game && game.id * 1047 + 453;

        return (
            <div className="shopping-cart-item">
                <div className="left-side">
                    <Link to={`/api/games/${game.id}`}>
                        <div className="title-card">
                            {titleCard && <img className="title-card" src={titleCard.img_url} alt={getLocalizedGameTitle(game, locale)} />}
                        </div>
                    </Link>
                    <Link to={`/api/games/${game.id}`}>
                        <div className="title">{getLocalizedGameTitle(game, locale)}</div>
                    </Link>
                </div>
                <div className="right-side">
                    <div className="icons">
                        <i className="fab fa-windows"></i>
                        <i className="fab fa-apple"></i>
                    </div>
                    <div className="price-remove">
                        <p className="price">{getPriceLabel(game, '¥', locale)}</p>
                        <p className="remove" onClick={() => this.props.handleRemoveOneItem(game.id)}>
                            {t('cart_remove', locale)}
                        </p>
                    </div>
                </div>

                <div className="sc-item-detail">
                    <h4>{getLocalizedGameTitle(game, locale)}</h4>
                    <p>{getReleaseDateLabel(game, locale)}</p>
                    <img className="screenshot" src={screenshots[this.state.activePicIdx].img_url} alt="" />
                    <div className="review-box">
                        <p>{t('user_reviews', locale)}</p>
                        <p>
                            <span>{t('mostly_positive', locale)}</span>({reviewNum})
                        </p>
                    </div>
                    <div className="tag-box">
                        <p>{t('cart_user_tags', locale)}</p>
                        <div className="tags">
                            <div className="tag">Action</div>
                            <div className="tag">Indie</div>
                            <div className="tag">Adventure</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShoppingCartItem;
