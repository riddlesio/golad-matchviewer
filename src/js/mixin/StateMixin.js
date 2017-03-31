import _ from 'lodash';

const StateMixin = {

    applyTo: function (context) {

        let mixin;
        let state;

        mixin = {
            /**
             * Sets the component state
             * @param {Object} diff
             * @return {AbstractUIComponent}
             */
            setState: function (diff) {

                let _this = this;
                let currentState;
                let nextState;
                let shouldComponentUpdate = _this.shouldComponentUpdate;

                currentState = state;
                nextState    = _.merge({}, state, diff);

                if (state && shouldComponentUpdate && !shouldComponentUpdate(state, nextState)) {
                    return _this;
                }

                state = nextState;

                window.requestAnimationFrame(function () {

                    _this.render(nextState, currentState);
                });

                return _this;
            },

            /**
             * Returns the state
             * @return {Object}
             */
            getState: function () {

                return state;
            },
        };

        _.extend(context, mixin);
    },
};

export default StateMixin;
