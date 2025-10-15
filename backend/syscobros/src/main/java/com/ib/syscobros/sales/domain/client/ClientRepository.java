package com.ib.syscobros.sales.domain.client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client,Integer> {
    List<Client> findAllByStatus(boolean status);

    Optional<Client> findClientByIdAndStatus(int id, boolean status);

    boolean existsClientById(int id);

    Optional<Client> getClientById(int id);
}
