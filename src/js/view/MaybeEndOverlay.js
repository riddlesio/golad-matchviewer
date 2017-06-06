import React from 'react';
import { TweenLite, Bounce } from 'gsap';
import createMaybe from './createMaybe';

class EndOverlay extends React.Component {

    componentDidMount() {
        TweenLite.to(this.overlay, 1, {
            ease: Bounce.easeOut,
            y: '-47%',
        });
    }

    render() {
        const winner = this.props.winner || { id: 'none', emailHash: '' };
        const draw = winner.id === 'none';
        const message = draw ? 'It\'s a draw' : `${winner.alias} won!`;
        const defaultHref = encodeURIComponent(
            'https://storage.googleapis.com/riddles-images/riddles-avatar-solo-113.png');
        const avatar = !draw && (
                <div className={ `player-avatar-wrapper` }>
                    <img
                        className="player-avatar"
                        src={ 'https://www.gravatar.com/avatar/' +
                              `${player.emailHash}?d=${defaultHref}&s=65` }
                        alt="avatar"/>
                    <div className="player-avatar-frame"/>
                </div>
            );

        return <div className="Golad-overlay">
            <div className={ `Golad-overlay-foreground winner--${winner.id}` }
                ref={(overlay) => { this.overlay = overlay; }} >
                { draw ? null : avatar }
                <div className="winner-message u-text-shadow">
                    <span className="winner-messageContent">{ message }</span>
                </div>
            </div>
        </div>;
    }
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
