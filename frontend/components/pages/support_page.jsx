import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';

const FAQ_KEYS = [
    ['support_q1', 'support_a1'],
    ['support_q2', 'support_a2'],
    ['support_q3', 'support_a3'],
    ['support_q4', 'support_a4'],
];

const SupportPage = ({ locale = 'zh' }) => (
    <StaticPageLayout title={t('support_title', locale)}>
        {FAQ_KEYS.map(([qKey, aKey], index) => (
            <div key={qKey} className="faq-item stage-panel" style={{ '--enter-delay': `${110 + index * 45}ms` }}>
                <h4>{t(qKey, locale)}</h4>
                <p>{t(aKey, locale)}</p>
            </div>
        ))}
    </StaticPageLayout>
);

export default connect((state) => ({ locale: state.locale }))(SupportPage);
