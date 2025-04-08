import { AddToCalendarButton, AddToCalendarButtonType } from 'add-to-calendar-button-react';
import { declineInvitation } from './MainPage';
import PlusOne from './PlusOne';
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

    
  return (
    <>
      <div data-calendar-buttons className="text-center flex justify-center flex-col items-center gap-4">
        <p className="text-center text-xl">Du hast die Einladung angenommen!</p>
        <p className="text-center">Nice! Ich freue mich auf dich!</p>
        <AddToCalendarButton {...calendarEvent}></AddToCalendarButton>
      <hr className="w-full border-amber-900/30" />

        <a className="text-white bg-amber-500 font-black p-4 rounded" href="/dresscode">Zum Dresscode</a>

      <hr className="w-full border-amber-900/30" />
        <PlusOne userId={userId} />
      <hr className="w-full border-amber-900/30" />
        <button className="text-red-800 font-black p-4 border rounded" onClick={() => declineInvitation(userId ?? "")}>Ich kann leider doch nicht kommen</button>
    </div>
    </>
  )
}

export default InviteePage;
