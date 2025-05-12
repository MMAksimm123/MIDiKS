import { Icon16Done, Icon28ArrowLeftOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import { Button, Div, FixedLayout, NavIdProps, Panel, PanelHeaderButton, Snackbar, Spacing, Title } from "@vkontakte/vkui";
import React, { FC, useEffect, useState } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import PhoneInput from "../components/InputsForm/PhoneInput";
import SelectedDirection from "../components/InputsForm/SelectedInputs/SelectedDirection";
import { supabase } from "../database/supabaseClient";
import bridge from "@vkontakte/vk-bridge";

export const  EmployerRegistration: FC<NavIdProps> = ({id}) => {
    const [formData, setFormData] = useState({
        companyName: '',
        workingFace: '',
        phone: '',
        direction: '',
        city: '',
        login: '',
        password: ''
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
                before={<Icon16Done />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        )
    };

    const handleSubmit = async () => {
        if (!formData.companyName.trim()) {
            showError('Введите название компании');
            return;
        }

        if (!formData.workingFace.trim()) {
            showError('Введите ФИО');
            return;
        }

        if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 11) {
            showError('Введите корректный номер телефона');
            return;
        }

        if (!formData.direction) {
            showError('Выберите хотя специальность');
            return;
        }

        if (!formData.city.trim()) {
            showError('Запишите город');
            return;
        }

        if (!formData.login.trim()) {
            showError('Укажите логин');
            return;
        }

        if (!formData.password.trim()) {
            showError('Укажите пароль');
            return;
        }

        try {
            setLoading(true);

            const {data: existingUser} = await supabase
                .from('Employers')
                .select('login_employer')
                .eq('login_employer', formData.login)
                .maybeSingle();

            if (existingUser) {
                showError('Пользователь с таким Логином уже существует');
                return;
            }

            const {data, error} = await supabase
                .from('Employers')
                .insert([{
                    id_vk_employer: userId,
                    login_employer: formData.login,
                    password_employer: formData.password,
                    company_name: formData.companyName,
                    working_face: formData.workingFace,
                    phone_employer: formData.phone,
                    direction: formData.direction,
                    city_employer: formData.city,
                }])
                .select();

            if (error)
            {
                throw error;
            }

            showSuccess('Данные успешно сохранены!');
            console.log('Данные сохранены', data);

            setFormData({
                companyName: '',
                workingFace: '',
                phone: '',
                direction: '',
                city: '',
                login: '',
                password: ''
            });
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            showError('Произошла ошибка при сохранении данных');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        bridge.send('VKWebAppGetUserInfo')
            .then((userInfo) => {
                const vkUserId = userInfo.id;

                setUserId(vkUserId);
            })
            .catch((error) => {
                console.error('Ошибка получения информации о пользователе VK', error);
            });
    }, []);

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00'/>
            </PanelHeaderButton>
            <div style={{textAlign: 'center'}}>
                <Title level="1">Регистрация</Title>
            </div>
            <Div>
                <DefaultInput 
                    title="Компания" placeholder=""
                    id="name" value={formData.companyName} type="text"
                    onChange={(value) => setFormData({...formData, companyName: value})}
                />

                <DefaultInput 
                    title="Контактное лицо" placeholder=""
                    id="name" value={formData.workingFace} type="text"
                    onChange={(value) => setFormData({...formData, workingFace: value})}
                />

                <PhoneInput 
                    value={formData.phone}
                    onChange={(value) => setFormData({...formData, phone: value})}
                />

                <SelectedDirection
                    value={formData.direction}
                    onChange={(value) => setFormData({...formData, direction: value})}
                />

                <DefaultInput 
                    title="Город" placeholder=""
                    id="city" value={formData.city} type="text"
                    onChange={(value) => setFormData({...formData, city: value})}
                />

                <DefaultInput 
                    title="Логин" placeholder=""
                    id="login" value={formData.login} type="text"
                    onChange={(value) => setFormData({...formData, login: value})}
                />

                <DefaultInput 
                    title="Пароль" placeholder=""
                    id="password" value={formData.password} type="password"
                    onChange={(value) => setFormData({...formData, password: value})}
                />
            </Div>
            <Spacing size="4xl" />
            <Spacing size="4xl" />


            <FixedLayout vertical='bottom'>
                <Button 
                    className='btnStudent' stretched 
                    mode='secondary' size="l"  
                    hoverClassName='btnStudentHover'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Отправка...' : 'Продолжить'}
                </Button>
            </FixedLayout>
            {snackbar}
        </Panel>
    )
}