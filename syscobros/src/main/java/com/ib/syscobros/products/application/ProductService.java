package com.ib.syscobros.products.application;

import com.ib.syscobros.products.domain.product.Product;
import com.ib.syscobros.products.domain.product.ProductRepository;
import com.ib.syscobros.products.domain.product.ProductResponseStatuses;
import com.ib.syscobros.products.domain.supplier.SupplierRepository;
import com.ib.syscobros.response.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAllByStatus(true);
    }

    public Optional<Product> findProductByCode(String code) {
        return productRepository.findProductByProductCodeAndStatus(code,true);
    }

    public GenericResponse<ProductResponseStatuses.add, Product> addProduct(Product product) {
        if (productRepository.existsProductByProductCode(product.getProductCode())) return new GenericResponse<>(ProductResponseStatuses.add.CODE_IN_USE, null);
        if(product.getSupplier().getId() == 0)product.setSupplier(null);
        else if (!supplierRepository.existsSupplierById(product.getSupplier().getId())) return new GenericResponse<>(ProductResponseStatuses.add.SUPPLIER_NOT_FOUND, null);

        product.setStatus(true);

        return new GenericResponse<>(ProductResponseStatuses.add.SUCCESS, productRepository.save(product));
    }
    private Product verifyChangesProduct(Product original, Product changed){
        if(changed.getSupplier() != null && changed.getSupplier().getId() == 0) changed.setSupplier(original.getSupplier());
        if(changed.getName().isEmpty()) changed.setName(original.getName());
        if(changed.getPrice().equals(BigDecimal.ZERO)) changed.setPrice(original.getPrice());
        if(changed.getDescription().isEmpty()) changed.setDescription(original.getDescription());

        changed.setProductCode(original.getProductCode());
        changed.setStatus(true);

        return changed;
    }

    public GenericResponse<ProductResponseStatuses.update, Product> updateProduct(String code, Product productToUpdate) {
        Optional<Product> originalProduct = productRepository.findProductByProductCodeAndStatus(code,true);
        if(originalProduct.isEmpty()) return new GenericResponse<>(ProductResponseStatuses.update.NOT_FOUND,null);

        Product updatedProduct = verifyChangesProduct(originalProduct.get(),productToUpdate);
        if(updatedProduct.getSupplier() != null && !supplierRepository.existsSupplierById(updatedProduct.getSupplier().getId())) return new GenericResponse<>(ProductResponseStatuses.update.SUPPLIER_NOT_FOUND,null);
        return new GenericResponse<>(ProductResponseStatuses.update.SUCCESS,productRepository.save(updatedProduct));
    }
    public GenericResponse<ProductResponseStatuses.softDelete, Product> softDeleteProduct(String code) {
        Optional<Product> originalProduct = productRepository.getProductByProductCode(code);
        if(originalProduct.isEmpty()) return new GenericResponse<>(ProductResponseStatuses.softDelete.NOT_FOUND,null);
        Product productToSoftDelete = originalProduct.get();
        if(!productToSoftDelete.isStatus()) return new GenericResponse<>(ProductResponseStatuses.softDelete.ALREADY_SOFT_DELETED,null);

        productToSoftDelete.setStatus(false);
        return new GenericResponse<>(ProductResponseStatuses.softDelete.SUCCESS,productRepository.save(productToSoftDelete));
    }

    public GenericResponse<ProductResponseStatuses.hardDelete, Product> hardDeleteProduct(String code) {
        try{
            if(!productRepository.existsProductByProductCode(code)) return new GenericResponse<>(ProductResponseStatuses.hardDelete.NOT_FOUND,null);
            productRepository.deleteById(code);

            return new GenericResponse<>(ProductResponseStatuses.hardDelete.SUCCESS,null);
        }catch(DataIntegrityViolationException e){
            return new GenericResponse<>(ProductResponseStatuses.hardDelete.PRODUCT_IS_BEING_REFERENCED,null);
        }

    }

    public BigDecimal getPriceByCode(String productCode) {
        return productRepository.findProductByProductCode(productCode).get().getPrice();
    }
}
