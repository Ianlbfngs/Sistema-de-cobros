package com.ib.syscobros.response;

public record GenericResponse<Status extends IResponseStatus, T>(Status status, T data) {
}
