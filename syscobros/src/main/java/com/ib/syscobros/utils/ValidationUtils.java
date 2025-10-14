package com.ib.syscobros.utils;

import jakarta.validation.constraints.Size;

public class ValidationUtils {
     public static void validateNumberFormat(String value, String errorMessage) {
            value = value.replaceAll("\\s+", "");
            try {
                Long.parseLong(value);
            } catch (NumberFormatException e) {
                throw new NumberFormatException(errorMessage);
            }

    }

    public static void validateLength(String value, int length, String errorMessage) {
        value = value.replaceAll("\\s+", "");
        if(value.length() != length) { throw new IllegalArgumentException(errorMessage); }
    }
}
