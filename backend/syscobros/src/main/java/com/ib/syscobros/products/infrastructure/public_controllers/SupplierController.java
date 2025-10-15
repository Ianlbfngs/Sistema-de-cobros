package com.ib.syscobros.products.infrastructure.public_controllers;

import com.ib.syscobros.products.application.SupplierService;
import com.ib.syscobros.products.domain.supplier.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private static final Logger logger = LoggerFactory.getLogger(SupplierController.class);

    private final SupplierService supplierService;

    @Autowired
    public SupplierController(SupplierService supplierService){
        this.supplierService = supplierService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllSuppliers () {
        List<Supplier> result = supplierService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainSupplier (@PathVariable int id) {
        try{
        Optional<Supplier> result = supplierService.findSupplierById(id);
        if(result.isEmpty()) return ResponseEntity.notFound().build();
        else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the supplier with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

}
