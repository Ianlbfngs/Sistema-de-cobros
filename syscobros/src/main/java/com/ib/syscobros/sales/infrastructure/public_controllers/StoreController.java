package com.ib.syscobros.sales.infrastructure.public_controllers;

import com.ib.syscobros.sales.application.StoreService;
import com.ib.syscobros.sales.domain.store.Store;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private static final Logger logger = LoggerFactory.getLogger(StoreController.class);

    private final StoreService storeService;

    @Autowired
    public StoreController(StoreService storeService){
        this.storeService = storeService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllPaymentMethods () {
        List<Store> result = storeService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtainPaymentMethod (@PathVariable int id) {
        try{
            Optional<Store> result = storeService.findStoreById(id);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the store with id {}: {}", id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }


}
