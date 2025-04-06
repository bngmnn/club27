// InvitationList.tsx
import { useEffect, useState } from 'react';
import { supabase } from './client';
import { ClipboardCopy } from 'lucide-react';
import './App.css'

type Invitation = {
    id: number;
    user_id: string;
    name: string;
    invitation_state: InvitationState;
};

// Define the type for the invitation state
type InvitationState = 'accepted' | 'declined' | 'pending';

function InvitationList() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            const { data, error } = await supabase
                .from('guests')
                .select('id, name, user_id, invitation_state');

            if (error) {
                console.error('Error fetching invitations:', error);
                setIsLoading(false);
                return;
            }
            setInvitations(data as unknown as Invitation[]);
            setIsLoading(false);
        };

        fetchInvitations();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
    }

    const getStatusColor = (state: InvitationState) => {
        switch (state) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return '';
        }
    };
    const copyUserLink = (userId: string) => {
        const userLink = `https://geburtstag.marvinbangemann.de/?user_id=${userId}`;
        navigator.clipboard.writeText(userLink)
            .then(() => {
                console.log('User link copied to clipboard:', userLink);
            })
            .catch((error) => {
                console.error('Error copying user link:', error);
            });
    };
    function handleCopyClick(userId: string) {
        copyUserLink(userId);
    };

    return (
        <>
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Einladungsstatus</h1>
            <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="py-2 px-4 border-b">Link</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Einladungsstatus</th>
                    </tr>
                </thead>
                <tbody>
                    {invitations.map((invitation) => (
                        <tr key={invitation.id} className={`${getStatusColor(invitation.invitation_state)} hover:bg-gray-200`}>
                            <td className="py-2 px-4 border-b"><button onClick={() => handleCopyClick(invitation.user_id)}><ClipboardCopy size={28} /></button></td>
                            <td className="py-2 px-4 border-b">{invitation.name}</td>
                            <td className="py-2 px-4 border-b">{invitation.invitation_state}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default InvitationList;
