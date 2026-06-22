import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from '../sidebar/sidebar';
import { t } from '../../util/i18n';
import { fetchNewsItems } from '../../util/content_util';

class NewsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], loading: true };
    }

    componentDidMount() {
        fetchNewsItems().done((items) => this.setState({ items, loading: false }));
    }

    render() {
        const locale = this.props.locale || 'zh';

        return (
            <div className="homepage news-page">
                <Sidebar />
                <div className="main-content">
                    <h2>{t('news_title', locale)}</h2>
                    {this.state.loading ? (
                        <p>{t('loading', locale)}</p>
                    ) : (
                        <ul className="news-list">
                            {this.state.items.map((item) => (
                                <li key={item.id} className="news-card">
                                    <p className="news-date">{item.published_on}</p>
                                    <h3>
                                        <Link to={`/api/games/${item.game_id}`}>{item.title}</Link>
                                    </h3>
                                    <p>{item.summary}</p>
                                    <Link to={`/api/games/${item.game_id}`}>{t('news_read_more', locale)}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(NewsPage);
