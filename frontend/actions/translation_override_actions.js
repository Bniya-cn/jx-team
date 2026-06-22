export const SET_TEXT_OVERRIDE = 'SET_TEXT_OVERRIDE';

/** 划词 AI 翻译后写回 React 管理的文案区域 */
export const setTextOverride = (key, text) => ({
    type: SET_TEXT_OVERRIDE,
    key,
    text,
});
