import { LogoArea } from './LogoArea';
import { useCallback, useEffect, useState } from 'react';
import { AddToCalendarButton, AddToCalendarButtonType } from 'add-to-calendar-button-react';
import { Link, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Resend } from 'resend';
import { supabase } from './client';
import './App.css'
import { copyUserLink } from './InvitationList';

function InviteePage() {

    const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

    const calendarEvent: AddToCalendarButtonType = {
      name: 'Marvins 27 ½ Geburtstag',
      description: '',
      location: 'Hirschgraben 12, 22089 Hamburg',
      timeZone: 'Europe/Berlin',
      options: ['Apple', 'Google', 'iCal'],
      startDate: '2025-06-14',
      endDate: '2025-06-14',
      startTime: '13:00',
      endTime: '23:00',
      organizer: "Marvin Bangemann|post@marvinbangemann.de",
      buttonsList: false,
      buttonStyle: 'default',
      label: 'Save the date',
    }

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

    async function updateInvitationState(state: string) {
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

      resend.emails.send({
        from: 'post@marvinbangemann.de',
        to: 'marvin@bngmnn.de',
        subject: `Geburtstagseinladung was ${state} by ${inviteeName}`,
        html: `<p>Die Einladung wurde ${state} von ${inviteeName}!</p>`
      });
        
      window.location.reload()
    }
    
    async function acceptInvitation() {
      await updateInvitationState("accepted");
    }
    
    async function declineInvitation() {
      await updateInvitationState("declined");
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
    async function addPlusOne() {
      const plusOneNameInput = document.getElementById("plusOneNameInput") as HTMLInputElement;
      const plusOneName = plusOneNameInput.value;
      const { data, error } = await supabase
        .from("guests")
        .insert({ name: plusOneName, invited_by: userId })
        .select();
      if (error) {
        console.error(error);
        return; // Or handle error accordingly
      }
      console.log(data);
      setPlusOneName(plusOneName);
      plusOneNameInput.value = "";
      await updatePlusOneInCurrentUser(plusOneName);
    }
    async function updatePlusOneInCurrentUser(plusOneName: string) {
      const { data, error } = await supabase
        .from("guests")
        .update({ plus_one_name: plusOneName })
        .eq("user_id", userId)
        .select();
      if (error) {
        console.error(error);
        return; // Or handle error accordingly
      }
      console.log(data);
    }

    const [inviteeName, setInviteeName] = useState<string>("");
    const [invitationState, setInvitationState] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(window.localStorage.getItem("user_id"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [plusOneName, setPlusOneName] = useState<string>("");
    const [plusOneUserId, setPlusOneUserId] = useState<string | undefined>();

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

    const getPlusOneName = useCallback(async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("plus_one_name")
        .eq("user_id", window.localStorage.getItem("user_id"))
        .single();
      if (error) {
        console.error(error);
        return; // Or handle error accordingly
      }
      setPlusOneName(data.plus_one_name);
    }, []);
    const getPlusOneUserId = useCallback(async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("user_id")
        .eq("name", plusOneName)
        .single();
      if (error) {
        console.error(error);
        return; // Or handle error accordingly
      }
      setPlusOneUserId(data.user_id);
    }, [plusOneName]);

    useEffect(() => {
      setUserIdFromUrl();
      setIsLoading(false);
      simulateInvitationState();
    }, []);

    useEffect(() => {
      getName();
      getInvitationState();
      getPlusOneName();
      getPlusOneUserId();
    }, [userId]);
    
  return (
    <>
      <main className={`flex flex-col items-center w-screen min-h-screen font-serif text-gray-700/90 overflow-x-hidden overflow-y-auto px-8 pb-8 ${!!userId ? '' : 'max-h-screen'}`}>
        <LogoArea animateLogo={!!userId} />
        <div className='w-full overflow-hidden max-w-full fixed top-0 left-0 h-full'>
          <div className="bg-radial from-amber-200 via-transparent to-transparent w-[600px] h-full translate-y-1/2 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
          <div className="bg-radial from-red-200 via-transparent to-transparent w-[800px] h-full translate-y-1/3 left-0 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
        </div>
        <div className="relative z-0 bg-transparent mt-8">
          {isLoading && <p className="text-center">Loading...</p>}
          {invitationState === "pending" && !isLoading &&
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
              <button onClick={declineInvitation} className="text-red-800 font-black p-8 rounded-2xl border-red-800 border-2 hover:bg-red-400 hover:text-white"><ThumbsDown size={40} strokeWidth={2} /></button>
              <button onClick={acceptInvitation} className="text-green-700 font-black p-8 rounded-2xl border-green-700 border-2 hover:bg-green-300 hover:text-white"><ThumbsUp size={40} strokeWidth={2}/></button>
            </div>
          </>
          }
          {invitationState === "accepted" && !isLoading && 
            <>
              <div data-calendar-buttons className="text-center flex justify-center flex-col items-center gap-4">
                <p className="text-center text-xl">Du hast die Einladung angenommen!</p>
                <p className="text-center">Nice! Ich freue mich auf dich!</p>
                <AddToCalendarButton {...calendarEvent}></AddToCalendarButton>
              <hr className="w-full border-amber-900/30" />

                <a className="text-white bg-amber-500 font-black p-4 rounded" href="/dresscode">Zum Dresscode</a>

              <hr className="w-full border-amber-900/30" />
                {
                !!plusOneName && 
                <>
                  <a className="text-amber-500 inline-flex items-center gap-2 cursor-pointer" onClick={() => copyUserLink(plusOneUserId)}><Link className='w-4 h-4' />Einladungslink für <strong>{plusOneName}</strong> kopieren</a>
                  <button className="text-center text-amber-700" onClick={() => setPlusOneName("")}>Du möchtest deinen +1 ändern?</button>
                </>
                }
                {!plusOneName && 
                <>
                  <p className="text-center">Du willst noch jemanden mitbringen?</p>
                  <div className="flex items-center w-full">
                    <input id="plusOneNameInput" className="w-full bg-white rounded rounded-r-none py-2 px-4" placeholder="Gib den Vornamen deines +1 ein"/>
                    <button className="bg-amber-500 text-white rounded rounded-l-none p-2 px-4 font-bold" onClick={addPlusOne}>+1</button>
                  </div>
                </>
                }
              <hr className="w-full border-amber-900/30" />
                <button className="text-red-800 font-black p-4 border rounded" onClick={declineInvitation}>Ich kann leider doch nicht kommen</button>
              </div>
            </>
          }
          {invitationState === "declined" && !isLoading && 
          <>
            <p className="text-center">Du hast die Einladung bereits abgelehnt.</p>
            <p className="text-center">Du möchtest dich noch einmal anders entscheiden?</p>

            <button className="mt-4 text-green-700 font-black p-4 border rounded" onClick={acceptInvitation}>Ich hab' meine Meinung geändert, ich komme doch</button>
            </>
          }
          </div>
        <div>
        </div>
      </main>
    </>
  )
}

export default InviteePage;
