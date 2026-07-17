package ru.vsu.cs.contractRegistry.mapper;

import jooqdata.tables.records.CustomerRecord;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import ru.vsu.cs.contractRegistry.dto.CustomerDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CustomerMapper {

    CustomerDTO toDto(CustomerRecord customerRecord);

    void toRecord(CustomerDTO customerDTO, @MappingTarget CustomerRecord customerRecord);
}
