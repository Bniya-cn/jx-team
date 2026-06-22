import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import { getPriceLabel, getScreenshotImages, getTitleCardImage } from '../../util/game_helpers';
import { t } from '../../util/i18n';

class DiscoverPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentGame: null };
        this.pickNext = this.pickNext.bind(this);
    }

    componentDidMount() {
        this.props.requestAllGames();
        if (this.props.currentUserId) {
            this.props.fetchUser(this.props.currentUserId);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.games !== prevProps.games || this.props.ownedGameIds !== prevProps.ownedGameIds) {
            if (!this.state.currentGame) {
                this.pickNext();
            }
        }
    }

    pickNext() {
        const owned = new Set(this.props.ownedGameIds || []);
        const candidates = (this.props.games || []).filter((g) => !owned.has(g.id));
        if (candidates.length === 0) {
            this.setState({ currentGame: null });
            return;
        }
        const idx = Math.floor(Math.random() * candidates.length);
        this.setState({ currentGame: candidates[idx] });
    }

    render() {
        const game = this.state.currentGame;
        const titleCard = getTitleCardImage(game);
        const screenshot = getScreenshotImages(game, 1)[0];
        const locale = this.props.locale || 'zh';

        return (
            <div className="homepage discover-page">
                <Sidebar />
                <div className="main-content">
                    <h2>{t('discover_title', locale)}</h2>
                    <p>{t('discover_subtitle', locale)}</p>
                    {game ? (
                        <div className="discover-card">
                            {screenshot && <img src={screenshot.img_url} alt={game.title} />}
                            <div className="discover-info">
                                {titleCard && <img className="discover-title-card" src={titleCard.img_url} alt="" />}
                                <h3>{game.title}</h3>
                                <p>{game.shortDescription || game.description}</p>
                                <p className="discover-price">{getPriceLabel(game, '¥', locale)}</p>
                                <div className="discover-actions">
                                    <Link to={`/api/games/${game.id}`} className="discover-link">
                                        {t('discover_view_details', locale)}
                                    </Link>
                                    <button onClick={this.pickNext}>{t('discover_next', locale)}</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>{t('discover_empty', locale)}</p>
                    )}
                </div>
            </div>
        );
    }
}

export default DiscoverPage;
