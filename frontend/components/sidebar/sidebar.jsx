import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { genreLabel, t } from '../../util/i18n';

class Sidebar extends React.Component {
    render() {
        const locale = this.props.locale || 'zh';

        return (
            <div className="sidebar">
                <div className="giftcards-pic">
                    <img src={window.giftCards} alt={t('sidebar_gift_cards', locale)} />
                    <div className="sidebar-logo">
                        <div className="logo">
                            <i className="fas fa-cogs"></i>
                        </div>
                        <h4>JX-Team</h4>
                    </div>
                </div>
                <ul className="giftCard-list">
                    <li>
                        <Link to="/gift-cards">{t('sidebar_gift_cards', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/featured">{t('sidebar_now_available', locale)}</Link>
                    </li>
                </ul>
                <ul>
                    <li>{t('sidebar_recommended', locale)}</li>
                    <li>
                        <Link to="/recommendations">
                            <i className="fas fa-users"></i> {t('sidebar_friend_recommendations', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/curators">
                            <i className="fas fa-lightbulb"></i> {t('sidebar_curator_recommendations', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/tags">
                            <i className="fas fa-tags"></i> {t('sidebar_tags', locale)}
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>{t('sidebar_discovery_queue', locale)}</li>
                    <li>
                        <Link to="/browse/featured">
                            <i className="fas fa-newspaper"></i> {t('sidebar_for_you', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/new">
                            <i className="fas fa-plus-square"></i> {t('new_releases', locale)}
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>{t('sidebar_browse', locale)}</li>
                    <li>
                        <Link to="/browse/featured">
                            <i className="fas fa-chart-line"></i> {t('sidebar_top_sellers', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/new">
                            <i className="fas fa-plus-square"></i> {t('new_releases', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/upcoming">
                            <i className="fas fa-angle-up"></i> {t('sidebar_upcoming', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/specials">
                            <i className="fas fa-percent"></i> {t('sidebar_specials', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/vr">
                            <i className="fas fa-cloud"></i> {genreLabel('vr', locale)}
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse/controller">
                            <i className="fas fa-gamepad"></i> {t('sidebar_controller', locale)}
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>{t('sidebar_browse_by_genre', locale)}</li>
                    <li>
                        <Link to="/browse/action">{genreLabel('action', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/free-to-play">{genreLabel('free-to-play', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/early-access">{genreLabel('early-access', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/adventure">{genreLabel('adventure', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/casual">{genreLabel('casual', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/indie">{genreLabel('indie', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/mmo">{genreLabel('mmo', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/racing">{genreLabel('racing', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/rpg">{genreLabel('rpg', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/simulation">{genreLabel('simulation', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/sports">{genreLabel('sports', locale)}</Link>
                    </li>
                    <li>
                        <Link to="/browse/strategy">{genreLabel('strategy', locale)}</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(Sidebar);
