import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';

const SETTINGS_KEY = 'jx_team_settings';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        this.state = {
            theme: saved.theme || 'dark',
            pageSize: saved.pageSize || 10,
        };
        this.save = this.save.bind(this);
    }

    save() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.state));
        alert(t('settings_saved', this.props.locale || 'zh'));
    }

    render() {
        const locale = this.props.locale || 'zh';
        return (
            <StaticPageLayout title={t('settings_title', locale)}>
                <label className="stage-panel" style={{ '--enter-delay': '110ms' }}>
                    {t('settings_theme', locale)}
                    <select value={this.state.theme} onChange={(e) => this.setState({ theme: e.target.value })}>
                        <option value="dark">{t('settings_theme_dark', locale)}</option>
                        <option value="light">{t('settings_theme_light', locale)}</option>
                    </select>
                </label>
                <label className="stage-panel" style={{ '--enter-delay': '150ms' }}>
                    {t('settings_page_size', locale)}
                    <input
                        type="number"
                        min="5"
                        max="50"
                        value={this.state.pageSize}
                        onChange={(e) => this.setState({ pageSize: e.target.value })}
                    />
                </label>
                <button className="stage-panel static-page-button" style={{ '--enter-delay': '190ms' }} onClick={this.save}>
                    {t('settings_save', locale)}
                </button>
            </StaticPageLayout>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(SettingsPage);
