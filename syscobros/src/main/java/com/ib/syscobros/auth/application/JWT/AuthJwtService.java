package com.ib.syscobros.auth.application.JWT;

import com.ib.syscobros.auth.domain.UserRole;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@Service
public class AuthJwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(int userId, String username, UserRole role){
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId",userId);
        claims.put("role",role);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+(24L * 60 * 60 * 1000)))
                .and().signWith(getKey())
                .compact();
    }

    private SecretKey getKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


}

