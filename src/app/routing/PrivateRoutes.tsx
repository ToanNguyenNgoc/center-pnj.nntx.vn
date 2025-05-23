import { lazy, FC, Suspense, Fragment } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../pages/dashboard/DashboardWrapper'
import { MenuTestPage } from '../pages/MenuTestPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import { InstanceSocket, NotificationMessage } from '../components'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  const Roles = lazy(() => import('../pages/roles/RolesPage'));
  const RolesFormPage = lazy(() => import('../pages/roles/RolesFormPage'));
  const CustomersPage = lazy(() => import('../pages/users/UsersPage'));
  const CustomersFormPage = lazy(() => import('../pages/users/UsersFormPage'));
  const OrganizationsPage = lazy(() => import('../pages/organizations/OrganizationsPage'));
  const OrganizationsFormPage = lazy(() => import('../pages/organizations/OrganizationsFormPage'));
  const BrandsPage = lazy(() => import('../pages/brands/BrandsPage'));
  const MessengerPage = lazy(()=> import('../pages/messenger/MessengerPage'));

  return (
    <Fragment>
      <InstanceSocket />
      <NotificationMessage/>
      <Routes>
        <Route element={<MasterLayout />}>
          {/* Redirect to Dashboard after success login/registartion */}
          <Route path='auth/*' element={<Navigate to='/dashboard' />} />
          {/* Pages */}
          <Route path='dashboard' element={<DashboardWrapper />} />
          <Route path='builder' element={<BuilderPageWrapper />} />
          <Route path='menu-test' element={<MenuTestPage />} />
          {/* Lazy Modules */}
          <Route
            path='apps/organizations'
            element={
              <SuspensedView>
                <OrganizationsPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/organizations-form/:id'
            element={
              <SuspensedView>
                <OrganizationsFormPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/organizations-form'
            element={
              <SuspensedView>
                <OrganizationsFormPage />
              </SuspensedView>
            }
          />
          {/* brand */}
          <Route
            path='apps/brands'
            element={
              <SuspensedView>
                <BrandsPage />
              </SuspensedView>
            }
          />
          {/* profile */}
          <Route
            path='crafted/pages/profile/*'
            element={
              <SuspensedView>
                <ProfilePage />
              </SuspensedView>
            }
          />
          <Route
            path='crafted/pages/wizards/*'
            element={
              <SuspensedView>
                <WizardsPage />
              </SuspensedView>
            }
          />
          <Route
            path='crafted/widgets/*'
            element={
              <SuspensedView>
                <WidgetsPage />
              </SuspensedView>
            }
          />
          <Route
            path='crafted/account/*'
            element={
              <SuspensedView>
                <AccountPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/chat/*'
            element={
              <SuspensedView>
                <ChatPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/user-management/*'
            element={
              <SuspensedView>
                <UsersPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/roles'
            element={
              <SuspensedView>
                <Roles />
              </SuspensedView>
            }
          />
          <Route
            path='apps/roles-form/:id'
            element={
              <SuspensedView>
                <RolesFormPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/roles-form'
            element={
              <SuspensedView>
                <RolesFormPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/users'
            element={
              <SuspensedView>
                <CustomersPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/users-form/:id'
            element={
              <SuspensedView>
                <CustomersFormPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/users-form'
            element={
              <SuspensedView>
                <CustomersFormPage />
              </SuspensedView>
            }
          />
          <Route
            path='apps/messengers/*'
            element={
              <SuspensedView>
                <MessengerPage />
              </SuspensedView>
            }
          />
          {/* Page Not Found */}
          <Route path='*' element={<Navigate to='/error/404' />} />
        </Route>
      </Routes>
    </Fragment>
  )
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export { PrivateRoutes }
