import { Div, FixedLayout, Panel, PanelHeader, Title, ScreenSpinner } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import TabBar from "../components/TabBar/TabBar";
import Notices from "../components/Notices/Notices";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";
import NoticesStudent from "../components/Notices/NoticesStudent";

type ScreenProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

export const Notifications: React.FC<ScreenProps> = ({ id, onStoryChange }) => {
    const [userType, setUserType] = useState<'student' | 'employer' | null>(null);
    const [loading, setLoading] = useState(true);
    const routeNavigator = useRouteNavigator();

    useEffect(() => {
        async function fetchUserType() {
            try {
                // Получаем данные пользователя через VK Bridge
                const vkUser = await bridge.send('VKWebAppGetUserInfo');
                const vkId = vkUser.id;

                // Проверяем наличие в таблице Students
                const { data: studentData, error: studentError } = await supabase
                    .from('Students')
                    .select('id_vk_student')
                    .eq('id_vk_student', vkId)
                    .single();

                if (studentData) {
                    setUserType('student');
                    return;
                }

                // Проверяем наличие в таблице Employers
                const { data: employerData, error: employerError } = await supabase
                    .from('Employers')
                    .select('id_vk_employer')
                    .eq('id_vk_employer', vkId)
                    .single();

                if (employerData) {
                    setUserType('employer');
                    return;
                }

                // Если пользователь не найден ни в одной таблице
                console.log('User not found in any table');
                // Можно перенаправить на другую страницу или показать сообщение
                // routeNavigator.push('/not-found');
            } catch (error) {
                console.error('Error fetching user type:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserType();
    }, []);

    if (loading) {
        return <ScreenSpinner />;
    }

    return (
        <Panel id={id}>
            <PanelHeader>
                <Title>Уведомления</Title>
            </PanelHeader>

            <Div>
                {userType === 'student' && <NoticesStudent />}
                {userType === 'employer' && <Notices />}
            </Div>

            <FixedLayout vertical="bottom">
                <TabBar activeStory="notifications" onStoryChange={onStoryChange}/>
            </FixedLayout>
        </Panel>
    )
}