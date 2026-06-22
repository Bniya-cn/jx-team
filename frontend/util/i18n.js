import UI_STRINGS from './locale_strings.json';

export const SUPPORTED_LOCALES = ['zh', 'en', 'ja', 'ko'];

const GENRE_LABELS = {
    action: { zh: '动作', en: 'Action', ja: 'アクション', ko: '액션' },
    indie: { zh: '独立', en: 'Indie', ja: 'インディー', ko: '인디' },
    rpg: { zh: '角色扮演', en: 'RPG', ja: 'RPG', ko: 'RPG' },
    strategy: { zh: '策略', en: 'Strategy', ja: 'ストラテジー', ko: '전략' },
    adventure: { zh: '动作冒险', en: 'Action & Adventure', ja: 'アクションアドベンチャー', ko: '액션 어드벤처' },
    casual: { zh: '休闲', en: 'Casual', ja: 'カジュアル', ko: '캐주얼' },
    mmo: { zh: '大型多人在线', en: 'MMO', ja: 'MMO', ko: 'MMO' },
    racing: { zh: '竞速', en: 'Racing', ja: 'レース', ko: '레이싱' },
    simulation: { zh: '模拟', en: 'Simulation', ja: 'シミュレーション', ko: '시뮬레이션' },
    sports: { zh: '体育', en: 'Sports', ja: 'スポーツ', ko: '스포츠' },
    'free-to-play': { zh: '免费开玩', en: 'Free to Play', ja: '基本プレイ無料', ko: '무료 플레이' },
    'early-access': { zh: '抢先体验', en: 'Early Access', ja: '早期アクセス', ko: '얼리 액세스' },
    vr: { zh: '虚拟现实', en: 'VR', ja: 'VR', ko: 'VR' },
};

/** 取 UI 文案 */
export const t = (key, locale = 'zh') => {
    const entry = UI_STRINGS[key];
    if (!entry) return key;
    return entry[locale] || entry.zh || entry.en || key;
};

/** 带变量的文案 */
export const tf = (key, locale = 'zh', vars = {}) => {
    const template = t(key, locale);
    return Object.entries(vars).reduce((text, [name, value]) => {
        return text.replace(new RegExp(`%\\{${name}\\}`, 'g'), String(value));
    }, template);
};

/** 类型 slug 对应本地化显示名 */
export const genreLabel = (slug, locale = 'zh') => {
    if (!slug) return t('game_fallback', locale);
    const entry = GENRE_LABELS[slug.toLowerCase()];
    if (!entry) return slug || t('game_fallback', locale);
    return entry[locale] || entry.zh;
};

export { UI_STRINGS, GENRE_LABELS };
