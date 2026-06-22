import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminDashboard } from '../../util/admin_util';
import { t } from '../../util/i18n';
import AdminShell from './admin_shell';

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashboard: null,
            error: null,
            loading: true,
        };
    }

    componentDidMount() {
        if (!this.props.isAdmin) {
            this.setState({ loading: false, error: 'forbidden' });
            return;
        }

        fetchAdminDashboard()
            .done((dashboard) => this.setState({ dashboard, loading: false }))
            .fail(() => this.setState({ error: 'request_failed', loading: false }));
    }

    renderCountCard(label, value, index) {
        return (
            <li key={label} className="admin-stat-card stage-panel" style={{ '--enter-delay': `${60 + index * 45}ms` }}>
                <p>{label}</p>
                <strong>{value}</strong>
            </li>
        );
    }

    render() {
        const locale = this.props.locale || 'zh';

        if (this.state.loading) {
            return (
                <AdminShell>
                        <p>{t('loading', locale)}</p>
                </AdminShell>
            );
        }

        if (this.state.error) {
            return (
                <AdminShell>
                        <div className="admin-empty stage-panel" style={{ '--enter-delay': '60ms' }}>
                            <h2>{t('admin_brand', locale)}</h2>
                            <p>{this.state.error === 'forbidden' ? t('admin_no_permission', locale) : t('admin_unavailable', locale)}</p>
                            <Link to="/">{t('admin_back_store', locale)}</Link>
                        </div>
                </AdminShell>
            );
        }

        const counts = this.state.dashboard.counts || {};
        const cards = [
            [t('admin_games', locale), counts.games],
            [t('admin_users', locale), counts.users],
            [t('admin_purchases', locale), counts.purchases],
            [t('admin_reviews', locale), counts.reviews],
            [t('admin_news', locale), counts.news_items],
            [t('admin_curators_count', locale), counts.curator_picks],
        ];

        return (
            <AdminShell>
                    <section className="admin-hero stage-panel" style={{ '--enter-delay': '60ms' }}>
                        <div>
                            <p className="admin-kicker">{t('admin_overview', locale)}</p>
                            <h1>{t('admin_brand', locale)}</h1>
                        </div>
                        <Link to="/" className="admin-back-link">
                            {t('admin_back_store', locale)}
                        </Link>
                    </section>

                    <ul className="admin-stats">{cards.map(([label, value], index) => this.renderCountCard(label, value, index))}</ul>

                    <div className="admin-grid">
                        <section className="admin-panel stage-panel" style={{ '--enter-delay': '170ms' }}>
                            <h3>{t('admin_recent_games', locale)}</h3>
                            <ul>
                                {(this.state.dashboard.recent_games || []).map((game) => (
                                    <li key={game.id}>
                                        <Link to={`/api/games/${game.id}`}>{game.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="admin-panel stage-panel" style={{ '--enter-delay': '220ms' }}>
                            <h3>{t('admin_recent_purchases', locale)}</h3>
                            <ul>
                                {(this.state.dashboard.recent_purchases || []).map((purchase) => (
                                    <li key={purchase.id}>
                                        <strong>{purchase.buyer}</strong>
                                        <span>{purchase.game}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="admin-panel stage-panel" style={{ '--enter-delay': '270ms' }}>
                            <h3>{t('admin_recent_reviews', locale)}</h3>
                            <ul>
                            {(this.state.dashboard.recent_reviews || []).map((review) => (
                                <li key={review.id}>
                                    <strong>{review.author}</strong>
                                        <span>{review.game}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
            </AdminShell>
        );
    }
}

const mapStateToProps = (state) => {
    const user = state.entities.users[state.session.id];
    return {
        locale: state.locale,
        isAdmin: user ? user.admin : false,
    };
};

export default connect(mapStateToProps)(AdminDashboard);
