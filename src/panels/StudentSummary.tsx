import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { Avatar, Div, NavIdProps, Panel, PanelHeaderButton, Title, Text, MiniInfoCell, Link, ScreenSpinner, Spacing, FixedLayout, Button } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { supabase } from "../database/supabaseClient";
import bridge from "@vkontakte/vk-bridge";

interface StudentData {
  id: string;
  name_student: string;
  specialization_of_study: string;
  url_photo_student: string;
  vacancies: string;
  student_work_experience: string;
  student_last_place_of_employment: string;
  student_employment_type: string;
  skills?: string;
  responsibilities?: string;
  vk_id_student: string;
}

interface ContactInfo {
  phone_number_student?: string;
  students_mail?: string;
  link_sammary?: string;
  link_portfolio?: string;
}

export const StudentSummary: React.FC<NavIdProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const params = useParams<"id">();
  const userId = params?.id;

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Получаем данные из таблицы Summary
        const { data: summaryData, error: summaryError } = await supabase
          .from("Summary")
          .select("*")
          .eq("vk_id_student", userId)
          .single();

        if (summaryError) throw summaryError;

        setStudentData(summaryData);

        // Получаем контактные данные из таблицы Students
        if (summaryData?.vk_id_student) {
          const { data: studentContactData, error: studentError } = await supabase
            .from("Students")
            .select("phone_number_student, students_mail, link_sammary, link_portfolio")
            .eq("id_vk_student", summaryData.vk_id_student)
            .single();

          if (studentError) throw studentError;

          setContactInfo(studentContactData);
        }

        // Проверяем статус приглашения
        if (summaryData?.id) {
          const user = await bridge.send('VKWebAppGetUserInfo');
          const vkId = user.id;

          const { data: invitationData } = await supabase
            .from('Invitations')
            .select('*')
            .eq('id_vk_employear', vkId)
            .eq('id_card', summaryData.id)
            .single();

          setInviteStatus(invitationData ? 'sent' : 'idle');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleInviteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!studentData) return;
    
    try {
      setInviteStatus('loading');
      const user = await bridge.send('VKWebAppGetUserInfo');
      const vkEmployerId = user.id;

      // Получаем данные работодателя
      const { data: employerData, error: employerError } = await supabase
        .from('Employers')
        .select('company_name')
        .eq('id_vk_employer', vkEmployerId)
        .single();

      if (employerError || !employerData) {
        throw employerError || new Error('Employer not found');
      }

      // Отправляем приглашение
      const { error: inviteError } = await supabase
        .from('Invitations')
        .insert([
          {
            id_vk_employear: vkEmployerId,
            id_vk_student: studentData.vk_id_student,
            id_card: studentData.id
          }
        ]);

      if (inviteError) {
        throw inviteError;
      }

      // Создаем уведомление
      const { error: noticeError } = await supabase
        .from('Notices_Student')
        .insert([
          {
            vk_id_student: studentData.vk_id_student,
            vk_id_employer: vkEmployerId,
            id_card: studentData.id,
            reviewed: false,
          }
        ]);

      if (noticeError) {
        throw noticeError;
      }

      setInviteStatus('sent');
    } catch (error) {
      console.error('Error sending invitation:', error);
      setInviteStatus('idle');
    }
  };

  const handleRemoveInviteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!studentData) return;
    
    try {
      setInviteStatus('loading');
      const user = await bridge.send('VKWebAppGetUserInfo');
      const vkEmployerId = user.id;

      // Удаляем приглашение
      const { error: inviteError } = await supabase
        .from('Invitations')
        .delete()
        .eq('id_vk_employear', vkEmployerId)
        .eq('id_card', studentData.id);

      if (inviteError) {
        throw inviteError;
      }

      // Удаляем уведомление
      const { error: noticeError } = await supabase
        .from('Notices_Student')
        .delete()
        .eq('vk_id_student', studentData.vk_id_student)
        .eq('vk_id_employer', vkEmployerId)
        .eq('id_card', studentData.id);

      if (noticeError) {
        throw noticeError;
      }

      setInviteStatus('idle');
    } catch (error) {
      console.error('Error removing invitation:', error);
      setInviteStatus('sent');
    }
  };

  const getInviteButtonText = () => {
    switch (inviteStatus) {
      case 'loading':
        return 'Отправка...';
      case 'sent':
        return 'Приглашение отправлено';
      default:
        return 'Пригласить';
    }
  };

  if (loading) {
    return <ScreenSpinner />;
  }

  if (error) {
    return <Div>Ошибка: {error}</Div>;
  }

  if (!studentData) {
    return <Div>Данные студента не найдены</Div>;
  }

  

  return (
    <Panel id={id}>
      <PanelHeaderButton onClick={() => routeNavigator.back()}>
        <Icon28ArrowLeftOutline fill='fc4c00' />
      </PanelHeaderButton>
      
      <Div>
        <Div style={{display: 'flex', flexDirection: 'row'}}>
          <Avatar size={96} src={studentData.url_photo_student} />
          <Div>
            <Title level="2" style={{ marginTop: 12 }}>{studentData.name_student}</Title>
            <Text>{studentData.specialization_of_study}</Text>
          </Div>
        </Div>

        <Div style={{border: 'solid 1px black', borderRadius: '20px'}}>
          <Title level="3">Контактная информация</Title>
          {contactInfo?.phone_number_student && <MiniInfoCell>Телефон: {contactInfo.phone_number_student}</MiniInfoCell>}
          {contactInfo?.students_mail && <MiniInfoCell>Email: {contactInfo.students_mail}</MiniInfoCell>}
          <Div style={{display: 'flex', flexDirection: 'column'}}>
            {contactInfo?.link_portfolio && <Link href={contactInfo.link_portfolio} target="_blank">Портфолио</Link>}
            <Spacing size='xl' />
            {contactInfo?.link_sammary && <Link href={contactInfo.link_sammary} target="_blank">Резюме</Link>}
          </Div>
        </Div>

        <Spacing size='2xl' />

        <Div style={{border: 'solid 1px black', borderRadius: '20px'}}>
          <Title level="3">{studentData.vacancies}</Title>
          <MiniInfoCell>Опыт работы: {studentData.student_work_experience}</MiniInfoCell>
          <MiniInfoCell>Последнее место работы: {studentData.student_last_place_of_employment}</MiniInfoCell>
        </Div>

        {studentData.skills && (
          <Div>
            <Title level="3">Мои навыки:</Title>
            <Text>{studentData.skills}</Text>
          </Div>
        )}
            
        {studentData.responsibilities && (
          <Div>
            <Title level="3">Опыт работы {studentData.student_work_experience}</Title>
            <Spacing size='xl' />
            <Text>{studentData.student_last_place_of_employment}</Text>
            <Spacing size='xl' />
            <Text>Обязанности</Text>
            <MiniInfoCell>{studentData.responsibilities}</MiniInfoCell>
          </Div>
        )}

        <Div>
          <Title level="3">Тип занятости</Title>
          <Text>{studentData.student_employment_type}</Text>
        </Div>
      </Div>

      <FixedLayout filled vertical="bottom">
        <Div>
          {inviteStatus === 'sent' ? (
            <Button 
              size="l" 
              stretched 
              className='btnStudent' 
              hoverClassName='btnStudentHover' 
              onClick={handleRemoveInviteClick}
              mode="secondary"
            >
              Отозвать приглашение
            </Button>
          ) : (
            <Button 
              size="l" 
              stretched 
              className='btnStudent' 
              hoverClassName='btnStudentHover' 
              mode="secondary"
              onClick={handleInviteClick}
              disabled={inviteStatus !== 'idle'}
            >
              {getInviteButtonText()}
            </Button>
          )}
        </Div>
      </FixedLayout>  
    </Panel>
  );
};