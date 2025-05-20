import { Div, FixedLayout, Panel, PanelHeader, Spacing, Title } from "@vkontakte/vkui"
import React, { useState, useEffect } from "react";
import TabBar from "../components/TabBar/TabBar";
import FeedbackTabs from "../components/Tabs/FeedbackTabs";
import Favorites from "../components/Favourites/Favourites";
import FavouritesForStudent from "../components/Favourites/FavouritesForStudent";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";
import Invitations from "../components/Invitations/Invitations";
import InvitationsForStudents from "../components/Invitations/InvitationsForStudents";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";
import FeedbackForStudent from "../components/Feedback/FeedbackForStudent";

type ScreenProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

type UserType = 'employer' | 'student' | null;

export const Feedback: React.FC<ScreenProps> = ({id, onStoryChange}) => {
    const [activeTab, setActiveTab] = useState("feedback");
    const [userType, setUserType] = useState<UserType>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                // Получаем VK ID пользователя через VK Bridge
                const vkUser = await bridge.send('VKWebAppGetUserInfo');
                const vkId = vkUser.id;

                // Проверяем, есть ли пользователь в таблице Employers
                const { data: employerData, error: employerError } = await supabase
                    .from('Employers')
                    .select('id_vk_employer')
                    .eq('id_vk_employer', vkId)
                    .single();
                
                if (employerData) {
                    setUserType('employer');
                    setLoading(false);
                    return;
                }

                // Если не найден в Employers, проверяем таблицу Students
                const { data: studentData, error: studentError } = await supabase
                    .from('Students')
                    .select('id_vk_student')
                    .eq('id_vk_student', vkId)
                    .single();

                if (studentData) {
                    setUserType('student');
                    setLoading(false);
                    return;
                }

                // Если не найден ни в одной таблице
                setLoading(false);
                
            } catch (error) {
                console.error('Error fetching user type:', error);
                setLoading(false);
            }
        };

        fetchUserType();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case "feedback":
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="4xl" />
                        {userType === 'employer' && <FeedbackComponent />}
                        {userType === 'student' && <FeedbackForStudent />}
                    </Div>
                );
            case "invitations":
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="4xl" />
                        {userType === 'employer' && <Invitations />}
                        {userType === 'student' && <InvitationsForStudents />}
                        {/* Здесь ваш контент для вкладки "Приглашения" */}
                    </Div>
                );
            case "favorites":
                if (loading) {
                    return <Div>Загрузка...</Div>;
                }
                
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="4xl" />
                        {userType === 'employer' && <Favorites />}
                        {userType === 'student' && <FavouritesForStudent />}
                        {!userType && <Div>Пользователь не найден</Div>}
                    </Div>
                );
            default:
                return null;
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader>
                <Title>Отклики</Title>
            </PanelHeader>

            <FixedLayout vertical="top">
                <FeedbackTabs onTabChange={setActiveTab}/>
            </FixedLayout>

            {renderContent()}

            <FixedLayout vertical="bottom">
                <TabBar activeStory="feedback" onStoryChange={onStoryChange}/>
            </FixedLayout>
        </Panel>
    )
}