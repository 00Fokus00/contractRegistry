package ru.vsu.cs.contractRegistry.service;

import jooqdata.tables.records.CustomerRecord;
import org.jooq.DSLContext;
import org.jooq.SortField;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.vsu.cs.contractRegistry.dto.CustomerDTO;
import ru.vsu.cs.contractRegistry.mapper.CustomerMapper;

import java.util.List;
import java.util.stream.Collectors;

import static jooqdata.tables.Customer.CUSTOMER;

@Service
public class CustomerService {

    private final DSLContext dsl;
    private final CustomerMapper mapper;

    public CustomerService(DSLContext dsl, CustomerMapper mapper) {
        this.dsl = dsl;
        this.mapper = mapper;
    }

    public List<CustomerDTO> findAll(String name, String inn, String kpp, String mainCode, String legalAddress, String postalAddress, Boolean isOrg, Boolean isPerson, String sortField, String sortOrder) {
        var query = dsl.selectFrom(CUSTOMER);

        if (name != null && !name.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_NAME.containsIgnoreCase(name));
        }
        if (inn != null && !inn.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_INN.eq(inn));
        }
        if (kpp != null && !kpp.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_KPP.eq(kpp));
        }
        if (mainCode != null && !mainCode.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_CODE_MAIN.eq(mainCode));
        }
        if (legalAddress != null && !legalAddress.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_LEGAL_ADDRESS.containsIgnoreCase(legalAddress));
        }
        if (postalAddress != null && !postalAddress.isEmpty()) {
            query.where(CUSTOMER.CUSTOMER_POSTAL_ADDRESS.containsIgnoreCase(postalAddress));
        }
        if (isOrg != null) {
            query.where(CUSTOMER.IS_ORGANIZATION.eq(isOrg));
        }
        if (isPerson != null) {
            query.where(CUSTOMER.IS_PERSON.eq(isPerson));
        }

        if (sortField != null && !sortField.isEmpty()) {
            SortField<?> sort = getSortField(sortField, sortOrder);
            if (sort != null) {
                query.orderBy(sort);
            }
        }

        return query.fetch().stream().map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public CustomerDTO findByCode(String code) {
        CustomerRecord record = dsl.selectFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(code)).fetchOne();
        return record != null ? mapper.toDto(record) : null;
    }

    @Transactional
    public CustomerDTO create(CustomerDTO dto) {
        CustomerRecord record = dsl.newRecord(CUSTOMER);
        mapper.toRecord(dto, record);
        record.store();
        return mapper.toDto(record);
    }

    @Transactional
    public CustomerDTO update(String code, CustomerDTO dto) {
        CustomerRecord record = dsl.selectFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(code)).fetchOne();
        if (record == null) {
            throw new RuntimeException("Контрагент не найден");
        }
        mapper.toRecord(dto, record);
        record.update();
        return mapper.toDto(record);
    }

    @Transactional
    public void delete(String code) {
        dsl.deleteFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(code)).execute();
    }

    private SortField<?> getSortField(String field, String order) {
        if (field == null) return null;
        boolean asc = order == null || !order.equalsIgnoreCase("desc");
        return switch (field) {
            case "customerCode" -> asc ? CUSTOMER.CUSTOMER_CODE.asc() : CUSTOMER.CUSTOMER_CODE.desc();
            case "customerName" -> asc ? CUSTOMER.CUSTOMER_NAME.asc() : CUSTOMER.CUSTOMER_NAME.desc();
            case "customerInn" -> asc ? CUSTOMER.CUSTOMER_INN.asc() : CUSTOMER.CUSTOMER_INN.desc();
            case "customerKpp" -> asc ? CUSTOMER.CUSTOMER_KPP.asc() : CUSTOMER.CUSTOMER_KPP.desc();
            case "customerLegalAddress" -> asc ? CUSTOMER.CUSTOMER_LEGAL_ADDRESS.asc() : CUSTOMER.CUSTOMER_LEGAL_ADDRESS.desc();
            case "customerPostalAddress" -> asc ? CUSTOMER.CUSTOMER_POSTAL_ADDRESS.asc() : CUSTOMER.CUSTOMER_POSTAL_ADDRESS.desc();
            case "customerEmail" -> asc ? CUSTOMER.CUSTOMER_EMAIL.asc() : CUSTOMER.CUSTOMER_EMAIL.desc();
            case "customerCodeMain" -> asc ? CUSTOMER.CUSTOMER_CODE_MAIN.asc() : CUSTOMER.CUSTOMER_CODE_MAIN.desc();
            default -> null;
        };
    }
}
