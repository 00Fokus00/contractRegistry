package ru.vsu.cs.contractRegistry.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.vsu.cs.contractRegistry.dto.CustomerDTO;
import ru.vsu.cs.contractRegistry.service.CustomerService;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String inn,
            @RequestParam(required = false) String kpp,
            @RequestParam(required = false) String mainCode,
            @RequestParam(required = false) String legalAddress,
            @RequestParam(required = false) String postalAddress,
            @RequestParam(required = false) Boolean isOrganization,
            @RequestParam(required = false) Boolean isPerson,
            @RequestParam(defaultValue = "customerName") String sort,
            @RequestParam(defaultValue = "asc") String order) {

        List<CustomerDTO> customers = customerService.findAll(
                name, inn, kpp, mainCode, legalAddress, postalAddress, isOrganization, isPerson, sort, order
        );
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{code}")
    public ResponseEntity<CustomerDTO> getCustomerByCode(@PathVariable String code) {
        CustomerDTO customer = customerService.findByCode(code);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO created = customerService.create(customerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{code}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable String code,
            @RequestBody CustomerDTO customerDTO) {
        try {
            CustomerDTO updated = customerService.update(code, customerDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("не найден")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String code) {
        try {
            customerService.delete(code);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
