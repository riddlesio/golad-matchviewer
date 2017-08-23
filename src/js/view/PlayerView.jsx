import React from 'react';
import createView from 'omniscient';

const PlayerView = createView(function (data) {

    const { state, settings } = data;
    const composedPlayers = state.players.map(player => ({
        ...player,
        ...settings.players[player.id],
    }));
    const activePlayersIds = state.players
        .filter(player => player.move)
        .map(player => player.id);

    return <div className='Playerview'>
        { composedPlayers.map(getPlayerRenderer(activePlayersIds)) }
    </div>;
});

function getPlayerRenderer(activePlayersIds) {

    return function renderPlayer(player, index) {

        const defaultHref = encodeURIComponent(
            'https://storage.googleapis.com/riddles-images/riddles-avatar-solo-47.png');
        const playerColorClass = ` player--player${player.id}`;
        const isActive = activePlayersIds.some(id => id === player.id);
        const activeClass = isActive ? ' player--active' : '';
        const passing = player.move && player.move.moveType === 'pass';

        return <div
            key={ `Player-${index}` }
            className={ `player-wrapper${playerColorClass}${activeClass}` }>
            <div className={ `player-avatar-wrapper` } >
                <img
                    className="player-avatar"
                    src={ `https://www.gravatar.com/avatar/${player.emailHash}?d=${defaultHref}&s=55` }
                    alt="avatar"/>
                <div className="player-avatar-frame" />
                <div className="player-avatar-frame-preload0" />
                <div className="player-avatar-frame-preload1" />
            </div>
            <div className="player-info">
                <div className="player-name u-text-shadow">
                    { player.alias }
                </div>
                <div className="player-score">
                    <div className="player-score-icon" />
                    <span className="player-score-score">{ player.score }</span>
                    { passing && <span className="player-score-pass">pass</span>}
                </div>
            </div>
        </div>;
    };
}

export default PlayerView;
