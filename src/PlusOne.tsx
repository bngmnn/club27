import { useState, useEffect } from "react";
import { supabase } from "./client";
import { Link } from "lucide-react";
import { copyUserLink } from "./InvitationList";

type PlusOneParams = {
    userId: string | null;
}

const PlusOne = ({userId}: PlusOneParams) => {

    const [plusOneName, setPlusOneName] = useState<string>("");
    const [plusOneUserId, setPlusOneUserId] = useState<string | undefined>();
    

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

    useEffect(() => {
        const fetchPlusOneUserId = async () => {
          const plusOneUserId = await getPlusOneUserId();
          setPlusOneUserId(plusOneUserId);
        };
      
        fetchPlusOneUserId();
      }, [getPlusOneUserId]);

    return (
        <>
        {!!plusOneName && 
            <>
                <a className="text-amber-500 inline-flex items-center gap-2 cursor-pointer border-amber-500 rounded" onClick={() => copyUserLink(plusOneUserId)}><Link className='w-4 h-4' />Einladungslink für <strong>{plusOneName}</strong> kopieren</a>
                <button className="text-center text-amber-700 cursor-pointer border border-amber-700 rounded" onClick={() => setPlusOneName("")}>Du möchtest deinen +1 ändern?</button>
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