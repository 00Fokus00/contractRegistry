import { http } from './http';

export function fetchLots(filters) {
  const params = {};
  if (filters.lotName) params.lotName = filters.lotName;
  if (filters.customerCode) params.customerCode = filters.customerCode;
  if (filters.priceFrom !== '' && filters.priceFrom !== undefined) params.priceFrom = filters.priceFrom;
  if (filters.priceTo !== '' && filters.priceTo !== undefined) params.priceTo = filters.priceTo;
  if (filters.currency) params.currency = filters.currency;
  if (filters.ndsRate) params.ndsRate = filters.ndsRate;
  params.sort = filters.sort || 'lotName';
  params.order = filters.order || 'asc';
  return http.get('/api/lots', { params }).then((r) => r.data);
}

export function fetchLotByName(lotName) {
  return http.get(`/api/lots/${encodeURIComponent(lotName)}`).then((r) => r.data);
}

export function createLot(dto) {
  return http.post('/api/lots', dto).then((r) => r.data);
}

export function updateLot(lotName, dto) {
  return http.put(`/api/lots/${encodeURIComponent(lotName)}`, dto).then((r) => r.data);
}

export function deleteLot(lotName) {
  return http.delete(`/api/lots/${encodeURIComponent(lotName)}`);
}
