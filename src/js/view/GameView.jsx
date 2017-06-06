import React            from 'react';
import component        from 'omniscient';
import { event }        from '@riddles/match-viewer';
import PlayerView       from './PlayerView.jsx';
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

const GameView = component('GameView', lifeCycle, function ({ state, settings, isLastState }) {

    const { cells, winner, round, type } = state;
    const { isPlaying, speed } = this.state;
    const { boardStyle, canvas, brokenNumbers } = settings;
    const { cellMargin, boardWidth, cellSize } = boardStyle;
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = canvas;
    const doAnimation = isPlaying && !isLastState;
    const padding = {
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    };

    return (
        <div className={ 'Golad-wrapper' } style={ padding }>
            <div className="Golad">
                <div className="ui-wrapper">
                    <div className="Golad-round">
                        <span className="Golad-round-text">Round { round }</span>
                    </div>
                    <PlayerView state={ state } settings={ settings } />
                </div>
                <div className="Golad-board-wrapper" style={{ width: `${boardWidth}%` }}>
                    <div className="Golad-board Board">
                        { cells.map(getCellRenderer(
                            cellSize, cellMargin, brokenNumbers, type, speed, doAnimation)) }
                    </div>
                </div>
            </div>
            <MaybeEndOverlay winner={ winner } />
            <div className="end-screen-overlay-preload" />
            <div className="end-screen-image-preload" />
        </div>
    );
});

function getCellRenderer(cellSize, cellMargin, brokenNumbers, type, speed, doAnimation) {

    return function renderCell(cell) {

        return <Cell
            key={ `GoladCell-${cell.x}-${cell.y}` }
            size={ cellSize }
            cellMargin={ cellMargin }
            brokenNumbers={ brokenNumbers }
            speed={ speed }
            doAnimation={ doAnimation }
            stateType={ type }
            { ...cell }
        />;
    };
}

export default GameView;
