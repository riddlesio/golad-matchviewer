import _ from 'lodash';

/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} playerData The data about the participating players from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, playerData, defaults = {}) {

    const settings = {
        ...defaults,
        ...data.settings,
        players: parsePlayerNames(playerData),
    };

    settings.brokenNumbers = getRandomCellBroken(settings);
    settings.boardStyle = {
        ...settings.boardStyle,
        ...getSizes(settings),
    };

    return settings;
}

function parsePlayerNames(playerData) {

    return playerData.map((player) => ({
        alias: player.name || '',
        emailHash: player.emailHash || '',
    }));
}

function getSizes(settings) {

    const { canvas, board } = settings;
    const { height, width, paddingTop, paddingBottom } = canvas;

    const sizeHeight = height - paddingTop - paddingBottom;
    const cellSize = sizeHeight / board.height;

    return {
        cellSize: 100 / board.width,
        boardWidth: Math.ceil((cellSize * board.width * 100) / width),
    };
}

function getRandomCellBroken(settings) {  // gets the random type of broken for the cell
    const brokenNumbers = {};
    const { board } = settings;

    for (let x = 0; x < board.width; x++) {
        for (let y = 0; y < board.height; y++) {
            if (!brokenNumbers[x]) {
                brokenNumbers[x] = {};
            }

            brokenNumbers[x][y] = Math.floor(Math.random() * 3) + 1;
        }
    }

    return brokenNumbers;
}

/**
 * Parses the passed data and settings into states which can be rendered by the viewer
 * @param   {Object} data     The JSON data received from the server
 * @param   {Object} settings The parsed settings
 * @returns {Array}           List of states
 */
function parseStates(data, settings) {

    const parsedStates = [];

    data.states.forEach(state => {
        const { round, players, board } = state;
        const parsedState = {
            round,
            players,
            winner: undefined,
            cells: parseBoard(board, data.settings),
        };

        if (parsedState.players.some(player => player.move)) {  // split move state in 2
            const previousState = parsedStates[parsedStates.length - 1];

            const moveState = _.cloneDeep(previousState);
            moveState.round = parsedState.round;
            moveState.players.forEach((player, index) => {
                const move = parsedState.players[index].move;
                player.move = move;
                player.moving = !!move;
            });

            parsedState.players.forEach(player => {
                player.moving = !!player.move;
                player.move = null;
            });

            parsedStates.push(moveState);
            parsedStates.push(parsedState);
        } else {
            parsedStates.push(parsedState);
        }
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
            next: split.length > 1 ? split[1] : split[0],
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
