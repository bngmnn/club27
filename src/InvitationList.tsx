import { useEffect, useState } from 'react';
import { supabase } from './client';
import { ClipboardCopy } from 'lucide-react';
import './App.css';
import { toast } from 'react-toastify';

type InvitationState = 'accepted' | 'declined' | 'pending';

type Invitation = {
    id: number;
    user_id: string;
    name: string;
    invitation_state: InvitationState;
    invited_by?: string;
    plus_one_name?: string;
    brings?: string;
};
type InvitationWithInviter = Invitation & { invited_by_name?: string | null };

    

export const copyUserLink = (userId: string | undefined) => {
    if (!userId) return;

    const userLink = `https://geburtstag.marvinbangemann.de/?user_id=${userId}`;
    navigator.clipboard.writeText(userLink)
        .then(() => {
            console.log('User link copied to clipboard:', userLink);
            toast.success('Einladungslink erfolgreich kopiert!');
        })
        .catch((error) => {
            console.error('Error copying user link:', error);
        });
};

export function InvitationList() {
    const [invitations, setInvitations] = useState<InvitationWithInviter[]>([]);

    useEffect(() => {
        const fetchInvitations = async () => {
            const { data } = await supabase
                .from('guests')
                .select('id, name, user_id, invitation_state, invited_by, plus_one_name, brings');

            const nameMap = new Map<string, string>();
            data?.forEach((inv) => {
                nameMap.set(inv.user_id, inv.name);
            });

            const enriched = data?.map((inv) => ({
                ...inv,
                invited_by_name: inv.invited_by ? nameMap.get(inv.invited_by) : null,
            })) as InvitationWithInviter[];

            setInvitations(enriched);
        };

        fetchInvitations();
    }, []);

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

    const handleCopyClick = (userId: string) => {
        copyUserLink(userId);
        toast('Link erfolgreich kopiert!');
    };

    const updateInvitationState = async (id: number, newState: InvitationState) => {
        const { error } = await supabase
            .from('guests')
            .update({ invitation_state: newState })
            .eq('id', id);

        if (error) {
            toast.error('Fehler beim Aktualisieren des Status');
            console.error(error);
        } else {
            toast.success('Status erfolgreich aktualisiert!');
            setInvitations((prevInvitations) =>
                prevInvitations.map((invitation) =>
                    invitation.id === id ? { ...invitation, invitation_state: newState } : invitation
                )
            );
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Einladungsstatus</h1>
            <h2 className="text-lg font-bold mb-4 pb-4 border-b space-x-4">
                Eingeladene Gäste: {invitations.length}
                <br />
                <span className="text-green-500">
                    Zusagen: {invitations.filter((inv) => inv.invitation_state === 'accepted').length}
                </span>
                <span className="text-yellow-500">
                    Ausstehend: {invitations.filter((inv) => inv.invitation_state === 'pending').length}
                </span>
                <span className="text-red-500">
                    Absagen: {invitations.filter((inv) => inv.invitation_state === 'declined').length}
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className={`rounded border p-4 shadow ${getStatusColor(invitation.invitation_state)}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">{invitation.name}</h2>
                            <button onClick={() => handleCopyClick(invitation.user_id)}>
                                <ClipboardCopy size={18} />
                            </button>
                        </div>
                        <p className="text-sm mb-1">
                            <span className="font-medium">Bringt mit:</span>
                            <br />
                            {invitation.brings || '-'}
                        </p>
                        <p className="text-sm mb-1">
                            <span className="font-medium">Eingeladen von:</span> {invitation.invited_by_name || '-'}
                        </p>
                        {invitation.id === 3 && 
                            <div className="mt-4">
                                <label className="block text-sm font-medium">Einladungsstatus</label>
                                <select
                                    value={invitation.invitation_state}
                                    onChange={(e) => updateInvitationState(invitation.id, e.target.value as InvitationState)}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="pending">Ausstehend</option>
                                    <option value="accepted">Zugesagt</option>
                                    <option value="declined">Abgesagt</option>
                                </select>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}