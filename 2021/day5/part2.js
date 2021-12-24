/* Same as part 1 but now consider diagonals */

const fs = require("fs")
const data = fs.readFileSync("./puzzleInput.txt").toString().split("\n").map((coordinatePair) => {
    const [x1y1, x2y2] = coordinatePair.split("->")
    const [x1, y1] = x1y1.split(",")
    const [x2, y2] = x2y2.split(",")
    return [[+x1, +y1], [+x2, +y2]]
})

const genCartesian = (dimensions) => {
    return new Array(dimensions).fill(".").map((row) => new Array(dimensions).fill("."))
}

const plotPoint = (chart, coordinatePair) => {
    if (chart[coordinatePair[1]][coordinatePair[0]] === ".") {
        chart[coordinatePair[1]][coordinatePair[0]] = 1
    } else {
        chart[coordinatePair[1]][coordinatePair[0]] = ++chart[coordinatePair[1]][coordinatePair[0]]
    }
}

const plotLine = (chart, coordinatePairs) => {
    const [pair1, pair2] = coordinatePairs;
    const slope = calcSlope(pair1, pair2);
    const yIntercept = calcYIntercept(slope, pair1);
    const points = calcAllPoints(pair1, pair2, slope, yIntercept);

    // if (slope !== 0) return  // part 2 
    
    points.forEach((xy) => plotPoint(chart, xy));
}

const calcSlope = (pair1, pair2) => {
    const yDir = pair2[1] - pair1[1]
    const xDir = pair2[0] - pair1[0]

    if (xDir === 0 || xDir === -0) {
        return 0
    }

    return yDir / xDir
}

const calcYIntercept = (slope, pair) => {
    const y = pair[1];
    const x = pair[0];

    return y - (slope * x)
}

const calcSlopeInterceptWithX = (slope, yIntercept, x) => {
    return slope * x + yIntercept
}

const calcSlopeInterceptWithY = (slope, yIntercept, y) => {
    if (slope === 0) return 0
    return (y - yIntercept) / slope
}


const calcAllPoints = (pair1, pair2, slope, yIntercept) => {
    let start, end, useX;
    const points = []

    if (pair1[0] === pair2[0]) {
        useX = false
        if (pair1[1] > pair2[1]) {
            start = pair2[1]
            end = pair1[1]
        } else {
            start = pair1[1]
            end = pair2[1]
        }
    } else {
        useX = true
        if (pair1[0] > pair2[0]) {
            start = pair2[0]
            end = pair1[0]
        } else {
            start = pair1[0]
            end = pair2[0]
        }
    }

    if (useX) {
        for (start; start <= end; ++start) {
            const y = calcSlopeInterceptWithX(slope, yIntercept, start);
            points.push([start, y])
        }
    } else {
        for (start; start <= end; ++start) {
            let x = calcSlopeInterceptWithY(slope, yIntercept, start);

            if (pair1[0] === pair2[0]) {
                x = pair1[0]
            }
            points.push([x, start])
        }
    }

    return points
}

const chart = genCartesian(999)
data.forEach((line, idx) => {
    try {
        plotLine(chart, line)
    } catch (e) {
        console.log(line, "INVALID")
    }
})
let result = 0;
const flatChart = chart.flat()
flatChart.forEach(point => {
    if (point >= 2) {
        ++result
    }
})

console.log(result)