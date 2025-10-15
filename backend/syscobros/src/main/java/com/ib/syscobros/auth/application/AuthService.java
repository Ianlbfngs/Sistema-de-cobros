package com.ib.syscobros.auth.application;

import com.ib.syscobros.auth.application.JWT.AuthJwtService;
import com.ib.syscobros.auth.domain.User;
import com.ib.syscobros.auth.domain.UserRepository;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.auth.domain.AuthResponseStatuses;
import com.ib.syscobros.sales.application.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService{

    private final UserRepository userRepository;
    private final AuthJwtService jwtService;
    private final StoreService storeService;

    @Autowired
    public AuthService(UserRepository userRepository, AuthJwtService jwtService, StoreService storeService){
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.storeService = storeService;
    }

    public List<User> findAllUsers() {
        return userRepository.findAllByStatusAndIdNot(true,0);
    }

    public Optional<User> findUserById(int id) {
        return userRepository.findByIdAndStatusAndIdNot(id,true,0);
    }


    public GenericResponse<AuthResponseStatuses.login,User> login(User user) {
        Optional<User> existingUser = userRepository.findUserByUsername(user.getUsername());
        if(existingUser.isPresent()) {
            User currentUser = existingUser.get();
            if(!currentUser.isStatus()) return new GenericResponse<>(AuthResponseStatuses.login.USER_SUSPENDED,null);
            if(!user.getPassword().equals(currentUser.getPassword()))  return new GenericResponse<>(AuthResponseStatuses.login.DENIED,null);
            currentUser.setToken(jwtService.generateToken(currentUser.getId(),currentUser.getUsername(),currentUser.getRole()));
            return new GenericResponse<>(AuthResponseStatuses.login.SUCCESS,currentUser);

        }else return new GenericResponse<>(AuthResponseStatuses.login.DENIED,null);
    }

    public GenericResponse<AuthResponseStatuses.register,User> register(User newUser) {

            if(userRepository.existsUserByUsername(newUser.getUsername())) return new GenericResponse<>(AuthResponseStatuses.register.USER_IN_USE,null);
            if(newUser.getStore().getId() == 0) newUser.setStore(null);
            if(newUser.getStore() != null && storeService.findStoreById(newUser.getStore().getId()).isEmpty())return new GenericResponse<>(AuthResponseStatuses.register.STORE_NOT_FOUND,null);
            newUser.setStatus(true);
            userRepository.save(newUser);
            return new GenericResponse<>(AuthResponseStatuses.register.SUCCESS,newUser);

    }

    public GenericResponse<AuthResponseStatuses.updatePassword,User> updatePassword(String username, String newPassword) {

            Optional<User> existingUser = userRepository.findUserByUsernameAndStatusAndIdNot(username,true,0);
            if(existingUser.isEmpty()) return new GenericResponse<>(AuthResponseStatuses.updatePassword.NOT_FOUND,null);
            User user = existingUser.get();
            user.setPassword(newPassword);
            return new GenericResponse<>(AuthResponseStatuses.updatePassword.SUCCESS,userRepository.save(user));

    }

    public GenericResponse<AuthResponseStatuses.softDelete, User> softDeleteUser(int id) {
        Optional<User> existingUser = userRepository.findUserByIdAndIdNot(id,0);
        if(existingUser.isEmpty()) return new GenericResponse<>(AuthResponseStatuses.softDelete.NOT_FOUND,null);
        User currentUser = existingUser.get();
        if(!currentUser.isStatus()) return new GenericResponse<>(AuthResponseStatuses.softDelete.ALREADY_SOFT_DELETED,null);

        currentUser.setStatus(false);

        return new GenericResponse<>(AuthResponseStatuses.softDelete.SUCCESS,userRepository.save(currentUser));
    }

    public GenericResponse<AuthResponseStatuses.updateUser, User> updateUser(String username,User updatedUser) {
        Optional<User> originalUser = userRepository.findUserByUsernameAndStatusAndIdNot(username,true,0);
        if(originalUser.isEmpty()) return new GenericResponse<>(AuthResponseStatuses.updateUser.NOT_FOUND, null);
        User ogUser = originalUser.get();
        if(updatedUser.getStore() != null && updatedUser.getStore().getId() == 0) updatedUser.setStore(null);
        updatedUser.setPassword(ogUser.getPassword());
        updatedUser.setId(ogUser.getId());
        updatedUser.setUsername(username);
        updatedUser.setStatus(true);
        return new GenericResponse<>(AuthResponseStatuses.updateUser.SUCCESS,userRepository.save(updatedUser));
    }
}
