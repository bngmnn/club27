import { useState, useEffect } from "react";
import { supabase } from "./client";
import { Link } from "lucide-react";
import { toast } from "react-toastify";

const PlusOne = () => {
    const [plusOneName, setPlusOneName] = useState<string>("");
    const [plusOneUserId, setPlusOneUserId] = useState<string | undefined>();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // Modal state
    const [duplicateName, setDuplicateName] = useState<string | null>(null); // Store the name that caused the duplicate

    // Function to check if the name already exists
    const checkDuplicateName = async (name: string) => {
        const { data, error } = await supabase
            .from("guests")
            .select("name")
            .eq("name", name)
            .single();
        if (error) {
            console.error(error);
            return false; // Handle error accordingly
        }
        return data; // Return the result, null if no match
    };

    const handleCopyClick = () => {
        copyUserLink(plusOneUserId);
    };

    const copyUserLink = (userId: string | undefined) => {
        if (!userId) return;
    
        const userLink = `https://geburtstag.marvinbangemann.de/?user_id=${userId}`;
        navigator.clipboard.writeText(userLink)
            .then(() => {
                console.log('User link copied to clipboard:', userLink);
                toast.success('Einladungslink erfolgreich kopiert!');
            })
            .catch((error) => {
                console.error('Error copying user link:', error);
                toast.error('ups.', error);
            });
    };

    async function addPlusOne() {
        const plusOneNameInput = document.getElementById("plusOneNameInput") as HTMLInputElement;
        const plusOneName = plusOneNameInput.value;

        // Check if the name already exists
        const duplicate = await checkDuplicateName(plusOneName);

        if (duplicate) {
            setDuplicateName(plusOneName); // Set duplicate name
            setShowConfirmModal(true); // Show confirmation modal
            return; // Don't proceed until the user confirms
        }

        // Proceed to add the new +1 name
        await insertPlusOne(plusOneName);
    }

    const insertPlusOne = async (plusOneName: string) => {
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
        toast('Dein +1 wurde hinzugefügt 🤜🤛');
        await updatePlusOneInCurrentUser(plusOneName);
    };

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

    // Confirm the action and add the name
    const handleConfirm = async () => {
        if (duplicateName) {
            await insertPlusOne(duplicateName); // Add the duplicate name as a new +1
            setShowConfirmModal(false); // Close modal
            setDuplicateName(null); // Clear the duplicate name state
        }
    };

    // Cancel the action and close the modal
    const handleCancel = () => {
        setShowConfirmModal(false); // Close modal without doing anything
    };

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
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <p className="text-lg text-center text-amber-700 mb-4">
                            Jemand mit dem Namen "{duplicateName}" ist bereits eingeladen. Bist du sicher, dass es sich um eine andere Person handelt?
                        </p>
                        <div className="flex justify-between w-full">
                            <button
                                className="bg-amber-500 text-white p-2 rounded w-auto"
                                onClick={handleConfirm}
                            >
                                Ja, ich bin mir sicher
                            </button>
                            <button
                                className="bg-gray-300 text-black p-2 rounded w-auto"
                                onClick={handleCancel}
                            >
                                Abbrechen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            {!!plusOneName &&
                <div className="flex flex-col gap-2">
                    <p className="text-amber-700 text-lg font-semibold">Dein +1 ist: <strong>{plusOneName}</strong></p>
                    <button className="text-white bg-amber-500 inline-flex justify-center p-2 items-center gap-2 cursor-pointer border border-amber-500 rounded" onClick={handleCopyClick}><Link className='w-4 h-4' />Einladungslink kopieren</button>
                    <button className="text-center text-amber-700 cursor-pointer p-2 border border-amber-700 rounded" onClick={() => setPlusOneName("")}>Du möchtest deinen +1 ändern?</button>
                </div>
            }
            {!plusOneName &&
                <div className="flex flex-col gap-3">
                    <p className="text-center text-amber-700 text-lg font-semibold">Du bringst einen +&nbsp;1 mit?</p>
                    <span className="text-center text-xs">Trage einfach seinen/ihren Vornamen ein und klicke auf +1</span>
                    <div className="flex items-center w-full">
                        <input id="plusOneNameInput" className="w-full bg-white rounded rounded-r-none py-2 px-4 border border-amber-500 border-r-none" placeholder="Vorname deines +&nbsp;1" />
                        <button className="bg-amber-500 text-white rounded rounded-l-none p-2 px-4 font-bold border border-amber-500" onClick={addPlusOne}>+&nbsp;1</button>
                    </div>
                </div>
            }
        </>
    );
};

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
    const plusOneName = await getPlusOneName();
    const { data, error } = await supabase
        .from("guests")
        .select("user_id")
        .eq("name", plusOneName)
        .single();
    if (error) {
        console.error(error);
        return; // Or handle error accordingly
    }
    return data.user_id;
};
