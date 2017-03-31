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

    const innerSize = size / 3;
    const innerDelta = (size - innerSize) / 2;
    const outerCornerSize = size / 10;
    const innerCornerSize = size / 15;

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
            { next && <rect
                className={ innerClass }
                x={ innerDelta }
                y={ innerDelta }
                rx={ innerCornerSize }
                ry={ innerCornerSize }
                width={ innerSize }
                height={ innerSize } />
            }
        </g>
    );
});

export default Cell;
