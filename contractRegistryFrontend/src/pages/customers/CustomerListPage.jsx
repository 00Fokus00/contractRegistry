import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import DataTable from '../../components/DataTable.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { fetchCustomers, deleteCustomer } from '../../api/customers';
import { extractErrorMessage } from '../../api/http';

const EMPTY_FILTERS = {
  name: '',
  inn: '',
  kpp: '',
  mainCode: '',
  legalAddress: '',
  postalAddress: '',
  isOrganization: '',
  isPerson: '',
};

const columns = [
  { key: 'customerCode', label: 'Код', sortable: true },
  { key: 'customerName', label: 'Наименование', sortable: true },
  { key: 'customerInn', label: 'ИНН', sortable: true },
  { key: 'customerKpp', label: 'КПП', sortable: true },
  { key: 'customerLegalAddress', label: 'Юридический адрес', sortable: true },
  { key: 'customerPostalAddress', label: 'Почтовый адрес', sortable: true },
  { key: 'customerEmail', label: 'Email', sortable: true },
  { key: 'customerCodeMain', label: 'Код головной организации', sortable: true },
  {
    key: 'isOrganization',
    label: 'Организация',
    render: (row) => (row.isOrganization ? 'Да' : 'Нет'),
  },
  {
    key: 'isPerson',
    label: 'Физ. лицо',
    render: (row) => (row.isPerson ? 'Да' : 'Нет'),
  },
];

export default function CustomerListPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('customerName');
  const [order, setOrder] = useState('asc');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    fetchCustomers({ ...filters, sort, order })
      .then(setRows)
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось загрузить список контрагентов')))
      .finally(() => setLoading(false));
  }, [filters, sort, order]);

  useEffect(() => {
    load();
  }, [sort, order]);

  const handleFilterChange = (field) => (e) => {
    setFilters((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleTriStateChange = (field) => (e) => {
    setFilters((f) => ({ ...f, [field]: e.target.value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    load();
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setTimeout(load, 0);
  };

  const handleSortChange = (key) => {
    if (sort === key) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(key);
      setOrder('asc');
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setDeleting(true);
    deleteCustomer(toDelete.customerCode)
      .then(() => {
        setToDelete(null);
        load();
      })
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось удалить контрагента')))
      .finally(() => setDeleting(false));
  };

  return (
    <div>
      <div className="page-header">
        <h2>Контрагенты</h2>
        <Link to="/customers/new">
          <Button label="Добавить контрагента" view="primary" />
        </Link>
      </div>

      <form className="filters-panel" onSubmit={applyFilters}>
        <div className="field">
          <label>Наименование</label>
          <input type="text" value={filters.name} onChange={handleFilterChange('name')} placeholder="Поиск по названию" />
        </div>
        <div className="field">
          <label>ИНН</label>
          <input type="text" value={filters.inn} onChange={handleFilterChange('inn')} />
        </div>
        <div className="field">
          <label>КПП</label>
          <input type="text" value={filters.kpp} onChange={handleFilterChange('kpp')} />
        </div>
        <div className="field">
          <label>Основной код (головная организация)</label>
          <input type="text" value={filters.mainCode} onChange={handleFilterChange('mainCode')} />
        </div>
        <div className="field">
          <label>Юридический адрес</label>
          <input type="text" value={filters.legalAddress} onChange={handleFilterChange('legalAddress')} />
        </div>
        <div className="field">
          <label>Почтовый адрес</label>
          <input type="text" value={filters.postalAddress} onChange={handleFilterChange('postalAddress')} />
        </div>
        <div className="field">
          <label>Организация</label>
          <select value={filters.isOrganization} onChange={handleTriStateChange('isOrganization')}>
            <option value="">Все</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
        <div className="field">
          <label>Физическое лицо</label>
          <select value={filters.isPerson} onChange={handleTriStateChange('isPerson')}>
            <option value="">Все</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
        <div className="filters-actions">
          <Button label="Найти" view="primary" type="submit" />
          <Button label="Сбросить" view="ghost" type="button" onClick={resetFilters} />
        </div>
      </form>

      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <div className="loading-state">Загрузка...</div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          sortField={sort}
          sortOrder={order}
          onSortChange={handleSortChange}
          getRowKey={(row) => row.customerCode}
          actions={(row) => (
            <>
              <Link to={`/customers/${encodeURIComponent(row.customerCode)}/edit`}>
                <Button label="Изменить" view="secondary" size="s" />
              </Link>
              <Button
                label="Удалить"
                view="secondary"
                size="s"
                onClick={() => setToDelete(row)}
              />
            </>
          )}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Удаление контрагента"
        description={toDelete ? `Удалить контрагента «${toDelete.customerName}» (код ${toDelete.customerCode})?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
