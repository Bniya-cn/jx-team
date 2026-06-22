import { connect } from 'react-redux';
import PersonalRecommendations from './personal_recommendations';

const mapStateToProps = (state) => {
    const allGames = Object.values(state.entities.games || {});
    const userId = window.currentUser && window.currentUser.id;
    const user = userId ? state.entities.users[userId] : null;
    const ownedGames = user && user.ownedGames ? user.ownedGames : [];
    const ownedGameIds = new Set(ownedGames.map((g) => g.id));

    // Get unowned games
    let candidates = allGames.filter((game) => !ownedGameIds.has(game.id));

    if (userId && ownedGames.length > 0) {
        // Logged in: prioritize games matching the genres the user already owns
        const ownedGenres = new Set(ownedGames.map((g) => g.genre).filter(Boolean));
        
        candidates.sort((a, b) => {
            const aMatch = ownedGenres.has(a.genre) ? 1 : 0;
            const bMatch = ownedGenres.has(b.genre) ? 1 : 0;
            if (aMatch !== bMatch) return bMatch - aMatch;
            if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            return (b.discount || 0) - (a.discount || 0);
        });
    } else {
        // Guest or no owned games: prioritize featured and discounted games
        candidates.sort((a, b) => {
            if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            return (b.discount || 0) - (a.discount || 0);
        });
    }

    // Limit to 4 recommendations
    const recommendations = candidates.slice(0, 4);

    // Fallback to any games if candidates are too few
    if (recommendations.length < 4) {
        const fallbacks = allGames.filter((g) => !recommendations.some((r) => r.id === g.id)).slice(0, 4 - recommendations.length);
        recommendations.push(...fallbacks);
    }

    return {
        games: recommendations,
        locale: state.locale || 'zh',
        isLoggedIn: !!userId,
    };
};

export default connect(mapStateToProps)(PersonalRecommendations);
