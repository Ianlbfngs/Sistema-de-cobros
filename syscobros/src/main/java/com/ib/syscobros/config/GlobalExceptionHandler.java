package com.ib.syscobros.config;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<Object> handleInvalidFormatException(InvalidFormatException ex) {
        String fieldName = null;

        if (!ex.getPath().isEmpty()) {
            JsonMappingException.Reference ref = ex.getPath().getFirst();
            fieldName = ref.getFieldName();
        }

        String message = String.format(
                "El campo '%s' tiene un valor inválido, se esperaba un %s.",
                fieldName, ex.getTargetType().getSimpleName()
        );

        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }




}
