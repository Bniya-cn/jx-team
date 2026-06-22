import { connect } from 'react-redux';
import SpecialOffers from './special_offers';

const mapStateToProps = (state) => {
    const allGames = Object.values(state.entities.games || {});
    // Filter games that have a discount and valid sale price
    let discounted = allGames.filter(
        (game) => game.discount > 0 && game.sale_price !== null
    );

    // Sort by discount percentage descending, then by release date descending
    discounted.sort((a, b) => b.discount - a.discount || new Date(b.release_date) - new Date(a.release_date));

    // Take top 3 games for the grid
    const featuredOffers = discounted.slice(0, 3);

    // Fallback in case there are no discounted games yet
    if (featuredOffers.length < 3 && allGames.length >= 3) {
        const fallbacks = allGames.slice(0, 3 - featuredOffers.length);
        featuredOffers.push(...fallbacks);
    }

    return {
        games: featuredOffers,
        locale: state.locale || 'zh',
    };
};

export default connect(mapStateToProps)(SpecialOffers);
