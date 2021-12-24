/* 
On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, 
so rather than waste time counting its arms, the safe thing to do is to figure out 
which board will win last and choose that one. That way, no matter which boards it picks, 
it will win for sure.

In the above example, the second board is the last to win, which happens after 13 
is eventually called and its middle column is completely marked. 
If you were to keep playing until this point, the second board would have a sum of unmarked 
numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?
*/

const fs = require("fs")
const data = fs.readFileSync("./puzzleInput.txt").toString().split("\n\n")
    .map(bingoCard => {
        return bingoCard.split("\n")
    })
    .map(bingoCard => {
        return bingoCard.map(row => {
            const vals = row.split(" ")
            if (vals.length === 5) return vals
            else return vals.filter(val => val !== "")
        })
    })
const drawingOrder = fs.readFileSync("./drawings.txt").toString().split(",");

const markBoard = (bingoCard, numberDrawn) => {
    return bingoCard.map(row => {
        return row.map(val => {
            if (val === numberDrawn) {
                return "X"
            } else return val
        })
    })
}

const verifyRows = (bingoCard) => {
    let bingo = false;

    bingoCard.forEach((row) => {     
        if (row.every((val) => val === "X")) {
            bingo = true
        }
    })

    return bingo
}

const verifyColumns = (bingoCard) => {
    let bingo;

    for (let i = 0; i < 5; i++) {
        bingo = true;
        bingoCard.forEach(row => {
            if (row[i] !== "X") {
                bingo = false
            }
        })
        if (bingo) {
            return bingo
        }
    }

    return bingo
}

let markedBoards = data;
let winningBoards = [], winningIdxs = [], winningNum;

for (let j = 0; j < drawingOrder.length; j++) {
    const drawnNumber = drawingOrder[j];

    markedBoards = markedBoards.map(bingoCard => {
        return markBoard(bingoCard, drawnNumber);
    })

    markedBoards.forEach((markedBoard, idx) => {
        const winningRow = verifyRows(markedBoard);
        const winningColumn = verifyColumns(markedBoard);

        if ((winningRow || winningColumn) && !winningIdxs.includes(idx)) {
            winningBoards.push(markedBoard)
            winningIdxs.push(idx)
        }
    })

    if (winningBoards.length === data.length && !winningNum) {
        console.log('Last winning board is:')
        console.log(winningBoards[winningBoards.length - 1])
        winningBoard = winningBoards[winningBoards.length - 1]
        winningNum = drawnNumber
    }
}

const result = winningBoards[winningBoards.length - 1].reduce((acc, row) => {
    row.forEach(val => {
        if (val !== "X") {
            acc += +val;
        }
    })
    return acc;
}, 0)

console.log(`Final score of winning board is: ${result * winningNum}`);