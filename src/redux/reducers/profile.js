const initialState = {
    uid: "undefined",
    name: "anonymous",
    bingoList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bingoSelected:[[1, 1, 1, 1, 1],[ 1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],
    bingoSelected2 :[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    numberPicked: [],
    messages: [],
    online: 0,
    gamemode: "picking",
    myTurn: false,
    point: 0
}



export const profile = (state = initialState, action) => {
    switch (action["type"]) {
        case "RESTOREPROFILE":
            return initialState;
        case "UPDATEUUID":
            return {
                ...state,
                uid: action.payload.uid
            }
        case "UPDATENAME":
            return {
                ...state,
                name: action.payload.name
            }
        case "UPDATEBINGOLIST":
            return {
                ...state,
                bingoList: action.payload.bingoList
            }
        case "UPDATEBINGOSELECTED":
            return {
                ...state,
                bingoSelected: action.payload.bingoSelected
            }
        
        case "UPDATENUMBERPICKED":
            return {
                ...state,
                numberPicked: action.payload.numberPicked
            }
        case "UPDATEMESSAGES":
            return {
                ...state,
                messages: [...state.messages, action.payload.message]
            }
        case "UPDATEONLINEMEMBER":
            return {
                ...state,
                online: action.payload.online
            }
        case "UPDATEGAMEMODE":
            return {
                ...state,
                gamemode: action.payload.gamemode
            }
        case "UPDATEMYTURN":
            return {
                ...state,
                myTurn: action.payload.myTurn
            }
        case "UPDATEPOINT":
            return {
                ...state,
                point: action.payload.point
            }
        default:
            return state;
    }
}