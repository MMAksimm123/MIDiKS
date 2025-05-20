import bridge from "@vkontakte/vk-bridge";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import { Avatar, Banner, Spacing, Spinner, Text } from "@vkontakte/vkui";
import ContentUserCard from "../Cards/ContentUserCard";

interface StudentFeedback {
    id: string;
    id_vk_student: string;
    full_name_student: string;
    url_vk_student_photo: string;
    education_level: string;
    year_of_study: string;
    student_work_experience: string;
    student_last_place_of_employment: string;
    student_employment_type: string;
    position: string;
    work_experience: string;
    work_format: string;
    type_employment: string;
}

const FeedbackComponent = () => {
    const [feedbacks, setFeedback] = useState<StudentFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                const vkEmployerId = user.id;

                // Получаем отклики для текущего работодателя
                const { data: feedbacksData, error: feedbacksError } = await supabase
                    .from('Feedback')
                    .select('id, id_vk_student, id_card_vacancie')
                    .eq('id_vk_employear', vkEmployerId);

                if (feedbacksError) {
                    throw feedbacksError;
                }

                if (!feedbacksData || feedbacksData.length === 0) {
                    setLoading(false);
                    return;
                }

                // Получаем ID студентов и вакансий для дополнительных запросов
                const studentIds = feedbacksData.map(feed => feed.id_vk_student);
                const vacancyIds = feedbacksData.map(feed => feed.id_card_vacancie);

                // Получаем данные студентов
                const { data: studentsData, error: studentsError } = await supabase
                    .from('Students')
                    .select('id_vk_student, full_name_student, url_vk_student_photo, education_level, year_of_study, student_work_experience, student_last_place_of_employment, student_employment_type')
                    .in('id_vk_student', studentIds);

                if (studentsError) {
                    throw studentsError;
                }

                // Получаем данные вакансий
                const { data: vacanciesData, error: vacanciesError } = await supabase
                    .from('Vacancies')
                    .select('id, position, work_experience, work_format, type_employment')
                    .in('id', vacancyIds);

                if (vacanciesError) {
                    throw vacanciesError;
                }

                // Объединяем все данные
                const combinedData = feedbacksData.map(feedback => {
                    const student = studentsData.find(s => s.id_vk_student === feedback.id_vk_student);
                    const vacancy = vacanciesData.find(v => v.id === feedback.id_card_vacancie);

                    return {
                        id: feedback.id,
                        id_vk_student: feedback.id_vk_student,
                        full_name_student: student?.full_name_student || 'Не указано',
                        url_vk_student_photo: student?.url_vk_student_photo || '',
                        education_level: student?.education_level || 'Не указано',
                        year_of_study: student?.year_of_study || 'Не указано',
                        student_work_experience: student?.student_work_experience || 'Не указано',
                        student_last_place_of_employment: student?.student_last_place_of_employment || 'Не указано',
                        student_employment_type: student?.student_employment_type || 'Не указано',
                        position: vacancy?.position || 'Не указано',
                        work_experience: vacancy?.work_experience || 'Не указано',
                        work_format: vacancy?.work_format || 'Не указано',
                        type_employment: vacancy?.type_employment || 'Не указано'
                    };
                });

                setFeedback(combinedData);
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError('Не удалось загрузить отклики');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) {
        return <Spinner size="l" style={{ margin: '20px auto' }} />;
    }

    if (error) {
        return <div style={{ padding: "16px", color: "red" }}>{error}</div>;
    }

    if (feedbacks.length === 0) {
        return <div style={{ padding: "16px", textAlign: "center" }}>У вас нет отправленных откликов</div>;
    }

    return (
        <div style={{ padding: "16px" }}>
            {feedbacks.map((feedback) => (
                <div key={feedback.id} style={{border: '2px solid black', borderRadius: '20px', padding: '10px', marginBottom: '10px'}}>
                    <Text>Отклик на вакансию: {feedback.position}, {feedback.work_experience}, {feedback.work_format}, {feedback.type_employment}</Text>
                    <Spacing size="xl" />
                    <Banner 
                        before={
                            <Avatar 
                                size={48}
                                src={feedback.url_vk_student_photo}
                                alt={feedback.full_name_student}
                            />
                        }
                        title={feedback.full_name_student}
                        subtitle={`${feedback.education_level}, ${feedback.year_of_study} курс`}
                        style={{margin: "12px"}}
                        actions={
                            <ContentUserCard 
                                id={feedback.id_vk_student}
                                workExperience={feedback.student_work_experience}
                                lastPlaceOfEmployment={feedback.student_last_place_of_employment}
                                vacancy={feedback.position}
                                employmentType={feedback.student_employment_type}
                            />
                        }
                    />
                </div>
            ))}
        </div>
    );
};

export default FeedbackComponent;