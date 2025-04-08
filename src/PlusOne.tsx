import { useState, useEffect } from "react";
import { supabase } from "./client";
import { Link } from "lucide-react";
import { copyUserLink } from "./InvitationList";
import { toast } from "react-toastify";


const PlusOne = () => {

    const [plusOneName, setPlusOneName] = useState<string>("");
    const [plusOneUserId, setPlusOneUserId] = useState<string | undefined>();
    

    async function addPlusOne() {
        const plusOneNameInput = document.getElementById("plusOneNameInput") as HTMLInputElement;
        const plusOneName = plusOneNameInput.value;
        const { data, error } = await supabase
            .from("guests")
            .insert({ name: plusOneName, invited_by: window.localStorage.getItem("user_id") })
            .select();
        if (error) {
            console.error(error);
            return; // Or handle error accordingly
        }
        console.log(data);
        setPlusOneName(plusOneName);
        plusOneNameInput.value = "";
        toast('Dein +1 wurde hinzugefügt 🤜🤛');
        await updatePlusOneInCurrentUser(plusOneName);
    }
    async function updatePlusOneInCurrentUser(plusOneName: string) {
        const { data, error } = await supabase
            .from("guests")
            .update({ plus_one_name: plusOneName })
            .eq("user_id", window.localStorage.getItem("user_id"))
            .select();
        if (error) {
            console.error(error);
            return; // Or handle error accordingly
        }
        console.log(data);
    }

    useEffect(() => {
        const fetchPlusOneUserId = async () => {
          const plusOneUserId = await getPlusOneUserId();
          setPlusOneUserId(plusOneUserId);
        };
        const fetchPlusOneName = async () => {
            const plusOneName = await getPlusOneName();
            setPlusOneName(plusOneName);
        }
      
        fetchPlusOneUserId();
        fetchPlusOneName();
      }, []);

    return (
        <>
        {!!plusOneName && 
            <div className="flex flex-col gap-2">
                <p className="text-amber-700 text-lg font-semibold">Dein +1 ist: <strong>{plusOneName}</strong></p>
                <a className="text-white bg-amber-500 inline-flex justify-center p-2 items-center gap-2 cursor-pointer border border-amber-500 rounded" onClick={() => copyUserLink(plusOneUserId)}><Link className='w-4 h-4' />Einladungslink kopieren</a>
                <button className="text-center text-amber-700 cursor-pointer p-2 border border-amber-700 rounded" onClick={() => setPlusOneName("")}>Du möchtest deinen +1 ändern?</button>
            </div>
        }
        {!plusOneName && 
            <div className="flex flex-col gap-3">
                <p className="text-center text-amber-700 text-lg font-semibold">Du bringst einen +&nbsp;1 mit?</p>
                <span className="text-center text-xs">Trage einfach seinen/ihren Vornamen ein</span>
                <div className="flex items-center w-full">
                    <input id="plusOneNameInput" className="w-full bg-white rounded rounded-r-none py-2 px-4 border border-amber-500 border-r-none" placeholder="Vorname deines +&nbsp;1"/>
                    <button className="bg-amber-500 text-white rounded rounded-l-none p-2 px-4 font-bold border border-amber-500" onClick={addPlusOne}>+&nbsp;1</button>
                </div>
            </div>
        }
        </>
    )
        
}

export default PlusOne;


export const getPlusOneName = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("plus_one_name")
      .eq("user_id", window.localStorage.getItem("user_id"))
      .single();
    if (error) {
      console.error(error);
      return; // Or handle error accordingly
    }
    return data.plus_one_name;
};
export const getPlusOneUserId = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("user_id")
      .eq("name", getPlusOneName)
      .single();
    if (error) {
      console.error(error);
      return; // Or handle error accordingly
    }
    return data.user_id;
};