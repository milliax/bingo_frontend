import { useEffect, useState, useRef } from "react"

import { useDispatch, useSelector } from "react-redux"
import { store } from "../../redux/store"

export default function Messages(props) {
    const [messageInput, setMessageInput] = useState("")

    const [messages,setMessages] = useState(useSelector(state => state.profile.messages))

    const sendMessage = (event) => {
        event.preventDefault()
        props.pack.setSendMessage(messageInput)
        setMessageInput("")
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    store.subscribe(()=>{
        setMessages(store.getState().profile.messages)
    })

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col overflow-auto h-full">
                {messages ? messages.map((item, index) => (
                    <div key={`${item}${index}`} className="text-left">
                        {item}
                    </div>
                )) : <div>無訊息</div>}
                <div className="" ref={messagesEndRef}></div>
            </div>
            <div className="">
                <form onSubmit={sendMessage} className="flex flex-row space-x-1">
                    <input className="rounded-md w-full px-1" value={messageInput} onChange={(event) => { setMessageInput(event.target.value) }} placeholder="點此傳遞訊息">
                    </input>
                    <button className="hidden md:block px-1 bg-blue-200 hover:bg-blue-300 rounded-md">send</button>
                </form>
            </div>
        </div>
    )
}