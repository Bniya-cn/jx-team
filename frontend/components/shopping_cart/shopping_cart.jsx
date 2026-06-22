import React from 'react';
import ShoppingCartItem from './shopping_cart_item';
import { Link, Redirect } from 'react-router-dom';
import { t } from '../../util/i18n';

class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: JSON.parse(localStorage.getItem(this.props.currentUserId)),
        };
        this.handleRemoveAllItems = this.handleRemoveAllItems.bind(this);
        this.handleRemoveOneItem = this.handleRemoveOneItem.bind(this);
        this.handlePurchaseButton = this.handlePurchaseButton.bind(this);
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this);
    }
    componentDidMount() {
        if (Object.values(this.state.games).length < 1) {
            return <Redirect to="/" />;
        }
    }
    componentDidUpdate() {
        if (Object.values(this.state.games).length < 1) {
            return <Redirect to="/" />;
        }
    }
    calculateTotalPrice() {
        let total = 0;
        Object.values(this.state.games).map((game) => {
            total += game.price || 0;
        });

        return total;
    }

    handleRemoveAllItems() {
        localStorage.clear();
    }

    handleRemoveOneItem(itemId) {
        delete this.state.games[itemId];
        localStorage.setItem(this.props.currentUserId, JSON.stringify(this.state.games));
        this.setState({
            games: this.state.games,
        });
    }
    handlePurchaseButton() {
        let games = Object.values(this.state.games);

        games.map((game) => {
            this.props.createNewPurchase({ buyerId: this.props.currentUserId, gameId: game.id });
        });

        localStorage.clear();
        this.setState({
            games: [],
        });
    }

    render() {
        if (this.state.games === null || Object.values(this.state.games) < 1) {
            return <Redirect to="/" />;
        }

        const locale = this.props.locale || 'zh';

        const mappedGames =
            this.state.games &&
            Object.values(this.state.games).map((game, idx) => {
                return (
                    <li key={`shop-cart-${idx}`}>
                        {<ShoppingCartItem handleRemoveOneItem={this.handleRemoveOneItem} game={game} locale={locale} />}
                    </li>
                );
            });

        return (
            <div className="shopping-cart-container">
                <div className="shopping-cart-header">
                    <p>
                        <Link to="/">
                            <span>{t('all_games', locale)} </span>
                        </Link>{' '}
                        {'>'} {t('cart_title', locale)}
                    </p>
                    <h1>{t('cart_title', locale)}</h1>
                </div>
                <div className="transition-bar"></div>
                <div className="shopping-cart-body">
                    <ul>{mappedGames}</ul>
                </div>
                <div className="shopping-cart-bottom">
                    <div className="estimated-total">
                        <p>{t('cart_total', locale)}</p>
                        <p>{`¥${(this.calculateTotalPrice() / 100).toFixed(2)}`}</p>
                    </div>
                    <div className="purchase-row">
                        <div className="purchase-button" onClick={() => this.handlePurchaseButton()}>
                            <Link to={`/api/users/${this.props.currentUserId}`}> {t('cart_purchase_self', locale)} </Link>
                        </div>
                    </div>
                </div>
                <div className="under-cart">
                    <div className="remove-all-box" onClick={() => this.handleRemoveAllItems()}>
                        <Link to="/">
                            <p>{t('cart_remove_all', locale)}</p>
                        </Link>
                    </div>

                    <div className="continue-shopping-box">
                        <Link to="/">{t('cart_continue', locale)}</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShoppingCart;
