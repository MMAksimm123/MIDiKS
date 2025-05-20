import { Icon28Cards2Outline, Icon28HomeOutline, Icon28NotificationAddOutline, Icon28Profile } from "@vkontakte/icons"
import { Tabbar, TabbarItem } from "@vkontakte/vkui"
import React from "react";

type TabBarProps = {
    activeStory: string;
    onStoryChange: (story: string) => void;
}

const TabBar:React.FC<TabBarProps> = ({ activeStory, onStoryChange }) => {
    return (
        <div>
            <div style={{ maxWidth: 768, margin: 'auto' }}>
                <Tabbar>
                    <TabbarItem 
                        selected={activeStory === 'mainscreen'} label="Лента"
                        onClick={() => onStoryChange('mainscreen')}>
                        <Icon28HomeOutline />
                    </TabbarItem>
                    <TabbarItem 
                        selected={activeStory === 'feedback'} label="Отклики"
                        onClick={() => onStoryChange('Feedback')}>
                        <Icon28Cards2Outline />
                    </TabbarItem>
                    <TabbarItem 
                        selected={activeStory === 'notifications'} label="Уведомления"
                        onClick={() => onStoryChange('notifications')}>
                        <Icon28NotificationAddOutline />
                    </TabbarItem>
                    <TabbarItem 
                        selected={activeStory === 'profile'} label="Профиль"
                        onClick={() => onStoryChange('profile')}>
                        <Icon28Profile />
                    </TabbarItem>
                </Tabbar> 
            </div>
        </div>
    )
}

export default TabBar;