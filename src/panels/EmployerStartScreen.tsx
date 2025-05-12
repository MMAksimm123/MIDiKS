import { FC } from 'react';
import { Panel, Div, Image, NavIdProps, Button, Spacing, FixedLayout} from "@vkontakte/vkui";
import "../style/Home.css";
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export const EmployerStartScreen: FC<NavIdProps> = ({id}) => {
  const routeNavigatorToRegistration = useRouteNavigator();
  const routeNavigatorToLoggining = useRouteNavigator();

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
            onClick={() => routeNavigatorToRegistration.push('/employerregistrtion')}>
              Новый работодатель
            </Button>
          <Spacing size="m"/>
          <Button 
            className='btnEmployer' stretched 
            mode='secondary' size="l" 
            hoverClassName='btnEmployerHover'
            onClick={() => routeNavigatorToLoggining.push('/logginingemployer')}>
              Войти
          </Button>
        </Div>
      </FixedLayout>
    </Panel>
  )
}