package com.ib.syscobros.sales.domain.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store,Integer> {
    List<Store> findAllByStatus(boolean status);

    Optional<Store> findStoreByIdAndStatus(int id, boolean status);

    boolean existsStoreById(int id);

    Optional<Store> findStoreById(int id);

    boolean existsStoreByName(String name);

    boolean existsStoreByAddress(String address);

    boolean existsStoreByNameAndIdNot(String name, int id);

    boolean existsStoreByAddressAndIdNot(String address, int id);
}
