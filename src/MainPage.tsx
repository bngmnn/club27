// InvitationList.tsx
import Header from './Header';
import InviteePage from './InviteePage';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { supabase } from './client';
import { getPlusOneName, getPlusOneUserId } from './PlusOne';
import { useCallback, useEffect, useState } from 'react';
import './App.css'

function MainPage() {
    async function simulateInvitationState() {
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');
        state && setInvitationState(state);
      }
  
      function setUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        setUserId(userId);
        if (userId) {
          window.localStorage.setItem('user_id', userId);
          console.log("User ID set from URL: ", userId);
        } else {
          console.log("No user ID found in URL");
        }
      }  
  
      async function getInvitationState() {
        if (!userId) return;
        const { data, error } = await supabase
          .from("guests")
          .select("invitation_state")
          .eq("user_id", userId)
          .single();
        if (error) {
          console.error(error);
          return; // Or handle error accordingly
        }
        console.log(data);
        setInvitationState(data.invitation_state);
      }
  
      const [inviteeName, setInviteeName] = useState<string>("");
      const [invitationState, setInvitationState] = useState<string>("");
      const [userId, setUserId] = useState<string | null>(window.localStorage.getItem("user_id"));
  
  
      const getName = useCallback(async () => {
        const { data, error } = await supabase
          .from("guests")
          .select("name")
          .eq("user_id", window.localStorage.getItem("user_id"))
          .single();
        if (error) {
          console.error(error);
          return; // Or handle error accordingly
        }
        console.log(data);
        setInviteeName(data.name);
      }, []);
  
      
  
      useEffect(() => {
        setUserIdFromUrl();
        simulateInvitationState();
      }, []);
  
      useEffect(() => {
        getName();
        getInvitationState();
        getPlusOneName();
        getPlusOneUserId();
      }, [userId]);
    
      return (
        <main className={`flex flex-col items-center w-screen min-h-screen font-serif text-gray-700/90 overflow-x-hidden overflow-y-auto px-8 pb-8 ${!!userId ? '' : 'max-h-screen'}`}>
            <Header userId={userId} />
            <div className="relative z-0 bg-transparent mt-8">
            {invitationState === "pending" &&
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
            }
            {invitationState === "accepted" && <InviteePage userId={userId} />}

            {invitationState === "declined" && 
                <>
                <p className="text-center">Du hast die Einladung bereits abgelehnt.</p>
                <p className="text-center">Du möchtest dich noch einmal anders entscheiden?</p>

                <button className="mt-4 text-green-700 font-black p-4 border rounded" onClick={() => acceptInvitation(userId ?? "")}>Ich hab' meine Meinung geändert, ich komme doch</button>
                </>
            }
            </div>
            <div>
            </div>
        </main>
      )
}

export default MainPage;

type UpdateInvitationStateParams = {
    state: string;
    userId: string;
}

export async function updateInvitationState({state, userId}: UpdateInvitationStateParams) {
    const { data, error } = await supabase
      .from("guests")
      .update({ invitation_state: state })
      .eq("user_id", userId)
      .select();
  
    if (error) {
      console.error(error);
      return; // Or handle error accordingly
    }
    console.log(data);
      
    window.location.reload()
  }
  
  export async function acceptInvitation(userId: string) {
    await updateInvitationState({state: "accepted", userId});
  }
  
  export async function declineInvitation(userId: string) {
    await updateInvitationState({state: "declined", userId});
  }  