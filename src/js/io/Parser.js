import _ from 'lodash';
import CellType from '../enum/CellType';

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
        const previousParsedState = parsedStates[parsedStates.length - 1];
        const previousCells = previousParsedState ? previousParsedState.cells : null;
        const selectedCells = getSelectedCells(players);
        const parsedState = {
            round,
            players,
            winner: undefined,
            cells: parseBoard(board, previousCells, selectedCells, data.settings),
            type: 'lifecycle',
        };

        parsedStates.push.apply(parsedStates, splitState(parsedState, previousParsedState));
    });

    return addFinalState(parsedStates, data.winner, settings.players);
}

function getSelectedCells(players) {
    const selectedCells = {};

    players.forEach(player =>  {
        const { move, id } = player;

        if (move) {
            const { sacrificeCells, birthCell, killCell } = move;

            sacrificeCells && sacrificeCells.forEach(cell => {
                selectedCells[getCellIndex(cell.x, cell.y)] = id;
            });

            if (birthCell) {
                selectedCells[getCellIndex(birthCell.x, birthCell.y)] = id;
            }

            if (killCell) {
                selectedCells[getCellIndex(killCell.x, killCell.y)] = id;
            }
        }
    });

    return selectedCells;
}

function splitState(parsedState, previousState) {
    if (!parsedState.players.some(player => player.move)) {
        return [parsedState];
    }

    const selectState = _.cloneDeep(previousState);
    selectState.round = parsedState.round;
    selectState.type = 'select';
    selectState.cells.forEach((cell, index) => {
        cell.selected = parsedState.cells[index].selected;
    });

    parsedState.type = 'move';

    return [selectState, parsedState];
}

function parseBoard(input, previousCells, selectedCells, settings) {

    const { width } = settings.board;

    return input.split(',').map((cell, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        const split = cell.split('>');
        const current = split[0];
        const next = split.length > 1 ? split[1] : current;
        const selected = selectedCells[getCellIndex(x, y)];

        return {
            x,
            y,
            selected: selected !== undefined ? selected : null,
            color: current !== '.' ? current : next,
            type: getCellType(current, next),
            previousType: previousCells ? previousCells[index].type : null,
            previousColor: previousCells ? previousCells[index].color : null,
        };
    });
}

function getCellType(current, next) {
    if (current === '.' && next === '.') {
        return CellType.EMPTY;
    } else if (current === '.' && next !== '.') {
        return CellType.SMALL;
    } else if (current !== '.' && next === '.') {
        return CellType.BROKEN;
    } else {
        return CellType.WHOLE;
    }
}

function getCellIndex(x, y) {
    return `${x},${y}`;
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
