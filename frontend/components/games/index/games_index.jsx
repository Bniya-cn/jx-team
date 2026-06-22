import React from 'react';
import { Link } from 'react-router-dom';
import GameIndexItem from './games_index_item';
import ReactToolTip from 'react-tooltip';
import { t } from '../../../util/i18n';

class GamesIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGame: null,
        };
        this.sortGamesByReleaseDate = this.sortGamesByReleaseDate.bind(this);
    }

    componentDidMount() {
        this.props.requestAllGames();
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldState.activeGame === null && this.props.games.length > 0) {
            const sorted = [...this.props.games].sort(this.sortGamesByReleaseDate);
            this.setState({
                activeGame: sorted[0].id,
            });
            ReactToolTip.rebuild();
        }
    }

    sortGamesByReleaseDate(a, b) {
        if (a.release_date > b.release_date) {
            return -1;
        } else if (a.release_date === b.release_date) {
            return 0;
        } else return 1;
    }

    render() {
        const locale = this.props.locale || 'zh';
        let sortedGames = this.props.games && [...this.props.games].sort(this.sortGamesByReleaseDate);
        if (!sortedGames) return null;

        // Homepage list shows top 10 new releases
        const homepageGames = sortedGames.slice(0, 10);

        const mappedGames = homepageGames.map((game, idx) => {
            const reviewCount = this.props.reviewCounts[game.id] || 0;
            return (
                <li
                    key={`game-${game.id}`}
                    className="stagger-item"
                    style={{ '--stagger-index': idx }}
                    onMouseEnter={() => {
                        this.setState({ activeGame: game.id });
                    }}>
                    <GameIndexItem 
                        isActive={this.state.activeGame === game.id} 
                        game={game} 
                        reviewCount={reviewCount}
                        locale={locale} 
                    />
                </li>
            );
        });

        return (
            <div className="index-container stage-panel" style={{ '--enter-delay': '120ms' }}>
                <div className="index-left-side">
                    <div className="index-header-row">
                        <p>{t('see_more', locale)}</p>
                        <div>
                            <Link to="/browse/new">{t('new_releases', locale)}</Link>
                        </div>
                    </div>
                    <ul className="stagger-list" style={{ '--stagger-offset': '190ms' }}>
                        {mappedGames}
                    </ul>
                    {sortedGames.length > 10 && (
                        <div className="index-more-button-row">
                            <Link to="/browse/new" className="index-more-button">
                                {t('new_releases', locale)} &raquo;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default GamesIndex;
