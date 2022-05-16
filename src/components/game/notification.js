import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateMyTurn } from "../../redux/actions"
import { store } from "../../redux/store"

export default function Notification(props) {
    const [timeRemain, setTimeRemain] = useState(0)

    const [timeClass, setTimeClass] = useState("")
    const dispatch = useDispatch()

    const intervalRef = useRef()

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeRemain(prev => prev - 1)
        }, 1000)
        return () => clearInterval(intervalRef.current)
    }, [])

    const [myTurn, setMyturn] = useState(useSelector(state => state.profile.myTurn))
    const [username, setUsername] = useState(useSelector(state => state.profile.name))
    const [mode, setMode] = useState(useSelector(state => state.profile.gamemode))
    const [online, setOnline] = useState(useSelector(state => state.profile.online))
    const [point, setPoint] = useState(useSelector(state => state.profile.point))
 
    store.subscribe(() => {
        setMyturn(store.getState().profile.myTurn)
        setUsername(store.getState().profile.name)
        setOnline(store.getState().profile.online)
        setMode(store.getState().profile.gamemode)
        setPoint(store.getState().profile.point)
    })

    useEffect(() => {
        if (myTurn) {
            setTimeRemain(30)
        } else {
            setTimeRemain(0)
        }
    }, [myTurn])

    return (
        <div className="w-full bg-red-100 flex flex-col justify-between py-2 h-full">
            <div className="place-self-auto">
                <div className={`${timeClass}`} id="countdown" >
                    TimeLeft: {timeRemain}
                </div>
                暱稱：{username}<br />
                目前在線：{online} <br />
                模式：{mode}<br />
                條數：{point}<br />
                <span hidden={props["pack"]["number"] === 26}>現在選擇：{props["pack"]["number"]}</span>
            </div>

            <div className="">
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    onClick={props["pack"]["randomSort"]} hidden={mode === "gaming" || mode === "finished"}>隨機排序!!!</button>
                <button className="bg-indigo-200 py-1 px-2 rounded-lg hover:bg-indigo-300 "
                    hidden={!(props["pack"]["number"] === 26 && (mode === "picking" || mode === "changing"))} onClick={props["pack"]["confirmTable"]}>確定/修改排版</button>
            </div>
        </div>
    )
}