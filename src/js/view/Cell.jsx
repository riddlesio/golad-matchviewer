import React from 'react';
import createView from 'omniscient';

function getColorClass(id) {
    return id === '.' ? 'empty' : `player${id}`;
}

const Cell = createView(function (data) {

    const { x, y, current, next, size } = data;
    const transform = `translate(${x * size}, ${y * size})`;

    const outerClass = `Cell-outer Cell-color--${getColorClass(current)}`;
    const innerClass = `Cell-inner Cell-color--${getColorClass(next)}`;

    const innerSize = size / 6;
    const center = size / 2;
    const outerCornerSize = size / 10;

    return (
        <g className="Cell" transform={ transform }>
            <rect
                className={ outerClass }
                x="1"
                y="1"
                rx={ outerCornerSize }
                ry={ outerCornerSize }
                width={ size - 2 }
                height={ size - 2 } />
            { next && <circle
                className={ innerClass }
                cx={ center }
                cy={ center }
                r={ innerSize }
                width={ innerSize }
                height={ innerSize } />
            }
        </g>
    );
});

export default Cell;
