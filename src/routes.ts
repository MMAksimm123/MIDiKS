import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
  STUDENTSTARTSCREEN: 'studentstartscreen',
  EMPLOYERSTARTSCREEN: 'employerstartscreen',
  STUDENTREGISTRATION: 'studentregistration',
  EMPLOYERREGISTRATION: 'employerregistrtion',
  LOGGININGEMPLOYER: 'logginingemployer',
  MAINSCREEN: 'mainscreen',
  LOGGININGSTUDENT: 'logginingstudent',
  PROFILE: 'profile',
  FEEDBACK: 'feedback',
  NOTIFICATIONS: 'notifications',
  JOBCREATION: 'jobcreation',
  EDITINGEMPLOYERPROFILE: 'editingemployerprofile',
  EDITINGSTUDENTPROFILE: 'editingstudentprofile',
  SUMMARYCREATION: 'summarycreation',
  STUDENTSUMMARY: 'studentsummary',
  EMPLOYERVACANCES: 'employervacances',
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}`, []),
      createPanel(DEFAULT_VIEW_PANELS.STUDENTSTARTSCREEN, `/${DEFAULT_VIEW_PANELS.STUDENTSTARTSCREEN}`, []),
      createPanel(DEFAULT_VIEW_PANELS.EMPLOYERSTARTSCREEN, `/${DEFAULT_VIEW_PANELS.EMPLOYERSTARTSCREEN}`, []),
      createPanel(DEFAULT_VIEW_PANELS.STUDENTREGISTRATION, `/${DEFAULT_VIEW_PANELS.STUDENTREGISTRATION}`, []),
      createPanel(DEFAULT_VIEW_PANELS.EMPLOYERREGISTRATION, `/${DEFAULT_VIEW_PANELS.EMPLOYERREGISTRATION}`, []),
      createPanel(DEFAULT_VIEW_PANELS.LOGGININGEMPLOYER, `/${DEFAULT_VIEW_PANELS.LOGGININGEMPLOYER}`, []),
      createPanel(DEFAULT_VIEW_PANELS.MAINSCREEN, `/${DEFAULT_VIEW_PANELS.MAINSCREEN}`, []),
      createPanel(DEFAULT_VIEW_PANELS.LOGGININGSTUDENT, `/${DEFAULT_VIEW_PANELS.LOGGININGSTUDENT}`, []),
      createPanel(DEFAULT_VIEW_PANELS.PROFILE, `/${DEFAULT_VIEW_PANELS.PROFILE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.FEEDBACK, `/${DEFAULT_VIEW_PANELS.FEEDBACK}`, []),
      createPanel(DEFAULT_VIEW_PANELS.NOTIFICATIONS, `/${DEFAULT_VIEW_PANELS.NOTIFICATIONS}`, []),
      createPanel(DEFAULT_VIEW_PANELS.JOBCREATION, `/${DEFAULT_VIEW_PANELS.JOBCREATION}`, []),
      createPanel(DEFAULT_VIEW_PANELS.EDITINGEMPLOYERPROFILE, `/${DEFAULT_VIEW_PANELS.EDITINGEMPLOYERPROFILE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.EDITINGSTUDENTPROFILE, `/${DEFAULT_VIEW_PANELS.EDITINGSTUDENTPROFILE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.SUMMARYCREATION, `/${DEFAULT_VIEW_PANELS.SUMMARYCREATION}`, []),
      createPanel(DEFAULT_VIEW_PANELS.STUDENTSUMMARY, `/${DEFAULT_VIEW_PANELS.STUDENTSUMMARY}/:id`, []),
      createPanel(DEFAULT_VIEW_PANELS.EMPLOYERVACANCES, `/${DEFAULT_VIEW_PANELS.EMPLOYERVACANCES}/:id`, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
