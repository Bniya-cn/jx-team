import React from 'react';
import StaticPageLayout from '../shared/static_page_layout';

class ActivityPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { feed: [] };
    }

    componentDidMount() {
        $.ajax({ method: 'GET', url: '/api/activities' }).done((feed) => this.setState({ feed }));
    }

    render() {
        return (
            <StaticPageLayout title="动态">
                <ul className="activity-feed">
                    {this.state.feed.map((item, i) => (
                        <li key={i} className="activity-item">
                            {item.type === 'review' ? (
                                <span>
                                    <strong>{item.username}</strong> 评测了《{item.game_title}》：{item.body}
                                </span>
                            ) : (
                                <span>
                                    <strong>{item.username}</strong> 购买了《{item.game_title}》
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </StaticPageLayout>
        );
    }
}

export default ActivityPage;
