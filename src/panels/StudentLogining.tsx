import { Icon16Done, Icon28ArrowLeftOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, Div, FixedLayout, NavIdProps, Panel, PanelHeaderButton, Snackbar, Spacing, Title } from "@vkontakte/vkui";
import React, { FC, useEffect, useState } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import { supabase } from "../database/supabaseClient";
import bridge from "@vkontakte/vk-bridge";

export const StudentLogining: FC<NavIdProps> = ({ id }) => {
    const [formData, setFormData] = useState({
        code: '',
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const [userId, setUserId] = useState<number>(0);
    const [userDirection, setUserDirection] = useState<string | null>(null);
    const routeNavigation = useRouteNavigator();

    useEffect(() => {
        bridge.send('VKWebAppGetUserInfo')
            .then((userInfo) => {
                const vkUserId = userInfo.id;
                setUserId(vkUserId);
                
                // Проверяем регистрацию пользователя сразу после получения ID
                checkUserRegistration(vkUserId);
            })
            .catch((error) => {
                console.error('Ошибка получения информации о пользователе VK', error);
                showError('Ошибка получения данных пользователя');
            });
    }, []);

    const checkUserRegistration = async (vkUserId: number) => {
        try {
            const { data: student, error: studentError } = await supabase
                .from('Students')
                .select('direction_of_study')
                .eq('id_vk_student', vkUserId)
                .maybeSingle();

            if (studentError) {
                console.error('Ошибка при проверке регистрации:', studentError);
                return;
            }

            if (!student) {
                showError('Вы не зарегистрированы в системе');
                return;
            }

            // Сохраняем направление пользователя
            setUserDirection(student.direction_of_study);
        } catch (error) {
            console.error('Ошибка при проверке регистрации:', error);
            showError('Произошла ошибка при проверке регистрации');
        }
    };

    const showError = (message: string) => {
        setSnackbar(
            <Snackbar
                before={<Icon56ErrorOutline />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        );
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
        );
    };

    const handleSubmit = async () => {
        if (!formData.code) {
            showError('Введите код доступа');
            return;
        }

        if (!userDirection) {
            showError('Не удалось определить ваше направление обучения');
            return;
        }

        try {
            setLoading(true);

            // Получаем код доступа для направления пользователя
            const { data: accessCode, error: codeError } = await supabase
                .from('Access_code')
                .select('access_code')
                .eq('direction', userDirection)
                .maybeSingle();

            if (codeError) {
                console.error('Ошибка при получении кода доступа:', codeError);
                showError('Ошибка при проверке кода доступа');
                return;
            }

            if (!accessCode) {
                showError('Для вашего направления нет кода доступа');
                return;
            }

            if (accessCode.access_code !== formData.code) {
                showError('Неверный код доступа');
                return;
            }

            // Все проверки пройдены - вход разрешен
            showSuccess('Вход выполнен успешно!');
            // Здесь можно добавить редирект на главную страницу студента
            routeNavigation.push('/mainscreen');

        } catch (error) {
            console.error('Ошибка при входе:', error);
            showError('Произошла ошибка при входе');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00' />
            </PanelHeaderButton>
            <div style={{textAlign: 'center'}}>
                <Title level="1">Вход</Title>
            </div>
            <Spacing size="4xl" />
            <Spacing size="4xl" />
            <Spacing size="4xl" />
            <Spacing size="4xl" />
            <Div>
                <DefaultInput
                    title="Код доступа"
                    placeholder=""
                    id="code"
                    value={formData.code}
                    type="text"
                    onChange={(value) => setFormData({ ...formData, code: value })}
                />
            </Div>
            <FixedLayout vertical="bottom">
                <Button
                    className='btnStudent'
                    stretched
                    mode='secondary'
                    size="l"
                    hoverClassName='btnStudentHover'
                    onClick={handleSubmit}
                    disabled={loading || !userDirection}
                >
                    {loading ? 'Проверка...' : 'Продолжить'}
                </Button>
            </FixedLayout>
            {snackbar}
        </Panel>
    )
}