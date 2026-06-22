import React from 'react';
import { connect } from 'react-redux';
import AdminShell from './admin_shell';
import { fetchAdminGames, fetchAdminGenres, updateAdminGame } from '../../util/admin_util';
import { t } from '../../util/i18n';

const EMPTY_FORM = {
    featured: false,
    controller_support: false,
    genre_ids: [],
    sale_price: '',
    price: '',
};

class AdminGames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            genres: [],
            query: '',
            selectedGameId: null,
            form: EMPTY_FORM,
            loading: true,
            saving: false,
        };
        this.selectGame = this.selectGame.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        Promise.all([fetchAdminGames(), fetchAdminGenres()]).then(([games, genres]) => {
            const firstGameId = games[0] ? games[0].id : null;
            this.setState(
                {
                    games,
                    genres,
                    loading: false,
                    selectedGameId: firstGameId,
                },
                () => this.syncFormFromSelection()
            );
        });
    }

    syncFormFromSelection() {
        const game = this.selectedGame();
        if (!game) return;

        this.setState({
            form: {
                featured: Boolean(game.featured),
                controller_support: Boolean(game.controller_support),
                genre_ids: (game.genres || []).map((genre) => genre.id),
                sale_price: game.sale_price == null ? '' : String(game.sale_price),
                price: game.price == null ? '' : String(game.price),
            },
        });
    }

    selectedGame() {
        return this.state.games.find((game) => game.id === this.state.selectedGameId);
    }

    selectGame(gameId) {
        this.setState({ selectedGameId: gameId }, () => this.syncFormFromSelection());
    }

    handleSearch(e) {
        const query = e.currentTarget.value;
        this.setState({ query });
        fetchAdminGames(query).then((games) => {
            this.setState(
                {
                    games,
                    selectedGameId: games[0] ? games[0].id : null,
                },
                () => this.syncFormFromSelection()
            );
        });
    }

    handleCheckbox(field) {
        return (e) => {
            this.setState({
                form: {
                    ...this.state.form,
                    [field]: e.currentTarget.checked,
                },
            });
        };
    }

    handleInput(field) {
        return (e) => {
            this.setState({
                form: {
                    ...this.state.form,
                    [field]: e.currentTarget.value,
                },
            });
        };
    }

    handleGenreToggle(genreId) {
        return () => {
            const current = new Set(this.state.form.genre_ids);
            if (current.has(genreId)) current.delete(genreId);
            else current.add(genreId);

            this.setState({
                form: {
                    ...this.state.form,
                    genre_ids: Array.from(current),
                },
            });
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        const game = this.selectedGame();
        if (!game) return;

        this.setState({ saving: true });
        updateAdminGame(game.id, {
            featured: this.state.form.featured,
            controller_support: this.state.form.controller_support,
            price: Number(this.state.form.price || 0),
            sale_price: this.state.form.sale_price === '' ? null : Number(this.state.form.sale_price),
            genre_ids: this.state.form.genre_ids,
        }).then((updatedGame) => {
            this.setState((prevState) => ({
                saving: false,
                games: prevState.games.map((entry) => (entry.id === updatedGame.id ? updatedGame : entry)),
            }));
            this.selectGame(updatedGame.id);
        });
    }

    render() {
        const selectedGame = this.selectedGame();
        const locale = this.props.locale || 'zh';

        return (
            <AdminShell>
                <section className="admin-hero stage-panel" style={{ '--enter-delay': '60ms' }}>
                    <div>
                        <p className="admin-kicker">{t('admin_catalog_kicker', locale)}</p>
                        <h1>{t('admin_catalog_title', locale)}</h1>
                        <p>{t('admin_catalog_subtitle', locale)}</p>
                    </div>
                    <div className="admin-search">
                        <input
                            type="text"
                            value={this.state.query}
                            onChange={this.handleSearch}
                            placeholder={t('admin_search_placeholder', locale)}
                        />
                    </div>
                </section>

                {this.state.loading ? (
                    <p>{t('loading', locale)}</p>
                ) : (
                    <div className="admin-workspace">
                        <section className="admin-list-panel stage-panel" style={{ '--enter-delay': '120ms' }}>
                            <h3>{t('admin_games', locale)}</h3>
                            <ul className="admin-item-list">
                                {this.state.games.map((game) => (
                                    <li key={game.id}>
                                        <button
                                            type="button"
                                            className={game.id === this.state.selectedGameId ? 'active' : ''}
                                            onClick={() => this.selectGame(game.id)}>
                                            <strong>{game.title}</strong>
                                            <span>
                                                {(game.genres || []).map((genre) => genre.name).join(' / ') || game.genre}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="admin-editor-panel stage-panel" style={{ '--enter-delay': '170ms' }}>
                            {selectedGame ? (
                                <form className="admin-form" onSubmit={this.handleSubmit}>
                                    <div className="admin-form-header">
                                        <div>
                                            <h3>{selectedGame.title}</h3>
                                            <p>
                                                {selectedGame.developer} · {selectedGame.publisher}
                                            </p>
                                        </div>
                                        <button type="submit" disabled={this.state.saving}>
                                            {this.state.saving ? t('admin_saving', locale) : t('admin_save', locale)}
                                        </button>
                                    </div>

                                    <div className="admin-form-grid">
                                        <label>
                                            <span>{t('admin_price', locale)}</span>
                                            <input
                                                type="number"
                                                value={this.state.form.price}
                                                onChange={this.handleInput('price')}
                                            />
                                        </label>
                                        <label>
                                            <span>{t('admin_sale_price', locale)}</span>
                                            <input
                                                type="number"
                                                value={this.state.form.sale_price}
                                                onChange={this.handleInput('sale_price')}
                                            />
                                        </label>
                                    </div>

                                    <div className="admin-checkbox-row">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={this.state.form.featured}
                                                onChange={this.handleCheckbox('featured')}
                                            />
                                            <span>{t('admin_featured_toggle', locale)}</span>
                                        </label>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={this.state.form.controller_support}
                                                onChange={this.handleCheckbox('controller_support')}
                                            />
                                            <span>{t('admin_controller_toggle', locale)}</span>
                                        </label>
                                    </div>

                                    <div className="admin-genre-picker">
                                        <p>{t('admin_genres', locale)}</p>
                                        <div className="admin-chip-grid">
                                            {this.state.genres.map((genre) => {
                                                const active = this.state.form.genre_ids.includes(genre.id);
                                                return (
                                                    <button
                                                        key={genre.id}
                                                        type="button"
                                                        className={active ? 'active' : ''}
                                                        onClick={this.handleGenreToggle(genre.id)}>
                                                        {genre.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="admin-empty">
                                    <h2>{t('admin_no_games', locale)}</h2>
                                    <p>{t('admin_adjust_search', locale)}</p>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </AdminShell>
        );
    }
}

export default connect((state) => ({ locale: state.locale }))(AdminGames);
