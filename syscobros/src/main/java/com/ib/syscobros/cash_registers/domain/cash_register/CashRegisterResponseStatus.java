package com.ib.syscobros.cash_registers.domain.cash_register;

import com.ib.syscobros.response.IResponseStatus;

public class CashRegisterResponseStatus
{

    public enum open implements IResponseStatus {SUCCESS,THERE_IS_A_CASH_REGISTER_OPEN}

    public enum close implements IResponseStatus {SUCCESS,NO_CASH_REGISTER_OPEN}

    public enum audit implements IResponseStatus {CORRECT,NOT_FOUND,CASH_REGISTER_IS_OPEN,DISCREPANCY }


}
