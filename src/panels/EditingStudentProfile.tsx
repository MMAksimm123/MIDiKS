import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { Avatar, Button, Div, FixedLayout, NavIdProps, Panel, PanelHeaderButton, Snackbar, Spacing } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import PhoneInput from "../components/InputsForm/PhoneInput";
import SelectedInput from "../components/InputsForm/SelectedInput";
import NumericInput from "../components/InputsForm/NumericInput";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";

export const EditingStudentProfile: React.FC<NavIdProps> = ({id}) => {
    const [formData, setFormData] = useState({
        nameStudent: '',
        phoneStudent: '',
        educationLevel: '',
        yearStudy: '',
        // directionOfStudy: '',
        // specializationOfStudy: [] as {value: string, label: string}[],
        // studentVacancy: '',
        // studentWorkExperience: '',
        // studentEmploymentType: '',
        // studentLastPlaceOfEmployment: '',
        urlPhoto: '',
        studentMail: '',
        studentSummary: '',
        studentPortfolio: '',
    })

    const [vkUserId, setVkUserId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<React.ReactNode>(null);

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

        async function fetchStudentData() {
            try {
                const {data, error} = await supabase
                    .from('Students')
                    .select('*')
                    .eq('id_vk_student', vkUserId)
                    .single();
                
                if (error) throw error;

                if (data) {
                    setFormData({
                        nameStudent: data.full_name_student || '',
                        phoneStudent: data.phone_number_student || '',
                        educationLevel: data.education_level || '',
                        yearStudy: data.year_of_study || '',
                        // directionOfStudy: data.direction_of_study || '',
                        // specializationOfStudy: data.specialization_of_study || '',
                        // studentVacancy: data.student_vacancy || '',
                        // studentWorkExperience: data.student_work_experience || '',
                        // studentEmploymentType: data.student_employment_type || '',
                        // studentLastPlaceOfEmployment: data.student_last_place_of_employment || '',
                        urlPhoto: data.url_vk_student_photo || '',
                        studentMail: data.students_mail || '',
                        studentSummary: data.link_sammary || '',
                        studentPortfolio: data.link_portfolio || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching employer data:', error);
                showSnackbar('Не удалось загрузить данные работодателя');
            }
        }

        fetchStudentData();
    }, [vkUserId]);

    const handleSave = async () => {
        if (!vkUserId) return;

        try {
            const {error} = await supabase
                .from('Students')
                .update({
                    full_name_student: formData.nameStudent,
                    phone_number_student: formData.phoneStudent,
                    education_level: formData.educationLevel,
                    year_of_study: formData.yearStudy,
                    students_mail: formData.studentMail,
                    link_sammary: formData.studentSummary,
                    link_portfolio: formData.studentPortfolio,
                    // direction_of_study: formData.directionOfStudy,
                    // specialization_of_study: formData.specializationOfStudy,
                    // student_vacancy: formData.studentVacancy,
                    // student_work_experience: formData.studentWorkExperience,
                    // student_employment_type: formData.studentEmploymentType,
                    // student_last_place_of_employment: formData.studentLastPlaceOfEmployment,
                })
                .eq('id_vk_student', vkUserId);

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
                <Icon28ArrowLeftOutline fill='fc4c00' />
            </PanelHeaderButton>

            <Div style={{display: 'flex', justifyContent: 'center'}}>
                <Avatar size={75}
                    src={formData.urlPhoto}
                />
            </Div>
            <DefaultInput 
                title="ФИО"
                placeholder=""
                id="name"
                value={formData.nameStudent}
                onChange={(value) => setFormData({...formData, nameStudent: value})}
                type="text"
            />

            <PhoneInput 
                value={formData.phoneStudent}
                onChange={(value) => setFormData({...formData, phoneStudent: value})}
            /> 

            <SelectedInput
                value={formData.educationLevel}
                onChange={(value) => setFormData({...formData, educationLevel: value})}
            />

            <NumericInput 
                title="Курс"
                placeholder=""
                id="course"
                maxLength={1}
                value={formData.yearStudy}
                onChange={(value) => setFormData({...formData, yearStudy: value})}
            />

            {/* <SelectedDirection
                value={formData.directionOfStudy}
                onChange={(value) => setFormData({...formData, directionOfStudy: value})}
            />

            <ChipsSelectedSpeciality
                value={formData.specializationOfStudy}
                onChange={(value) => setFormData({...formData, specializationOfStudy: value})}
            />

            <DefaultInput
                title="Интересуемая вакансия"
                placeholder=""
                id="vacancy"
                value={formData.studentVacancy}
                type="text"
                onChange={(value) => setFormData({...formData, studentVacancy: value})}
            />
            
            <WorkExperienceInput
                value={formData.studentWorkExperience}
                onChange={(value) => setFormData({...formData, studentWorkExperience: value})}
            />

            <TypeYmploymentInput
                value={formData.studentEmploymentType}
                onChange={(value) => setFormData({...formData, studentEmploymentType: value})}
            />

            <DefaultInput
                title="Прошлое место работы"
                placeholder=""
                id="work"
                value={formData.studentLastPlaceOfEmployment}
                type="text"
                onChange={(value) => setFormData({...formData, studentLastPlaceOfEmployment: value})}
            /> */}

            <DefaultInput 
                title="Почта"
                placeholder=""
                id="mail"
                value={formData.studentMail}
                onChange={(value) => setFormData({...formData, studentMail: value})}
                type="text"
            />

            <DefaultInput 
                title="Ссылка на резюме"
                placeholder=""
                id="link"
                value={formData.studentSummary}
                onChange={(value) => setFormData({...formData, studentSummary: value})}
                type="text"
            />

            <DefaultInput 
                title="Ссылка на портфолио"
                placeholder=""
                id="link"
                value={formData.studentPortfolio}
                onChange={(value) => setFormData({...formData, studentPortfolio: value})}
                type="text"
            />

            <Spacing size="4xl" />
            <Spacing size="4xl" />
            
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