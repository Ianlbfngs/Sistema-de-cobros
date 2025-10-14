package com.ib.syscobros.auth.domain;

import com.ib.syscobros.response.IResponseStatus;

public class AuthResponseStatuses {
    public enum login implements IResponseStatus {SUCCESS,DENIED, USER_SUSPENDED}
    public enum register implements IResponseStatus {SUCCESS,USER_IN_USE,STORE_NOT_FOUND}
    public enum updatePassword implements IResponseStatus{SUCCESS,NOT_FOUND}
    public enum softDelete implements IResponseStatus{SUCCESS,NOT_FOUND,ALREADY_SOFT_DELETED}
    public enum updateUser implements IResponseStatus{SUCCESS,NOT_FOUND}

}
