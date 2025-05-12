import { FC } from 'react';
import { Panel, Div, Image, NavIdProps, Button, Spacing, FixedLayout} from "@vkontakte/vkui";
import { UserInfo } from '@vkontakte/vk-bridge';
import "../style/Home.css";
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';


export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({id}) => {
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
          <Button className='btnStudent' stretched mode="secondary" size="l"  
            hoverClassName='btnStudentHover' 
            onClick={() => routeNavigator.push('studentstartscreen')}>
              Студент
          </Button>
          <Spacing size="m"/>
          <Button className='btnEmployer' stretched mode='secondary' size="l" 
            hoverClassName='btnEmployerHover'
            onClick={() => routeNavigator.push('employerstartscreen')}>
              Работодатель
            </Button>
        </Div>
      </FixedLayout>
    </Panel>
  )
}