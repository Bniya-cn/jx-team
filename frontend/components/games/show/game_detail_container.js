import { connect } from 'react-redux'
import { requestOneGame} from '../../../actions/games_actions'
import { requestAllGameReviews } from '../../../actions/reviews_actions'
import GameDetail from './game_detail'

const MSTP = (state, ownProps) => {
    const id = ownProps.match.params.id
    const gameReviews = Object.values(state.entities.reviews).filter(
        (r) => String(r.game_id) === String(id)
    )

    const descKey = `game-desc-${id}`;

    return {
        gameId: id,
        games: state.entities.games,
        reviewCount: gameReviews.length,
        recommendedCount: gameReviews.filter((r) => r.recommended).length,
        currentUserId: state.session.id,
        locale: state.locale,
        descriptionOverride: state.translationOverrides[descKey],
    }
}

const MDTP = dispatch => {
    return {
        requestOneGame: (gameId) => dispatch(requestOneGame(gameId)),
        requestAllGameReviews: (gameId) => dispatch(requestAllGameReviews(gameId)),
    }
}

export default connect(MSTP, MDTP)(GameDetail)