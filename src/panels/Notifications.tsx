import { Div, FixedLayout, Panel, PanelHeader, Title } from "@vkontakte/vkui";
import React from "react";
import TabBar from "../components/TabBar/TabBar";
import Notices from "../components/Notices/Notices";

type ScreenProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

export const Notifications:React.FC<ScreenProps> = ({id, onStoryChange}) => {
    return (
        <Panel id={id}>
            <PanelHeader>
                <Title>Уведомления</Title>
            </PanelHeader>

            <Div>
                <Notices />
            </Div>

            <FixedLayout vertical="bottom">
                <TabBar activeStory="notifications" onStoryChange={onStoryChange}/>
            </FixedLayout>
        </Panel>
    )
}