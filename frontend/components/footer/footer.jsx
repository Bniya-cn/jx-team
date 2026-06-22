import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const FOOTER_STRINGS = {
    copyright: {
        zh: "© 2026 Valve Corporation。保留所有权利。所有商标均为其在美国及其他国家/地区的各自持有者所有。所有的价格均已包含增值税（如适用）。",
        en: "© 2026 Valve Corporation. All rights reserved. All trademarks are property of their respective owners in the US and other countries. All prices include VAT where applicable.",
        ja: "© 2026 Valve Corporation. All rights reserved. すべての商標は、米国およびその他の国におけるそれぞれの所有者に帰属します。表示価格には、該当する場合、消費税が含まれます。",
        ko: "© 2026 Valve Corporation. All rights reserved. 모든 상표는 미국 및 기타 국가에서 각각 해당 소유자의 자산입니다. 모든 가격에는 부가가치세가 포함되어 있습니다(해당하는 경우)."
    },
    about_steam: { zh: "关于 Steam", en: "About Steam", ja: "Steam について", ko: "Steam 정보" },
    subscriber_agreement: { zh: "Steam 订阅协议", en: "Steam Subscriber Agreement", ja: "Steam 利用規約", ko: "Steam 이용 약관" },
    steamworks: { zh: "Steamworks", en: "Steamworks", ja: "Steamworks", ko: "Steamworks" },
    distribution: { zh: "Steam 分销", en: "Steam Distribution", ja: "Steam パブリッシング", ko: "Steam 배급" },
    gift_cards: { zh: "礼物卡", en: "Gift Cards", ja: "ギフトカード", ko: "기프트 카드" },
    about_valve: { zh: "关于 Valve", en: "About Valve", ja: "Valve について", ko: "Valve 정보" },
    jobs: { zh: "工作机会", en: "Jobs", ja: "採用情報", ko: "채용 정보" },
    hardware: { zh: "硬件", en: "Hardware", ja: "ハードウェア", ko: "하드웨어" },
    recycling: { zh: "回收", en: "Recycling", ja: "リサイクル", ko: "재활용" },
    privacy: { zh: "隐私", en: "Privacy Policy", ja: "個人情報保護方針", ko: "개인정보 처리방침" },
    accessibility: { zh: "无障碍", en: "Accessibility", ja: "アクセシビリティ", ko: "접근성" },
    legal: { zh: "通知与政策", en: "Legal", ja: "法的通知", ko: "법적 고지" },
    cookies: { zh: "Cookie", en: "Cookies", ja: "Cookie", ko: "쿠키" },
    refunds: { zh: "退款", en: "Refunds", ja: "返金", ko: "환불" },
    install: { zh: "下载 Steam", en: "Install Steam", ja: "Steamをインストール", ko: "Steam 설치" },
    mobile: { zh: "下载手机应用", en: "Mobile App", ja: "モバイルアプリ", ko: "모바일 앱" },
    support: { zh: "联系客服", en: "Support", ja: "サポート", ko: "지원" },
    account: { zh: "我的账户", en: "My Account", ja: "マイアカウント", ko: "내 계정" }
};

class Footer extends React.Component {
    render() {
        const locale = this.props.locale || 'zh';
        const t = (key) => FOOTER_STRINGS[key]?.[locale] || FOOTER_STRINGS[key]?.zh || key;

        return (
            <footer className="steam-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="logo-row">
                            <i className="fab fa-steam footer-logo"></i>
                            <span className="logo-divider">|</span>
                            <span className="valve-logo">VALVE</span>
                        </div>
                        <p className="copyright-text">{t('copyright')}</p>
                        <div className="social-row">
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                        </div>
                    </div>
                    <div className="footer-right">
                        <div className="links-col">
                            <h4>STEAM</h4>
                            <Link to="/about">{t('about_steam')}</Link>
                            <Link to="/legal/terms">{t('subscriber_agreement')}</Link>
                            <a href="#" className="demo-modal-trigger">{t('steamworks')}</a>
                            <a href="#" className="demo-modal-trigger">{t('distribution')}</a>
                            <Link to="/gift-cards">{t('gift_cards')}</Link>
                        </div>
                        <div className="links-col">
                            <h4>VALVE</h4>
                            <Link to="/about">{t('about_valve')}</Link>
                            <a href="#" className="demo-modal-trigger">{t('jobs')}</a>
                            <a href="#" className="demo-modal-trigger">{t('hardware')}</a>
                            <a href="#" className="demo-modal-trigger">{t('recycling')}</a>
                        </div>
                        <div className="links-col">
                            <h4>法律信息</h4>
                            <Link to="/legal/privacy">{t('privacy')}</Link>
                            <a href="#" className="demo-modal-trigger">{t('accessibility')}</a>
                            <Link to="/legal/terms">{t('legal')}</Link>
                            <Link to="/settings">{t('cookies')}</Link>
                            <Link to="/support">{t('refunds')}</Link>
                        </div>
                        <div className="links-col">
                            <h4>更多</h4>
                            <a href="#" className="demo-modal-trigger">{t('install')}</a>
                            <a href="#" className="demo-modal-trigger">{t('mobile')}</a>
                            <Link to="/support">{t('support')}</Link>
                            <Link to="/account">{t('account')}</Link>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = (state) => ({
    locale: state.locale
});

export default connect(mapStateToProps)(Footer);
