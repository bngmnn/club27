import { declineInvitation, acceptInvitation } from "./MainPage"
import { ThumbsDown, ThumbsUp } from 'lucide-react';

type InvitationParams = {
    userId: string | null;
    inviteeName?: string;
}
const Invitation = ({userId, inviteeName}: InvitationParams) => {
    
    return (
        <>
            <div className="text-left">
            <strong className="text-2xl mb-2 block font-black">Moin {inviteeName} </strong>
            <p className="text-justify">Ich lade dich zu meinem 27 ½ Geburtstag ein!
            <strong className="block my-2">Was?! 27 ½?</strong>
                Absolut richtig! Die Queen hat ihrerzeit ihren Geburtstag 
                lieber im Sommer gefeiert und ich werde es ihr jetzt gleichtun. 
                <br />
                Glücklicherweise lässt sich das auch mit der Einweihung unseres neuen Zuhauses,
                nach Monaten der Renovierung und Wochen der Vorbereitung, kombinieren.
                <br /><br />
                Ich wäre super happy, wenn du gemeinsam mit uns am 14. Juni 25 feiern würdest.
            </p>
            </div>
            <div className="flex flex-row justify-around gap-8 my-4">
                <button onClick={() => declineInvitation(userId ?? "")} className="text-red-800 font-black p-8 rounded-2xl border-red-800 border-2 hover:bg-red-400 hover:text-white"><ThumbsDown size={40} strokeWidth={2} /></button>
                <button onClick={() => acceptInvitation(userId ?? "")} className="text-green-700 font-black p-8 rounded-2xl border-green-700 border-2 hover:bg-green-300 hover:text-white"><ThumbsUp size={40} strokeWidth={2}/></button>
            </div>
        </>
    )
}

export default Invitation;