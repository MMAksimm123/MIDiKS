import { Panel, Title, Div, FixedLayout, ScreenSpinner, Spacing, Button, PanelHeader } from "@vkontakte/vkui";
import { FC, useEffect, useState } from "react";
import TabBar from "../components/TabBar/TabBar";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../database/supabaseClient";
import CardUser from "../components/Cards/CardUser";
import CardEmployer from "../components/Cards/CardEmployer";
import { Icon24Add } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

type ProfileProps = {
    id: string;
    onStoryChange: (story: string) => void;
}

type UserData = {
    vk_id: string;
    // другие поля из таблицы Students
    urlPhoto?: string;
    name?: string;
    specialization?: string;
    studentVacancy?: string;
    studentWorkExpiriency?: string;
    studentLastPlaceEmployment?: string;
    studentEmploymentType?: string;
}

type EmployerData = {
    vk_id: string;
    company_name?: string;
    company_description?: string;
    link_company?: string;
}

export const Profile: FC<ProfileProps> = ({id, onStoryChange}) => {
    const [userId, setUserId] = useState<number>(0);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [employerData, setEmployerData] = useState<EmployerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const routeNavigator = useRouteNavigator();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Получаем информацию о пользователе VK
                const userInfo = await bridge.send('VKWebAppGetUserInfo');
                const vkUserId = userInfo.id;
                setUserId(vkUserId);
                console.log(vkUserId)

                // Проверяем наличие пользователя в таблице Students
                const { data: studentData, error: studentError } = await supabase
                    .from('Students')
                    .select('*')
                    .eq('id_vk_student', vkUserId)
                    .single();

                if (studentData && !studentError) {
                    setUserData(studentData);
                    setLoading(false);
                    return;
                }

                // Если не найден в Students, проверяем таблицу Employers
                const { data: employerData, error: employerError } = await supabase
                    .from('Employers')
                    .select('*')
                    .eq('id_vk_employer', vkUserId)
                    .single();

                if (employerData && !employerError) {
                    setEmployerData(employerData);
                    setLoading(false);
                    return;
                }

                // Если пользователь не найден ни в одной таблице
                setError("Пользователь не найден");
                setLoading(false);
            } catch (error) {
                console.error('Ошибка:', error);
                setError("Произошла ошибка при загрузке данных");
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <ScreenSpinner />;
    }

    if (error) {
        return (
            <Panel id={id}>
                <Div>
                    <Title>{error}</Title>
                </Div>
            </Panel>
        );
    }

    return (
        <Panel id={id}>
            <PanelHeader>
                 <Title>Профиль</Title>
            </PanelHeader>
            <>
                <Spacing size="4xl" />
                
                {userData && (
                    <Div>
                        <CardUser
                            idVkStudent={userData.vk_id}
                            urlPhoto={userData.urlPhoto || ''}
                            name={userData.name || ''}
                            specialization={userData.specialization || ''}
                            studentVacancy={userData.studentVacancy || ''}
                            studentWorkExpiriency={userData.studentWorkExpiriency || ''}
                            studentLastPlaceEmployment={userData.studentLastPlaceEmployment || ''}
                            studentEmploymentType={userData.studentEmploymentType || ''}
                        />
                        <Spacing size="xl" />
                        <Button
                            className='btnStudent'                             
                            stretched 
                            mode="secondary"
                            size="l"
                            hoverClassName='btnStudentHover'
                        >
                            Редактировать профиль 
                        </Button>
                        <Spacing size="xl" />
                        <Spacing size="xl" />
                    </Div>
                )}
            </>
            {employerData && (
                <Div>
                    <CardEmployer
                        nameCompany={employerData.company_name || ''}
                        companyDescription={employerData.company_description || ''}
                        companyLink={employerData.link_company || ''}
                    />
                    <Spacing size="4xl" />
                    <Button className='btnStudent'                             
                        stretched 
                        mode="secondary"
                        size="l"
                        hoverClassName='btnStudentHover'
                    >
                        Редактировать профиль 
                    </Button>
                    <Spacing size="4xl" />
                    <Spacing size="4xl" />
                </Div>
            )}

            {employerData && (
                <FixedLayout vertical="bottom" filled>
                    <Div style={{
                        paddingBottom: 60,
                        backgroundColor: 'var(--vkui--color_background_content)'
                    }}>
                        <Button 
                            className='btnStudent' 
                            stretched 
                            mode="secondary" 
                            size="l" 
                            hoverClassName='btnStudentHover'
                            onClick={() => routeNavigator.push('/jobcreation')}
                        >
                            <Div style={{
                                display: 'flex',  
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '10px'
                            }}>
                                <Icon24Add />
                                Создать вакансию
                            </Div>
                        </Button>
                    </Div>
                    <TabBar activeStory="profile" onStoryChange={onStoryChange} />
                </FixedLayout>
            )}

            {!employerData && (
                <FixedLayout vertical="bottom">
                    <TabBar activeStory="profile" onStoryChange={onStoryChange} />
                </FixedLayout>
            )}
        </Panel>
    );
}