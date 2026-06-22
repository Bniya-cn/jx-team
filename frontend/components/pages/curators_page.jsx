import React from 'react';
import { Link } from 'react-router-dom';
import StaticPageLayout from '../shared/static_page_layout';
import { t } from '../../util/i18n';
import { fetchCuratorPicks } from '../../util/content_util';

class CuratorsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { picks: [], loading: true };
    }

    componentDidMount() {
        fetchCuratorPicks().done((picks) => this.setState({ picks, loading: false }));
    }

    render() {
        const locale = this.props.locale || 'zh';

        return (
            <StaticPageLayout title={t('curators_title', locale)}>
                {this.state.loading ? (
                    <p>{t('loading', locale)}</p>
                ) : (
                    <ul className="curator-list">
                        {this.state.picks.map((pick) => (
                            <li key={pick.id} className="curator-card">
                                <h4>{pick.curator_name}</h4>
                                <p>{pick.note}</p>
                                <Link to={`/api/games/${pick.game_id}`}>{pick.game_title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </StaticPageLayout>
        );
    }
}

export default CuratorsPage;
