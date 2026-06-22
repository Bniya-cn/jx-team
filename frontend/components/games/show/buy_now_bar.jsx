import React from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist, isInWishlist, removeFromWishlist } from '../../../util/wishlist_util';
import { getPriceLabel, getLocalizedGameTitle } from '../../../util/game_helpers';
import { t } from '../../../util/i18n';

class BuyNowBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inWishlist: props.currentUserId ? isInWishlist(props.currentUserId, props.game.id) : false,
            cartConfirmed: false,
            wishlistFlash: null,
        };
        this.addToCart = this.addToCart.bind(this);
        this.toggleWishlist = this.toggleWishlist.bind(this);
        this.flashCartConfirmation = this.flashCartConfirmation.bind(this);
        this.flashWishlistState = this.flashWishlistState.bind(this);

        this.cartTimerId = null;
        this.wishlistTimerId = null;
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.currentUserId !== this.props.currentUserId ||
            prevProps.game.id !== this.props.game.id
        ) {
            this.setState({
                inWishlist: this.props.currentUserId ? isInWishlist(this.props.currentUserId, this.props.game.id) : false,
                cartConfirmed: false,
                wishlistFlash: null,
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.cartTimerId);
        clearTimeout(this.wishlistTimerId);
    }

    flashCartConfirmation() {
        clearTimeout(this.cartTimerId);
        this.setState({ cartConfirmed: true });
        this.cartTimerId = setTimeout(() => this.setState({ cartConfirmed: false }), 1400);
    }

    flashWishlistState(nextFlashState) {
        clearTimeout(this.wishlistTimerId);
        this.setState({ wishlistFlash: nextFlashState });
        this.wishlistTimerId = setTimeout(() => this.setState({ wishlistFlash: null }), 1400);
    }

    addToCart(e) {
        const { currentUserId, game } = this.props;
        if (!currentUserId) {
            if (e) e.preventDefault();
            window.location.hash = '#/login';
            return;
        }

        const savedCart = localStorage.getItem(currentUserId);
        let cart = {};
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        cart[game.id] = game;
        localStorage.setItem(currentUserId, JSON.stringify(cart));
        this.flashCartConfirmation();
    }

    toggleWishlist() {
        const { currentUserId, game } = this.props;
        if (!currentUserId) {
            window.location.hash = '#/login';
            return;
        }

        if (this.state.inWishlist) {
            removeFromWishlist(currentUserId, game.id);
            this.setState({ inWishlist: false });
            this.flashWishlistState('removed');
        } else {
            addToWishlist(currentUserId, game);
            this.setState({ inWishlist: true });
            this.flashWishlistState('added');
        }
    }

    render() {
        const { game, locale = 'zh', className = '', style } = this.props;
        const cartLabel = this.state.cartConfirmed ? t('added_to_cart', locale) : t('add_to_cart', locale);
        let wishlistLabel = this.state.inWishlist ? t('in_wishlist', locale) : t('add_to_wishlist', locale);

        if (this.state.wishlistFlash === 'added') {
            wishlistLabel = t('wishlist_added', locale);
        } else if (this.state.wishlistFlash === 'removed') {
            wishlistLabel = t('wishlist_removed', locale);
        }

        return (
            <div className={`buy-now-bar ${className}`.trim()} style={style}>
                <div className="main-box">
                    <h2 className="title">
                        {t('buy_prefix', locale)} {getLocalizedGameTitle(game, locale)}
                    </h2>
                    <div className="icons">
                        <i className="fab fa-windows"></i>
                        <i className="fab fa-apple"></i>
                    </div>
                </div>
                <div className="black-box">
                    <div className="price-box">
                        <p>{getPriceLabel(game, '¥', locale)}</p>
                    </div>
                    <Link to={this.props.currentUserId ? "/cart" : "/login"}>
                        <div className={this.state.cartConfirmed ? 'cart-box confirmed' : 'cart-box'} onClick={this.addToCart}>
                            <p>{cartLabel}</p>
                        </div>
                    </Link>
                    <div
                        className={this.state.inWishlist ? 'wishlist-box active' : 'wishlist-box'}
                        onClick={this.toggleWishlist}>
                        <p>{wishlistLabel}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default BuyNowBar;
