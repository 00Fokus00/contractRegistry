import { http } from './http';

export function fetchCustomers(filters) {
  const params = {};
  if (filters.name) params.name = filters.name;
  if (filters.inn) params.inn = filters.inn;
  if (filters.kpp) params.kpp = filters.kpp;
  if (filters.mainCode) params.mainCode = filters.mainCode;
  if (filters.legalAddress) params.legalAddress = filters.legalAddress;
  if (filters.postalAddress) params.postalAddress = filters.postalAddress;
  if (filters.isOrganization !== undefined && filters.isOrganization !== '') {
    params.isOrganization = filters.isOrganization;
  }
  if (filters.isPerson !== undefined && filters.isPerson !== '') {
    params.isPerson = filters.isPerson;
  }
  params.sort = filters.sort || 'customerName';
  params.order = filters.order || 'asc';
  return http.get('/api/customers', { params }).then((r) => r.data);
}

export function fetchCustomerByCode(code) {
  return http.get(`/api/customers/${encodeURIComponent(code)}`).then((r) => r.data);
}

export function createCustomer(dto) {
  return http.post('/api/customers', dto).then((r) => r.data);
}

export function updateCustomer(code, dto) {
  return http.put(`/api/customers/${encodeURIComponent(code)}`, dto).then((r) => r.data);
}

export function deleteCustomer(code) {
  return http.delete(`/api/customers/${encodeURIComponent(code)}`);
}
