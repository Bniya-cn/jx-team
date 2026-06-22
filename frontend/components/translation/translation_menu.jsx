import React from 'react';
import { connect } from 'react-redux';
import { setTextOverride } from '../../actions/translation_override_actions';
import {
    translateTexts,
    detectSourceLang,
    findTranslateKey,
    isFullTranslateBlockSelection,
    replaceRangeText,
    SUPPORTED_TRANSLATE_LANGS,
} from '../../util/translation_util';
import { t } from '../../util/i18n';

const TARGET_BUTTONS = [
    { code: 'en', labelKey: 'translate_to_en' },
    { code: 'zh', labelKey: 'translate_to_zh' },
    { code: 'ja', labelKey: 'translate_to_ja' },
    { code: 'ko', labelKey: 'translate_to_ko' },
];

// 右键划词 AI 翻译：调用 DeepSeek，并将译文写回页面
class TranslationMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            x: 0,
            y: 0,
            selectedText: '',
            translating: false,
        };
        this.savedRange = null;
        this.onContextMenu = this.onContextMenu.bind(this);
        this.hide = this.hide.bind(this);
        this.stopMenuEvent = this.stopMenuEvent.bind(this);
        this.doTranslate = this.doTranslate.bind(this);
    }

    componentDidMount() {
        document.addEventListener('contextmenu', this.onContextMenu);
        document.addEventListener('click', this.hide);
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this.onContextMenu);
        document.removeEventListener('click', this.hide);
    }

    stopMenuEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    onContextMenu(e) {
        const sel = window.getSelection();
        const text = sel && sel.toString().trim();
        if (!text) {
            this.setState({ visible: false });
            this.savedRange = null;
            return;
        }
        e.preventDefault();
        this.savedRange = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
        this.setState({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            selectedText: text,
            translating: false,
        });
    }

    hide() {
        this.setState({ visible: false, translating: false });
        this.savedRange = null;
    }

    applyTranslation(translated) {
        const { selectedText } = this.state;
        const range = this.savedRange;
        const translateKey = findTranslateKey(range);

        if (translateKey && isFullTranslateBlockSelection(range, selectedText)) {
            this.props.setTextOverride(translateKey, translated);
        } else if (range) {
            replaceRangeText(range, translated);
        }

        this.hide();
    }

    doTranslate(targetLang) {
        const { selectedText, translating } = this.state;
        if (translating || !selectedText) return;
        if (!SUPPORTED_TRANSLATE_LANGS.includes(targetLang)) return;

        const sourceLang = detectSourceLang(selectedText);
        if (sourceLang === targetLang) {
            alert(t('translate_same_lang', this.props.locale));
            return;
        }

        this.setState({ translating: true });
        translateTexts([selectedText], sourceLang, targetLang)
            .done((res) => {
                if (res.message) alert(res.message);
                const translated = (res.translations && res.translations[0]) || '';
                if (!translated) {
                    alert(t('translation_empty', this.props.locale));
                    this.setState({ translating: false });
                    return;
                }
                this.applyTranslation(translated);
            })
            .fail((xhr) => {
                alert((xhr.responseJSON && xhr.responseJSON.error) || t('translation_failed', this.props.locale));
                this.setState({ translating: false });
            });
    }

    render() {
        const { visible, x, y, translating } = this.state;
        const locale = this.props.locale || 'zh';
        if (!visible) return null;

        return (
            <div
                className="translation-context-menu"
                style={{ left: x, top: y }}
                onMouseDown={this.stopMenuEvent}
                onClick={this.stopMenuEvent}>
                <p className="ctx-label">{t('translate_selection', locale)}</p>
                {TARGET_BUTTONS.map(({ code, labelKey }) => (
                    <button
                        key={code}
                        disabled={translating}
                        type="button"
                        onClick={() => this.doTranslate(code)}>
                        {translating ? '...' : t(labelKey, locale)}
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
    setTextOverride: (key, text) => dispatch(setTextOverride(key, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TranslationMenu);
