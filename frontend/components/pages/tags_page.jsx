import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';

// 标签索引页：链到各标签浏览
const TAG_LIST = [
    { slug: 'roguelike', key: 'tag_roguelike' },
    { slug: 'puzzle', key: 'tag_puzzle' },
    { slug: 'story-rich', key: 'tag_story-rich' },
    { slug: 'open-world', key: 'tag_open-world' },
];

const TagsPage = ({ locale = 'zh' }) => (
    <StaticPageLayout title={t('tags_title', locale)}>
        <ul className="tag-index">
            {TAG_LIST.map((tag, index) => (
                <li key={tag.slug} className="stage-panel" style={{ '--enter-delay': `${110 + index * 35}ms` }}>
                    <Link to={`/browse/tag-${tag.slug}`}>{t(tag.key, locale)}</Link>
                </li>
            ))}
        </ul>
    </StaticPageLayout>
);

export default connect((state) => ({ locale: state.locale }))(TagsPage);
