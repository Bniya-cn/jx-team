#!/usr/bin/env node
// 本地语言切换单元测试

const assert = require('assert');
const path = require('path');

const UI_STRINGS = require(path.resolve(__dirname, '../frontend/util/locale_strings.json'));
const { getDescriptionLocalized, DESCRIPTIONS_BY_APPID } = require(path.resolve(
    __dirname,
    '../frontend/util/game_descriptions.cjs'
));

const t = (key, locale = 'zh') => {
    const entry = UI_STRINGS[key];
    if (!entry) return key;
    return entry[locale] || entry.zh;
};

const getLocalizedDescription = (game, locale) => {
    if (!game) return '';
    if (locale === 'en') return game.shortDescription || '';
    const localized = getDescriptionLocalized(game.appid, locale);
    return localized || game.shortDescription || '';
};

assert.strictEqual(t('featured_title', 'zh'), '精选与推荐');
assert.strictEqual(t('featured_title', 'ja'), '注目＆おすすめ');
assert.strictEqual(t('featured_title', 'ko'), '추천 및 인기');
assert.strictEqual(t('add_to_cart', 'ja'), 'カートに入れる');
assert.ok(getDescriptionLocalized(367520, 'zh').includes('空洞骑士'));
assert.ok(getDescriptionLocalized(367520, 'ja').includes('Hollow Knight'));
assert.ok(getDescriptionLocalized(367520, 'ko').includes('Hollow Knight'));
assert.strictEqual(
    getLocalizedDescription({ appid: 367520, shortDescription: 'Forge your own path' }, 'ja'),
    DESCRIPTIONS_BY_APPID[367520].ja
);
assert.strictEqual(
    getLocalizedDescription({ appid: 367520, shortDescription: 'Forge your own path' }, 'en'),
    'Forge your own path'
);

console.log('locale tests passed');
