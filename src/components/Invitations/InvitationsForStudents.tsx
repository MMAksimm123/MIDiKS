import bridge from "@vkontakte/vk-bridge";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import { Banner, Spacing, Spinner } from "@vkontakte/vkui";
import InvitationsEmployearCard from "../Cards/InvitationsEmployearCard";

interface Employear {
    id: string;
    vk_id_employer: string;
    company_name: string;
    position: string;
    work_experience: string;
    type_employment: string;
    working_face: string;
    phone_employer: string;
}

const InvitationsForStudents = () => {
    const [invitations, setInvitations] = useState<Employear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkStudentId = user.id;

        const {data: invitationsData, error: invitationsError} = await supabase
          .from('Invitations')
          .select('id_card, id_vk_employear')
          .eq('id_vk_student', vkStudentId);

        if (invitationsError) {
          throw invitationsError;
        }

        if (!invitationsData || invitationsData.length === 0) {
          setLoading(false);
          return;
        }

        const employearsIds = invitationsData.map(inv => inv.id_vk_employear);

        const {data: employearData, error: employearError} = await supabase 
          .from('Employers')
          .select('*')
          .in('id_vk_employer', employearsIds);

        if (employearError) {
          throw employearError;
        }

        setInvitations(employearData || []);
      } catch (err) {
        console.error('Error fetching invitations:', err);
        setError('Не удалось загрузить приглашения');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  if (loading) {
    return <Spinner size="l" style={{ margin: '20px auto' }} />;
  }
  
  if (error) {
    return <div style={{ padding: "16px", color: "red" }}>{error}</div>;
  }
  
  if (invitations.length === 0) {
    return <div style={{ padding: "16px", textAlign: "center" }}>У вас нет отправленных приглашений</div>;
  }

  return (
    <div style={{padding: '16px'}} >
      {invitations.map((invitation) => (
        <Banner 
          key={invitation.id}
          actions={
            <InvitationsEmployearCard idEmployear={invitation.vk_id_employer}
              nameCompany={invitation.company_name}
              workingFace={invitation.working_face}
              phoneEmployer={invitation.phone_employer}
            />
          }
        />
      ))}
    </div>
  )
}

export default InvitationsForStudents;