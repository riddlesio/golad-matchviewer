import React from 'react';
import createMaybe from './createMaybe';

function EndOverlay(props) {

    const winner = props.winner || { id: 'none', emailHash: '' };
    const draw = winner.id === 'none';
    const message = draw ? 'The game is a draw' : `${winner.alias} won the game`;
    const defaultImage = encodeURIComponent(
        'https://storage.googleapis.com/riddles-images/riddles-avatar-solo-113.png');
    const avatar = !draw && (
            <img
                className="Winner-avatar"
                src={ `https://www.gravatar.com/avatar/${winner.emailHash}?s=112&d=${defaultImage}` }
                alt="avatar"
            />
        );

    return (
        <div className="Golad-overlay">
            <div className={ `Winner Winner--${winner.id}` }>
                { draw ? null : avatar }
                <div className="Winner-message">
                    <h2 className="Winner-messageHeading">Game end</h2>
                    <p className="Winner-messageContent">{ message }</p>
                </div>
            </div>
        </div>
    )
}

function predicate({ winner }) {
    return winner !== undefined;
}

function FirstChild(props) {
    const children = React.Children.toArray(props.children);
    return children[0] || null;
}

const transition = {
    component: FirstChild,
    transitionName: 'overlay',
    transitionLeaveTimeout: 80,
    transitionEnterTimeout: 80,
};

export default createMaybe({ Component: EndOverlay, predicate, transition });
