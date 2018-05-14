package com.hw6.docstar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import com.hw6.docstar.security.AuthenticationFailure;
import com.hw6.docstar.security.AuthenticationSuccess;
import com.hw6.docstar.security.EntryPointUnauthorizedHandler;
import com.hw6.docstar.services.DocstarUserService;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private DocstarUserService service;
	
	@Autowired
	private AuthenticationFailure authFailure;
	
	@Autowired
	private AuthenticationSuccess authSuccess;

	@Autowired
	private EntryPointUnauthorizedHandler authDenied;
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            		.antMatchers("/", "/css/**", "/js/**", "/user", "/login", "/logout").permitAll()
                .anyRequest().authenticated()
                .and()
            .exceptionHandling()
            		.authenticationEntryPoint(authDenied) 
            		.and()
            .formLogin()
				.successHandler(authSuccess)
				.failureHandler(authFailure)
				.loginPage("/")
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/user")
				.usernameParameter("username")
				.passwordParameter("password")
				.permitAll()
                .and()
            .logout()
                .permitAll()
                .and()
            .csrf()//.disable();            		
            	.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
    }

    @Autowired
    public void configureGlobal( AuthenticationManagerBuilder auth ) throws Exception {
    		auth.userDetailsService( service );
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider( authenticationProvider() );
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(service);
        authProvider.setPasswordEncoder(encoder());
        
        return authProvider;
    }
    
    @Bean
    public PasswordEncoder encoder() {
    		PasswordEncoder encoder = new BCryptPasswordEncoder(11);
        return encoder;
    }
}
