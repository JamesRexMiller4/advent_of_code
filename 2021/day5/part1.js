/* 
You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds,
so it would be best to avoid them if possible.

They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents (your puzzle input)
for you to review. For example:

0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2

Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 
where x1,y1 are the coordinates of one end the line segment and x2,y2 are the coordinates of the other end.
These line segments include the points at both ends. In other words:

An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

So, the horizontal and vertical lines from the above list would produce the following diagram:

.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....
In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position is shown as the number
of lines which cover that point or . if no line covers that point. The top-left pair of 1s, for example, comes from 2,2 -> 2,1;
the very bottom row is formed by the overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.

To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. 
In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.

Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
*/

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

    if (slope !== 0) return

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


// const chart = genCartesian(10)

// const points = [
//     [[2,6], [6,2]],
//     [[1,1], [1,6]],
//     [[1,6], [5,6]],
//     [[7,4], [8,9]],
// ]

// const [pair1, pair2] = points;
// const slope = calcSlope(pair1, pair2)
// const yIntercept = calcYIntercept(slope, pair1)
// const linePoints = calcAllPoints(pair1, pair2, slope, yIntercept)

// console.log(slope)
// console.log(yIntercept)
// console.log(linePoints)
// console.log(plotLine(chart, points))

// points.forEach(line => plotLine(chart, line))

// console.log(chart)


const chart = genCartesian(999)
data.forEach((line, idx) => {
    try {
        plotLine(chart, line)
    } catch (e) {
        console.log(line, "INVALID")

        const [pair1, pair2] = line;
        const slope = calcSlope(pair1, pair2)
        const yIntercept = calcYIntercept(slope, pair1)
        const linePoints = calcAllPoints(pair1, pair2, slope, yIntercept)

        console.log(slope, "slope")
        console.log(yIntercept, "yIntercept")
        console.log(linePoints, "points on line")

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