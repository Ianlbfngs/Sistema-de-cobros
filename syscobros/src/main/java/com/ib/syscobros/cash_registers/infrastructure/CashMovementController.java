package com.ib.syscobros.cash_registers.infrastructure;

import com.ib.syscobros.cash_registers.application.CashMovementService;
import com.ib.syscobros.cash_registers.domain.cash_movement.CashMovement;
import com.ib.syscobros.cash_registers.domain.cash_movement.CashMovementResponseStatus;
import com.ib.syscobros.response.GenericResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cashMovements")
public class CashMovementController {
    private static final Logger logger = LoggerFactory.getLogger(CashMovementController.class);

    private final CashMovementService cashMovementService;

    @Autowired
    public CashMovementController(CashMovementService cashMovementService) {
        this.cashMovementService = cashMovementService;
    }

    /*
    @GetMapping("/all")         //commented because useless ¿under what motive it will be used?
    public ResponseEntity<?> obtainAllCashRegisters () {
        List<CashMovement> result = cashMovementService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }
   */

    @GetMapping("/all/{cashRegisterId}")
    public ResponseEntity<?> obtainAllCashMovementsByCashRegister (@PathVariable Long cashRegisterId) {
        List<CashMovement> result = cashMovementService.findAllByCashRegister(cashRegisterId);
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<?> obtainAllCashMovementsBySale (@PathVariable Long saleId) {
        List<CashMovement> result = cashMovementService.findAllBySale(saleId);
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainCashMovement (@PathVariable Long id) {
        try{
            Optional<CashMovement> result = cashMovementService.findCashMovementById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the cash movement with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCashMovement(@RequestBody CashMovement cashMovement){
        try{
            GenericResponse<CashMovementResponseStatus.add,CashMovement> result = cashMovementService.addCashMovement(cashMovement);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case CASH_REGISTER_NOT_FOUND -> ResponseEntity.badRequest().body(Map.of("error","No se encontro la caja con id "+cashMovement.getCashRegister().getId()));
                case SALE_NOT_FOUND -> ResponseEntity.badRequest().body(Map.of("error","No se encontro la venta con id "+cashMovement.getSale().getId()+" referenciada por el movimiento"));
                case CASH_REGISTER_IS_CLOSED -> ResponseEntity.badRequest().body(Map.of("error","La caja con id "+cashMovement.getCashRegister().getId()+" esta cerrada"));
            };

        }catch(Exception e){
            logger.error("Error adding the cash movement :{}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }


}