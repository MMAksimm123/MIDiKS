import { Icon24Like, Icon24LikeOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import { Spacing, Title, Text, Div, ButtonGroup, Button } from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";

type JobContentProp = {
  id: string;
  vacancy: string;
  workExperience: string;
  employmentType: string;
  onActionClick?: (e: React.MouseEvent) => void;
}

const ContentJobCard: React.FC<JobContentProp> = ({ id, vacancy, workExperience, employmentType, onActionClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const checkStatuses = async () => {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkId = user.id;

        // Проверка избранного
        const { data: favoriteData } = await supabase
          .from('Favourites')
          .select('*')
          .eq('id_user', vkId)
          .eq('id_card_favoriterite', id)
          .single();

        setIsFavorite(!!favoriteData);

        // Проверка отклика
        const { data: feedbackData } = await supabase
          .from('Feedback')
          .select('*')
          .eq('id_vk_student', vkId)
          .eq('id_card_vacancie', id)
          .single();

        setHasFeedback(!!feedbackData);
      } catch (error) {
        console.error('Error checking statuses:', error);
      }
    };

    checkStatuses();
  }, [id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) onActionClick(e);
    
    try {
      setLoading(true);
      const user = await bridge.send('VKWebAppGetUserInfo');
      const vkId = user.id;

      if (isFavorite) {
        const { error } = await supabase
            .from('Favourites')
            .delete()
            .eq('id_user', vkId)
            .eq('id_card_favoriterite', id);

        if (!error) {
            setIsFavorite(false);
        }
      } else {
        const { error } = await supabase
            .from('Favourites')
            .insert([
                { 
                    id_user: vkId, 
                    id_card_favoriterite: id 
                }
            ]);

        if (!error) {
            setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) onActionClick(e);
    
    try {
      setFeedbackLoading(true);
      const user = await bridge.send('VKWebAppGetUserInfo');
      const vkIdStudent = user.id;

      if (hasFeedback) {
        // Отмена отклика
        const { error } = await supabase
          .from('Feedback')
          .delete()
          .eq('id_vk_student', vkIdStudent)
          .eq('id_card_vacancie', id);

        if (!error) {
          setHasFeedback(false);
        }
      } else {
        // Создание отклика
        const { data: vacancyData, error: vacancyError } = await supabase
          .from('Vacancies')
          .select('vk_id_employer, position')
          .eq('id', id)
          .single();

        if (vacancyError || !vacancyData) {
          throw new Error(vacancyError?.message || 'Vacancy not found');
        }

        // Добавляем запись в таблицу Notices
        const { error: noticeError } = await supabase
          .from('Notices')
          .insert([
            {
              vk_id_student: vkIdStudent,
              vk_id_employer: vacancyData.vk_id_employer,
              id_card: id,
              reviewed: false
            }
          ]);

        if (noticeError) {
          throw noticeError;
        }

        const { error: feedbackError } = await supabase
          .from('Feedback')
          .insert([
            {
              id_vk_student: vkIdStudent,
              id_vk_employear: vacancyData.vk_id_employer,
              id_card_vacancie: id,
              vacancies: vacancyData.position
            }
          ]);

        if (feedbackError) {
          throw feedbackError;
        }

        setHasFeedback(true);
      }
    } catch (error) {
      console.error('Error handling feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <>
      <Title level="3">{vacancy}</Title>

      <Spacing size="xl" />

      <Div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
        <div style={{padding: '8px', border: '1px solid #7b7b7b', borderRadius: '20px'}}>
          <Text>{workExperience}</Text>
        </div>
        <div style={{padding: '8px', border: '1px solid #7b7b7b', borderRadius: '20px'}}>
          <Text>{employmentType}</Text>
        </div>
      </Div>

      <Spacing size="xl" />

      <ButtonGroup mode="horizontal" gap="m">
        <Button 
          mode="tertiary" 
          onClick={handleFavoriteClick}
          disabled={loading}
        >
          {isFavorite ? <Icon24Like fill="#fc4c00"/> : <Icon24LikeOutline fill="#fc4c00"/>}
        </Button>
        <Button 
          className='btnStudent' 
          hoverClassName='btnStudentHover' 
          mode="secondary"
          onClick={handleFeedbackClick}
          disabled={feedbackLoading}
          loading={feedbackLoading}
        >
          {hasFeedback ? 'Отменить отклик' : 'Откликнуться'}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default ContentJobCard;