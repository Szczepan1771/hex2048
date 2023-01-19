import {DirectionType, KeyboardKeys, MatrixType, RNGType, SlideKeys,} from "../types";

const deepCopy = <T> (value: T): T => {
    return JSON.parse(JSON.stringify(value))
}
const createCell = (x: number, y: number) => {
    return {
        x,
        y,
        z: x + y !== 0 ? -(x + y) : 0,
        value: 0
    }
}

export const generateMatrix = (array: RNGType[], radius: number, constant: SlideKeys, direction?: DirectionType) => {
    const map: MatrixType = {}
    array.map(item => {
        const key = item[constant] + radius
        !map.hasOwnProperty(key) ? map[key] = [item] : map[key].push(item)
        return item
    })
    if(direction === DirectionType.DESC) {
        const descMap: MatrixType = {}
        Object.keys(map).map(key => {
            descMap[key] = map[key].reverse()
        })
        return descMap
    }
    return map
}

export const generateArray = (radius: number) => {
    const columns = radius - 1
    let array: RNGType[] = []
    for (let x = -columns; x < radius; x++) {
        for (let y = columns; y > -radius && (x + y > -radius); y--) {
            if (x < 1 || (x > 0 && (x + y < radius))) {
                array.push(createCell(x, y))
            }
        }
    }
    return array
}

const generateMatrixDirectionMap: Record<KeyboardKeys, DirectionType> = {
    [KeyboardKeys.TOP]: DirectionType.DESC,
    [KeyboardKeys.BOTTOM]: DirectionType.ASC,
    [KeyboardKeys.TOP_RIGHT]: DirectionType.ASC,
    [KeyboardKeys.BOTTOM_RIGHT]: DirectionType.ASC,
    [KeyboardKeys.TOP_LEFT]: DirectionType.DESC,
    [KeyboardKeys.BOTTOM_LEFT]: DirectionType.DESC
}

const constantMap: Record<KeyboardKeys, SlideKeys> = {
    [KeyboardKeys.TOP]: SlideKeys.X,
    [KeyboardKeys.BOTTOM]: SlideKeys.X,
    [KeyboardKeys.TOP_RIGHT]: SlideKeys.Y,
    [KeyboardKeys.BOTTOM_LEFT]: SlideKeys.Y,
    [KeyboardKeys.TOP_LEFT]: SlideKeys.Z,
    [KeyboardKeys.BOTTOM_RIGHT] : SlideKeys.Z
}

const searchZeroValueField = (gameArray: RNGType[], i: number) => {
    const array = deepCopy(gameArray)
    for(let j = array.length - 1; j >= 0; j--) {
        if(!array[j].value) {
            if(j > i) {
                array[j].value = array[i].value
                array[i].value = 0
                break;
            }
        }
    }
    return array
}

const moveValues = (gameArray: RNGType[]) => {
    let array = deepCopy(gameArray)
    for(let i = array.length - 1; i >= 0; i--) {
        if(array[i].value) {
            array = searchZeroValueField(array, i)
        }
    }
    return array
}

const mergeValues = (gameArray: RNGType[], points: number) => {
    const array = deepCopy(gameArray)
    for(let i = array.length - 1; i >= 0; i--) {
        if(array[i + 1] && array[i].value && array[i].value === array[i + 1].value) {
            array[i + 1].value *= 2
            points += array[i + 1].value
            array[i].value = 0;
        }
    }
    return {
        mergedArray: array,
        points
    }
}

export const getNonZeroValues = (array: RNGType[]) => {
    return array.filter(item => item.value !== 0)
}
export const updateGameArray = (gameArray: RNGType[], cells: RNGType[]) => {
    let ids: { itemIndex: number; cellIndex: number; }[] = []
    gameArray.map((item, itemIndex) => cells.map((cell, cellIndex) => {
        if (cell.x === item.x && cell.y === item.y && cell.z === item.z) {
            ids.push({itemIndex, cellIndex})
        }
        return item
    }))

    ids.map(id => {
        gameArray[id.itemIndex] = cells[id.cellIndex]
        return id
    })
    return gameArray
}

export const checkIsGameOver = (array: RNGType[], radius: number) => {
    const checkIsGameOverArray = []
    for(let i = 0; i < array.length; i++) {
        if(array[i].value) {
            for(let j = i + 1; j <= i + radius + 1; j++) {
                if(array[j]) {
                    if(array[j].y === array[i].y - 1 && array[j].z === array[i].z + 1) {
                        checkIsGameOverArray.push(array[i].value !== array[j].value)
                    }
                    if(array[j].y === array[i].y - 1 && array[j].x === array[i].x + 1) {
                        checkIsGameOverArray.push(array[i].value !== array[j].value)
                    }
                    if(array[j].x === array[i].x + 1 && array[j].z === array[i].z - 1) {
                        checkIsGameOverArray.push(array[i].value !== array[j].value)
                    }
                }
            }
        }
     }
    return checkIsGameOverArray.every(item => item === true)
}

export const slideFunc = (
    gameArray: RNGType[],
    keyboardKey: KeyboardKeys,
    radius: number,
    points: number
) => {
    const constant = constantMap[keyboardKey]
    const copyArray = deepCopy(gameArray)
    let copyPoints = points
    const direction = generateMatrixDirectionMap[keyboardKey]
    const matrix = generateMatrix(copyArray, radius, constant, direction)
    const newGameArray: RNGType[] = Object.keys(matrix).map(key => {
        const movedArray = moveValues(matrix[key])
        const {
            mergedArray,
            points
        } = mergeValues(movedArray, copyPoints)
        copyPoints = points
        return moveValues(mergedArray)
    }).flat()

    return {
        updatedArray: updateGameArray(generateArray(radius), newGameArray),
        updatedPoints: copyPoints
    }
}