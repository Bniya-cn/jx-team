import React from 'react';
import StaticPageLayout from '../shared/static_page_layout';

const BADGES = [
    { id: 'first_buy', name: '初次购买', need: (u) => (u.ownedGames || []).length >= 1 },
    { id: 'collector', name: '收藏家', need: (u) => (u.ownedGames || []).length >= 3 },
    { id: 'critic', name: '评论家', need: () => false },
];

class BadgesPage extends React.Component {
    componentDidMount() {
        if (this.props.currentUserId) {
            this.props.fetchUser(this.props.currentUserId);
        }
    }

    render() {
        const user = this.props.users[this.props.currentUserId];
        return (
            <StaticPageLayout title="徽章">
                {!user ? (
                    <p>请先登录查看徽章。</p>
                ) : (
                    <ul className="badge-list">
                        {BADGES.map((b) => {
                            const unlocked = b.need(user);
                            return (
                                <li key={b.id} className={unlocked ? 'unlocked' : 'locked'}>
                                    <i className={`fas fa-medal`}></i> {b.name} {unlocked ? '已解锁' : '未解锁'}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </StaticPageLayout>
        );
    }
}

export default BadgesPage;
