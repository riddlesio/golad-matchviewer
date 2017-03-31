import React from 'react';
import createEither from './createEither';
import Nothing from './Nothing';

// Note: This should be replaced by Flow types
const propTypes = {
    Component: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.func,
    ]).isRequired,
    predicate: React.PropTypes.func.isRequired,
};

/**
 * A React Component which renders either Left or Right depending on whether condition is truthy
 * @param   {React.Component} Component The component to render if predicate returns true
 * @param   {Function}        predicate Determines whether to render Component or Nothing
 * @returns {React.Component}
 */
function createMaybe({ Component, predicate, transition }) {

    return createEither({ Left: Nothing, Right: Component, isRight: predicate, transition });
}

createMaybe.propTypes = propTypes;

export default createMaybe;
