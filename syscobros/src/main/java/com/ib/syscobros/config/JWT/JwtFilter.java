package com.ib.syscobros.config.JWT;

import com.ib.syscobros.auth.domain.UserRole;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.util.List;

public class JwtFilter extends  OncePerRequestFilter {


    private final JwtFilterService jwtFilterService;

    public JwtFilter(JwtFilterService jwtFilterService) {
        this.jwtFilterService = jwtFilterService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(authHeader ==null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        String token = authHeader.substring(7);

        try {
            Claims claims = jwtFilterService.extractClaims(token);

            String username = claims.getSubject();
            Integer userId = claims.get("userId", Integer.class);
            String role = claims.get("role", String.class);

            if (username != null && role != null) {
                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                List<GrantedAuthority> authorities = List.of(authority);

                JwtUser userDetails = new JwtUser(userId, username, role);

                Authentication auth = new UsernamePasswordAuthenticationToken(userDetails,null, authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }catch(Exception ignore){
        }
        filterChain.doFilter(request, response);

    }
}
