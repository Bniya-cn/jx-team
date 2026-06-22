import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';

const AboutPage = ({ locale = 'zh' }) => (
    <StaticPageLayout title={t('about_title', locale)}>
        <p className="stage-panel" style={{ '--enter-delay': '110ms' }}>{t('about_body_1', locale)}</p>
        <p className="stage-panel" style={{ '--enter-delay': '150ms' }}>{t('about_body_2', locale)}</p>
        <p className="stage-panel" style={{ '--enter-delay': '190ms' }}>{t('about_body_3', locale)}</p>
    </StaticPageLayout>
);

export default connect((state) => ({ locale: state.locale }))(AboutPage);
