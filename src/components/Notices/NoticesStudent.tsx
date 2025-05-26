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
  company_name?: string;
  position?: string;
  url_employer_photo?: string;
  employer_name?: string;
}

const NoticesStudent = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        
        // Получаем ID текущего пользователя (студента)
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkIdStudent = user.id;

        // Получаем уведомления для текущего студента
        const { data: noticesData, error: noticesError } = await supabase
          .from('Notices_Student')
          .select('*')
          .eq('vk_id_student', vkIdStudent)

        if (noticesError) throw noticesError;

        // Получаем дополнительную информацию о карточках и работодателях
        const noticesWithDetails = await Promise.all(
          (noticesData || []).map(async (notice) => {
            // Получаем информацию о карточке (из Summary)
            const { data: summaryData, error: summaryError } = await supabase
              .from('Summary')
              .select('vacancies')
              .eq('id', notice.id_card)
              .single();

            if (summaryError) console.error('Summary error:', summaryError);

            // Получаем информацию о работодателе
            const { data: employerData, error: employerError } = await supabase
              .from('Employers')
              .select('company_name')
              .eq('id_vk_employer', notice.vk_id_employer)
              .single();

            if (employerError) console.error('Employer error:', employerError);

            return {
              ...notice,
              position: summaryData?.vacancies,
              company_name: employerData?.company_name,
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
        .from('Notices_Student')
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
    return <Div>У вас пока нет уведомлений</Div>;
  }

  return (
    <Div>
      {notices.map((notice) => (
        <Banner
          key={notice.id}
          onClick={() => handleNoticeClick(notice.id)}
          title={notice.company_name || notice.employer_name || 'Работодатель'}
          subtitle={`Приглашение на вакансию: ${notice.position || 'не указана'}`}
          style={{
            marginBottom: 12,
            borderLeft: notice.reviewed ? '4px solid transparent' : '4px solid #fc4c00',
            opacity: notice.reviewed ? 0.8 : 1
          }}
        />
      ))}
    </Div>
  );
};

export default NoticesStudent;