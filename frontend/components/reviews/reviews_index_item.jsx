import React from 'react';
import { Link } from 'react-router-dom';

class ReviewsIndexItem extends React.Component {
    componentDidMount() {
        this.props.fetchUser(this.props.review.author_id);
    }

    render() {
        const { users, review } = this.props;

        if (Object.values(users).length < 1 || !users[review.author_id]) {
            return <div>暂无内容</div>;
        }

        const author = users[review.author_id];
        if (!author.ownedGames) {
            return <div>暂无内容</div>;
        }
        return (
            <div className="review-index-item">
                <div className="transition-bar"></div>
                <div className="review-item-header">
                    <div className="ri-header-left">
                        <Link to={`/api/users/${author.id}`}>
                            <div className="profile-pic">
                                <img src={window.cubeURL} alt="头像" />
                            </div>
                        </Link>
                        <Link to={`/api/users/${author.id}`}>
                            <div className="user-info">
                                <h5>{author.username}</h5>
                                <p>账户中共有 {author.ownedGames.length} 款产品</p>
                            </div>
                        </Link>
                    </div>
                    <div className="ri-header-right">
                        {review.recommended ? (
                            <div className="thumbs-box">
                                <i className="fas fa-thumbs-up"></i>
                                推荐
                            </div>
                        ) : (
                            <div className="thumbs-box">
                                <i className="fas fa-thumbs-down"></i>
                                <span>不推荐</span>
                            </div>
                        )}
                        <div className="logo">
                            <i className="fas fa-cogs"></i>
                        </div>
                    </div>
                </div>
                <div className="review-item-body">
                    <div className="review-body-left"></div>
                    <div className="review-body-right">
                        <p className="date">
                            <span>发布于：</span>
                            {new Date(review.created_at).toLocaleDateString('zh-CN', {
                                timeZone: 'utc',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                        <p className="review-body">{review.body}</p>
                    </div>
                </div>
                <div className="review-item-footer">
                    {author.id === this.props.currentUserId ? (
                        <div className="buttons">
                            <div className="delete-button" onClick={() => this.props.deleteGameReview(review.id)}>
                                删除
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}
export default ReviewsIndexItem;
