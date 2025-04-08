import { AddToCalendarButton, AddToCalendarButtonType } from 'add-to-calendar-button-react';
import { useCallback } from 'react';
import { declineInvitation } from './MainPage';
import PlusOne from './PlusOne';
import { supabase } from './client';
import './App.css'

type InviteePageParams = {
  userId: string | null;
}

function InviteePage({userId}: InviteePageParams) {

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

    const isInvited = useCallback(async () => {
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
      return data.invited_by;
    }, []);
    
  return (
    <>
      <div data-calendar-buttons className="max-w-xl mx-auto flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-md text-center">
        <div>
          <h2 className="text-2xl font-semibold text-amber-700">Du hast die Einladung angenommen!</h2>
          <p className="text-gray-700">Nice! Ich freue mich auf dich!</p>
        </div>

        <div className="flex justify-center">
          <AddToCalendarButton {...calendarEvent} />
        </div>

        <hr className="border-amber-900/30" />

        <a
          href="/dresscode"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded transition"
        >
          Zum Dresscode
        </a>

        {!isInvited && (
          <>
            <hr className="border-amber-900/30" />
            <PlusOne userId={userId} />
          </>
        )}

        <hr className="border-amber-900/30" />

        <div className="text-left">
          <label htmlFor="brings" className="block text-lg font-semibold text-amber-700 mb-2">
            Möchtest du etwas zu essen mitbringen?
          </label>
          <textarea
            id="brings"
            name="brings"
            placeholder="Falls ja, was möchtest du mitbringen?"
            className="w-full border border-amber-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            rows={3}
          ></textarea>
          <button
            className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition"
            onClick={() => console.log("Save bring item")} // Replace with your logic
          >
            Speichern
          </button>
        </div>
        
        <hr className="border-amber-900/30" />

        <button
          onClick={() => declineInvitation(userId ?? "")}
          className="text-red-700 font-bold py-3 px-6 border border-red-300 hover:bg-red-50 rounded transition"
        >
          Ich kann leider doch nicht kommen
        </button>
      </div>

    </>
  )
}

export default InviteePage;
