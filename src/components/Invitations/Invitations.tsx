import { Avatar, Banner, Spinner } from "@vkontakte/vkui";
import ContentUserCard from "../Cards/ContentUserCard";
import { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../../database/supabaseClient";

interface Student {
  id: string;
  name_student: string;
  url_photo_student: string;
  specialization_of_study: string;
  vacancies: string;
  student_work_experience: string;
  student_last_place_of_employment: string;
  student_employment_type: string;
}

const Invitations = () => {
  const [invitations, setInvitations] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Получаем VK ID текущего пользователя
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkEmployerId = user.id;

        // Получаем приглашения текущего пользователя
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('Invitations')
          .select('id_card, id_vk_student')
          .eq('id_vk_employear', vkEmployerId);

        if (invitationsError) {
          throw invitationsError;
        }

        if (!invitationsData || invitationsData.length === 0) {
          setLoading(false);
          return;
        }

        // Получаем ID карточек из приглашений
        const cardIds = invitationsData.map(inv => inv.id_card);

        // Получаем данные студентов по этим карточкам
        const { data: studentsData, error: studentsError } = await supabase
          .from('Summary')
          .select('*')
          .in('id', cardIds);

        if (studentsError) {
          throw studentsError;
        }

        setInvitations(studentsData || []);
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
    <div style={{ padding: "16px" }}>
      {invitations.map((invitation) => (
        <Banner 
          key={invitation.id}
          before={
            <Avatar
              size={48}
              src={invitation.url_photo_student}
              alt={invitation.name_student}
            />
          }
          title={invitation.name_student}
          subtitle={invitation.specialization_of_study}
          style={{ marginBottom: "12px" }}
          actions={
            <ContentUserCard
              id={invitation.id}
              vacancy={invitation.vacancies}
              workExperience={invitation.student_work_experience}
              lastPlaceOfEmployment={invitation.student_last_place_of_employment}
              employmentType={invitation.student_employment_type}   
            />
          }
        />
      ))}
    </div>
  );
}

export default Invitations;