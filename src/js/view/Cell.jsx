import React from 'react';
import { TimelineLite, TweenLite, Power2 } from 'gsap';
import CellType from '../enum/CellType';

TweenLite.defaultEase = Power2.easeIn;

function getCellClass(type, color, brokenNumber) {
    const colorClass = type !== CellType.EMPTY ? ` Cell--player${color}` : '';
    const typeClass = type === CellType.BROKEN ? `${type}${brokenNumber}` : type;
    return `Cell-${typeClass}${colorClass}`;
}

class Cell extends React.Component {

    animateRemoveSelect(timeline, animationSpeed) {
        this.select && timeline.to(this.select, animationSpeed, { css: { opacity: 0 } });
    }

    componentDidUpdate() { // handles animation
        if (!this.props.doAnimation) return;

        const {
            speed,
            stateType,
            type,
            previousType,
            previousColor,
            x,
            y,
            brokenNumbers,
        } = this.props;

        const timeline = new TimelineLite();
        const animationSpeed = speed / 3;

        // noinspection FallThroughInSwitchStatementJS
        switch (stateType) {
            case 'select':
                if (this.select) {
                    timeline.set(this.select, { css: { opacity: 0 } });
                    timeline.to(this.select, speed / 3, { css: { opacity: 1 } });
                }

                break;
            case 'lifecycle':
                if (this.props.noLifeCycleAnimation) { // Only animate the selections
                    this.animateRemoveSelect(timeline, animationSpeed);
                    break;
                }

                // no break on purpose
            case 'move':
                const broken = previousType === CellType.BROKEN ? brokenNumbers[x][y] : '';
                const animationClass = `start-disappear${broken}--player${previousColor}`;

                if (previousType === CellType.SMALL
                    && (type === CellType.WHOLE || type === CellType.BROKEN)) {
                    timeline.set(this.cell, { scale: 0.45 });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 1 }, 0);

                } else if (previousType === CellType.BROKEN && type === CellType.EMPTY) {
                    timeline.set(this.cell, { scale: 1, className: `+=${animationClass}` });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 0 }, 0);
                    timeline.set(this.cell, { scale: 1, className: `-=${animationClass}` });

                } else if (previousType === CellType.BROKEN && type === CellType.SMALL) {
                    timeline.set(this.cell, { scale: 1 / 0.45, className: `+=${animationClass}` });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 1 }, 0);
                    timeline.set(this.cell, { className: `-=${animationClass}` });

                } else if (previousType === CellType.EMPTY && type !== CellType.EMPTY) {
                    timeline.set(this.cell, { scale: 0 });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 1 }, 0);

                } else if (previousType !== CellType.EMPTY && type === CellType.EMPTY) {
                    const scale = previousType === CellType.SMALL ? 0.45 : 1;

                    timeline.set(this.cell, { scale: scale, className: `+=${animationClass}` });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 0 }, 0);
                    timeline.set(this.cell, { scale: 1, className: `-=${animationClass}` });

                } else if (previousType === CellType.WHOLE && type === CellType.SMALL) {
                    timeline.set(this.cell, { scale: 1 / 0.45 });
                    this.animateRemoveSelect(timeline, animationSpeed);
                    timeline.to(this.cell, animationSpeed, { scale: 1 }, 0);

                }

                break;
        }

        timeline.play();
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.speed === this.props.speed && nextProps.isPlaying === this.props.isPlaying;
    }

    render() {

        const {
            x,
            y,
            selected,
            color,
            type,
            size,
            cellMargin,
            brokenNumbers,
        } = this.props;

        const cellClass = getCellClass(type, color, brokenNumbers[x][y]);

        const backgroundStyle = {
            width: `calc(${size}% - ${cellMargin}px`,
            height: `calc(${size}% - ${cellMargin}px`,
            marginTop: 0,
            marginRight: cellMargin,
            marginBottom: cellMargin,
            marginLeft: 0,
        };

        return <div className={`Cell-background`} style={backgroundStyle}>
            <div className={`Cell ${cellClass}`} ref={(cell) => { this.cell = cell; }} />
            { selected !== null && <div
                className={`Cell Cell-select Cell--player${selected}`}
                ref={(select) => { this.select = select; }}
            /> }
        </div>;
    }
}

export default Cell;
