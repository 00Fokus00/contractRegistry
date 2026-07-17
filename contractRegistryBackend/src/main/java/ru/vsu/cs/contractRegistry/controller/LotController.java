package ru.vsu.cs.contractRegistry.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.vsu.cs.contractRegistry.dto.LotDTO;
import ru.vsu.cs.contractRegistry.service.LotService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/lots")
public class LotController {

    private final LotService lotService;

    public LotController(LotService lotService) {
        this.lotService = lotService;
    }

    @GetMapping
    public ResponseEntity<List<LotDTO>> getAllLots(
            @RequestParam(required = false) String lotName,
            @RequestParam(required = false) String customerCode,
            @RequestParam(required = false) BigDecimal priceFrom,
            @RequestParam(required = false) BigDecimal priceTo,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String ndsRate,
            @RequestParam(defaultValue = "lotName") String sort,
            @RequestParam(defaultValue = "asc") String order) {

        List<LotDTO> lots = lotService.findAll(
                lotName, customerCode, priceFrom, priceTo, currency, ndsRate, sort, order
        );
        return ResponseEntity.ok(lots);
    }

    @GetMapping("/{lotName}")
    public ResponseEntity<LotDTO> getLotByLotName(@PathVariable String lotName) {
        LotDTO lot = lotService.findByLotName(lotName);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lot);
    }

    @PostMapping
    public ResponseEntity<?> createLot(@RequestBody LotDTO lotDTO) {
        try {
            LotDTO created = lotService.create(lotDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{lotName}")
    public ResponseEntity<?> updateLot(
            @PathVariable String lotName,
            @RequestBody LotDTO lotDTO) {
        try {
            LotDTO updated = lotService.update(lotName, lotDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("не найден")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{lotName}")
    public ResponseEntity<?> deleteLot(@PathVariable String lotName) {
        try {
            lotService.delete(lotName);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}