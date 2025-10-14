package com.ib.syscobros.sales.infrastructure.public_controllers;

import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.sales.application.SaleService;
import com.ib.syscobros.sales.domain.sale.Sale;
import com.ib.syscobros.sales.domain.sale.SaleStatus;
import com.ib.syscobros.sales.domain.sale.SaleResponseStatuses;
import com.ib.syscobros.sales.domain.sale.SaleWithStoreName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales")
public class SaleController {
    private static final Logger logger = LoggerFactory.getLogger(SaleController.class);

    private final SaleService saleService;

    @Autowired
    public SaleController(SaleService saleService){
        this.saleService = saleService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllSales () {
        List<SaleWithStoreName> result = saleService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }


    @GetMapping("/all/status")
    public ResponseEntity<?> obtainAllSalesByStatus (@RequestBody Map<String,String> statusMap) {
        try{
            SaleStatus status = SaleStatus.valueOf(statusMap.get("status"));
            List<Sale> result = saleService.findAllByStatus(status);
            if(result.isEmpty()) return ResponseEntity.noContent().build();
            else return ResponseEntity.ok(result);
        }catch(IllegalArgumentException e){
            logger.error("Error converting the status {}: {}",statusMap.get("status"),e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainSale (@PathVariable Long id) {
        try{
            Optional<Sale> result = saleService.findSaleById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the sale with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    private ResponseEntity<?> addSale (Sale sale){
        try{
            Sale result = saleService.addSale(sale);
            return ResponseEntity.ok(result);

        }catch(Exception e){
            logger.error("Error adding the sale: {}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PostMapping("/add/pending")
    public ResponseEntity<?> addPendingSale (@RequestBody Sale sale) {
        sale.setStatus(SaleStatus.PENDIENTE);
        return addSale(sale);
    }

    @PostMapping("/add/billed")
    public ResponseEntity<?> addBilledSale (@RequestBody Sale sale) {
        sale.setStatus(SaleStatus.FACTURADA);
        return addSale(sale);
    }



    @PutMapping("/update/{id}/status")
    public ResponseEntity<?> updateSaleStatus(@PathVariable Long id, @RequestBody Map<String,String> statusMap) {
        SaleStatus status = SaleStatus.valueOf(statusMap.get("status"));
        if(status.equals(SaleStatus.PENDIENTE)) return ResponseEntity.badRequest().body(Map.of("error","no se puede marcar una venta como pendiente de forma manual")); //it shouldn't ever happen
        try{
            GenericResponse<SaleResponseStatuses.updateStatus, Sale> result = saleService.updateStatus(id,status);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case ONLY_PENDING_SALES -> ResponseEntity.badRequest().body(Map.of("error","solo se puede actualizar el estado de las ventas pendientes"));
            };
        }catch(Exception e){
            logger.error("Error updating the status of the sale with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }



}
