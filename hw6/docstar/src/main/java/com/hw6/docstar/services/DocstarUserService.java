package com.hw6.docstar.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hw6.docstar.models.DocstarUser;
import com.hw6.docstar.models.NewUser;
import com.hw6.docstar.repositories.UserRepository;

@Service
public class DocstarUserService implements UserDetailsService {
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		DocstarUser user = userRepository.findByUsername(username);
		if( user == null ) {
			throw new UsernameNotFoundException("no such user");
		} else {
			System.out.println( user.getUsername() );
			System.out.println( user.getPassword() );
			return user;
		}
	}
	
	@PostConstruct
	public void makeMockUsers() {
		// do just one of these // use 2nd one to reset database
		if( this.userRepository.count() > 0 ) return;		
		//this.userRepository.deleteAll();
		String hashedPassword = encoder.encode("123");
		DocstarUser user1 = new DocstarUser.Builder()
				.roles( Arrays.asList( "USER", "ADMIN" ) )
				.password( hashedPassword )
				.username( "j@f" )
				.isEnabled( true )
				.isAccountNonExpired( true )
				.isAccountNonLocked(true)
				.isCredentialsNonExpired(true)
				.build();
		userRepository.save( user1 );
	
		DocstarUser tu2 = new DocstarUser.Builder()
				.roles( Arrays.asList( "USER" ) )
				.password( hashedPassword )
				.username( "julia" )
				.isEnabled( true )
				.isAccountNonExpired( true )
				.isAccountNonLocked(true)
				.isCredentialsNonExpired(true)
				.build();
		userRepository.save( tu2 );
	}
	
	public List<DocstarUser> findAll() {
		return userRepository.findAll();
	}

	public DocstarUser saveUser(NewUser newUser) {
		DocstarUser exists = userRepository.findByUsername(newUser.getUsername());
		if(exists != null) return null;//exists;
		DocstarUser user = new DocstarUser.Builder()
				.roles(newUser.getRole().equals("ADMIN")? Arrays.asList( "USER", "ADMIN" ) : Arrays.asList( "USER" ) )
				.password(encoder.encode(newUser.getPassword()))
				.username(newUser.getUsername())
				.isEnabled( true )
				.isAccountNonExpired( true )
				.isAccountNonLocked(true)
				.isCredentialsNonExpired(true)
				.build();
		return userRepository.save(user);
	}

	public DocstarUser updateUser(NewUser newUser) {
		DocstarUser user = userRepository.findByUsername(newUser.getUsername());
		if(user == null) return null;
		if(!newUser.getPassword().equals("")) {
			user.setPassword(encoder.encode(newUser.getPassword()));
		}
		user.setEnabled(newUser.isEnabled());
		user.setRoles(newUser.getRole().equals("ADMIN")? Arrays.asList( "USER", "ADMIN" ) : Arrays.asList( "USER" ) );
		return userRepository.save(user);
	}

}

