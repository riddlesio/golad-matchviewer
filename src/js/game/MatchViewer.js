import React                    from 'react';
import ReactDOM                 from 'react-dom';
import { createGame, event }    from '@riddles/match-viewer';
import StateMixin               from '../mixin/StateMixin';
import GameLoopMixin            from '../mixin/SimpleGameLoopMixin';
import GameView                 from '../view/GameView.jsx';
import { parseStates, parseSettings } from '../io/Parser';

const defaults = require('../data/gameDefaults.json');
const { PlaybackEvent } = event;

/**
 * MatchViewer class
 * @constructor
 */
const MatchViewer = createGame({

    /**
     * MatchViewer construct function
     * Automatically executed when instantiating the HelloWorldGame class
     * @param  {Object} options
     */
    construct: function (options) {

        window.viewer = this;
        registerEventListeners(this);
    },

    /**
     * Cleans up anything which might cause memory leaks
     */
    destroy: function () {

        releaseEventListeners(this);
        delete window.viewer;
    },

    getDefaults: function () {
        return defaults;
    },

    /**
     * Parses the received data and starts the game loop
     * @param  {Object} data
     */
    handleData: function (data) {

        const currentState      = 0;
        const matchData         = data.matchData;
        const playerData        = data.playerData;
        const settings          = parseSettings(matchData, playerData, defaults);
        const states            = parseStates(matchData, settings);

        console.log('states', states);

        this.settings = settings;
        this.states = states;

        this.triggerStateChange(currentState);
        this.play();
    },

    handlePlaying: function () {
        this.settings.isPlaying = true;
        this.render(this.getState(), undefined);
    },

    handlePaused: function () {
        this.settings.isPlaying = false;
        this.render(this.getState(), undefined);
    },

    /**
     * Renders the game
     * @param {Object} state
     * @param {Object} prevState
     */
    render: function (state, prevState) {

        const { currentState } = state;
        const { settings, states } = this;

        const props = {
            settings,
            state: states[currentState],
        };

        ReactDOM.render(<GameView { ...props }/>, this.getDOMNode());
    },
}, [StateMixin, GameLoopMixin]);

// Private functions

/**
 * Register the event listeners
 * @param {context} context
 */
function registerEventListeners(context) {

    PlaybackEvent.on(PlaybackEvent.PLAY, context.play, context);
    PlaybackEvent.on(PlaybackEvent.PAUSE, context.pause, context);
    PlaybackEvent.on(PlaybackEvent.PAUSED, context.handlePaused, context);
    PlaybackEvent.on(PlaybackEvent.PLAYING, context.handlePlaying, context);
    PlaybackEvent.on(PlaybackEvent.FORWARD, context.moveForward, context);
    PlaybackEvent.on(PlaybackEvent.GOTO, context.setMove, context);
    PlaybackEvent.on(PlaybackEvent.FAST_FORWARD, context.fastForward, context);
    PlaybackEvent.on(PlaybackEvent.BACKWARD, context.moveBackward, context);
    PlaybackEvent.on(PlaybackEvent.FAST_BACKWARD, context.fastBackward, context);
}

/**
 * Release the event listeners
 * @param {context} context
 */
function releaseEventListeners(context) {

    PlaybackEvent.off(PlaybackEvent.PLAY, context.play, context);
    PlaybackEvent.off(PlaybackEvent.PAUSE, context.pause, context);
    PlaybackEvent.off(PlaybackEvent.PAUSED, context.handlePaused, context);
    PlaybackEvent.off(PlaybackEvent.PLAYING, context.handlePlaying, context);
    PlaybackEvent.off(PlaybackEvent.FORWARD, context.moveForward, context);
    PlaybackEvent.off(PlaybackEvent.GOTO, context.setMove, context);
    PlaybackEvent.off(PlaybackEvent.FAST_FORWARD, context.fastForward, context);
    PlaybackEvent.off(PlaybackEvent.BACKWARD, context.moveBackward, context);
    PlaybackEvent.off(PlaybackEvent.FAST_BACKWARD, context.fastBackward, context);
}

export default MatchViewer;
