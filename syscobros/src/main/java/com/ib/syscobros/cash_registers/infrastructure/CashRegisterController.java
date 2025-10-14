package com.ib.syscobros.cash_registers.infrastructure;

import com.ib.syscobros.cash_registers.application.CashRegisterService;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegister;
import com.ib.syscobros.cash_registers.domain.cash_register.CashRegisterResponseStatus;
import com.ib.syscobros.response.GenericResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cashRegisters")
public class CashRegisterController {
    private static final Logger logger = LoggerFactory.getLogger(CashRegisterController.class);

    private final CashRegisterService cashRegisterService;

    @Autowired
    public CashRegisterController(CashRegisterService cashRegisterService) {
        this.cashRegisterService = cashRegisterService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllCashRegisters () {
        List<CashRegister> result = cashRegisterService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/all/open")
    public ResponseEntity<?> obtainAllOpenCashRegisters () {
        List<CashRegister> result = cashRegisterService.findAllOpen();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/all/{storeId}")
    public ResponseEntity<?> obtainAllCashRegistersByStore (@PathVariable int storeId) {
        List<CashRegister> result = cashRegisterService.findAllByStore(storeId);
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/open/{storeId}")
    public ResponseEntity<?> obtainOpenCashRegisterByStore (@PathVariable int storeId) {
        try{
            Long result = cashRegisterService.findOpenCashRegisterByStore(storeId);
            if(result == null) return ResponseEntity.noContent().build();
            else return ResponseEntity.ok(Map.of("id", result));
        }catch(Exception e){
            logger.error("Error obtaining an open cash register with store id {}: {}", storeId, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainCashRegister (@PathVariable Long id) {
        try{
            Optional<CashRegister> result = cashRegisterService.findCashRegisterById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the cash register with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    /*
    @GetMapping("/audit/{id}")
    public ResponseEntity<?> auditCashRegister (@PathVariable Long id) {
        try{
            GenericResponse<CashRegisterResponseStatus.audit, BigDecimal> result = cashRegisterService.auditCashRegister(id);
            return switch (result.status()){
                case CORRECT -> ResponseEntity.ok(result.status());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case CASH_REGISTER_IS_OPEN -> ResponseEntity.badRequest().body(Map.of("error","La caja con id "+id+" esta abierta"));
                case DISCREPANCY_LOWER -> ResponseEntity.ok().body(Map.of("discrepancia","Se encontro una discrepancia entre la cantidad de dinero en la caja declarada a la hora de cierre y el calculo de los movimientos de la caja","montoDeCierreReal",result.data()));
                case DISCREPANCY_HIGHER -> ResponseEntity.ok().body(Map.of("discrepancia","Se encontro una discrepancia entre la cantidad de dinero en la caja declarada a la hora de cierre y el calculo de los movimientos de la caja","montoDeCierreReal",result.data()));

            };
        }catch(Exception e){
            logger.error("Error auditing the cash register with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }
    */
    @PostMapping("/open/{storeId}")
    public ResponseEntity<?> openCashRegister(@RequestBody CashRegister cashRegister, @PathVariable int storeId){
        try{
            cashRegister.getStore().setId(storeId);
            GenericResponse<CashRegisterResponseStatus.open,CashRegister> result = cashRegisterService.openCashRegister(cashRegister);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case THERE_IS_A_CASH_REGISTER_OPEN -> ResponseEntity.badRequest().body(Map.of("error","No se puede abrir una caja nueva si la caja anterior todavia esta abierta en el local con id: "+storeId));
            };

        }catch(Exception e){
            logger.error("Error opening the cash register :{}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PostMapping("/close/{storeId}")
    public ResponseEntity<?> closeCashRegister(@RequestBody BigDecimal closeAmount, @PathVariable int storeId){
        try{
            GenericResponse<CashRegisterResponseStatus.close,CashRegister> result = cashRegisterService.closeCashRegister(closeAmount,storeId);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NO_CASH_REGISTER_OPEN -> ResponseEntity.badRequest().body(Map.of("error","No hay caja abiertas, en el local con id: "+storeId));
            };

        }catch(Exception e){
            logger.error("Error opening the cash register :{}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }



}