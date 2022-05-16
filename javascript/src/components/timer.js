import { useState, useRef } from "react"

function useTimer(callback, delay) {
    const [remainSecond, setRemainSecond] = useState(0)
    const savedCallback = useRef()
    const savedDelay = useRef()

    // 保存到期回呼方法
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // 建立計數器並執行倒數
    useEffect(() => {
        // 刷新延遲秒數
        savedDelay.current = delay
        setRemainSecond(delay)

        // 每秒執行
        const tick = (id) => {
            // 計算剩餘時間
            if (savedDelay.current > 0) {
                savedDelay.current -= 1
            } else {
                savedDelay.current = 0
            }

            // 更新輸出的剩餘秒數
            setRemainSecond(savedDelay.current)

            // 停止條件
            if (savedDelay.current <= 0) {
                savedCallback.current()
                clearInterval(id)
            }
        }

        if (delay !== null) {
            // 產生計數器
            const id = setInterval(() => tick(id), 1000)

            // 清除計數器 (cleanup)
            return () => clearInterval(id)
        }
    }, [delay])

    // 輸出剩餘秒數
    return remainSecond
}