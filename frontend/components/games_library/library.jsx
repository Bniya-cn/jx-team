import React from 'react';
import LibraryIndexItem from './library_index_item.jsx';
class Library extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.fetchUser(this.props.userId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            this.props.fetchUser(this.props.userId);
        }
    }

    render() {
        const { users, userId } = this.props;
        const user = users && users[userId];
        const games = user && user.ownedGames;

        if (!user) return <div>用户不存在！</div>;
        const hasGames = games && games.length > 0 ? true : false;
        const mappedGames =
            games &&
            games.map((game, idx) => {
                return (
                    <li key={`library-${idx}`}>
                        <LibraryIndexItem user={user} game={game} locale={this.props.locale} />
                    </li>
                );
            });

        return (
            <div className="library-container">
                <div className="library-div">
                    <div className="username-bar">
                        <div className="profile-pic">
                            <img src={window.cubeURL} alt="头像" />
                        </div>
                        <div className="words">
                            <div className="words-helper">
                                <h1>{user.username}</h1>
                                <i className="fas fa-angle-double-right"></i>
                                <p>游戏</p>
                            </div>
                        </div>
                    </div>
                    <div className="library-nav-bar">
                        <div className="all-games">全部游戏</div>
                    </div>
                    <div className="library-index">
                        {hasGames ? (
                            <ul>{mappedGames}</ul>
                        ) : (
                            <div className="no-games">该用户似乎还没有购买任何游戏。</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Library;
