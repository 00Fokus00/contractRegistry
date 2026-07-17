package ru.vsu.cs.contractRegistry.dto;

import lombok.*;

@Data
public class CustomerDTO {

    private String customerCode;
    private String customerName;
    private String customerInn;
    private String customerKpp;
    private String customerLegalAddress;
    private String customerPostalAddress;
    private String customerEmail;
    private String customerCodeMain;
    private Boolean isOrganization;
    private Boolean isPerson;

    public CustomerDTO() {}

    public CustomerDTO(String customerCode, String customerName, String customerInn, String customerKpp, String customerLegalAddress, String customerPostalAddress, String customerEmail, String customerCodeMain, Boolean isOrganization, Boolean isPerson) {
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.customerInn = customerInn;
        this.customerKpp = customerKpp;
        this.customerLegalAddress = customerLegalAddress;
        this.customerPostalAddress = customerPostalAddress;
        this.customerEmail = customerEmail;
        this.customerCodeMain = customerCodeMain;
        this.isOrganization = isOrganization;
        this.isPerson = isPerson;
    }
}
