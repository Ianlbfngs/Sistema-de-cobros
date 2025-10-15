package com.ib.syscobros.products.infrastructure.private_controllers;

import com.ib.syscobros.products.application.SupplierService;
import com.ib.syscobros.products.domain.supplier.Supplier;
import com.ib.syscobros.products.domain.supplier.SupplierResponseStatuses;
import com.ib.syscobros.response.GenericResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/suppliers")
public class PrivateSupplierController {
    private static final Logger logger = LoggerFactory.getLogger(PrivateSupplierController.class);

    private final SupplierService supplierService;

    @Autowired
    public PrivateSupplierController(SupplierService supplierService){
        this.supplierService = supplierService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSupplier (@RequestBody @Valid Supplier supplier) {
        try{
            GenericResponse<SupplierResponseStatuses.add,Supplier> result = supplierService.addSupplier(supplier);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case CUIT_IN_USE ->  ResponseEntity.badRequest().body(Map.of("error","El CUIT '"+supplier.getCuit()+"' esta en uso"));
                case COMPANY_NAME_IN_USE ->  ResponseEntity.badRequest().body(Map.of("error","La razon social '"+supplier.getCompanyName()+"' esta en uso"));
            };
        } catch (NumberFormatException e) {
            logger.error("Error adding the supplier: {}", e.getMessage(),e);
            return ResponseEntity.badRequest().body("Format error: "+e.getMessage());
        }catch(Exception e){
            logger.error("Error adding the supplier: {}", e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSupplier (@PathVariable int id,@RequestBody @Valid Supplier supplier) {
        try{
            GenericResponse<SupplierResponseStatuses.update,Supplier> result = supplierService.updateSupplier(id,supplier);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case CUIT_IN_USE ->  ResponseEntity.badRequest().body(Map.of("error","El CUIT '"+supplier.getCuit()+"' esta en uso"));
                case COMPANY_NAME_IN_USE ->  ResponseEntity.badRequest().body(Map.of("error","La razon social '"+supplier.getCompanyName()+"' esta en uso"));
            };
        } catch (NumberFormatException e) {
            logger.error("Error updating the supplier with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.badRequest().body("Format error: "+e.getMessage());
        }catch(Exception e){
            logger.error("Error updating the supplier with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> softDeleteSupplier (@PathVariable int id) {
        try{
            GenericResponse<SupplierResponseStatuses.softDelete,Supplier> result = supplierService.softDeleteSupplier(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case ALREADY_SOFT_DELETED -> ResponseEntity.badRequest().body(Map.of("error","El proveedor ya se encuentra suspendido"));
            };
        }catch(Exception e){
            logger.error("Error soft deleting the supplier with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> hardDeleteSupplier (@PathVariable int id) {
        try{
            GenericResponse<SupplierResponseStatuses.hardDelete,Supplier> result = supplierService.hardDeleteSupplier(id);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case SUPPLIER_IS_BEING_REFERENCED -> ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","El proveedor esta siendo referenciado por otra tabla en la base de datos"));
            };
        }catch(Exception e){
            logger.error("Error hard deleting the supplier with id {}: {}",id, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

}
