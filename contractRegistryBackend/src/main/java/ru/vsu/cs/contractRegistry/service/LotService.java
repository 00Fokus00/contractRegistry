package ru.vsu.cs.contractRegistry.service;

import jooqdata.tables.records.LotRecord;
import org.jooq.DSLContext;
import org.jooq.SortField;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.vsu.cs.contractRegistry.dto.LotDTO;
import ru.vsu.cs.contractRegistry.mapper.LotMapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static jooqdata.tables.Customer.CUSTOMER;
import static jooqdata.tables.Lot.LOT;

@Service
public class LotService {

    private final DSLContext dsl;
    private final LotMapper mapper;

    public LotService(DSLContext dsl, LotMapper mapper) {
        this.dsl = dsl;
        this.mapper = mapper;
    }

    public List<LotDTO> findAll(String lotName, String customerCode, BigDecimal priceFrom, BigDecimal priceTo, String currency, String ndsRate, String sortField, String sortOrder) {
        var query = dsl.selectFrom(LOT);

        if (lotName != null && !lotName.isEmpty()) {
            query.where(LOT.LOT_NAME.containsIgnoreCase(lotName));
        }
        if (customerCode != null && !customerCode.isEmpty()) {
            query.where(LOT.CUSTOMER_CODE.eq(customerCode));
        }
        if (priceFrom != null) {
            query.where(LOT.PRICE.ge(priceFrom));
        }
        if (priceTo != null) {
            query.where(LOT.PRICE.le(priceTo));
        }
        if (currency != null && !currency.isEmpty()) {
            query.where(LOT.CURRENCY_CODE.eq(currency));
        }
        if (ndsRate != null && !ndsRate.isEmpty()) {
            query.where(LOT.NDS_RATE.eq(ndsRate));
        }

        if (sortField != null && !sortField.isEmpty()) {
            SortField<?> sort = getSortField(sortField, sortOrder);
            if (sort != null) {
                query.orderBy(sort);
            }
        }

        return query.fetch().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public LotDTO findByLotName(String lotName) {
        LotRecord record = dsl.selectFrom(LOT).where(LOT.LOT_NAME.eq(lotName)).fetchOne();
        return record != null ? mapper.toDto(record) : null;
    }

    @Transactional
    public LotDTO create(LotDTO dto) {
        LotRecord existing = dsl.selectFrom(LOT).where(LOT.LOT_NAME.eq(dto.getLotName())).fetchOne();
        if (existing != null) {
            throw new RuntimeException("Лот с названием '" + dto.getLotName() + "' уже существует");
        }

        if (dto.getCustomerCode() != null && !dto.getCustomerCode().isEmpty()) {
            boolean customerExists = dsl.fetchExists(dsl.selectFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(dto.getCustomerCode())));
            if (!customerExists) {
                throw new RuntimeException("Контрагент с кодом '" + dto.getCustomerCode() + "' не найден");
            }
        }

        LotRecord record = dsl.newRecord(LOT);
        mapper.toRecord(dto, record);
        record.store();
        return mapper.toDto(record);
    }

    @Transactional
    public LotDTO update(String lotName, LotDTO dto) {
        LotRecord record = dsl.selectFrom(LOT).where(LOT.LOT_NAME.eq(lotName)).fetchOne();
        if (record == null) {
            throw new RuntimeException("Лот с названием '" + lotName + "' не найден");
        }

        if (dto.getCustomerCode() != null && !dto.getCustomerCode().isEmpty()) {
            boolean customerExists = dsl.fetchExists(dsl.selectFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(dto.getCustomerCode())));
            if (!customerExists) {
                throw new RuntimeException("Контрагент с кодом '" + dto.getCustomerCode() + "' не найден");
            }
        }

        if (!lotName.equals(dto.getLotName())) {
            LotRecord existingWithNewName = dsl.selectFrom(LOT).where(LOT.LOT_NAME.eq(dto.getLotName())).fetchOne();
            if (existingWithNewName != null) {
                throw new RuntimeException("Лот с названием '" + dto.getLotName() + "' уже существует");
            }
        }

        mapper.toRecord(dto, record);
        record.update();
        return mapper.toDto(record);
    }

    @Transactional
    public void delete(String lotName) {
        int deleted = dsl.deleteFrom(LOT).where(LOT.LOT_NAME.eq(lotName)).execute();
        if (deleted == 0) {
            throw new RuntimeException("Лот с названием '" + lotName + "' не найден");
        }
    }

    private SortField<?> getSortField(String field, String order) {
        if (field == null) return null;
        boolean asc = order == null || !order.equalsIgnoreCase("desc");
        return switch (field) {
            case "lotName" -> asc ? LOT.LOT_NAME.asc() : LOT.LOT_NAME.desc();
            case "customerCode" -> asc ? LOT.CUSTOMER_CODE.asc() : LOT.CUSTOMER_CODE.desc();
            case "price" -> asc ? LOT.PRICE.asc() : LOT.PRICE.desc();
            case "currencyCode" -> asc ? LOT.CURRENCY_CODE.asc() : LOT.CURRENCY_CODE.desc();
            case "ndsRate" -> asc ? LOT.NDS_RATE.asc() : LOT.NDS_RATE.desc();
            case "placeDelivery" -> asc ? LOT.PLACE_DELIVERY.asc() : LOT.PLACE_DELIVERY.desc();
            case "dateDelivery" -> asc ? LOT.DATE_DELIVERY.asc() : LOT.DATE_DELIVERY.desc();
            default -> null;
        };
    }
}