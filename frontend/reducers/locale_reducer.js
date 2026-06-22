import { SET_LOCALE } from '../actions/locale_actions';
import { SUPPORTED_LOCALES } from '../util/i18n';

const STORAGE_KEY = 'jx_team_locale';

const readStoredLocale = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED_LOCALES.includes(saved) ? saved : 'zh';
    } catch (e) {
        return 'zh';
    }
};

const localeReducer = (state = readStoredLocale(), action) => {
    switch (action.type) {
        case SET_LOCALE:
            if (!SUPPORTED_LOCALES.includes(action.locale)) return state;
            try {
                localStorage.setItem(STORAGE_KEY, action.locale);
            } catch (e) {
                // 隐私模式等场景下忽略写入失败
            }
            return action.locale;
        default:
            return state;
    }
};

export default localeReducer;
