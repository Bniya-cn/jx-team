import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';

const NotificationsPage = ({ locale = 'zh' }) => (
    <StaticPageLayout title={t('notifications_title', locale)}>
        <p className="empty-state stage-panel" style={{ '--enter-delay': '110ms' }}>{t('notifications_empty', locale)}</p>
    </StaticPageLayout>
);

export default connect((state) => ({ locale: state.locale }))(NotificationsPage);
