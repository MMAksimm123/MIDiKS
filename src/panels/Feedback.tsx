import { Div, FixedLayout, Panel, PanelHeader, Spacing, Title } from "@vkontakte/vkui"
import React, { useState } from "react";
import TabBar from "../components/TabBar/TabBar";
import FeedbackTabs from "../components/Tabs/FeedbackTabs";
import Favorites from "../components/Favourites/Favourites";

type ScreenProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

export const Feedback:React.FC<ScreenProps> = ({id, onStoryChange}) => {
    const [activeTab, setActiveTab] = useState("feedback");

    const renderContent = () => {
        switch (activeTab) {
            case "feedback":
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="xl" />
                        <h3>Список ваших откликов</h3>
                        {/* Здесь ваш контент для вкладки "Отклики" */}
                    </Div>
                );
            case "invitations":
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="xl" />
                        <h3>Список приглашений</h3>
                        {/* Здесь ваш контент для вкладки "Приглашения" */}
                    </Div>
                );
            case "favorites":
                return (
                    <Div style={{ padding: "16px" }}>
                        <Spacing size="xl" />
                        <h3>Избранные вакансии</h3>
                        <Favorites />
                        {/* Здесь ваш контент для вкладки "Избранное" */}
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