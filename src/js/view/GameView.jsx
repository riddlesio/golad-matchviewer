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

    const { cells, winner, round, players } = state;
    const { isPlaying } = this.state;
    const { boardStyle, canvas, brokenNumbers } = settings;
    const { cellMargin, boardWidth, cellSize } = boardStyle;
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = canvas;
    const playbackClass = isPlaying ? 'is-playing' : 'is-paused';
    const padding = {
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };

    return (
        <div className={ `Golad-wrapper ${playbackClass}` } style={ padding }>
            <div className="Golad">
                <div className="ui-wrapper">
                    <div className="Golad-round">
                        <span className="Golad-round-text">Round { round }</span>
                    </div>
                    <PlayerView state={ state } settings={ settings } />
                </div>
                <div className="Golad-board-wrapper" style={{ width: `${boardWidth}%` }}>
                    <div className="Golad-board Board">
                        { cells.map(getCellRenderer(cellSize, cellMargin, brokenNumbers, players)) }
                    </div>
                </div>
            </div>
            <MaybeEndOverlay winner={ winner } />
        </div>
    );
});

function getCellRenderer(cellSize, cellMargin, brokenNumbers, players) {

    return function renderCell(cell) {

        return <Cell
            key={ `GoladCell-${cell.x}-${cell.y}` }
            size={ cellSize }
            cellMargin={ cellMargin }
            players={ players }
            brokenNumbers={ brokenNumbers }
            { ...cell }
        />;
    };
}

export default GameView;
