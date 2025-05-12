import { Icon16Done, Icon28ArrowLeftOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import { Button, Div, FixedLayout, NavIdProps, Panel, PanelHeaderButton, Snackbar, Spacing, Title} from "@vkontakte/vkui";
import { FC, useState } from "react";
import DefaultInput from "../components/InputsForm/DefoultInput";
import { supabase } from "../database/supabaseClient";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

export const EmployerLoggining: FC<NavIdProps> = ({id}) => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const routeNavigator = useRouteNavigator();

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
        if (!formData.login) {
            showError('Введите логин');
            return;
        }

        if (!formData.password) {
            showError('Введите пароль');
            return;
        }

        try {
            setLoading(true);

            // Ищем пользователя с указанным логином и паролем
            const { data: employer, error } = await supabase
                .from('Employers')
                .select('*')
                .eq('login_employer', formData.login)
                .eq('password_employer', formData.password)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!employer) {
                showError('Неверный логин или пароль');
                return;
            }

            // Если пользователь найден, сохраняем его данные (например, в localStorage)
            localStorage.setItem('employer', JSON.stringify(employer));
            
            showSuccess('Вход выполнен успешно');
            routeNavigator.push('/mainscreen');
           
        } catch (error) {
            console.error('Ошибка при входе:', error);
            showError('Произошла ошибка при входе');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00'/>
            </PanelHeaderButton>
            <div style={{textAlign: 'center'}}>
                <Title level="1">Вход</Title>
            </div>
            <Spacing size="4xl"/>
            <Spacing size="4xl"/>
            <Spacing size="4xl"/>
            <Spacing size="4xl"/>
            <Div>
                <DefaultInput
                    title="Логин" placeholder=""
                    id='name' value={formData.login} type="text"
                    onChange={(value) => setFormData({...formData, login: value})}
                />
                <DefaultInput 
                    title="Пароль" placeholder=""
                    id="password" value={formData.password} type="password"
                    onChange={(value) => setFormData({...formData, password: value})}
                />
            </Div>
            <FixedLayout vertical="bottom">
                <Button 
                    className='btnStudent' stretched 
                    mode='secondary' size="l"  
                    hoverClassName='btnStudentHover'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Проверка...' : 'Продолжить'}
                </Button>
            </FixedLayout>
            {snackbar}
        </Panel>
    )
}