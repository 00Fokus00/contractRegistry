package ru.vsu.cs.contractRegistry.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LotDTO {

    private String lotName;
    private String customerCode;
    private BigDecimal price;
    private String currencyCode;
    private String ndsRate;
    private String placeDelivery;
    private LocalDateTime dateDelivery;

    public LotDTO() {}

    public LotDTO(String lotName, String customerCode, BigDecimal price, String currencyCode, String ndsRate, String placeDelivery, LocalDateTime dateDelivery) {
        this.lotName = lotName;
        this.customerCode = customerCode;
        this.price = price;
        this.currencyCode = currencyCode;
        this.ndsRate = ndsRate;
        this.placeDelivery = placeDelivery;
        this.dateDelivery = dateDelivery;
    }
}
