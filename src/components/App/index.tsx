import React from "react"
import {useGameBoard} from "../../hooks/useGameBoard";
import Tile from "../Tile";
import Menu from "../Menu";

export const App: React.FC = () => {
    const {
        radius,
        points,
        error,
        gameMatrix,
        gameStatus,
        handleSizeBoard,
        handleReset,
    } = useGameBoard()

    return (
        <>
            <Menu
                radius={radius}
                points={points}
                gameStatus={gameStatus}
                handleSizeBoard={handleSizeBoard}
                handleReset={handleReset}
            />
            <div className={'hex_grid'}>
                {Object.keys(gameMatrix).map(key => (
                    <div className={'hex_column'} key={key}>
                        {gameMatrix[key].map(item => (
                            <Tile key={`${item.x}-${item.y}-${item.z}`} {...item} />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}
