import {FC} from "react";
import {RNGType} from "../../types";
const Tile: FC<RNGType> = (props) => {
    const {x, y, z, value} = props
    return (
        <div className={`hex x${value}`} data-x={x} data-y={y} data-z={z} data-value={value}>
            {value !== 0 && value}
        </div>
    )
}

export default Tile