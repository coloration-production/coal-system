import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { 
  Signin, 
  Insight,
  SettingFeature,
  SettingAccount,
  DustDevices,
  DustManage,
  History,
} from '../views'
import { DashboardContainer } from '../components'

const routes:RouteRecordRaw[] = [
 
  { 
    path: '/dashboard', 
    component: DashboardContainer,
    children: [
      { path: 'insight', component: Insight },
      { path: 'dust-devices', component: DustDevices },
      { path: 'dust-manage', component: DustManage },
      { path: 'history', component: History },
      { path: 'setting-feature', component: SettingFeature },
      { path: 'setting-account', component: SettingAccount },
    ]
  },
  { 
    path: '/', 
    component: Signin 
  },

]

export const appRouter = createRouter({
  history: createWebHashHistory(),
  routes,
})

