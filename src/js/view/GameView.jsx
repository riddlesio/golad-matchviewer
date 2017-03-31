import React            from 'react';
import component        from 'omniscient';
import { event }        from '@riddles/match-viewer';
import PlayerView       from './PlayerView.jsx';
import MaybeEndOverlay  from './MaybeEndOverlay';
import Cell             from './Cell.jsx';

const { PlaybackEvent } = event;

const lifeCycle = {

    getInitialState() {
        return {
            isPlaying: true,
        };
    },

    componentWillMount() {
        PlaybackEvent.on(PlaybackEvent.PLAY, this.setPlaying);
        PlaybackEvent.on(PlaybackEvent.PAUSE, this.setPaused);
        PlaybackEvent.on(PlaybackEvent.PAUSED, this.setPaused);
    },

    setPaused() {
        this.setState({ isPlaying: false });
    },

    setPlaying() {
        this.setState({ isPlaying: true });
    },
};

const GameView = component('GameView', lifeCycle, function ({ state, settings }) {

    const { cells, winner } = state;
    const { isPlaying } = this.state;
    const { cellSize, wider } = getCellSize(settings);
    const boardTransform = getBoardTransform(settings, cellSize, wider);
    const viewBox = `0 0 ${settings.canvas.width} ${settings.canvas.height}`;
    const playbackClass = isPlaying ? 'is-playing' : 'is-paused';

    return (
        <div className={ `Golad-wrapper ${playbackClass}` }>
            <PlayerView
                state={ state }
                settings={ settings }
                players={ state.players }
                boardWidth={ settings.board.width * cellSize }
                orientation={ getPlayerViewOrientation(settings, cellSize) } />
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
    const sizeHeight = (canvas.height - canvas.marginTop - canvas.marginBottom) / board.height;
    const sizeWidth = (canvas.width - canvas.marginRight - canvas.marginLeft) / board.width;

    if (sizeHeight < sizeWidth) {
        return { cellSize: sizeHeight, wider: false };
    }

    return { cellSize: sizeWidth, wider: true };
}

function getBoardTransform(settings, cellSize, wider) {

    const board = settings.board;
    const canvas = settings.canvas;
    const boardWidth = board.width * cellSize;
    const boardHeight = board.height * cellSize;
    const x = canvas.width - canvas.marginRight - boardWidth;
    const y = wider ? (canvas.height - canvas.marginBottom - boardHeight) / 2 : canvas.marginTop;

    return `translate(${x}, ${y})`;
}

function getPlayerViewOrientation(settings, cellSize) {

    const canvas = settings.canvas;
    const maxBoardWidth = canvas.width - canvas.marginRight - canvas.marginLeft;
    const boardWidth = settings.board.width * cellSize;

    return boardWidth / maxBoardWidth < 0.7 ? 'vertical' : 'horizontal';
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
