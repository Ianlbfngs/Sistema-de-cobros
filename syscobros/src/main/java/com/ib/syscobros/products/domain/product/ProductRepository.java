package com.ib.syscobros.products.domain.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,String> {
    Optional<Product> findProductByProductCode(String productCode);

    boolean existsProductByProductCode(String productCode);

    Optional<Product> getProductByProductCode(String productCode);

    List<Product> findAllByStatus(boolean status);

    Optional<Product> findProductByProductCodeAndStatus(String productCode, boolean status);

}
