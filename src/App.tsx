import { LogoArea } from './LogoArea';
import { useCallback, useEffect, useState } from 'react';
import { AddToCalendarButton, AddToCalendarButtonType } from 'add-to-calendar-button-react';
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {

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
      buttonStyle: 'default'
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
    }
    
    async function acceptInvitation() {
      await updateInvitationState("accepted");
    }
    
    async function declineInvitation() {
      await updateInvitationState("declined");
    }    

    async function getInvitationState() {
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
    const [isLoading, setIsLoading] = useState<boolean>(true);


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
      setIsLoading(false);
    }, []);

    useEffect(() => {
      getName();
      getInvitationState();
    }, [userId]);

  return (
    <>
      <main className='flex flex-col items-center w-screen min-h-screen font-serif text-gray-700/90 overflow-hidden'>
        <LogoArea />
        <div className='w-full overflow-x-hidden max-w-full fixed top-0 left-0 h-full'>
          <div className="bg-radial from-teal-300 via-transparent to-transparent w-[600px] h-full translate-y-1/2 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
          <div className="bg-radial from-purple-400 via-transparent to-transparent w-[800px] h-full translate-y-1/3 left-0 scale-125 absolute bottom-0 -z-10 overflow-x-hidden"></div>  
        </div>
        <div className="relative z-0 bg-transparent mt-8">
          {isLoading && <p className="text-center">Loading...</p>}
          {invitationState === "pending" && !isLoading &&
          <>
            <p className="text-center">Du hast die Einladung noch nicht beantwortet.</p>
            <strong className="text-2xl text-center font-black">Moin {inviteeName} </strong>
            <div className="flex gap-4">
              <button onClick={acceptInvitation} className="text-green-700 font-black px-4 py-2 rounded">Ich komme sehr gerne!</button>
              <button onClick={declineInvitation} className="text-red-800 font-black px-4 py-2 rounded">Ich kann leider nicht</button>
            </div>
          </>
          }
          {invitationState === "accepted" && !isLoading && 
            <>
              <div data-calendar-buttons className="text-center">
                <strong className="text-2xl text-center font-black">Save the date!</strong>
                <AddToCalendarButton {...calendarEvent}></AddToCalendarButton>
              </div>
            </>
          }
          {invitationState === "declined" && !isLoading && 
          <>
            <p className="text-center">Du hast die Einladung bereits abgelehnt.</p>
          </>
          }
          </div>
        <div>
        </div>
      </main>
    </>
  )
}

export default App
