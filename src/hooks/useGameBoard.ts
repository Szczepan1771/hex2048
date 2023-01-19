import {useEffect, useState} from "react";
import {GameStatus, KeyboardKeys, MatrixType, RNGType, SlideKeys,} from "../types";
import axios from "axios";
import {checkIsGameOver, generateArray, generateMatrix, getNonZeroValues, slideFunc, updateGameArray} from "../utils";
import {useGameOptions} from "./useGameOptions";

export const useGameBoard = () => {
    const {radius, hostname, handleSizeBoard} = useGameOptions()
    const [gameStatus, setGameStatus] = useState<GameStatus>(() => GameStatus.PLAYING)
    const [pressedKey, setPressedKey] = useState(() => '')
    const [points, setPoints] = useState(() => 0);
    const [prevGameArray, setPrevGameArray] = useState<RNGType[]>(() => [])
    const [gameArray, setGameArray] = useState<RNGType[]>(() => generateArray(radius))
    const [gameMatrix, setGameMatrix] = useState<MatrixType>(() => generateMatrix(gameArray, radius, SlideKeys.X))
    const [error, setError] = useState<null | string>(() => null)
    const fetchNewCell = async (array: RNGType[]) => {
        const body = getNonZeroValues(array);
        try {
            await  axios.post(`http://${hostname}/${radius}`, body).then(res => updateArray(res.data, array))
        } catch (err) {
            setError(err as string)
        } finally {

        }

    }
    const updateArray = (cells: RNGType[], array: RNGType[]) => {
        const newArray = updateGameArray(array, cells)
        const newMatrix = generateMatrix(newArray, radius, SlideKeys.X)
        setGameArray(newArray)
        setGameMatrix(newMatrix)
    }
    const slide = (keyboardKey: KeyboardKeys) => {
        const {
            updatedArray,
            updatedPoints
        } = slideFunc(gameArray, keyboardKey, radius, points)
        setPoints(updatedPoints)
        setGameArray(updatedArray)
    }
    const handleSlideKeys = (key: KeyboardKeys) => {
        if (gameStatus === GameStatus.PLAYING) {
            if (Object.values(KeyboardKeys).includes(key)) {
                setPressedKey(() => '')
                return slide(key)
            }
        }
    }
    const handleReset = () => {
        setPoints(0)
        setGameStatus(GameStatus.PLAYING)
        updateArray([], generateArray(radius))
    }

    useEffect(() => {
        document.addEventListener('keyup', evt => setPressedKey(evt.key))
        return () => {
            document.removeEventListener('keyup', evt => setPressedKey(evt.key))
        }
    }, [])

    useEffect(() => {
        if (JSON.stringify(prevGameArray) !== JSON.stringify(gameArray)) {
            setPrevGameArray(gameArray)
            fetchNewCell(gameArray)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameArray, prevGameArray])

    useEffect(() => {
        if (getNonZeroValues(gameArray).length === gameArray.length) {
            const isGameOver = checkIsGameOver(gameArray, radius)
            if (isGameOver) setGameStatus(GameStatus.GAME_OVER)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getNonZeroValues(gameArray).length === gameArray.length])

    useEffect(() => {
        handleSlideKeys(pressedKey as KeyboardKeys)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pressedKey])

    useEffect(() => {
        handleReset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [radius])

    return {
        radius,
        error,
        gameMatrix,
        gameStatus,
        points,
        handleSizeBoard,
        handleReset,
    }
}