import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { fetchCustomerByCode, fetchCustomers, createCustomer, updateCustomer } from '../../api/customers';
import { extractErrorMessage } from '../../api/http';

const EMPTY = {
  customerCode: '',
  customerName: '',
  customerInn: '',
  customerKpp: '',
  customerLegalAddress: '',
  customerPostalAddress: '',
  customerEmail: '',
  customerCodeMain: '',
  isOrganization: false,
  isPerson: false,
};

export default function CustomerFormPage({ mode }) {
  const { code } = useParams();
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
    fetchCustomerByCode(code)
      .then((data) => setForm(data))
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось загрузить контрагента')))
      .finally(() => setLoading(false));
  }, [isEdit, code]);

  const setField = (field) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const setCheckbox = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const action = isEdit ? updateCustomer(code, form) : createCustomer(form);
    action
      .then(() => navigate('/customers'))
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось сохранить контрагента')))
      .finally(() => setSaving(false));
  };

  const mainCodeOptions = customers.filter((c) => c.customerCode !== code);

  if (loading) return <div className="loading-state">Загрузка...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>{isEdit ? 'Изменение контрагента' : 'Новый контрагент'}</h2>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Код контрагента *</label>
            <input
              type="text"
              value={form.customerCode}
              onChange={setField('customerCode')}
              disabled={isEdit}
              required
            />
          </div>
          <div className="field">
            <label>Наименование *</label>
            <input type="text" value={form.customerName} onChange={setField('customerName')} required />
          </div>
          <div className="field">
            <label>ИНН</label>
            <input type="text" value={form.customerInn} onChange={setField('customerInn')} />
          </div>
          <div className="field">
            <label>КПП</label>
            <input type="text" value={form.customerKpp} onChange={setField('customerKpp')} />
          </div>
          <div className="field field-full">
            <label>Юридический адрес</label>
            <input type="text" value={form.customerLegalAddress} onChange={setField('customerLegalAddress')} />
          </div>
          <div className="field field-full">
            <label>Почтовый адрес</label>
            <input type="text" value={form.customerPostalAddress} onChange={setField('customerPostalAddress')} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="text" value={form.customerEmail} onChange={setField('customerEmail')} />
          </div>
          <div className="field">
            <label>Код головной организации</label>
            <select value={form.customerCodeMain || ''} onChange={setField('customerCodeMain')}>
              <option value="">Не выбран</option>
              {mainCodeOptions.map((c) => (
                <option key={c.customerCode} value={c.customerCode}>
                  {c.customerCode} — {c.customerName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="checkbox-row">
              <input type="checkbox" checked={!!form.isOrganization} onChange={setCheckbox('isOrganization')} />
              Является организацией
            </label>
          </div>
          <div className="field">
            <label className="checkbox-row">
              <input type="checkbox" checked={!!form.isPerson} onChange={setCheckbox('isPerson')} />
              Является физическим лицом
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Button label={isEdit ? 'Сохранить' : 'Создать'} view="primary" type="submit" loading={saving} />
          <Link to="/customers">
            <Button label="Отмена" view="ghost" type="button" />
          </Link>
        </div>
      </form>
    </div>
  );
}
