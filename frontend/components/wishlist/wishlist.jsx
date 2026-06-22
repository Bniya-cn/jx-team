import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../../util/wishlist_util';
import { getPriceLabel, getTitleCardImage } from '../../util/game_helpers';

class Wishlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: getWishlist(props.currentUserId),
        };
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(gameId) {
        const games = removeFromWishlist(this.props.currentUserId, gameId);
        this.setState({ games });
    }

    render() {
        const games = Object.values(this.state.games || {});

        if (games.length < 1) {
            return (
                <div className="wishlist-container">
                    <h2>愿望单</h2>
                    <p>您的愿望单是空的。</p>
                    <Link to="/">浏览商店</Link>
                </div>
            );
        }

        const mappedGames = games.map((game) => {
            const titleCard = getTitleCardImage(game);
            return (
                <li key={`wishlist-${game.id}`} className="wishlist-item">
                    <Link to={`/api/games/${game.id}`}>
                        {titleCard && <img src={titleCard.img_url} alt={game.title} />}
                        <span>{game.title}</span>
                    </Link>
                    <span className="wishlist-price">{getPriceLabel(game)}</span>
                    <button onClick={() => this.handleRemove(game.id)}>移除</button>
                </li>
            );
        });

        return (
            <div className="wishlist-container">
                <h2>愿望单（{games.length}）</h2>
                <ul className="wishlist-list">{mappedGames}</ul>
            </div>
        );
    }
}

export default Wishlist;
