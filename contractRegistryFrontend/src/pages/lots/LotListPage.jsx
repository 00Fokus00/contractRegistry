import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import DataTable from '../../components/DataTable.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { fetchLots, deleteLot } from '../../api/lots';
import { extractErrorMessage } from '../../api/http';
import { CURRENCY_OPTIONS, NDS_RATE_OPTIONS } from '../../constants/lotOptions';

const EMPTY_FILTERS = {
  lotName: '',
  customerCode: '',
  priceFrom: '',
  priceTo: '',
  currency: '',
  ndsRate: '',
};

function formatDateTime(value) {
  if (!value) return '';
  return value.replace('T', ' ').slice(0, 16);
}

const columns = [
  { key: 'lotName', label: 'Название лота', sortable: true },
  { key: 'customerCode', label: 'Код контрагента', sortable: true },
  { key: 'price', label: 'Цена', sortable: true },
  { key: 'currencyCode', label: 'Валюта', sortable: true },
  { key: 'ndsRate', label: 'Ставка НДС', sortable: true },
  { key: 'placeDelivery', label: 'Место поставки', sortable: true },
  {
    key: 'dateDelivery',
    label: 'Дата поставки',
    sortable: true,
    render: (row) => formatDateTime(row.dateDelivery),
  },
];

export default function LotListPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('lotName');
  const [order, setOrder] = useState('asc');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    fetchLots({ ...filters, sort, order })
      .then(setRows)
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось загрузить список лотов')))
      .finally(() => setLoading(false));
  }, [filters, sort, order]);

  useEffect(() => {
    load();
  }, [sort, order]);

  const handleFilterChange = (field) => (e) => {
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
    deleteLot(toDelete.lotName)
      .then(() => {
        setToDelete(null);
        load();
      })
      .catch((e) => setError(extractErrorMessage(e, 'Не удалось удалить лот')))
      .finally(() => setDeleting(false));
  };

  return (
    <div>
      <div className="page-header">
        <h2>Лоты</h2>
        <Link to="/lots/new">
          <Button label="Добавить лот" view="primary" />
        </Link>
      </div>

      <form className="filters-panel" onSubmit={applyFilters}>
        <div className="field">
          <label>Название лота</label>
          <input type="text" value={filters.lotName} onChange={handleFilterChange('lotName')} />
        </div>
        <div className="field">
          <label>Код контрагента</label>
          <input type="text" value={filters.customerCode} onChange={handleFilterChange('customerCode')} />
        </div>
        <div className="field">
          <label>Цена от</label>
          <input type="number" value={filters.priceFrom} onChange={handleFilterChange('priceFrom')} />
        </div>
        <div className="field">
          <label>Цена до</label>
          <input type="number" value={filters.priceTo} onChange={handleFilterChange('priceTo')} />
        </div>
        <div className="field">
          <label>Валюта</label>
          <select value={filters.currency} onChange={handleFilterChange('currency')}>
            <option value="">Все</option>
            {CURRENCY_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Ставка НДС</label>
          <select value={filters.ndsRate} onChange={handleFilterChange('ndsRate')}>
            <option value="">Все</option>
            {NDS_RATE_OPTIONS.map((rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            ))}
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
          getRowKey={(row) => row.lotName}
          actions={(row) => (
            <>
              <Link to={`/lots/${encodeURIComponent(row.lotName)}/edit`}>
                <Button label="Изменить" view="secondary" size="s" />
              </Link>
              <Button label="Удалить" view="secondary" size="s" onClick={() => setToDelete(row)} />
            </>
          )}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Удаление лота"
        description={toDelete ? `Удалить лот «${toDelete.lotName}»?` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
