import React            from 'react';
import component        from 'omniscient';
import { event }        from '@riddles/match-viewer';
import MaybeEndOverlay  from './MaybeEndOverlay';
import Cell             from './Cell.jsx';

const gameSpeed = require('../data/gameSpeed.json');

const { PlaybackEvent } = event;

const sliderRange = gameSpeed.min + gameSpeed.max;
const sliderWidth = gameSpeed.max - gameSpeed.min;

const lifeCycle = {

    getInitialState() {
        return {
            isPlaying: true,
            speed: (sliderWidth / 2) / 1000,
        };
    },

    componentWillMount() {
        PlaybackEvent.on(PlaybackEvent.PLAY, this.setPlaying);
        PlaybackEvent.on(PlaybackEvent.PAUSE, this.setPaused);
        PlaybackEvent.on(PlaybackEvent.PAUSED, this.setPaused);
        PlaybackEvent.on(PlaybackEvent.CHANGE_SPEED, this.changeSpeed);
    },

    setPaused() {
        this.setState({ isPlaying: false });
    },

    setPlaying() {
        this.setState({ isPlaying: true });
    },

    changeSpeed(rangeValue) {
        const ms = sliderRange - rangeValue;
        const speed = ms / 1000;

        this.setState({ speed: speed });
    },
};

const GameView = component('GameView', lifeCycle, function ({ state, settings }) {

    const { cells, winner } = state;
    const { isPlaying, speed } = this.state;
    const playbackClass = isPlaying ? 'is-playing' : 'is-paused';
    const cellSize = getCellSize(settings);
    const boardTransform = getBoardTransform(settings, cellSize);
    const viewBox = `0 0 ${settings.canvas.width} ${settings.canvas.height}`;

    return (
        <div className={ `Golad-wrapper ${playbackClass}` }>
            <svg className="Golad" viewBox={ viewBox } preserveAspectRatio="xMidYMid meet">
                <g className="Golad-board Board" transform={ boardTransform }>
                    { cells.map(getCellRenderer(cellSize)) }
                </g>
            </svg>
            <MaybeEndOverlay winner={ winner } />
        </div>
    );
});

function getCellSize(settings) {

    const canvas = settings.canvas;
    const board = settings.board;

    return (canvas.height - canvas.marginTop - canvas.marginBottom) / board.height;
}

function getBoardTransform(settings, cellSize) {

    const boardWidth = settings.board.width * cellSize;
    const canvas = settings.canvas;
    const x = canvas.width - canvas.marginRight - boardWidth;
    const y = canvas.marginTop;

    return `translate(${x}, ${y})`;
}

function getCellRenderer(cellSize) {

    return function renderCell(cell, index) {

        return <Cell
            key={ `GoladCell-${index}` }
            x={ cell.x }
            y={ cell.y }
            current={ cell.current }
            next={ cell.next }
            size={ cellSize }
        />;
    };
}

export default GameView;
