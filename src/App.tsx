import { LogoArea } from './LogoArea';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
      buttonsList: true,
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
    }, []);

    useEffect(() => {
      getName();
      getInvitationState();
    }, [userId]);

  return (
    <>
      <main className='flex flex-col items-center min-h-screen font-serif text-gray-700/90'>
        <LogoArea />
        <div className="bg-radial from-teal-300 via-transparent to-transparent w-full h-full translate-y-1/2 scale-125 absolute bottom-0 -z-10"></div>  
        <div className="bg-radial from-purple-400 via-transparent to-transparent w-1/2 h-full translate-y-1/3 left-0 scale-125 absolute bottom-0 -z-10"></div>  
        <div className="relative z-0 bg-transparent">
          

          
          {isLoading && <p className="text-center">Loading...</p>}
          {invitationState === "accepted" && 
            <>
              <div data-calendar-buttons className="text-center">
                <strong className="text-4xl text-center uppercase font-black">Save the date!</strong>
                <AddToCalendarButton {...calendarEvent}></AddToCalendarButton>
              </div>
            </>
          }
          {invitationState === "declined" && <p className="text-center">Du hast die Einladung bereits abgelehnt.</p>}
            <strong className="text-4xl text-center uppercase font-black">Moin {inviteeName} </strong>
            <div className="flex gap-4">
              <button onClick={acceptInvitation} className="bg-green-500 text-white px-4 py-2 rounded">Ja</button>
              <button onClick={declineInvitation} className="bg-red-500 text-white px-4 py-2 rounded">Nein</button>
            </div>
          </div>
        <div>
          <p>Geburtstag? Marvin? Im Sommmer?
          </p>
        </div>
      </main>
    </>
  )
}

export default App
