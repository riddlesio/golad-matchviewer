import React from 'react';
import createView from 'omniscient';

const PlayerView = createView(function (data) {

    const { state, settings, players, orientation } = data;
    const composedPlayers = players.map(player => ({
        ...player,
        ...settings.players[player.id],
    }));
    const activePlayers = state.players.filter(player => player.move);

    return (<div className={ `PlayerView PlayerView--${orientation}` } >
        { composedPlayers.map(getPlayerRenderer(activePlayers)) }
    </div>);
});

function getPlayerRenderer(activePlayers) {

    return function renderPlayer(player, index) {

        const defaultImage = `/img/avatar-solo-50x50.png`;
        const defaultHref = encodeURIComponent(`https://riddles.io${defaultImage}`);
        const playerColorClass = `player-color--player${player.id}`;
        const isActive = activePlayers.some(activePlayer => activePlayer.id === player.id);
        const activeClass = isActive ? ' player--active' : '';

        return <div key={ `Player-${index}` } className={ `player-wrapper${activeClass}` }>
            <div className={ `player-avatar-background ${playerColorClass}` } >
                <img
                    className="player-avatar"
                    src={ `https://www.gravatar.com/avatar/${player.emailHash}?d=${defaultHref}&s=42` }
                    alt="avatar"/>
            </div>
            <div className={ `player-info ${playerColorClass}` }>
                <div className="player-name">
                    { player.alias }
                </div>
                <div className="player-score">
                    { player.score }
                </div>
            </div>
        </div>
    };
}

export default PlayerView;
