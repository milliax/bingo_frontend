import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

// import Admin from "./pages/Admin";
import Game from "./pages/Games"
import Home from "./pages/Home"
import { useEffect, useState } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket"
import { v4 as uuidv4 } from "uuid"
import Nav from "./components/nav"

import { useDispatch, useSelector } from "react-redux";
import { updateName, updateUUID, updateBingoList, updateBingoSelected, updateMessages, updateMyTurn, updateOnlineMember, updateNumberPicked, updatePoint,updateGameMode } from "./redux/actions"
import { store } from "./redux/store";

const client = new W3CWebSocket("ws://127.0.0.1:1234")

export function App() {
  // unique uuid
  const dispatch = useDispatch()
  const [uid, setUid] = useState(useSelector(state => state.profile.uid))
  const [username, setUsername] = useState(useSelector(state => state.profile.name))
  const [mode, setMode] = useState(useSelector(state => state.profile.gamemode)) // ["picking"|"gaming"|"changing"]
  const [myTurn, setMyTurn] = useState(useSelector(state => state.profile.myTurn))
  const [bingoSelected, setBingoSelected] = useState(useSelector(state => state.profile.bingoSelected))
  const [point,setPoint] = useState(useSelector(state => state.profile.point))
  const [realpoint, setRealpoint] =useState(point)

  const [sendMessage, setSendMessage] = useState("")
  const [buttonValue, setButtonValue] = useState("0")

  store.subscribe(() => {
    setMode(store.getState().profile.gamemode)
    setMyTurn(store.getState().profile.myTurn)
    setUsername(store.getState().profile.name)
    setUid(store.getState().profile.uid)
    setBingoSelected(store.getState().profile.bingoSelected)
    setPoint(store.getState().profile.point)
  })

  //發送訊息給Server
  const sendMsg = (data) => {
    console.log(data)
    client.send(JSON.stringify(data))
  }

  //計算條數
  const checkpoint = () =>{
    let temp_array = store.getState().profile.bingoSelected
    len = store.getState().profile.numberPicked.length
    for(i =0;i<len;i++){
      count = 0
      for(x = 0;x<25;x++){
        if(store.getState().profile.bingoList[x] == store.getState().profile.numberPicked[i]){
          temp_array[parseInt(count/5)][count%5] = 0
        }
        count++
      }
    }
    dispatch(updateBingoSelected({
      bingoSelected : temp_array
    }))
    console.log(store.getState().profile.bingoSelected)
    console.log(store.getState().profile.numberPicked)
    //橫
    let k = 0
    for(i=0;i<5;i++){
        sum = 0
        for(j=0;j<5;j++){
            sum += temp_array[i][j] 
        }
        if( sum === 0 ){
            k++
        }
    }
    //縱
    for(i=0;i<5;i++){
        sum = 0
        for(j=0;j<5;j++){
            sum += temp_array[j][i]
        }
        if( sum === 0 ){
            k++
        }
    }
    //斜
    for(i=0;i<5;i++){
        sum += temp_array[i][i]
    }
    if( sum === 0 ){
        k++
    }
    sum = 0
    for(i=0;i<5;i++){
        sum += temp_array[i][4-i]
    }
    if( sum === 0 ){
        k++
    }
    console.log(k)
    setRealpoint(k)
    dispatch(updatePoint({
      point: k
    }))
}
  //處理Server發來的訊息
  const handleMessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
    let sender;
    let new_message = ""
    dispatch(updateOnlineMember({
      online: message["online"]
    }))
    switch (message["type"]) {
      case "system":
        console.log("system")
        sender = "系統訊息"
        new_message = `SYSTEM: ${message["content"]}`
        console.log(`player: ${message["player"]}`)
        if (message["player"] === store.getState().profile.uid) {
          // it's my turn
          dispatch(updateMyTurn(
            { myTurn: true }
          ))
        }
        break;
      case "user":
        console.log("user")
        sender = message["from"]
        new_message = `${sender}: ${message["content"]}`
        break;
      case "handshake":
        const name = uuidv4().substring(0, 7);
        console.log(uid)
        dispatch(updateUUID({
          uid: name
        }))
        sendMsg({
          type: "login",
          content: store.getState().profile.uid,
        })
        return;
      case "login":
        // new_message = `${message["content"]} 已加入`
        break;
      case "logout":
        new_message = `${message["content"]} 離開了遊戲`
        break;
      case "player_send_number":
        new_message = `${message["content"]}`
        //接收玩家選的數字
        dispatch(updateNumberPicked(
          {numberPicked : message["picked_list"]}
        ))
        checkpoint()
      
        if (message["player"] === store.getState().profile.uid) {
          // it's my turn
          dispatch(updateMyTurn(
            { myTurn: true }
          ))
        }
        break;
      //有人贏了
      case "finish":
        new_message=`${message["content"]}`
        alert(`${message["content"]}`)
        dispatch(updateGameMode({
          "gamemode": "finished"
        }))
        break;
      case "change_name":
        //new_message = `${message["from"]} changed to ${message["to"]}`
        new_message = `${message["to"]} 已加入`
        break;
      case "reject":
        alert("遊戲不開放")
        break;
    }
    console.log(`message: ${new_message}`)
    dispatch(updateMessages({
      message: new_message
    }))
  }

  const handleWindowClose = async (event) => {
    event.preventDefault()
    event.returnValue = ""
  }


  useEffect(() => {
    client.onopen = () => {
      console.log("websocket connected")
    }
    client.onmessage = (message) => { handleMessage(message) }
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose)
    }
  }, [])

  useEffect(() => {
    if (sendMessage !== "") {
      sendMsg({
        type: "send",
        content: sendMessage
      })
    }
    setSendMessage("")
  }, [sendMessage])

  //如果條數有動
  useEffect(() => {
   if(realpoint == 1){
    sendMsg({
      type: "finish",
      content:""
    })
   }
  },[realpoint])

  //按按鈕後 取消自己的選號碼狀態
  useEffect(() => {
    if (buttonValue !== "0") {
      if (myTurn) {
        sendMsg({
          type: "sendnumber",
          content: buttonValue,
        })
        dispatch(updateMyTurn({
          myTurn: false,
        }))
      }
    }
  }, [buttonValue])

  useEffect(() => {
    if (username !== "anonymous") {
      console.log("username")
      sendMsg({
        type: "update_name",
        content: username
      })
    }
  }, [username])

  useEffect(() => {
    if (mode === "gaming") {
      sendMsg({
        "type": "ready",
        "content": store.getState().profile.bingoList,
      })
    }
    if (mode === "finished"){

    }
  }, [mode])

  return (
    <div className="bg-blue-200">
      <Router>
        <header className="text-center text-4xl font-bold">
          <Link to="/">
            <h1>Bingooo</h1>
          </Link>
        </header>
        <Nav />

        {/* Routes */}
        <Switch>
          {/*
          <Route path="/admin">
            <Admin pack={
              {
                messages:messages,
                sendMessage :sendMessage,
                setSendMessage :setSendMessage,
                username : username,
                setUsername: setUsername,
                online : online,
                mode: mode,
                setMode :setMode,
              }
            }/>
          </Route>
          */}
          <Route path="/games">
            <Game pack={{
              sendMessage: sendMessage,
              setSendMessage: setSendMessage,
              buttonValue: buttonValue,
              setButtonValue: setButtonValue,
            }} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};