package com.ib.syscobros.sales.application;

import com.ib.syscobros.sales.domain.client.Client;
import com.ib.syscobros.sales.domain.client.ClientRepository;
import com.ib.syscobros.sales.domain.client.ClientResponseStatuses;
import com.ib.syscobros.response.GenericResponse;
import com.ib.syscobros.utils.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository){
        this.clientRepository = clientRepository;
    }

    public List<Client> findAll() {return clientRepository.findAllByStatus(true);}

    public Optional<Client> findClientById(int id) {return clientRepository.findClientByIdAndStatus(id,true);}



    public Client addClient(Client client) {
        ValidationUtils.validateNumberFormat(client.getPhoneNumber(),"Invalid phone number");
        client.setStatus(true);
        return clientRepository.save(client);
    }

    private Client verifyChangesClient(Client original, Client changed){
        if(changed.getName().isEmpty()) changed.setName(original.getName());
        if(changed.getSurname().isEmpty()) changed.setSurname(original.getSurname());
        if(changed.getPhoneNumber().isEmpty()) changed.setPhoneNumber(original.getPhoneNumber());
        if(changed.getEmail().isEmpty()) changed.setEmail(original.getEmail());
        if(changed.getAddress().isEmpty()) changed.setAddress(original.getAddress());

        changed.setId(original.getId());
        changed.setStatus(true);

        return changed;
    }

    public GenericResponse<ClientResponseStatuses.update, Client> updateClient(int id, Client clientToUpdate) {
        ValidationUtils.validateNumberFormat(clientToUpdate.getPhoneNumber(),"Invalid phone number");
        Optional<Client> originalClient = clientRepository.findClientByIdAndStatus(id,true);
        if(originalClient.isEmpty())return new GenericResponse<>(ClientResponseStatuses.update.NOT_FOUND,null);

        Client updatedClient = verifyChangesClient(originalClient.get(),clientToUpdate);

        return new GenericResponse<>(ClientResponseStatuses.update.SUCCESS,clientRepository.save(updatedClient));
    }

    public GenericResponse<ClientResponseStatuses.softDelete, Client> softDeleteClient(int id) {
        Optional<Client> clientToSoftDelete = clientRepository.getClientById(id);
        if(clientToSoftDelete.isEmpty()) return new GenericResponse<>(ClientResponseStatuses.softDelete.NOT_FOUND,null);

        if(!clientToSoftDelete.get().isStatus()) return new GenericResponse<>(ClientResponseStatuses.softDelete.ALREADY_SOFT_DELETED,null);

        clientToSoftDelete.get().setStatus(false);
        return new GenericResponse<>(ClientResponseStatuses.softDelete.SUCCESS,clientRepository.save(clientToSoftDelete.get()));
    }

    public GenericResponse<ClientResponseStatuses.hardDelete, Client> hardDeleteClient(int id) {
        try{
            if(!clientRepository.existsClientById(id)) return new GenericResponse<>(ClientResponseStatuses.hardDelete.NOT_FOUND,null);

            clientRepository.deleteById(id);
            return new GenericResponse<>(ClientResponseStatuses.hardDelete.SUCCESS,null);

        }catch(DataIntegrityViolationException e){
            return new GenericResponse<>(ClientResponseStatuses.hardDelete.CLIENT_IS_BEING_REFERENCED,null);
        }
    }
}
