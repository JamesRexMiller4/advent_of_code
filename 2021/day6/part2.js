/* How many after 256 days?*/

const fs = require("fs");
const data = fs.readFileSync("./puzzleInput.txt").toString().split(",").map(val => +val);

function spawn(daysLeft, timer) {
    if (daysLeft === 0) {
        return 1
    }

    if (daysLeft < 6 && timer < daysLeft) {
        return 2
    } 
    
    if (daysLeft > 6 && timer === 0) {
        return spawn(daysLeft - 1, 6) + spawn(daysLeft - 1, 8)
    } else {
        return spawn(daysLeft - 1, timer - 1)
    }
}

function memoizer(fun){
    let cache = {}
    return function (days, timer){
        if (cache[timer] !== undefined ) {
            return cache[timer]
        } else {
            let result = fun(days, timer)
            cache[timer] = result
            return result
        }
    }
}


const starterFish = data;
const spawnMemo = memoizer(spawn)
const total = []

starterFish.forEach(fish => {
    const fishies = spawnMemo(256, fish)
    total.push(fishies)
})
console.log(total.reduce((acc, curVal) => acc += curVal))

/// not the best/fastest, but it works