import { AddToCalendarButton, AddToCalendarButtonType } from 'add-to-calendar-button-react';
import { useCallback, useEffect, useState } from 'react';
import { declineInvitation } from './MainPage';
import PlusOne from './PlusOne';
import Brings from './Brings';
import { supabase } from './client';
import './App.css'

type InviteePageParams = {
  inviteeName?: string;
}

function InviteePage({inviteeName}: InviteePageParams) {

    const [isInvitedBy, setIsInvitedBy] = useState<boolean>(false);

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

    const getIsInvitedBy = useCallback(async () => {
      const { data, error } = await supabase
          .from("guests")
          .select("invited_by")
          .eq("user_id", window.localStorage.getItem("user_id"))
          .single();
      if (error) {
          console.error(error);
          return;
      }
      console.log(data);
      setIsInvitedBy(!!data.invited_by);
    }, []);

    useEffect(() => {
      getIsInvitedBy();
    })


    
  return (
    <>
      <div data-calendar-buttons className="max-w-xl mx-auto flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-md text-center">
        <div>
          <h2 className="text-lg font-semibold text-amber-700">
            Schön, dass du dabei bist <br />
            <strong>{inviteeName}</strong>
          </h2>
          <p className="text-gray-700">Ich freue mich auf dich!</p>
        </div>

        <div className="flex justify-center">
          <AddToCalendarButton {...calendarEvent} />
        </div>

        <hr className="border-amber-900/30" />

        <a
          href="/dresscode"
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded transition"
        >
          Zum Dresscode
        </a>

        {!isInvitedBy && (
          <>
            <hr className="border-amber-900/30" />
            <PlusOne />
          </>
        )}

        <hr className="border-amber-900/30" />

        <Brings />

        <hr className="border-amber-900/30" />

        <button
          onClick={() => declineInvitation()}
          className="text-red-700 font-bold py-3 px-6 border border-red-300 hover:bg-red-50 rounded transition"
        >
          Ich kann leider doch nicht kommen
        </button>
      </div>

    </>
  )
}

export default InviteePage;
