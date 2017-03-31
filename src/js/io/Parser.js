/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} playerData The data about the participating players from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, playerData, defaults = {}) {

    return {
        ...defaults,
        ...data.settings,
        players: parsePlayerNames(playerData),
    };
}

function parsePlayerNames(playerData) {

    return playerData.map((player) => ({
        alias: player.name || '',
        emailHash: player.emailHash || '',
    }));
}

/**
 * Parses the passed data and settings into states which can be rendered by the viewer
 * @param   {Object} data     The JSON data received from the server
 * @param   {Object} settings The parsed settings
 * @returns {Array}           List of states
 */
function parseStates(data, settings) {

    const parsedStates = data.states.map(state => {
        const { round, players, board } = state;

        return {
            round,
            players,
            winner: undefined,
            cells: parseBoard(board, data.settings),
        };
    });

    return addFinalState(parsedStates, data.winner, settings.players);
}

function parseBoard(input, settings) {

    const { width } = settings.board;

    return input.split(',').map((cell, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        const split = cell.split('>');

        return {
            x,
            y,
            current: split[0],
            next: split.length > 1 ? split[1] : null,
        };
    });
}

function addFinalState(states, winnerId, players) {

    const beforeFinalState = states[states.length - 1];
    const winner = winnerId === null ? null : { id: winnerId, ...players[winnerId] };
    const finalState = { ...beforeFinalState, winner };

    return [...states, finalState];
}

export {
    parseSettings,
    parseStates,
};
