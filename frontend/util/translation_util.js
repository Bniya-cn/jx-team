// DeepSeek 划词翻译（经 Rails 代理，不暴露 API Key）

export const SUPPORTED_TRANSLATE_LANGS = ['zh', 'en', 'ja', 'ko'];

export const translateTexts = (texts, sourceLang, targetLang) => {
    return $.ajax({
        method: 'POST',
        url: '/api/translate',
        contentType: 'application/json',
        data: JSON.stringify({
            texts,
            source_lang: sourceLang,
            target_lang: targetLang,
        }),
    });
};

/** 根据字符集粗略判断源语言 */
export const detectSourceLang = (text) => {
    if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(text)) return 'ja';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    return 'en';
};

const getElementFromRange = (range) => {
    if (!range) return null;
    let node = range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    return node;
};

/** 查找带 data-translate-key 的 React 文案容器 */
export const findTranslateKey = (range) => {
    const node = getElementFromRange(range);
    if (!node || !node.closest) return null;
    const el = node.closest('[data-translate-key]');
    return el ? el.getAttribute('data-translate-key') : null;
};

/** 判断选中的是否为整个可翻译区块 */
export const isFullTranslateBlockSelection = (range, selectedText) => {
    const node = getElementFromRange(range);
    if (!node || !node.closest) return false;
    const el = node.closest('[data-translate-key]');
    if (!el) return false;
    return el.textContent.trim() === selectedText.trim();
};

/** 将译文写回选区（非 React 管控的纯 DOM 文本） */
export const replaceRangeText = (range, newText) => {
    if (!range || newText == null) return false;
    try {
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
        return true;
    } catch (e) {
        return false;
    }
};
