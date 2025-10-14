package com.ib.syscobros.products.application;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.ib.syscobros.products.domain.supplier.Supplier;
import com.ib.syscobros.products.domain.supplier.SupplierRepository;
import com.ib.syscobros.products.domain.supplier.SupplierResponseStatuses;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.utils.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Autowired
    public SupplierService(SupplierRepository supplierRepository){
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> findAll() {
        return supplierRepository.findAllByStatus(true);
    }

    public Optional<Supplier> findSupplierById(int id) {
        return supplierRepository.findSupplierByIdAndStatus(id,true);
    }

    public GenericResponse<SupplierResponseStatuses.add, Supplier> addSupplier(Supplier supplier) {
        ValidationUtils.validateLength(supplier.getCuit(),11,"CUIT length is less than 11");
        ValidationUtils.validateNumberFormat(supplier.getCuit(), "Invalid CUIT format. Must be a number");
        ValidationUtils.validateNumberFormat(supplier.getPhoneNumber(), "Invalid phone number format. Must be a number");
        if(supplierRepository.existsSupplierByCuit(supplier.getCuit())) return new GenericResponse<>(SupplierResponseStatuses.add.CUIT_IN_USE,null);
        if(supplierRepository.existsSupplierByCompanyName(supplier.getCompanyName())) return new GenericResponse<>(SupplierResponseStatuses.add.COMPANY_NAME_IN_USE,null);

        supplier.setStatus(true);
        return new GenericResponse<>(SupplierResponseStatuses.add.SUCCESS,supplierRepository.save(supplier));
    }

    private Supplier verifyChangesSupplier(Supplier original, Supplier changed){
        if(changed.getCuit().equals("00000000000")) changed.setCuit(original.getCuit());
        if(changed.getCompanyName().isEmpty()) changed.setCompanyName(original.getCompanyName());
        if(changed.getAddress().isEmpty()) changed.setAddress(original.getAddress());
        if(changed.getEmail().isEmpty()) changed.setEmail(original.getEmail());
        if(changed.getPhoneNumber().isEmpty()) changed.setPhoneNumber(original.getPhoneNumber());

        changed.setId(original.getId());
        changed.setStatus(true);

        return changed;
    }

    public GenericResponse<SupplierResponseStatuses.update, Supplier> updateSupplier(int id, Supplier supplierToUpdate) {
        ValidationUtils.validateNumberFormat(supplierToUpdate.getCuit(), "Invalid CUIT format. Must be a number");
        ValidationUtils.validateNumberFormat(supplierToUpdate.getPhoneNumber(), "Invalid phone number format. Must be a number");
        Optional<Supplier> originalSupplier = supplierRepository.findSupplierByIdAndStatus(id,true);
        if(originalSupplier.isEmpty()) return new GenericResponse<>(SupplierResponseStatuses.update.NOT_FOUND,null);

        Supplier updatedSupplier = verifyChangesSupplier(originalSupplier.get(),supplierToUpdate);
        if(supplierRepository.existsSupplierByCuitAndIdNot(updatedSupplier.getCuit(),id)) return new GenericResponse<>(SupplierResponseStatuses.update.CUIT_IN_USE,null);
        if(supplierRepository.existsSupplierByCompanyNameAndIdNot(updatedSupplier.getCompanyName(),id)) return new GenericResponse<>(SupplierResponseStatuses.update.COMPANY_NAME_IN_USE,null);

        return new GenericResponse<>(SupplierResponseStatuses.update.SUCCESS,supplierRepository.save(updatedSupplier));
    }

    public GenericResponse<SupplierResponseStatuses.softDelete, Supplier> softDeleteSupplier(int id) {
        Optional<Supplier> originalSupplier = supplierRepository.findSupplierById(id);
        if(originalSupplier.isEmpty()) return new GenericResponse<>(SupplierResponseStatuses.softDelete.NOT_FOUND,null);
        Supplier supplierToSoftDelete = originalSupplier.get();
        if(!supplierToSoftDelete.isStatus()) return new GenericResponse<>(SupplierResponseStatuses.softDelete.ALREADY_SOFT_DELETED,null);

        supplierToSoftDelete.setStatus(false);
        return new GenericResponse<>(SupplierResponseStatuses.softDelete.SUCCESS,supplierRepository.save(supplierToSoftDelete));
    }

    public GenericResponse<SupplierResponseStatuses.hardDelete, Supplier> hardDeleteSupplier(int id) {
        try{
        if(!supplierRepository.existsSupplierById(id)) return new GenericResponse<>(SupplierResponseStatuses.hardDelete.NOT_FOUND,null);

        supplierRepository.deleteById(id);
        return new GenericResponse<>(SupplierResponseStatuses.hardDelete.SUCCESS,null);

        }catch(DataIntegrityViolationException e){
            return new GenericResponse<>(SupplierResponseStatuses.hardDelete.SUPPLIER_IS_BEING_REFERENCED,null);
        }
    }
}
