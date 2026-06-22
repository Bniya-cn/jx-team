import React from 'react';
import { Link } from 'react-router-dom';
import BuyNowBar from './buy_now_bar';
import ReviewsIndexContainer from '../../reviews/reviews_index_container';
import ReactToolTip from 'react-tooltip';
import {
    getGalleryImages,
    getLocalizedDescription,
    getReleaseDateLabel,
    getScreenshotImages,
    getTitleCardImage,
    getLocalizedGameTitle,
    getSystemRequirements,
    getPriceLabel,
} from '../../../util/game_helpers';
import { t, genreLabel as getGenreLabel } from '../../../util/i18n';

class GameDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePicIdx: 0,
        };
        this.intervalId = null;
        this.debounceInterval = this.debounceInterval.bind(this);
        this.scrollToReviews = this.scrollToReviews.bind(this);
    }
    componentDidMount() {
        this.props.requestOneGame(this.props.gameId);
        this.props.requestAllGameReviews(this.props.gameId);
        this.debounceInterval();
        window.scrollTo(0, 0);
    }
    scrollToReviews() {
        const section = document.getElementById('reviews-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    componentDidUpdate(oldProps, oldState) {
        if (oldProps.gameId !== this.props.gameId) {
            this.props.requestOneGame(this.props.gameId);
            this.props.requestAllGameReviews(this.props.gameId);
            this.setState({ activePicIdx: 0 });
            window.scrollTo(0, 0);
        } else {
            const oldGame = oldProps.games && oldProps.games[oldProps.gameId];
            const newGame = this.props.games && this.props.games[this.props.gameId];
            if (!oldGame && newGame) {
                window.scrollTo(0, 0);
            }
        }
        if (oldState.activePicIdx === null && this.props.games && Object.keys(this.props.games).length > 0) {
            this.setState({
                activePicIdx: 0,
            });
        }
        ReactToolTip.rebuild();
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    debounceInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            this.setState({
                activePicIdx:
                    this.state.activePicIdx === Object.values(this.props.games[this.props.gameId].gameImages).length - 2
                        ? 0
                        : this.state.activePicIdx + 1,
            });
        }, 5 * 1000);
    }
    render() {
        const { gameId, games, locale = 'zh', descriptionOverride } = this.props;
        const descKey = `game-desc-${gameId}`;
        const game = games && games[gameId];
        const titleCard = getTitleCardImage(game);
        const screenshots = getScreenshotImages(game);
        const galleryImages = getGalleryImages(game);

        const { reviewCount, recommendedCount } = this.props;
        const genreSlugs = game && game.genres && game.genres.length > 0 ? game.genres : game && game.genre ? [game.genre] : ['indie'];
        const primaryGenre = genreSlugs[0] || 'indie';
        const genreLabelText = getGenreLabel(primaryGenre, locale);
        const genreBrowsePath = `/browse/${primaryGenre}`;

        if (!game) {
            return <div></div>;
        }

        const reqs = getSystemRequirements(game, locale);
        const similarGames = games
            ? Object.values(games)
                .filter((g) => g.id !== game.id && g.genre === game.genre)
                .slice(0, 3)
            : [];
        return (
            <div className="game-show-page">
                <img className="background" src={galleryImages[0].img_url} />
                <div className="center-page-helper">
                    <div className="game-detail-container stage-panel" style={{ '--enter-delay': '80ms' }}>
                        <div className="game-detail-header">
                            <div className="gd-header-left">
                                <p>
                                    <Link to="/">
                                        <span>{t('all_games', locale)}</span>
                                    </Link>{' '}
                                    {'>'}{' '}
                                    <Link to={genreBrowsePath}>
                                        <span>{genreLabelText}</span>
                                    </Link>{' '}
                                    {'>'} <span>{getLocalizedGameTitle(game, locale)}</span>
                                </p>
                                <h2>{getLocalizedGameTitle(game, locale)}</h2>
                            </div>
                            <div className="gd-header-right">
                                <div className="community-hub" onClick={this.scrollToReviews} role="button">
                                    {t('community_hub', locale)}
                                </div>
                            </div>
                        </div>
                        <div className="game-detail-main">
                            <div className="game-detail-left">
                                <div className="big-picture">
                                    <img
                                        key={`${game.id}-${this.state.activePicIdx}`}
                                        className="detail-stage-image"
                                        src={screenshots[this.state.activePicIdx].img_url}
                                        alt={`${getLocalizedGameTitle(game, locale)} ${t('screenshot_alt', locale)}`}
                                    />
                                </div>
                                <div className="screenshots">
                                    {screenshots.map((screenshot, idx) => {
                                        return (
                                            <div
                                                key={`show-sc-${idx}`}
                                                className={
                                                    idx === this.state.activePicIdx ? 'screenshot active' : 'screenshot'
                                                }
                                                style={{ '--stagger-index': idx }}>
                                                <img
                                                    onClick={() => {
                                                        this.debounceInterval();
                                                        this.setState({
                                                            activePicIdx: idx,
                                                        });
                                                    }}
                                                    src={screenshot.img_url}
                                                    alt={`${getLocalizedGameTitle(game, locale)} ${t('screenshot_alt', locale)} ${idx + 1}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="game-detail-right">
                                <div className="title-card">
                                    {titleCard && <img src={titleCard.img_url} alt={getLocalizedGameTitle(game, locale)} />}
                                </div>
                                <div className="description">
                                    <p data-translate-key={descKey}>
                                        {getLocalizedDescription(game, locale, descriptionOverride)}
                                    </p>
                                </div>
                                <div className="bottom-half">
                                    <div className="reviews-left">
                                        <p>{t('recent_reviews', locale)}</p>
                                        <p>{t('all_reviews', locale)}</p>
                                    </div>
                                    <div className="reviews-right">
                                        <p>
                                            <span>
                                                {reviewCount > 0
                                                    ? t('mostly_positive', locale)
                                                    : t('no_reviews', locale)}
                                            </span>{' '}
                                            {reviewCount > 0 ? `(${recommendedCount})` : ''}
                                        </p>
                                        <p>
                                            <span>
                                                {reviewCount > 0
                                                    ? t('mostly_positive', locale)
                                                    : t('no_reviews', locale)}
                                            </span>{' '}
                                            {reviewCount > 0 ? `(${reviewCount})` : ''}
                                        </p>
                                    </div>

                                    <p className="releaseDate">{t('release_date', locale)}</p>
                                    <p className="date">{getReleaseDateLabel(game, locale)}</p>
                                    <div className="devpub-left">
                                        <p>{t('developer', locale)}</p>
                                        <p>{t('publisher', locale)}</p>
                                    </div>
                                    <div className="devpub-right">
                                        <p>
                                            <Link to={`/browse/dev-${encodeURIComponent(game.developer)}`}>
                                                {game.developer}
                                            </Link>
                                        </p>
                                        <p>
                                            <Link to={`/browse/pub-${encodeURIComponent(game.publisher)}`}>
                                                {game.publisher}
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="popular-tags">
                                    <p>{t('popular_tags', locale)}</p>
                                    <div className="tags">
                                        {genreSlugs.map((slug) => (
                                            <Link key={slug} className="tag" to={`/browse/${slug}`}>
                                                {getGenreLabel(slug, locale)}
                                            </Link>
                                        ))}
                                        {(game.tags || []).map((slug) => (
                                            <Link key={slug} className="tag" to={`/browse/tag-${slug}`}>
                                                {slug}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BuyNowBar
                        className="stage-panel"
                        style={{ '--enter-delay': '170ms' }}
                        game={game}
                        currentUserId={this.props.currentUserId}
                        locale={locale}
                    />

                    <div className="school-note-card stage-panel" style={{ '--enter-delay': '190ms' }}>
                        <div className="logo-section">
                            <img src={window.jxnuLogo || "/assets/jxnu-logo.svg"} alt="JXNU Logo" />
                            <h4>{locale === 'zh' ? '江西师范大学 - JX-Team 推荐' : 'Jiangxi Normal University - JX-Team Review'}</h4>
                        </div>
                        <p className="note-body">
                            {locale === 'zh' 
                                ? '本项目由江西师范大学数字媒体技术实践团队研发。结合 Steam 风格的游戏商城设计，围绕浏览、购买、库存与评测形成完整链路，本板块为江西师大校园专属推荐，突出作品集属性与学术实践特色。'
                                : 'This project is developed by the Digital Media Technology practice team of Jiangxi Normal University. It is a Steam-style storefront showcasing full browsing, purchasing, inventory, and review flows. This section is a campus-exclusive review, highlighting portfolio attributes and academic practice.'
                            }
                        </p>
                    </div>

                    <div className="system-requirements-card stage-panel" style={{ '--enter-delay': '210ms' }}>
                        <h3>{locale === 'zh' ? '系统需求' : 'System Requirements'}</h3>
                        <div className="requirements-grid">
                            <div className="req-column">
                                <h4>{locale === 'zh' ? '最低配置:' : 'Minimum:'}</h4>
                                <ul>
                                    <li><strong>{locale === 'zh' ? '操作系统: ' : 'OS: '}</strong>{reqs.minimum.os}</li>
                                    <li><strong>{locale === 'zh' ? '处理器: ' : 'Processor: '}</strong>{reqs.minimum.cpu}</li>
                                    <li><strong>{locale === 'zh' ? '内存: ' : 'Memory: '}</strong>{reqs.minimum.ram}</li>
                                    <li><strong>{locale === 'zh' ? '显卡: ' : 'Graphics: '}</strong>{reqs.minimum.gpu}</li>
                                    <li><strong>DirectX: </strong>{reqs.minimum.dx}</li>
                                    <li><strong>{locale === 'zh' ? '存储空间: ' : 'Storage: '}</strong>{reqs.minimum.storage}</li>
                                </ul>
                            </div>
                            <div className="req-column">
                                <h4>{locale === 'zh' ? '推荐配置:' : 'Recommended:'}</h4>
                                <ul>
                                    <li><strong>{locale === 'zh' ? '操作系统: ' : 'OS: '}</strong>{reqs.recommended.os}</li>
                                    <li><strong>{locale === 'zh' ? '处理器: ' : 'Processor: '}</strong>{reqs.recommended.cpu}</li>
                                    <li><strong>{locale === 'zh' ? '内存: ' : 'Memory: '}</strong>{reqs.recommended.ram}</li>
                                    <li><strong>{locale === 'zh' ? '显卡: ' : 'Graphics: '}</strong>{reqs.recommended.gpu}</li>
                                    <li><strong>DirectX: </strong>{reqs.recommended.dx}</li>
                                    <li><strong>{locale === 'zh' ? '存储空间: ' : 'Storage: '}</strong>{reqs.recommended.storage}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {similarGames.length > 0 && (
                        <div className="similar-games-section stage-panel" style={{ '--enter-delay': '250ms' }}>
                            <h3>{locale === 'zh' ? '相似游戏推荐' : 'Similar Games'}</h3>
                            <div className="similar-games-grid">
                                {similarGames.map((simGame) => {
                                    const simTitleCard = getTitleCardImage(simGame);
                                    return (
                                        <Link key={simGame.id} to={`/api/games/${simGame.id}`} className="similar-game-card">
                                            <div className="card-image">
                                                {simTitleCard && <img src={simTitleCard.img_url} alt={getLocalizedGameTitle(simGame, locale)} />}
                                            </div>
                                            <div className="card-info">
                                                <h4>{getLocalizedGameTitle(simGame, locale)}</h4>
                                                <p className="price">{getPriceLabel(simGame, '¥', locale)}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div id="reviews-section" className="stage-panel" style={{ '--enter-delay': '290ms' }}>
                        <ReviewsIndexContainer gameId={this.props.gameId} />
                    </div>
                </div>
            </div>
        );
    }
}

export default GameDetail;
