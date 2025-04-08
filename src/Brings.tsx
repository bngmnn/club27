import { toast } from "react-toastify";
import { supabase } from "./client";
import { useState, useCallback, useEffect } from "react";


const Brings = () => {

    const [brings, setBrings] = useState<string>("");

    const handleUpdateBringItems = async () => {
        const { data, error } = await supabase
          .from("guests")
          .update({ brings: brings })
          .eq("user_id", window.localStorage.getItem("user_id"))
          .select();
      if (error) {
          console.error(error);
          return;
      }
      console.log(data);
      toast('Vielen Dank! Du kannst jederzeit ändern oder ergänzen was du mitbringst 🤗')
    }

    const getBrings = useCallback(async () => {
        const { data, error } = await supabase
            .from("guests")
            .select("brings")
            .eq("user_id", window.localStorage.getItem("user_id"))
            .single();
    
        if (error) {
            console.error(error);
            return;
        }
    
        setBrings(data.brings);
    }, [window.localStorage.getItem("user_id")]);
    
    useEffect(() => {
        getBrings();
    }, [getBrings]);

    const handleBringsValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBrings(event.target.value);
    }

    return (
        <>
            <div className="text-left">
            <p className="text-sm mb-2">Ich wünsche mir keine Geschenke, es ist schließlich nicht mein offizieller Geburtstag - wenn du trotzdem etwas mitbringen möchtest, würde ich mich über einen Zusatz zum Buffet freuen!</p>
            <label htmlFor="brings" className="block text-lg font-semibold text-amber-700 mb-2">
                Möchtest du etwas zu essen mitbringen?
            </label>
            <textarea
                id="brings"
                name="brings"
                placeholder="Trag gerne ein, was du zum Buffet mitbringen möchtest"
                className="w-full border border-amber-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                rows={3}
                value={brings}
                onChange={(e) => handleBringsValue(e)}
            ></textarea>
            <button
                className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition w-full"
                onClick={() => handleUpdateBringItems()}
            >
                Speichern
            </button>
            </div>
        </>
    )
}

export default Brings;