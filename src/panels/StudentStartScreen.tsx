import { FC } from 'react';
import { Panel, Div, Image, NavIdProps, Button, Spacing, FixedLayout} from "@vkontakte/vkui";
import "../style/Home.css";
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export const StudentStartScreen: FC<NavIdProps> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    return (
        <Panel id={id}>
        <Spacing size="xs" />
    
        <Spacing size="4xl"/>
        <Spacing size="4xl"/>
        <Spacing size="4xl"/>
        <Spacing size="4xl"/>
        <Spacing size="4xl"/>
        <Spacing size="4xl"/>
        <Image className='' keepAspectRatio src="../../public/logo.png" noBorder/>

        <FixedLayout vertical='bottom'>
            <Div>
            <Button className='btnStudent' stretched 
                mode="secondary" size="l" 
                hoverClassName='btnStudentHover'
                onClick={() => routeNavigator.push('/studentregistration')}>
                    Новый пользователь
                </Button>
            <Spacing size="m"/>
            <Button 
                className='btnEmployer' stretched 
                mode='secondary' size="l" hoverClassName='btnEmployerHover'
                onClick={() => routeNavigator.push('/logginingstudent')}
            >
                Войти
            </Button>
            </Div>
        </FixedLayout>
        </Panel>
    )
}