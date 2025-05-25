import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { Avatar, Div, NavIdProps, Panel, PanelHeaderButton, Title, Text, MiniInfoCell, Link, ScreenSpinner, Spacing, FixedLayout } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { supabase } from "../database/supabaseClient";

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
            <Title  level="3">{studentData.vacancies}</Title>
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

        <FixedLayout>
        
        </FixedLayout>  
    </Panel>
  );
};