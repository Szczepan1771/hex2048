import {getNonZeroValues} from "../utils"

const mock = [
    {
        x: 0,
        y: 0,
        z: 0,
        value: 2
    },
    {
        x: 1,
        y: 1,
        z: 1,
        value: 4
    },
    {
        x: 1,
        y: 0,
        z: 1,
        value: 0
    },
]

const expected = [
    {
        x: 0,
        y: 0,
        z: 0,
        value: 2
    },
    {
        x: 1,
        y: 1,
        z: 1,
        value: 4
    },
]

test('test 1', () => {
    const array = getNonZeroValues(mock)
    expect(array).toStrictEqual(expected)
})

