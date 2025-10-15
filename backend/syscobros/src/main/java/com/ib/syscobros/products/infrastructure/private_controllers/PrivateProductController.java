package com.ib.syscobros.products.infrastructure.private_controllers;

import com.ib.syscobros.products.application.ProductService;
import com.ib.syscobros.products.domain.product.Product;
import com.ib.syscobros.products.domain.product.ProductResponseStatuses;
import com.ib.syscobros.response.GenericResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class PrivateProductController {
    private static final Logger logger = LoggerFactory.getLogger(PrivateProductController.class);

    private final ProductService productService;

    @Autowired
    public PrivateProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct (@RequestBody @Valid Product product) {
        if(product.getProductCode()==null) return ResponseEntity.badRequest().body(Map.of("error","El codigo de producto debe ser especificado"));
        try{
            GenericResponse<ProductResponseStatuses.add,Product> result = productService.addProduct(product);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case CODE_IN_USE -> ResponseEntity.badRequest().body(Map.of("error","El codigo '"+product.getProductCode()+"' de producto esta en uso"));
                case SUPPLIER_NOT_FOUND -> ResponseEntity.badRequest().body(Map.of("error","No se encontro un proveedor con id "+product.getSupplier().getId()));
            };
        }catch(Exception e){
            logger.error("Error adding the new product: {}",e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/update/{code}")
    public ResponseEntity<?> updateProduct (@PathVariable @Size(min = 1, max = 8, message = "el codigo debe tener entre 1 y 8 caracteres") String code,@RequestBody @Valid Product product) {
        try{
            GenericResponse<ProductResponseStatuses.update,Product> result = productService.updateProduct(code,product);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case SUPPLIER_NOT_FOUND -> ResponseEntity.badRequest().body(Map.of("error","No se encontro un proveedor con id "+product.getSupplier().getId()));
            };
        }catch(Exception e){
            logger.error("Error updating the product with code {}: {}", code, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @PutMapping("/delete/{code}")
    public ResponseEntity<?> softDeleteProduct (@PathVariable @Size(min = 1, max = 8, message = "el codigo debe tener entre 1 y 8 caracteres") String code) {
        try{
            GenericResponse<ProductResponseStatuses.softDelete,Product> result = productService.softDeleteProduct(code);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case ALREADY_SOFT_DELETED -> ResponseEntity.badRequest().body(Map.of("error","El producto ya se encuentra suspendido"));
            };
        }catch(Exception e){
            logger.error("Error soft deleting the product with code {}: {}", code, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }

    @DeleteMapping("/delete/{code}")
    public ResponseEntity<?> hardDeleteProduct (@PathVariable @Size(min = 1, max = 8, message = "el codigo debe tener entre 1 y 8 caracteres") String code) {
        try{
            GenericResponse<ProductResponseStatuses.hardDelete,Product> result = productService.hardDeleteProduct(code);
            return switch (result.status()){
                case SUCCESS -> ResponseEntity.ok(result.data());
                case NOT_FOUND -> ResponseEntity.notFound().build();
                case PRODUCT_IS_BEING_REFERENCED -> ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error","El producto esta siendo referenciado por otra tabla de la base de datos"));
            };
        }catch(Exception e){
            logger.error("Error hard deleting the product with code {}: {}", code, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }


}
