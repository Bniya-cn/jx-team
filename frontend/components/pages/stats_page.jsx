import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t, tf } from '../../util/i18n';

class StatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stats: null };
    }

    componentDidMount() {
        $.ajax({ method: 'GET', url: '/api/stats' }).done((stats) => this.setState({ stats }));
    }

    render() {
        const { stats } = this.state;
        const locale = this.props.locale || 'zh';
        return (
            <StaticPageLayout title={t('stats_title', locale)}>
                {!stats ? (
                    <p className="stage-panel" style={{ '--enter-delay': '110ms' }}>{t('loading', locale)}</p>
                ) : (
                    <ul className="stats-list stage-panel" style={{ '--enter-delay': '110ms' }}>
                        <li>{tf('stats_games', locale, { count: stats.games })}</li>
                        <li>{tf('stats_users', locale, { count: stats.users })}</li>
                        <li>{tf('stats_reviews', locale, { count: stats.reviews })}</li>
                        <li>{tf('stats_purchases', locale, { count: stats.purchases })}</li>
                    </ul>
                )}
            </StaticPageLayout>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(StatsPage);
