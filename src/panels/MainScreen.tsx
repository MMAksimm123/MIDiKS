import { Div, Panel, Title, Image, FixedLayout, Spacing, PanelHeader, ScreenSpinner } from "@vkontakte/vkui";
import { FC, useState, useEffect } from "react";
import Frame from "../../public/Frame.png";
import ImgText from "../../public/Text.png";
import TabBar from "../components/TabBar/TabBar";
import UserList from "../components/Cards/UserList";
import SearchPanel from "../components/SearchPanel/SearchPanel";
import JobList from "../components/Cards/JobList";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";

type MainScreenProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

type UserRole = 'employer' | 'student' | null;

export const MainScreen: FC<MainScreenProps> = ({id, onStoryChange}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);
    const routeNavigator = useRouteNavigator();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Получаем данные пользователя через VK Bridge
                const user = await bridge.send('VKWebAppGetUserInfo');
                const vkId = user.id;

                // Проверяем наличие пользователя в таблице Employers
                const { data: employerData, error: employerError } = await supabase
                    .from('Employers')
                    .select('id_vk_employer')
                    .eq('id_vk_employer', vkId)
                    .single();

                if (employerData) {
                    setUserRole('employer');
                    return;
                }

                // Проверяем наличие пользователя в таблице Students
                const { data: studentData, error: studentError } = await supabase
                    .from('Students')
                    .select('id_vk_student')
                    .eq('id_vk_student', vkId)
                    .single();

                if (studentData) {
                    setUserRole('student');
                    return;
                }

                // Если пользователь не найден ни в одной таблице
                // Можно перенаправить на страницу регистрации
                routeNavigator.push('/');

            } catch (error) {
                console.error('Error fetching user data:', error);
                // Можно показать ошибку или перенаправить на страницу ошибки
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [routeNavigator]);

    if (loading) {
        return <ScreenSpinner />;
    }

    return(
        <Panel id={id}>
            <PanelHeader>
                <Title>Лента</Title>
            </PanelHeader>  
            
            {/* Блок с картинками - верхний элемент */}
            <Div style={{
                background: "#FC4C00", 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '15px',  
                height: '194px',
                position: 'relative',
                zIndex: 1
            }}>
                <Image src={ImgText} size={96} noBorder keepAspectRatio/>
                <Image src={Frame} size={96} noBorder keepAspectRatio/>
            </Div>
            
            {/* Обертка для контента с картами */}
            <div style={{
                position: 'relative',
                marginTop: '-20px', // Поднимаем блок немного вверх для наложения
                zIndex: 2,
                backgroundColor: 'Background',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                paddingTop: '12px'
            }}>
                {/* Поисковая панель с sticky позиционированием */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 3,
                    backgroundColor: 'Background',
                    paddingTop: '12px'
                }}>
                    <SearchPanel searchQuery={searchQuery} onSearchChange={setSearchQuery}/>
                </div>
                
                {/* Отображаем соответствующий компонент в зависимости от роли */}
                <Div>
                    {userRole === 'employer' && <UserList searchQuery={searchQuery} />}
                    {userRole === 'student' && <JobList searchQuery={searchQuery} />}
                </Div>
            </div>

            <Spacing size="4xl" />

            <FixedLayout vertical="bottom">
                <TabBar activeStory="mainscreen" onStoryChange={onStoryChange}/>
            </FixedLayout>
        </Panel>
    )
}