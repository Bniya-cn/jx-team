import React from 'react';
import { Link } from 'react-router-dom';
import HeaderDropDownContainer from '../dropdowns/header_dropdown';
import TranslationToolbar from '../translation/translation_toolbar';
import { t } from '../../util/i18n';

class MainHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrolled: false,
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.handleScroll();
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const nextScrolled = window.scrollY > 18;
        if (nextScrolled !== this.state.scrolled) {
            this.setState({ scrolled: nextScrolled });
        }
    }

    navIsActive(section) {
        const pathname = (this.props.location && this.props.location.pathname) || '/';
        const sectionMatchers = {
            store: ['/', '/browse', '/discover', '/wishlist', '/news', '/stats', '/api/games'],
            community: ['/activity', '/curators', '/recommendations', '/tags', '/notifications'],
            profile: ['/account', '/badges', '/settings', '/api/users', '/admin'],
            about: ['/about', '/support', '/gift-cards', '/legal'],
        };

        return (sectionMatchers[section] || []).some((prefix) => {
            if (prefix === '/') return pathname === '/';
            return pathname.startsWith(prefix);
        });
    }

    openDemo(e) {
        e.preventDefault();
        if (window.openDemoModal) window.openDemoModal();
    }

    render() {
        const installButtonColor = this.props.loggedIn ? 'grey' : 'orange';
        const userId = this.props.id;
        const locale = this.props.locale || 'zh';
        const headerClassName = this.state.scrolled ? 'header-container scrolled' : 'header-container';
        const storeTitleClass = this.navIsActive('store') ? 'store-dropdown nav-pill active' : 'store-dropdown nav-pill';
        const communityTitleClass = this.navIsActive('community')
            ? 'community-dropdown nav-pill active'
            : 'community-dropdown nav-pill';
        const aboutTitleClass = this.navIsActive('about') ? 'about-dropdown nav-pill active' : 'about-dropdown nav-pill';
        const supportClassName = this.navIsActive('about') ? 'active-link' : '';

        return (
            <div className={headerClassName}>
                <div className="main-header">
                    <Link className="logo-container" to="/">
                        {window.jxnuLogo ? (
                            <img className="logo-img" src={window.jxnuLogo} alt="JXNU Logo" />
                        ) : (
                            <div className="logo">
                                <i className="fas fa-cogs"></i>
                            </div>
                        )}
                        <h1>JX-Team</h1>
                    </Link>

                    <nav className="main-header-nav">
                        <ul>
                            <li>
                                <HeaderDropDownContainer
                                    buttonName={'store-button'}
                                    hasHover={true}
                                    titleItem={<span className={storeTitleClass}>{t('nav_store', locale)}</span>}
                                    listItems={[
                                        <Link to="/">{t('nav_home', locale)}</Link>,
                                        <Link to="/discover" data-place="left">
                                            {t('nav_discover', locale)}
                                        </Link>,
                                        <Link to="/wishlist" data-place="left">
                                            {t('nav_wishlist', locale)}
                                        </Link>,
                                        <Link to="/news" data-place="left">
                                            {t('nav_news', locale)}
                                        </Link>,
                                        <Link to="/stats" data-place="left">
                                            {t('nav_stats', locale)}
                                        </Link>,
                                        <Link to="/about" data-place="left">
                                            {t('nav_about', locale)}
                                        </Link>,
                                    ]}
                                />
                            </li>
                            <li>
                                <HeaderDropDownContainer
                                    buttonName={'community-button'}
                                    hasHover={true}
                                    titleItem={<span className={communityTitleClass}>{t('nav_community', locale)}</span>}
                                    listItems={[
                                        <Link to="/">{t('nav_home', locale)}</Link>,
                                        <Link to="/activity" data-place="left">
                                            {t('nav_discussions', locale)}
                                        </Link>,
                                        <Link to="/curators" data-place="left">
                                            {t('nav_workshop', locale)}
                                        </Link>,
                                        <Link to="/browse/specials" data-place="left">
                                            {t('nav_market', locale)}
                                        </Link>,
                                        <Link to="/news" data-place="left">
                                            {t('nav_broadcasts', locale)}
                                        </Link>,
                                    ]}
                                />
                            </li>
                            {this.props.loggedIn ? (
                                <li>
                                    <HeaderDropDownContainer
                                        buttonName={'main-username-button'}
                                        hasHover={true}
                                        titleItem={<p>{this.props.username}</p>}
                                        listItems={[
                                            <Link to="/activity" data-place="left">
                                                {t('nav_activity', locale)}
                                            </Link>,
                                            <Link to={`/api/users/${userId}`}>{t('nav_profile', locale)}</Link>,
                                            <Link to="/recommendations" data-place="left">
                                                {t('nav_friends', locale)}
                                            </Link>,
                                            <Link to="/tags" data-place="left">
                                                {t('nav_groups', locale)}
                                            </Link>,
                                            <Link to="/news" data-place="left">
                                                {t('nav_content', locale)}
                                            </Link>,
                                            <Link to="/badges" data-place="left">
                                                {t('nav_badges', locale)}
                                            </Link>,
                                            <Link to={`/api/users/${userId}`} data-place="left">
                                                {t('nav_library', locale)}
                                            </Link>,
                                        ]}
                                    />
                                </li>
                            ) : (
                                <li>
                                    <Link to="/support" data-place="bottom" className={supportClassName}>
                                        {t('nav_support', locale)}
                                    </Link>
                                </li>
                            )}

                            <li>
                                <HeaderDropDownContainer
                                    buttonName="about-button"
                                    hasHover={true}
                                    titleItem={<span className={aboutTitleClass}>{t('nav_about', locale)}</span>}
                                    listItems={[
                                        <Link to="/about">
                                            <i className="fas fa-info-circle"></i> {t('nav_about_project', locale)}
                                        </Link>,
                                        <a target="_blank" href="https://github.com/lrharris215" rel="noreferrer">
                                            <i className="fab fa-github"></i> Github
                                        </a>,
                                    ]}
                                />
                            </li>
                        </ul>
                    </nav>

                    <div className="right-main-header">
                        {this.props.isAdmin && (
                            <Link to="/admin" className="admin-shortcut" data-place="bottom">
                                {t('nav_admin', locale)}
                            </Link>
                        )}
                        <TranslationToolbar />
                        <div
                            className={`install-button ${installButtonColor} demo-modal-trigger`}
                            data-place="bottom"
                            onClick={(e) => this.openDemo(e)}>
                            <i className="fas fa-download"></i>
                            {t('nav_install', locale)}
                        </div>
                        {this.props.loggedIn ? (
                            <div className="loggedIn-right-header">
                                <Link to="/notifications" className="envelope" data-place="bottom">
                                    <i className="fas fa-envelope"></i>
                                </Link>

                                <HeaderDropDownContainer
                                    buttonName={'username-button'}
                                    titleItem={
                                        <p className="username-dropdown">
                                            {this.props.username}
                                            <i className="fas fa-caret-down"></i>
                                        </p>
                                    }
                                    listItems={[
                                        <Link to={`/api/users/${userId}`}>{t('nav_view_profile', locale)}</Link>,
                                        <Link to="/account" data-place="left">
                                            {t('nav_account', locale)}
                                        </Link>,
                                        <button className="logout-button" onClick={this.props.logoutUser}>
                                            {t('nav_logout', locale)}：<span className="yellow-text">{this.props.username}</span>
                                        </button>,
                                        <Link to="/settings" data-place="left">
                                            {t('nav_settings', locale)}
                                        </Link>,
                                    ]}
                                />
                                <div className="profile-pic">
                                    <img src={window.cubeURL} alt="avatar" />
                                </div>
                            </div>
                        ) : (
                            <div className="loggedOut-right-header">
                                <Link to="/login">{t('nav_login', locale)}</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default MainHeader;
