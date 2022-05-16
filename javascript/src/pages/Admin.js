import { useState, useEffect } from "react";
import Messages from "../components/game/messages";
import Adminnotification from "../components/game/adminnotification";
export default function Admin(props){
  
  
  
  return(

    <div className="flex flex-col bg-indigo-50 text-center space-y-2 pt-10">
      <div className="flex flex-row bg-indigo-100 text-center w-full h-600 justify-center" >
        <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
            <Messages pack={props["pack"]} />
        </div>
        <div className="h-80 w-2">

        </div>
        <div className="hidden md:block w-1/5 bg-red-100 py-2 px-1">
            <Adminnotification pack={props["pack"]} />
        </div>
      </div>
    </div>
  );

}



