package com.ib.syscobros.auth.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findUserByUsernameAndPasswordAndStatus(String username, String password, boolean status);

    boolean existsUserByUsername(String username);

    Optional<User> findUserByUsername(String username);

    List<User> findAllByStatus(boolean status);

    List<User> findAllByStatusAndIdNot(boolean status, int id);

    Optional<User> findUserByUsernameAndStatusAndIdNot(String username, boolean status, int id);

    Optional<User> findByIdAndStatusAndIdNot(int id, boolean status, int id1);

    Optional<User> findUserByIdAndIdNot(int id, int id1);
}
