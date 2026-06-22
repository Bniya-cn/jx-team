import React from 'react';
import { connect } from 'react-redux';
import AdminShell from './admin_shell';
import {
    fetchAdminCuratorPicks,
    fetchAdminNewsItems,
    updateAdminCuratorPick,
    updateAdminNewsItem,
} from '../../util/admin_util';
import { t } from '../../util/i18n';

class AdminContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsItems: [],
            curatorPicks: [],
            loading: true,
        };
    }

    componentDidMount() {
        Promise.all([fetchAdminNewsItems(), fetchAdminCuratorPicks()]).then(([newsItems, curatorPicks]) => {
            this.setState({ newsItems, curatorPicks, loading: false });
        });
    }

    handleNewsField(id, field, value) {
        this.setState((prevState) => ({
            newsItems: prevState.newsItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    }

    handleCuratorField(id, field, value) {
        this.setState((prevState) => ({
            curatorPicks: prevState.curatorPicks.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    }

    saveNews(item) {
        return updateAdminNewsItem(item.id, {
            title: item.title,
            summary: item.summary,
            position: Number(item.position || 0),
            game_id: item.game_id,
            published_on: item.published_on,
        });
    }

    saveCurator(item) {
        return updateAdminCuratorPick(item.id, {
            curator_name: item.curator_name,
            note: item.note,
            position: Number(item.position || 0),
            game_id: item.game_id,
        });
    }

    render() {
        const locale = this.props.locale || 'zh';
        return (
            <AdminShell>
                <section className="admin-hero stage-panel" style={{ '--enter-delay': '60ms' }}>
                    <div>
                        <p className="admin-kicker">{t('admin_editorial_kicker', locale)}</p>
                        <h1>{t('admin_editorial_title', locale)}</h1>
                        <p>{t('admin_editorial_subtitle', locale)}</p>
                    </div>
                </section>

                {this.state.loading ? (
                    <p>{t('loading', locale)}</p>
                ) : (
                    <div className="admin-content-grid">
                        <section className="admin-panel stage-panel" style={{ '--enter-delay': '120ms' }}>
                            <h3>{t('admin_news_items', locale)}</h3>
                            <ul className="admin-edit-list">
                                {this.state.newsItems.map((item) => (
                                    <li key={item.id}>
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => this.handleNewsField(item.id, 'title', e.currentTarget.value)}
                                        />
                                        <textarea
                                            value={item.summary}
                                            onChange={(e) => this.handleNewsField(item.id, 'summary', e.currentTarget.value)}
                                        />
                                        <div className="admin-inline-fields">
                                            <input
                                                type="number"
                                                value={item.position}
                                                onChange={(e) =>
                                                    this.handleNewsField(item.id, 'position', e.currentTarget.value)
                                                }
                                            />
                                            <button type="button" onClick={() => this.saveNews(item)}>
                                                {t('admin_save_inline', locale)}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="admin-panel stage-panel" style={{ '--enter-delay': '170ms' }}>
                            <h3>{t('admin_curator_picks', locale)}</h3>
                            <ul className="admin-edit-list">
                                {this.state.curatorPicks.map((item) => (
                                    <li key={item.id}>
                                        <input
                                            type="text"
                                            value={item.curator_name}
                                            onChange={(e) =>
                                                this.handleCuratorField(item.id, 'curator_name', e.currentTarget.value)
                                            }
                                        />
                                        <textarea
                                            value={item.note}
                                            onChange={(e) => this.handleCuratorField(item.id, 'note', e.currentTarget.value)}
                                        />
                                        <div className="admin-inline-fields">
                                            <input
                                                type="number"
                                                value={item.position}
                                                onChange={(e) =>
                                                    this.handleCuratorField(item.id, 'position', e.currentTarget.value)
                                                }
                                            />
                                            <button type="button" onClick={() => this.saveCurator(item)}>
                                                {t('admin_save_inline', locale)}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                )}
            </AdminShell>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(AdminContent);
