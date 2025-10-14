package com.ib.syscobros.products.domain.supplier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Integer> {
    boolean existsSupplierById(int id);

    Optional<Supplier> findSupplierById(int id);

    boolean existsSupplierByCuit(String cuit);

    boolean existsSupplierByCompanyName(String companyName);

    boolean existsSupplierByCuitAndIdNot(String cuit, int id);

    boolean existsSupplierByCompanyNameAndIdNot(String companyName, int id);

    List<Supplier> findAllByStatus(boolean status);

    Optional<Supplier> findSupplierByIdAndStatus(int id, boolean status);
}
