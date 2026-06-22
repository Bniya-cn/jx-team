import React from 'react';
import { Link, Route } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import GamesIndexContainer from '../games/index/games_index_container';
import FeaturedCarouselContainer from '../games/featured/featured_carousel_container';
import SpecialOffersContainer from '../games/special_offers/special_offers_container';
import PersonalRecommendationsContainer from '../games/recommendations/personal_recommendations_container';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.numItemsInCart = this.numItemsInCart.bind(this);
    }
    numItemsInCart() {
        const currentUserId = window.currentUser && window.currentUser.id;
        if (currentUserId) {
            const items = Object.values(JSON.parse(localStorage.getItem(currentUserId) || '{}'));
            return items.length;
        }
        return 0;
    }
    render() {
        const currentUserId = window.currentUser && window.currentUser.id;
        const hasCart = currentUserId && this.numItemsInCart() > 0;

        return (
            <div className="homepage">
                <Route exact path="/" component={Sidebar} />
                <div className="main-content">
                    <div className="fake-nav-bar stage-panel" style={{ '--enter-delay': '40ms' }}>
                        {hasCart ? (
                            <Link to="/cart">
                                <div className="cart-button">购物车({this.numItemsInCart()})</div>
                            </Link>
                        ) : (
                            <div className="empty"> </div>
                        )}
                    </div>

                    <Route exact path="/" component={FeaturedCarouselContainer} />
                    <Route exact path="/" component={SpecialOffersContainer} />
                    <Route exact path="/" component={PersonalRecommendationsContainer} />
                    <Route exact path="/" component={GamesIndexContainer} />
                </div>
            </div>
        );
    }
}

export default HomePage;
