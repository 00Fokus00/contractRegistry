import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';

const SECTIONS = [
  {
    to: '/customers',
    title: 'Контрагенты',
    description:
      'Организации и физические лица: реквизиты, ИНН/КПП, адреса и контакты.',
    action: 'Перейти к списку контрагентов',
  },
  {
    to: '/lots',
    title: 'Лоты',
    description:
      'Позиции договоров: цена, валюта, ставка НДС, место и дата поставки.',
    action: 'Перейти к списку лотов',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Text as="h2" size="2xl" weight="bold" style={{ marginBottom: 12 }}>
        Реестр договоров
      </Text>
      <Text as="p" size="m" view="secondary" style={{ maxWidth: 640, marginBottom: 32 }}>
        Веб-приложение для ведения справочников «Контрагенты» и «Лоты». Данные
        читаются и изменяются через REST API бэкенд-приложения (Spring Boot +
        JOOQ + PostgreSQL).
      </Text>

      <Layout direction="row" style={{ gap: 20, flexWrap: 'wrap' }}>
        {SECTIONS.map((section) => (
          <Layout key={section.to} direction="column" className="home-card">
            <Text as="h3" size="l" weight="bold" style={{ marginBottom: 8 }}>
              {section.title}
            </Text>
            <Text as="p" size="s" view="secondary" style={{ marginBottom: 20, flexGrow: 1 }}>
              {section.description}
            </Text>
            <Button
              label={section.action}
              view="primary"
              width="full"
              onClick={() => navigate(section.to)}
            />
          </Layout>
        ))}
      </Layout>
    </div>
  );
}
