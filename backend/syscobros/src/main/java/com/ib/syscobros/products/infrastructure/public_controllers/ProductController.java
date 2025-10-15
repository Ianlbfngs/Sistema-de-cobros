package com.ib.syscobros.products.infrastructure.public_controllers;

import com.ib.syscobros.products.application.ProductService;
import com.ib.syscobros.products.domain.product.Product;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> obtainAllProducts () {
        List<Product> result = productService.findAll();
        if(result.isEmpty()) return ResponseEntity.noContent().build();
        else return ResponseEntity.ok(result);
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> obtainProduct (@PathVariable @Size(min = 1, max = 8, message = "el codigo debe tener entre 1 y 8 caracteres") String code) {
        try{
            Optional<Product> result = productService.findProductByCode(code);
            if(result.isEmpty()) return ResponseEntity.notFound().build();
            else return ResponseEntity.ok(result.get());
        }catch(Exception e){
            logger.error("Error obtaining the product with code {}: {}", code, e.getMessage(),e);
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }
}
