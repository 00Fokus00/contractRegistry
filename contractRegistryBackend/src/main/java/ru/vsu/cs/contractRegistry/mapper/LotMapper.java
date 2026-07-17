package ru.vsu.cs.contractRegistry.mapper;

import jooqdata.tables.records.LotRecord;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import ru.vsu.cs.contractRegistry.dto.LotDTO;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface LotMapper {

    LotDTO toDto(LotRecord lotRecord);

    void toRecord(LotDTO dto, @MappingTarget LotRecord lotRecord);
}
