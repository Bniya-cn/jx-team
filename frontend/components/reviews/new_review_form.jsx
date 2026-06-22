import React from 'react';
import { getLocalizedGameTitle } from '../../util/game_helpers';

class NewReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: '',
            recommended: true,
        };
    }
    componentDidMount() {
        this.props.requestOneGame(this.props.gameId);
    }

    update(field) {
        return (e) => {
            this.setState({
                [field]: e.currentTarget.value,
            });
        };
    }
    handleButton(answer) {
        const yes = document.getElementById('yes');
        const no = document.getElementById('no');
        if (answer === 'yes') {
            this.setState({
                recommended: true,
            });
            yes.className = 'pressed';
            no.className = 'unpressed';
        } else if (answer === 'no') {
            this.setState({
                recommended: false,
            });
            yes.className = 'unpressed';
            no.className = 'pressed';
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        let newReview = {
            game_id: this.props.gameId,
            author_id: this.props.currentUserId,
            body: this.state.body,
            recommended: this.state.recommended,
        };
        this.props.createNewGameReview(newReview);
    }
    render() {
        const game = this.props.games[this.props.gameId];
        if (!game) return <div>暂无内容</div>;
        const locale = this.props.locale || 'zh';
        const hoursPlayed = this.props.currentUserId * game.id * 42;
        return (
            <div className="review-form-container">
                <div className="green-header-bar">
                    <div className="in-library">
                        <i className="fas fa-bars"></i> <p>{locale === 'zh' ? '已在库中' : 'In Library'}</p>
                    </div>
                    <h3>{getLocalizedGameTitle(game, locale)} {locale === 'zh' ? '已在您的 JX-Team 游戏库中' : 'is already in your JX-Team Library'}</h3>
                </div>
                <div className="install-button-bar">
                    <div className="button install-jx-team demo-modal-trigger">{locale === 'zh' ? '安装 JX-Team' : 'Install JX-Team'}</div>
                    <div className="button play-now demo-modal-trigger">{locale === 'zh' ? '立即游玩' : 'Play Now'}</div>
                    <div className="stats">
                        {locale === 'zh' ? `游戏时长 ${hoursPlayed} 小时` : `Playtime: ${hoursPlayed} hours`}
                    </div>
                </div>
                <form className="review-form" onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="review-form-header">
                        <h3>{locale === 'zh' ? `为 ${getLocalizedGameTitle(game, locale)} 撰写评测` : `Write a Review for ${getLocalizedGameTitle(game, locale)}`}</h3>
                        <p>
                            {locale === 'zh' 
                                ? '请描述您喜欢或不喜欢这款游戏的哪些方面，以及是否向他人推荐。' 
                                : 'Please describe what you like or dislike about this game and whether you recommend it to others.'
                            }
                            <br /> {locale === 'zh' ? '请保持礼貌并遵守' : 'Please be polite and follow the'}
                            <span className="rules-link"> {locale === 'zh' ? '规则与指引' : 'Rules and Guidelines'}</span>。
                        </p>
                    </div>
                    <div className="review-form-body">
                        <div className="profile-pic">
                            <img src={window.cubeURL} alt="头像" />
                        </div>
                        <div className="main-body">
                            <textarea name="review-text" id="review-text" onChange={this.update('body')}></textarea>
                            <div className="review-form-footer">
                                <div className="recommended-box">
                                    <p>{locale === 'zh' ? '您会推荐这款游戏吗？' : 'Do you recommend this game?'}</p>
                                    <div className="buttons">
                                        <div
                                            id="yes"
                                            className={this.state.recommended ? 'pressed' : 'unpressed'}
                                            onClick={() => this.handleButton('yes')}>
                                            <i className="fas fa-check check"></i>
                                            <i className="fas fa-thumbs-up thumb"></i>
                                            {locale === 'zh' ? '推荐' : 'Yes'}
                                        </div>
                                        <div
                                            id="no"
                                            className={this.state.recommended ? 'unpressed' : 'pressed'}
                                            onClick={() => this.handleButton('no')}>
                                            <i className="fas fa-check check"></i>
                                            <i className="fas fa-thumbs-down thumb"></i>
                                            {locale === 'zh' ? '不推荐' : 'No'}
                                        </div>
                                    </div>
                                </div>
                                <button className="button submit-button">{locale === 'zh' ? '发布评测' : 'Post Review'}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewReviewForm;
