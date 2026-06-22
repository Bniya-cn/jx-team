import React from 'react';
import { connect } from 'react-redux';
import { setLocale } from '../../actions/locale_actions';
import { t, SUPPORTED_LOCALES } from '../../util/i18n';

const LOCALE_BUTTONS = [
    { code: 'zh', labelKey: 'switch_to_zh' },
    { code: 'en', labelKey: 'switch_to_en' },
    { code: 'ja', labelKey: 'switch_to_ja' },
    { code: 'ko', labelKey: 'switch_to_ko' },
];

// 商店/首页语言切换：使用本地多语言文案，不调用翻译 API
class TranslationToolbar extends React.Component {
    render() {
        const { locale, setLocale } = this.props;
        return (
            <div className="translation-toolbar" role="group" aria-label="Locale switcher">
                {LOCALE_BUTTONS.map(({ code, labelKey }) => (
                    <button
                        key={code}
                        className={locale === code ? 'active' : ''}
                        onClick={() => setLocale(code)}
                        type="button"
                        aria-pressed={locale === code}>
                        {t(labelKey, locale)}
                    </button>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    locale: state.locale,
});

const mapDispatchToProps = (dispatch) => ({
    setLocale: (locale) => {
        if (SUPPORTED_LOCALES.includes(locale)) dispatch(setLocale(locale));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TranslationToolbar);
