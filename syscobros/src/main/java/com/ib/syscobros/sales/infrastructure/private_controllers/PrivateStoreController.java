package com.ib.syscobros.sales.infrastructure.private_controllers;

import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.sales.application.StoreService;
import com.ib.syscobros.sales.domain.store.Store;
import com.ib.syscobros.sales.domain.store.StoreResponseStatuses;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stores")
public class PrivateStoreController {
    private static final Logger logger = LoggerFactory.getLogger(PrivateStoreController.class);

    private final StoreService storeService;

    @Autowired
    public PrivateStoreController(StoreService storeService){
        this.storeService = storeService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addStore (@RequestBody @Valid Store store) {
        try{
            GenericResponse<StoreResponseStatuses.add,Store> result = storeService.addStore(store);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NAME_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","el nombre de local '"+store.getName()+"' esta en uso"));
                case ADDRESS_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","la direccion de local '"+store.getAddress()+"' esta en uso"));
            };
        }catch(Exception e){
            logger.error("Error adding the store: {}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStore (@PathVariable int id,@RequestBody @Valid Store store) {
        try{
            GenericResponse<StoreResponseStatuses.update, Store> result = storeService.updateStore(id,store);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case NAME_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","el nombre de local '"+store.getName()+"' esta en uso"));
                case ADDRESS_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","la direccion de local '"+store.getAddress()+"' esta en uso"));
            };
        }catch(Exception e){
            logger.error("Error updating the store with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> softDeleteStore (@PathVariable int id) {
        try{
            GenericResponse<StoreResponseStatuses.softDelete,Store> result = storeService.softDeleteStore(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case ALREADY_SOFT_DELETED -> ResponseEntity.badRequest().body(Map.of("error","El local ya se encuentra suspendido"));
            };
        }catch(Exception e){
            logger.error("Error soft deleting the store with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> hardDeleteStore (@PathVariable int id) {
        try{
            GenericResponse<StoreResponseStatuses.hardDelete,Store> result = storeService.hardDeleteStore(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case STORE_IS_BEING_REFERENCED -> ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","El local esta siendo referenciado por otra tabla en la base de datos"));
            };
        }catch(Exception e){
            logger.error("Error hard deleting the store with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }
}
