import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { t } from '../../util/i18n';

const AdminShell = ({ children, location, locale = 'zh' }) => {
    const pathname = (location && location.pathname) || '/admin';
    const navItems = [
        { to: '/admin', exact: true, label: t('admin_dashboard', locale) },
        { to: '/admin/games', label: t('admin_games', locale) },
        { to: '/admin/content', label: t('admin_content', locale) },
    ];

    return (
        <div className="admin-shell">
            <aside className="admin-nav stage-panel" style={{ '--enter-delay': '40ms' }}>
                <div>
                    <h2>{t('admin_brand', locale)}</h2>
                    <p>{t('admin_overview', locale)}</p>
                </div>
                <ul>
                    {navItems.map((item) => {
                        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                        return (
                            <li key={item.to} className={active ? 'active' : ''}>
                                <Link to={item.to}>{item.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>
            <div className="admin-main">{children}</div>
        </div>
    );
};

export default connect((state) => ({ locale: state.locale }))(withRouter(AdminShell));
