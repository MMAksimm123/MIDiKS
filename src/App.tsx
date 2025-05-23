import { useState, useEffect, ReactNode } from 'react';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import { Persik, Home, StudentStartScreen, Profile, Feedback } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { EmployerStartScreen } from './panels/EmployerStartScreen';
import { StudentRegistration } from './panels/StudentRegistration';
import { EmployerRegistration} from './panels/EmployerRegistrtion';
import { EmployerLoggining } from './panels/EmployerLoggining';
import { MainScreen } from './panels/MainScreen';
import { StudentLogining } from './panels/StudentLogining';
import { Notifications } from './panels/Notifications';
import { JobCreation } from './panels/JobCreation';
import { EditingEmployerProfile } from './panels/EditingEmployerProfile';
import { EditingStudentProfile } from './panels/EditingStudentProfile';
import { SummaryCreation } from './panels/SummaryCreation';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner />);
  const routeNavigator = useRouteNavigator();

  const onStoryChange = (newActivePanel: string) => {
    routeNavigator.push('/' + newActivePanel);
  };

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" fetchedUser={fetchedUser} />
          <Persik id="persik" />
          <StudentStartScreen id="studentstartscreen" />
          <EmployerStartScreen id="employerstartscreen" />
          <StudentRegistration id="studentregistration" />
          <EmployerRegistration id='employerregistrtion' />
          <EmployerLoggining id='logginingemployer' />
          <StudentLogining id='logginingstudent' />
          <EditingEmployerProfile id='editingemployerprofile' />
          <EditingStudentProfile id='editingstudentprofile' />
          <MainScreen id='mainscreen' onStoryChange={onStoryChange}/>
          <Profile id='profile' onStoryChange={onStoryChange}/>
          <Feedback id='feedback' onStoryChange={onStoryChange} />
          <Notifications id='notifications' onStoryChange={onStoryChange} />
          <JobCreation id='jobcreation' onStoryChange={onStoryChange}/>
          <SummaryCreation id='summarycreation' onStoryChange={onStoryChange} />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
