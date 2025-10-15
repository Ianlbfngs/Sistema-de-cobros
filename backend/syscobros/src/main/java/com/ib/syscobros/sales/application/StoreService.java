package com.ib.syscobros.sales.application;

import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.sales.domain.store.Store;
import com.ib.syscobros.sales.domain.store.StoreRepository;
import com.ib.syscobros.sales.domain.store.StoreResponseStatuses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    private final StoreRepository storeRepository;

    @Autowired
    public StoreService(StoreRepository storeRepository){
        this.storeRepository = storeRepository;
    }


    public List<Store> findAll() {
        return storeRepository.findAllByStatus(true);
    }

    public Optional<Store> findStoreById(int id) {
        return storeRepository.findStoreByIdAndStatus(id,true);
    }

    public GenericResponse<StoreResponseStatuses.add,Store> addStore(Store store) {
        if(storeRepository.existsStoreByName(store.getName())) return new GenericResponse<>(StoreResponseStatuses.add.NAME_IN_USE,null);
        if(storeRepository.existsStoreByAddress(store.getAddress())) return new GenericResponse<>(StoreResponseStatuses.add.ADDRESS_IN_USE,null);
        store.setStatus(true);
        return new GenericResponse<>(StoreResponseStatuses.add.SUCCESS,storeRepository.save(store));
    }

    private Store verifyChangesStore(Store original, Store changed){
        if(changed.getName().isEmpty()) changed.setName(original.getName());
        if(changed.getAddress().isEmpty()) changed.setAddress(original.getAddress());

        changed.setId(original.getId());
        changed.setStatus(true);

        return changed;
    }

    public GenericResponse<StoreResponseStatuses.update, Store> updateStore(int id, Store storeToUpdate) {
        Optional<Store> originalStore = storeRepository.findStoreByIdAndStatus(id,true);
        if(originalStore.isEmpty()) return new GenericResponse<>(StoreResponseStatuses.update.NOT_FOUND,null);

        Store updatedStore = verifyChangesStore(originalStore.get(),storeToUpdate);

        if(storeRepository.existsStoreByNameAndIdNot(updatedStore.getName(),id)) return new GenericResponse<>(StoreResponseStatuses.update.NAME_IN_USE,null);
        if(storeRepository.existsStoreByAddressAndIdNot(updatedStore.getAddress(),id)) return new GenericResponse<>(StoreResponseStatuses.update.ADDRESS_IN_USE,null);

        return new GenericResponse<>(StoreResponseStatuses.update.SUCCESS,storeRepository.save(updatedStore));

    }

    public GenericResponse<StoreResponseStatuses.softDelete, Store> softDeleteStore(int id) {
        Optional<Store> originalStore = storeRepository.findStoreById(id);
        if(originalStore.isEmpty()) return new GenericResponse<>(StoreResponseStatuses.softDelete.NOT_FOUND,null);
        Store storeToSoftDelete = originalStore.get();
        if(!storeToSoftDelete.isStatus()) return new GenericResponse<>(StoreResponseStatuses.softDelete.ALREADY_SOFT_DELETED,null);

        storeToSoftDelete.setStatus(false);
        return new GenericResponse<>(StoreResponseStatuses.softDelete.SUCCESS,storeRepository.save(storeToSoftDelete));

    }

    public GenericResponse<StoreResponseStatuses.hardDelete, Store> hardDeleteStore(int id) {
        try{
            if(!storeRepository.existsStoreById(id)) return new GenericResponse<>(StoreResponseStatuses.hardDelete.NOT_FOUND,null);

            storeRepository.deleteById(id);
            return new GenericResponse<>(StoreResponseStatuses.hardDelete.SUCCESS,null);

        }catch(DataIntegrityViolationException e){
            return new GenericResponse<>(StoreResponseStatuses.hardDelete.STORE_IS_BEING_REFERENCED,null);
        }

    }
}
