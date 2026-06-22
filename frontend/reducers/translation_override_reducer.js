import { SET_LOCALE } from '../actions/locale_actions';
import { SET_TEXT_OVERRIDE } from '../actions/translation_override_actions';

// 划词翻译结果覆盖（切换界面语言时清空）
const translationOverrideReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_TEXT_OVERRIDE:
            return { ...state, [action.key]: action.text };
        case SET_LOCALE:
            return {};
        default:
            return state;
    }
};

export default translationOverrideReducer;
