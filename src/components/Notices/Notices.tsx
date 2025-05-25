import { Avatar, Banner, Div, ScreenSpinner } from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import bridge from "@vkontakte/vk-bridge";

interface Notice {
  id: string;
  vk_id_student: string;
  vk_id_employer: string;
  id_card: string;
  reviewed: boolean;
  student_name?: string;
  position?: string;
  url_vk_student_photo: string
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        
        // Получаем ID текущего пользователя (работодателя)
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkIdEmployer = user.id;

        // Получаем уведомления для текущего работодателя
        const { data: noticesData, error: noticesError } = await supabase
          .from('Notices')
          .select('*')
          .eq('vk_id_employer', vkIdEmployer);

        if (noticesError) throw noticesError;

        // Получаем дополнительную информацию о вакансиях и студентах
        const noticesWithDetails = await Promise.all(
          (noticesData || []).map(async (notice) => {
            // Получаем информацию о вакансии
            const { data: vacancyData, error: vacancyError } = await supabase
              .from('Vacancies')
              .select('position')
              .eq('id', notice.id_card)
              .single();

            if (vacancyError) console.error('Vacancy error:', vacancyError);

            // Получаем информацию о студенте
            const { data: studentData, error: studentError } = await supabase
              .from('Students')
              .select('full_name_student, url_vk_student_photo')
              .eq('id_vk_student', notice.vk_id_student)
              .single();

            if (studentError) console.error('Student error:', studentError);

            return {
              ...notice,
              position: vacancyData?.position,
              student_name: studentData?.full_name_student,
              url_vk_student_photo: studentData?.url_vk_student_photo,
            };
          })
        );

        setNotices(noticesWithDetails);
      } catch (err) {
        console.error('Error fetching notices:', err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleNoticeClick = async (noticeId: string) => {
    try {
      // Обновляем статус уведомления на "просмотрено"
      const { error } = await supabase
        .from('Notices')
        .update({ reviewed: true })
        .eq('id', noticeId);

      if (error) throw error;

      // Обновляем состояние, помечая уведомление как просмотренное
      setNotices(prev => prev.map(notice => 
        notice.id === noticeId ? { ...notice, reviewed: true } : notice
      ));
    } catch (err) {
      console.error('Error updating notice:', err);
    }
  };

  if (loading) {
    return <ScreenSpinner />;
  }

  if (error) {
    return <Div>{error}</Div>;
  }

  if (notices.length === 0) {
    return <Div>Уведомлений нет</Div>;
  }

  return (
    <Div>
      {notices.map((notice) => (
        <Banner
          key={notice.id}
          onClick={() => handleNoticeClick(notice.id)}
          before={
            <Avatar 
              size={48}
              src={notice.url_vk_student_photo}
            />
          }
          title={notice.student_name || 'Соискатель'}
          subtitle={`Отклик на вакансию: ${notice.position || 'не указана'}`}
          style={{
            marginBottom: 12,
            borderLeft: notice.reviewed ? '4px solid transparent' : '4px solid #3F8AE0',
            opacity: notice.reviewed ? 0.8 : 1
          }}
          //sideMode={notice.reviewed ? undefined : "expand"}
        />
      ))}
    </Div>
  );
};

export default Notices;