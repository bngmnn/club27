import { declineInvitation, acceptInvitation } from "./MainPage"
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

type InvitationParams = {
    inviteeName?: string;
}
const Invitation = ({inviteeName}: InvitationParams) => {
    
    const [userId, setUserId] = useState<string | null>(window.localStorage.getItem("user_id"));
    const [movingInfo, setMovingInfo] = useState<boolean>(true);

    async function getMovingInfo() {
        if (!userId) return;
        const { data, error } = await supabase
          .from("guests")
          .select("moving_info")
          .eq("user_id", userId)
          .single();
        if (error) {
          console.error(error);
          return; // Or handle error accordingly
        }
        console.log(data);
        setMovingInfo(data.moving_info);
      }

    useEffect(() => {
        getMovingInfo();
    },[]);

    return (
        <>
            <div className="text-left">
            <strong className="text-2xl mb-2 block font-black">Moin {inviteeName} </strong>
            <p className="text-justify">Ich lade dich zu meinem 27 ½ Geburtstag ein!
            <strong className="block my-2">Was?! 27 ½?</strong>
                Absolut richtig! Die Queen hat ihrerzeit ihren Geburtstag 
                lieber im Sommer gefeiert und ich werde es ihr jetzt gleichtun. 
                <br />
                {!!movingInfo && <>
                    Glücklicherweise lässt sich das auch mit der Einweihung unseres neuen Zuhauses,
                    nach Monaten der Renovierung und Wochen der Vorbereitung, kombinieren.
                    <br /><br />
                </>}
                Ich wäre super happy, wenn du gemeinsam mit uns am 14. Juni 25 feiern würdest.
            </p>
            </div>
            
            <div className="flex flex-row justify-evenly gap-8 my-4 mt-12">
                <button onClick={() => declineInvitation()} className="text-red-100 font-black p-8 rounded-full bg-red-400 hover:text-white"><ThumbsDown size={40} strokeWidth={2} /></button>
                <button onClick={() => acceptInvitation()} className="text-green-100 font-black p-8 rounded-full bg-green-500 hover:text-white"><ThumbsUp size={40} strokeWidth={2}/></button>
            </div>
            <p className="text-sm text-center">Du kannst deine Auswahl jederzeit ändern</p>
        </>
    )
}

export default Invitation;