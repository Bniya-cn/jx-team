import React from 'react';
import LibraryDropdown from '../dropdowns/library_dropdown';
import { Link } from 'react-router-dom';
import { getLocalizedGameTitle } from '../../util/game_helpers';

export default (props) => {
    const game = props.game;
    const locale = props.locale || 'zh';

    const titleCard = game.titleCard && game.titleCard[0];

    const hoursPlayed = props.user.id * game.id * 42;
    return (
        <div className="library-index-item">
            <div className="title-card">
                {titleCard && <img src={titleCard.img_url} />}
            </div>
            <div className="words">
                <div className="title">{getLocalizedGameTitle(game, locale)}</div>
                <div className="hours">游戏时长 {hoursPlayed} 小时</div>
                <div className="link-drop-downs">
                    <LibraryDropdown
                        buttonName="links-button"
                        titleItem={
                            <p className="links-dropdown">
                                <i className="fas fa-link"></i> <span>链接</span>
                                <i className="fas fa-caret-down"></i>
                            </p>
                        }
                        listItems={[<Link to={`/api/games/${game.id}`}>访问商店页面</Link>]}
                    />
                </div>
            </div>
        </div>
    );
};
