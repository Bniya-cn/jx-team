import React from 'react';
import { Link } from 'react-router-dom';
import ReviewsIndexItem from './reviews_index_item';
import NewReviewFormContainer from './new_review_form_container';

class ReviewsIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasReviewed: false,
        };
        this.sortReviewsByMostRecent = this.sortReviewsByMostRecent.bind(this);
    }

    componentDidMount() {
        if (this.props.currentUserId) {
            this.props.fetchUser(this.props.currentUserId);
            this.checkIfReviewed();
        }
        this.props.requestAllGameReviews(this.props.gameId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.currentUserId && this.props.reviews !== prevProps.reviews) {
            this.checkIfReviewed();
            this.checkIfOwned();
        } else if (this.props.currentUserId !== prevProps.currentUserId) {
            this.setState({
                hasReviewed: false,
                owned: false,
            });
        }
    }
    sortReviewsByMostRecent(a, b) {
        if (a.created_at > b.created_at) {
            return -1;
        } else if (a.created_at === b.created_at) {
            return 0;
        } else return 1;
    }
    checkIfOwned() {
        let gamesList = this.props.users[this.props.currentUserId].ownedGames;

        if (gamesList) {
            for (let i = 0; i < gamesList.length; i++) {
                if (gamesList[i].id.toString() === this.props.gameId) {
                    this.setState({
                        owned: true,
                    });
                    return;
                }
            }
            this.setState({
                owned: false,
            });
            return;
        } else {
            this.setState({
                owned: false,
            });
        }
    }
    checkIfReviewed() {
        for (let i = 0; i < this.props.reviews.length; i++) {
            if (this.props.reviews[i].author_id === this.props.currentUserId) {
                this.setState({
                    hasReviewed: true,
                });
                return;
            }
        }
        this.setState({
            hasReviewed: false,
        });
        return;
    }
    render() {
        const { reviews, gameId } = this.props;
        let sortedReviews = reviews && [...reviews].sort(this.sortReviewsByMostRecent);

        const mappedReviews = sortedReviews.map((review, idx) => {
            return (
                <li key={`review-${idx}`}>
                    <ReviewsIndexItem
                        deleteGameReview={this.props.deleteGameReview}
                        updateGameReview={this.props.updateGameReview}
                        fetchUser={this.props.fetchUser}
                        users={this.props.users}
                        review={review}
                        currentUserId={this.props.currentUserId}
                    />
                </li>
            );
        });

        return (
            <div className="reviews-index-container">
                <div className="reviews-index">
                    {!this.props.currentUserId ? (
                        <div className="login-to-review-banner">
                            <span>
                                {this.props.locale === 'zh' 
                                    ? '想要撰写您自己的评测吗？请先' 
                                    : 'Want to write a review? Please '
                                }
                            </span>
                            <Link to="/login" className="login-btn-review">
                                {this.props.locale === 'zh' ? '登录' : 'Sign In'}
                            </Link>
                            <span>
                                {this.props.locale === 'zh' 
                                    ? '并购买该游戏。' 
                                    : 'and purchase this game.'
                                }
                            </span>
                        </div>
                    ) : (
                        this.state.owned && !this.state.hasReviewed ? (
                            <NewReviewFormContainer gameId={this.props.gameId} />
                        ) : (
                            ''
                        )
                    )}
                    <div className="reviews-header">
                        <h4>用户评测</h4>
                    </div>

                    {reviews.length > 0 ? (
                        <ul className="reviews-list">{mappedReviews}</ul>
                    ) : (
                        <div className="empty-reviews-state" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 20px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px dashed rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            marginTop: '15px',
                            width: '650px',
                            boxSizing: 'border-box'
                        }}>
                            <i className="far fa-comment-alt" style={{ fontSize: '36px', color: '#ffcd16', marginBottom: '15px', opacity: 0.8 }}></i>
                            <h5 style={{ fontSize: '15px', color: '#fff', margin: '0 0 8px 0', fontWeight: '600' }}>
                                {this.props.locale === 'zh' ? '暂无玩家评测' : 'No user reviews yet'}
                            </h5>
                            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: 1.5 }}>
                                {this.props.locale === 'zh' 
                                    ? '购买这款游戏并发表您的第一条评测，分享您的校园游戏体验！' 
                                    : 'Purchase this game and write the first review to share your campus gaming experience!'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ReviewsIndex;
