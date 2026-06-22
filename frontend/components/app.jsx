import { Route, Switch, withRouter } from 'react-router-dom';
import React from 'react';
import ReactToolTip from 'react-tooltip';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import LogInFormContainer from '../components/session_form/login-form-container';
import SignUpFormContainer from '../components/session_form/signup-form-container';
import MainHeader from './main_header/main_header_container';
import GameDetailContainer from './games/show/game_detail_container';
import ShoppingCartContainer from './shopping_cart/shopping_cart_container';
import HomePage from './pages/homepage';
import LibraryContainer from './games_library/library_container';
import WishlistContainer from './wishlist/wishlist_container';
import BrowsePageContainer from './browse/browse_page_container';
import DiscoverPageContainer from './discover/discover_page_container';
import NewsPage from './news/news_page';
import StatsPage from './pages/stats_page';
import AboutPage from './pages/about_page';
import SupportPage from './pages/support_page';
import LegalTermsPage from './pages/legal_terms_page';
import LegalPrivacyPage from './pages/legal_privacy_page';
import NotificationsPage from './pages/notifications_page';
import GiftCardsPage from './pages/gift_cards_page';
import CuratorsPageContainer from './pages/curators_page_container';
import AccountPage from './pages/account_page';
import SettingsPage from './pages/settings_page';
import BadgesPageContainer from './pages/badges_page_container';
import ActivityPage from './pages/activity_page';
import RecommendationsPageContainer from './pages/recommendations_page_container';
import TagsPage from './pages/tags_page';
import DemoModal from './shared/demo_modal';
import TranslationMenu from './translation/translation_menu';
import AdminDashboard from './admin/admin_dashboard';
import AdminGames from './admin/admin_games';
import AdminContent from './admin/admin_content';

import Footer from './footer/footer';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { demoOpen: false };
    }

    componentDidMount() {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.openDemoModal = () => this.setState({ demoOpen: true });
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.demo-modal-trigger')) {
                e.preventDefault();
                this.setState({ demoOpen: true });
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location && prevProps.location && this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    componentWillUnmount() {
        delete window.openDemoModal;
    }

    render() {
        const routeKey = this.props.location ? this.props.location.pathname : 'root';

        return (
            <div>
                <header>
                    <MainHeader />
                    <ReactToolTip place="top" id="fake-link">
                        功能开发中
                    </ReactToolTip>
                </header>
                <TranslationMenu />
                <DemoModal open={this.state.demoOpen} onClose={() => this.setState({ demoOpen: false })} />
                <div key={routeKey} className="main-body-section route-stage">
                    <Switch>
                        <AuthRoute path="/login" component={LogInFormContainer} />
                        <AuthRoute path="/signup" component={SignUpFormContainer} />
                        <ProtectedRoute path="/cart" component={ShoppingCartContainer} />
                        <ProtectedRoute path="/wishlist" component={WishlistContainer} />
                        <ProtectedRoute path="/discover" component={DiscoverPageContainer} />
                        <ProtectedRoute path="/recommendations" component={RecommendationsPageContainer} />
                        <ProtectedRoute path="/account" component={AccountPage} />
                        <ProtectedRoute path="/badges" component={BadgesPageContainer} />
                        <ProtectedRoute path="/admin/games" component={AdminGames} />
                        <ProtectedRoute path="/admin/content" component={AdminContent} />
                        <ProtectedRoute path="/admin" component={AdminDashboard} />
                        <Route path="/browse/:filter" component={BrowsePageContainer} />
                        <Route path="/news" component={NewsPage} />
                        <Route path="/stats" component={StatsPage} />
                        <Route path="/about" component={AboutPage} />
                        <Route path="/support" component={SupportPage} />
                        <Route path="/legal/terms" component={LegalTermsPage} />
                        <Route path="/legal/privacy" component={LegalPrivacyPage} />
                        <Route path="/notifications" component={NotificationsPage} />
                        <Route path="/gift-cards" component={GiftCardsPage} />
                        <Route path="/curators" component={CuratorsPageContainer} />
                        <Route path="/settings" component={SettingsPage} />
                        <Route path="/activity" component={ActivityPage} />
                        <Route path="/tags" component={TagsPage} />
                        <Route path={`/api/games/:id`} component={GameDetailContainer} />
                        <Route path={`/api/users/:id`} component={LibraryContainer} />
                        <Route exact path="/" component={HomePage} />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(App);
