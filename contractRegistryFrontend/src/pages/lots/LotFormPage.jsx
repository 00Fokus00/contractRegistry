import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { fetchLotByName, createLot, updateLot } from '../../api/lots';
import { fetchCustomers } from '../../api/customers';
import { extractErrorMessage } from '../../api/http';
import { CURRENCY_OPTIONS, NDS_RATE_OPTIONS } from '../../constants/lotOptions';

const EMPTY = {
  lotName: '',
  customerCode: '',
  price: '',
  currencyCode: '',
  ndsRate: '',
  placeDelivery: '',
  dateDelivery: '',
};

function toInputDateTime(value) {
  if (!value) return '';
  return value.slice(0, 16);
}

export default function LotFormPage({ mode }) {
  const { lotName: lotNameParam } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState(EMPTY);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers({ sort: 'customerName', order: 'asc' })
      .then(setCustomers)
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    fetchLotByName(lotNameParam)
      .then((data) =>
        setForm({
          ...data,
          price: data.price ?? '',
          dateDelivery: toInputDateTime(data.dateDelivery),
        })
      )
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось загрузить лот')))
      .finally(() => setLoading(false));
  }, [isEdit, lotNameParam]);

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      price: form.price === '' ? null : Number(form.price),
      dateDelivery: form.dateDelivery ? `${form.dateDelivery}:00` : null,
    };

    const action = isEdit ? updateLot(lotNameParam, payload) : createLot(payload);
    action
      .then(() => navigate('/lots'))
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось сохранить лот')))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="loading-state">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>{isEdit ? 'Изменение лота' : 'Новый лот'}</h2>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Название лота *</label>
            <input type="text" value={form.lotName} onChange={setField('lotName')} required />
          </div>
          <div className="field">
            <label>Контрагент</label>
            <select value={form.customerCode || ''} onChange={setField('customerCode')}>
              <option value="">Не выбран</option>
              {customers.map((c) => (
                <option key={c.customerCode} value={c.customerCode}>
                  {c.customerCode} — {c.customerName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Цена</label>
            <input type="number" value={form.price} onChange={setField('price')} step="0.01" />
          </div>
          <div className="field">
            <label>Валюта</label>
            <select value={form.currencyCode || ''} onChange={setField('currencyCode')}>
              <option value="">Не выбрана</option>
              {CURRENCY_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Ставка НДС</label>
            <select value={form.ndsRate || ''} onChange={setField('ndsRate')}>
              <option value="">Не выбрана</option>
              {NDS_RATE_OPTIONS.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Место поставки</label>
            <input type="text" value={form.placeDelivery} onChange={setField('placeDelivery')} />
          </div>
          <div className="field">
            <label>Дата и время поставки</label>
            <input
              type="datetime-local"
              value={form.dateDelivery || ''}
              onChange={setField('dateDelivery')}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button label={isEdit ? 'Сохранить' : 'Создать'} view="primary" type="submit" loading={saving} />
          <Link to="/lots">
            <Button label="Отмена" view="ghost" type="button" />
          </Link>
        </div>
      </form>
    </div>
  );
}
