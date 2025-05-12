import { Icon16DonateOutline, Icon28ArrowLeftOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import bridge from "@vkontakte/vk-bridge";
import { Button, Div, FixedLayout, Panel, PanelHeaderButton, ScreenSpinner, Snackbar, Spacing } from "@vkontakte/vkui";
import React, { FC, useEffect, useState } from "react";
import { supabase } from "../database/supabaseClient";
import TabBar from "../components/TabBar/TabBar";
import DefaultInput from "../components/InputsForm/DefoultInput";
import SelectedDirection from "../components/InputsForm/SelectedInputs/SelectedDirection";
import ChipsSelectedSpeciality from "../components/InputsForm/SelectedInputs/ChipsSelectedSpeciality";
import WorkExperienceInput from "../components/InputsForm/SegmentedInput/WorkExperienceInput";
import MultilineInput from "../components/InputsForm/MultilineInput";
import WorkFormatInput from "../components/InputsForm/SegmentedInput/WorkFormatInput";
import TypeYmploymentInput from "../components/InputsForm/SegmentedInput/TypeYmploymentInput";
import PublicationConfirmation from "../components/InputsForm/Switch/PublicationConfirmation";

type ProfileProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

export const JobCreation:FC<ProfileProps> = ({id, onStoryChange}) => {
    const [formData, setFormData] = useState({
        position: '',
        direction: '',
        specialitieStudents: [] as {value: string, label: string}[],
        workExperience: '',
        duties: '',
        requirements: '',
        conditions: '',
        skillsAndTools: '',
        workSchedule: '',
        workFormat: '',
        typeYmployment: '',
        visibleVacancies: false,
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const [userId, setUserId] = useState<number>(0);

    const showError = (message: string) => {
        setSnackbar(
            <Snackbar 
                before={<Icon56ErrorOutline />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        )
    };

    const showSuccess = (message: string) => {
        setSnackbar(
            <Snackbar
                before={<Icon16DonateOutline />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        )
    };

    useEffect(() => {
        bridge.send('VKWebAppGetUserInfo')
            .then((userInfo) => {
                const vkUserId = userInfo.id;

                setUserId(vkUserId);
            })
            .catch((error) => {
                console.error('Ошибка получения информации о пользователе VK', error);
            })
    }, [])

    if (loading) {
        return <ScreenSpinner />;
    }

    const handleSubmit = async () => {
        if(!formData.position.trim()) {
            showError('Введите должность');
            return;
        }

        if(!formData.direction.trim()) {
            showError('Укажите направление подготовки');
            return;
        }

        if(formData.specialitieStudents.length === 0) {
            showError('Укажите специальность подготовки');
            return;
        }

        if(!formData.workExperience.trim()) {
            showError('Укажите опыт работы');
            return;
        }

        if(!formData.duties.trim()) {
            showError('Укажите обязаности');
            return;
        }

        if(!formData.requirements.trim()) {
            showError('Укажите требования');
            return;
        }

        if(!formData.skillsAndTools.trim()) {
            showError('Укажите необходимы навыки');
            return;
        }

        if(!formData.workFormat.trim()) {
            showError('Укажите формат работы');
            return;
        }

        if(!formData.typeYmployment.trim()) {
            showError('Укажите тип занятости');
            return;
        }

        try {
            setLoading(true);

            // 1. Получаем название компании из таблицы Employers
            const { data: employerData, error: employerError } = await supabase
                .from('Employers')
                .select('company_name')
                .eq('id_vk_employer', userId)
                .single();

            if (employerError || !employerData) {
                throw employerError || new Error('Компания не найдена');
            }

            const companyName = employerData.company_name;

            // 2. Вставляем вакансию с названием компании
            const speciality = formData.specialitieStudents.map(s => s.value).join(', ');

            const { data, error } = await supabase
                .from('Vacancies')
                .insert([{
                    vk_id_employer: userId,
                    company_name: companyName, // добавляем название компании
                    position: formData.position,
                    direction: formData.direction,
                    speciality,
                    work_experience: formData.workExperience,
                    duties: formData.duties,
                    requirements: formData.requirements,
                    conditions: formData.conditions,
                    skills_and_tools: formData.skillsAndTools,
                    work_schedule: formData.workSchedule,
                    work_format: formData.workFormat,
                    type_employment: formData.typeYmployment,
                    visible_vacancies: formData.visibleVacancies,
                }])
                .select();
        
            if (error) {
                throw error;
            }

            showSuccess('Данные успешно сохранены!');
            console.log('Вакансия создана', data);

            setFormData({
                position: '',
                direction: '',
                specialitieStudents: [],
                workExperience: '',
                duties: '',
                requirements: '',
                conditions: '',
                skillsAndTools: '',
                workSchedule: '',
                workFormat: '',
                typeYmployment: '',
                visibleVacancies: false
            });
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            showError('Произошла ошибка при сохранении данных');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00'/>
                Вакансия
            </PanelHeaderButton>
            
            <Div>
                <DefaultInput title="Должность" placeholder=""
                    id="position" value={formData.position} type="text"
                    onChange={(value) => setFormData({...formData, position: value})}
                />

                <SelectedDirection value={formData.direction}
                    onChange={(value) => setFormData({...formData, direction: value})}
                />

                <ChipsSelectedSpeciality value={formData.specialitieStudents}
                    onChange={(value) => setFormData({...formData, specialitieStudents: value})}
                />

                <WorkExperienceInput  value={formData.workExperience}
                    onChange={(value) => setFormData({...formData, workExperience: value})}
                />

                <MultilineInput title="Обязанности" placeholder=""
                    id="duty" value={formData.duties}
                    onChange={(value) => setFormData({...formData, duties: value})}
                />

                <MultilineInput title="Требования" placeholder=""
                    id="conditions" value={formData.conditions}
                    onChange={(value) => setFormData({...formData, conditions: value})}
                />

                <MultilineInput title="Условия" placeholder=""
                    id="requirements" value={formData.requirements}
                    onChange={(value) => setFormData({...formData, requirements: value})}
                />

                <MultilineInput title="Необходимые навыки и инструменты" placeholder=""
                    id="skillsAndTools" value={formData.skillsAndTools}
                    onChange={(value) => setFormData({...formData, skillsAndTools: value})}
                />

                <DefaultInput title="График работы" placeholder=""
                    id="Schedule" value={formData.workSchedule} type="text"
                    onChange={(value) => setFormData({...formData, workSchedule: value})}
                />

                <WorkFormatInput value={formData.workFormat}
                    onChange={(value) => setFormData({...formData, workFormat: value})}
                />

                <TypeYmploymentInput value={formData.typeYmployment}
                    onChange={(value) => setFormData({...formData, typeYmployment: value})}
                />

                <PublicationConfirmation value={formData.visibleVacancies}
                    onChange={(value) => setFormData({...formData, visibleVacancies: value})}
                />

                <Spacing size="4xl" />

                <Button className='btnStudent' stretched mode="secondary" size="l"  
                    hoverClassName='btnStudentHover' 
                    onClick={handleSubmit}>
                    Сохранить
                </Button>

                <Spacing size="4xl" />
                <Spacing size="4xl" />
            </Div>

            <FixedLayout vertical="bottom">
                <TabBar activeStory="profile" onStoryChange={onStoryChange} />
            </FixedLayout>
            {snackbar}
        </Panel>
    )
}