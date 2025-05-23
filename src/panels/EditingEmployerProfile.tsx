import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { Button, FixedLayout, NavIdProps, Panel, PanelHeaderButton, Spacing, Snackbar } from "@vkontakte/vkui";
import React, { useState, useEffect } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import PhoneInput from "../components/InputsForm/PhoneInput";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";

export const EditingEmployerProfile: React.FC<NavIdProps> = ({ id }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        description: '',
        link: '',
        workingFace: '',
        phoneEmployer: '',
        login: '',
        password: ''
    });
    const [vkUserId, setVkUserId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<React.ReactNode>(null);

    // Получаем VK user id при загрузке компонента
    useEffect(() => {
        async function fetchVkUserId() {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                setVkUserId(user.id);
            } catch (error) {
                console.error('Error fetching VK user info:', error);
                showSnackbar('Не удалось получить данные пользователя');
            }
        }
        fetchVkUserId();
    }, []);

    // Загружаем данные работодателя из Supabase когда известен vkUserId
    useEffect(() => {
        if (!vkUserId) return;

        async function fetchEmployerData() {
            try {
                const { data, error } = await supabase
                    .from('Employers')
                    .select('*')
                    .eq('id_vk_employer', vkUserId)
                    .single();

                if (error) throw error;
                
                if (data) {
                    setFormData({
                        name: data.company_name || '',
                        city: data.city_employer || '',
                        description: data.company_description || '',
                        link: data.link_company || '',
                        workingFace: data.working_face || '',
                        phoneEmployer: data.phone_employer || '',
                        login: data.login_employer || '',
                        password: data.password_employer || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching employer data:', error);
                showSnackbar('Не удалось загрузить данные работодателя');
            }
        }

        fetchEmployerData();
    }, [vkUserId]);

    const handleSave = async () => {
        if (!vkUserId) return;

        try {
            const { error } = await supabase
                .from('Employers')
                .update({
                    company_name: formData.name,
                    city_employer: formData.city,
                    company_description: formData.description,
                    link_company: formData.link,
                    working_face: formData.workingFace,
                    phone_employer: formData.phoneEmployer,
                    login_employer: formData.login,
                    password_employer: formData.password
                })
                .eq('id_vk_employer', vkUserId);

            if (error) throw error;

            showSnackbar('Данные успешно сохранены');
            
            // Возвращаемся назад через секунду после успешного сохранения
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

            <DefaultInput 
                title="Название компании:"
                placeholder=""
                id="name"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                type="text"
            />
            <DefaultInput 
                title="Город"
                placeholder=""
                id="city"
                value={formData.city}
                onChange={(value) => setFormData({...formData, city: value})}
                type="text"
            />

            <DefaultInput 
                title="Описание компании:"
                placeholder=""
                id="description"
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
                type="text"
            />

            <DefaultInput 
                title="Ссылка на сайт"
                placeholder=""
                id="link"
                value={formData.link}
                onChange={(value) => setFormData({...formData, link: value})}
                type="text"
            />

            <DefaultInput 
                title="Контактное лицо"
                placeholder=""
                id="workingFace"
                value={formData.workingFace}
                onChange={(value) => setFormData({...formData, workingFace: value})}
                type="text"
            />

            <PhoneInput 
                value={formData.phoneEmployer}
                onChange={(value) => setFormData({...formData, phoneEmployer: value})}
            />

            <DefaultInput 
                title="Логин"
                placeholder=""
                id="login"
                value={formData.login}
                onChange={(value) => setFormData({...formData, login: value})}
                type="text"
            />

            <DefaultInput 
                title="Пароль"
                placeholder=""
                id="password"
                value={formData.password}
                onChange={(value) => setFormData({...formData, password: value})}
                type="password"
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