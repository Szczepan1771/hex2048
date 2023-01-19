import React, {Dispatch, FC, useId} from "react";
import {GameStatus} from "../../types";

interface MenuProps {
    points: number
    gameStatus: GameStatus
    radius: number
    handleSizeBoard: Dispatch<number>
    handleReset: () => void
}

const Menu: FC<MenuProps> = (props) => {
    const {
        points,
        gameStatus,
        radius,
        handleSizeBoard,
        handleReset,
    } = props
    const id = useId()

    return (
        <div className={'menu'}>
            <div className={'input_wrapper'}>
                <label className={'input_label'} htmlFor={id}>Radius</label>
                <input
                    id={id}
                    onChange={(evt) => handleSizeBoard(Number(evt.target.value))}
                    value={radius}
                    type={"range"}
                    min={2}
                    max={6}
                />
            </div>
            <button onClick={handleReset} className={'button'}>RESET</button>
            <div>Points: <span>{points}</span></div>
            <div>Game Status: <span data-status={gameStatus}>{gameStatus}</span></div>
        </div>
    )
}

export default Menu