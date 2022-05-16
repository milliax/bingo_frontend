export const RESETPROFILE = "RESETPROFILE"
export const UPDATEUUID = "UPDATEUUID"
export const UPDATENAME = "UPDATENAME"
export const UPDATEBINGOLIST = "UPDATEBINGOLIST"
export const UPDATEBINGOSELECTED = "UPDATEBINGOSELECTED"
export const UPDATEMESSAGES = "UPDATEMESSAGES"
export const UPDATENUMBERPICKED = "UPDATENUMBERPICKED"
export const UPDATEONLINEMEMBER = "UPDATEONLINEMEMBER"
export const UPDATEGAMEMODE = "UPDATEGAMEMODE"
export const UPDATEMYTURN = "UPDATEMYTURN"
export const UPDATEPOINT = "UPDATEPOINT"

export const resetProfile = () => ({ type: RESETPROFILE })
export const updateUUID = (value) => ({ type: UPDATEUUID, payload: value })
export const updateName = (value) => ({ type: UPDATENAME, payload: value })
export const updateBingoList = (value) => ({ type: UPDATEBINGOLIST, payload: value })
export const updateBingoSelected = (value) => ({ type: UPDATEBINGOSELECTED, payload: value })
export const updateNumberPicked = (value) => ({ type: UPDATENUMBERPICKED, payload: value })
export const updateMessages = (value) => ({ type: UPDATEMESSAGES, payload: value })
export const updateOnlineMember = (value) => ({ type: UPDATEONLINEMEMBER, payload: value })
export const updateGameMode = (value) => ({ type: UPDATEGAMEMODE, payload: value })
export const updateMyTurn = (value) => ({ type: UPDATEMYTURN, payload: value })
export const updatePoint = (value) => ({type: UPDATEPOINT,payload: value})