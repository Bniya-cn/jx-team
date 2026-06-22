import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user_actions';
import { deleteGameReview, requestAllGameReviews, updateGameReview } from '../../actions/reviews_actions';
import ReviewsIndex from './reviews_index';

const MSTP = (state, ownProps) => {
    const gameId = ownProps.gameId || (ownProps.match && ownProps.match.params.id);
    const allReviews = Object.values(state.entities.reviews);

    return {
        gameId,
        // 只展示当前游戏的评论
        reviews: allReviews.filter((r) => String(r.game_id) === String(gameId)),
        users: state.entities.users,
        currentUserId: state.session.id,
        locale: state.locale,
    };
};

const MDTP = (dispatch) => {
    return {
        requestAllGameReviews: (gameId) => dispatch(requestAllGameReviews(gameId)),
        fetchUser: (userId) => dispatch(fetchUser(userId)),
        deleteGameReview: (reviewId) => dispatch(deleteGameReview(reviewId)),
        updateGameReview: (review) => dispatch(updateGameReview(review)),
    };
};

export default connect(MSTP, MDTP)(ReviewsIndex);
