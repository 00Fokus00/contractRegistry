import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';

const NAV_ITEMS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/customers', label: 'Контрагенты' },
  { to: '/lots', label: 'Лоты' },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <Layout direction="row" style={{ minHeight: '100vh' }}>
      <Layout
        direction="column"
        className="app-sidebar"
        style={{ width: 260, flexShrink: 0, padding: '24px 16px', gap: 24 }}
      >
        <Text size="l" weight="bold" view="primary" style={{ padding: '0 12px' }}>
          Реестр договоров
        </Text>

        <Layout direction="column" style={{ gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <Button
                  label={item.label}
                  view={isActive ? 'primary' : 'ghost'}
                  width="full"
                  className="sidebar-nav-button"
                />
              </Link>
            );
          })}
        </Layout>
      </Layout>

      <Layout direction="column" className="app-content" style={{ flex: 1, padding: '32px 40px' }}>
        <Outlet />
      </Layout>
    </Layout>
  );
}
