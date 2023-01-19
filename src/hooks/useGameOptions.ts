import {useEffect, useState} from "react";

const urlSearch = new URLSearchParams({
    hostname: window.location.hostname === 'localhost' ? 'localhost' : 'hex2048-lambda.octa.wtf',
    port: window.location.hostname === 'localhost' ? '13337': '80',
    radius: '2'
})

const hostname = window.location.hostname === 'localhost' ? `${urlSearch.get('hostname')}:${urlSearch.get('port')}`  : urlSearch.get('hostname')
export const useGameOptions = () => {
    const [radius, setRadius] = useState<number>(() => Number(urlSearch.get('radius')))
    const handleSizeBoard = (value: number) =>  {
        setRadius(value)
    }

    useEffect(() => {
        const size = 100 - (radius * 10)
        urlSearch.set('radius', `${radius}`)
        document.documentElement.style.setProperty('--a', `${size}px`)
    }, [radius])

    return {
        radius,
        hostname,
        handleSizeBoard
    }
}