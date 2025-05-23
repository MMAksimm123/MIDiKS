import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { Button, Div, FixedLayout, Panel, PanelHeaderButton, Snackbar, Spacing } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";
import SelectedDirection from "../components/InputsForm/SelectedInputs/SelectedDirection";
import ChipsSelectedSpeciality from "../components/InputsForm/SelectedInputs/ChipsSelectedSpeciality";
import WorkExperienceInput from "../components/InputsForm/SegmentedInput/WorkExperienceInput";
import MultilineInput from "../components/InputsForm/MultilineInput";
import TypeYmploymentInput from "../components/InputsForm/SegmentedInput/TypeYmploymentInput";

type ProfileProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

export const SummaryCreation: React.FC<ProfileProps> = ({id, onStoryChange}) => {
    const [formData, setFormData] = useState({
        studentLastPlaceOfEmployment: '',
        directionOfStudy: '',
        specializationOfStudy: [] as {value: string, label: string}[],
        studentWorkExperience: '',
        companyName: '',
        studentResponsibilities: '',
        studentSkills: '',
        studentEmploymentType: '',
        studentVacancie: '',
    })

    const [vkUserId, setVkUserId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        async function fetchedUserId() {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                setVkUserId(user.id);
            } catch (error) {
                console.error('Error fetching VK user info:', error);
                showSnackbar('Не удалось получить данные пользователя');
            }
        }
        
        fetchedUserId();
    }, []);

    useEffect(() => {
        if (!vkUserId) return;

        async function checkAndCopyUserData() {
            try {
                // Проверяем наличие пользователя в таблице Summary
                const { data: summaryData, error: summaryError } = await supabase
                    .from('Summary')
                    .select('*')
                    .eq('vk_id_student', vkUserId)
                    .single();
                
                if (summaryError && summaryError.code !== 'PGRST116') throw summaryError;

                // Если пользователь не найден в Summary, копируем данные из Students
                if (!summaryData) {
                    const { data: studentData, error: studentError } = await supabase
                        .from('Students')
                        .select('id_vk_student, full_name_student, url_vk_student_photo')
                        .eq('id_vk_student', vkUserId)
                        .single();
                    
                    if (studentError) throw studentError;

                    if (studentData) {
                        // Вставляем данные в таблицу Summary
                        const { error: insertError } = await supabase
                            .from('Summary')
                            .insert({
                                vk_id_student: studentData.id_vk_student,
                                name_student: studentData.full_name_student,
                                url_photo_student: studentData.url_vk_student_photo
                            });
                        
                        if (insertError) throw insertError;
                        
                        setIsNewUser(true);
                        // showSnackbar('Ваши основные данные были скопированы');
                    }
                } else {
                    // Если пользователь уже есть в Summary, загружаем его данные
                    setFormData({
                        studentLastPlaceOfEmployment: summaryData.student_last_place_of_employment || '',
                        directionOfStudy: summaryData.direction_of_study || '',
                        specializationOfStudy: summaryData.specialization_of_study || [],
                        studentWorkExperience: summaryData.student_work_experience || '',
                        companyName: summaryData.company_name || '',
                        studentResponsibilities: summaryData.responsibilities || '',
                        studentSkills: summaryData.skills || '',
                        studentEmploymentType: summaryData.student_employment_type || '',
                        studentVacancie: summaryData.vacancies || '',
                    });
                }
            } catch (error) {
                console.error('Error processing user data:', error);
                showSnackbar('Ошибка при обработке данных пользователя');
            }
        }
        
        checkAndCopyUserData();
    }, [vkUserId]);

    const handleSave = async () => {
        if (!vkUserId) return;

        try {
            const { error } = await supabase
                .from('Summary')
                .update({
                    student_last_place_of_employment: formData.studentLastPlaceOfEmployment,
                    direction_of_study: formData.directionOfStudy,
                    specialization_of_study: formData.specializationOfStudy,
                    student_work_experience: formData.studentWorkExperience,
                    company_name: formData.companyName,
                    responsibilities: formData.studentResponsibilities,
                    skills: formData.studentSkills,
                    student_employment_type: formData.studentEmploymentType,
                    vacancies: formData.studentVacancie,
                })
                .eq('vk_id_student', vkUserId);

            if (error) throw error;

            showSnackbar('Данные успешно сохранены');
            setTimeout(() => window.history.back(), 1000);
        } catch (error) {
            console.error('Error saving employer data:', error);
            showSnackbar('Ошибка при сохранении данных');
        }
    };

    const showSnackbar = (message: string) => {
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={<Icon28ArrowLeftOutline />}
            >
                {message}
            </Snackbar>
        );
    };

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00'/>
                    Резюме
            </PanelHeaderButton>

            <Div>
                <DefaultInput
                    title="Желаемая должность"
                    placeholder=""
                    id="vacancies"
                    value={formData.studentVacancie}
                    onChange={(value) => setFormData({...formData, studentVacancie: value})}
                    type="text"    
                />

                <DefaultInput
                    title="Последнее место работы"
                    placeholder=""
                    id="lastwork"
                    value={formData.studentLastPlaceOfEmployment}
                    onChange={(value) => setFormData({...formData, studentLastPlaceOfEmployment: value})}
                    type="text"    
                />

                <SelectedDirection
                    value={formData.directionOfStudy}
                    onChange={(value) => setFormData({...formData, directionOfStudy: value})}
                />

                <ChipsSelectedSpeciality
                    value={formData.specializationOfStudy}
                    onChange={(value) => setFormData({...formData, specializationOfStudy: value})}
                />

                <WorkExperienceInput
                    value={formData.studentWorkExperience}
                    onChange={(value) => setFormData({...formData, studentWorkExperience: value})}
                />

                <DefaultInput
                    title="Название компании"
                    placeholder=""
                    id="company"
                    value={formData.companyName}
                    onChange={(value) => setFormData({...formData, companyName: value})}
                    type="text"    
                />

                <MultilineInput
                    title="Обязанности"
                    placeholder=""
                    id="responsibilities"
                    value={formData.studentResponsibilities}
                    onChange={(value) => setFormData({...formData, studentResponsibilities: value})}
                />

                <MultilineInput
                    title="Мои навыки"
                    placeholder=""
                    id="skills"
                    value={formData.studentSkills}
                    onChange={(value) => setFormData({...formData, studentSkills: value})}
                />

                <TypeYmploymentInput
                    value={formData.studentEmploymentType}
                    onChange={(value) => setFormData({...formData, studentEmploymentType: value})}
                />
            </Div>

            <Spacing size='4xl' />

            <FixedLayout vertical="bottom">
                <Button
                    className='btnStudent' stretched 
                    mode='secondary' size="l"  
                    hoverClassName='btnStudentHover'
                    onClick={handleSave}
                >
                    Сохранить
                </Button>
            </FixedLayout>
            {snackbar}
        </Panel>
    )
}