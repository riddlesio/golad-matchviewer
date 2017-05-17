import React from 'react';
import createView from 'omniscient';
import _ from 'lodash';

function getColorClass(id) {
    return id === '.' ? 'empty' : `player${id}`;
}

function getCellClass(type, id) {
    return `cell-${type}--${getColorClass(id)}`;
}

function getCellBrokenClass(current, next, brokenNumber) {
    return current !== '.' && next === '.'
        ? ` cell-broken--type${brokenNumber}`
        : '';
}

function getCellSelectedPlayerId(x, y, players) {
    const coords = { x, y };
    let cellSelectedPlayerId = null;

    players.forEach(player =>  {
        const { move, id } = player;

        if (move) {
            const cells = [];
            move.sacrificeCells && cells.push.apply(cells, move.sacrificeCells);
            move.birthCell && cells.push(move.birthCell);
            move.killCell && cells.push(move.killCell);

            if (cells.some(cell => _.isEqual(cell, coords))) {
                cellSelectedPlayerId = id;
            }
        }
    });

    return cellSelectedPlayerId;
}

const Cell = createView(({ x, y, current, next, size, cellMargin, players, brokenNumbers }) => {

    const drawForeground = next !== '.' || current !== '.';
    const currentClass = getCellClass('current', current);
    const nextClass = getCellClass('next', next);
    const brokenClass = getCellBrokenClass(current, next, brokenNumbers[x][y]);
    const cellClass = `${currentClass} ${nextClass}${brokenClass}`;
    const cellSelectedPlayerId = getCellSelectedPlayerId(x, y, players);

    const backgroundStyle = {
        width: `calc(${size}% - ${cellMargin}px`,
        height: `calc(${size}% - ${cellMargin}px`,
        marginTop: 0,
        marginRight: cellMargin,
        marginBottom: cellMargin,
        marginLeft: 0,
    };

    return (
        <div className={`Cell-background`} style={backgroundStyle}>
            { drawForeground &&
                <div className={`Cell ${cellClass}`} /> }
            { cellSelectedPlayerId !== null &&
                <div className={`Cell cell-selected--player${cellSelectedPlayerId}`} /> }
        </div>
    );
});

export default Cell;
