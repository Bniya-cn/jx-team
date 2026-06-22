export const SET_LOCALE = 'SET_LOCALE';

/** 切换界面语言（zh / en），商店页使用本地文案，不请求翻译 API */
export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale,
});
