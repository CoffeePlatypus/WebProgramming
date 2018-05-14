package com.hw6.docstar.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

@SuppressWarnings("serial")
@Document
public class DocstarUser implements UserDetails {
	@Id
	private String id;
	
	private List<String> roles;
	@JsonIgnore
	private String password;
	@Indexed(unique=true)
	private String username;
	private boolean isAccountNonExpired;
	private boolean isAccountNonLocked;
	private boolean isCredentialsNonExpired;
	private boolean isEnabled;
	
	public DocstarUser() {}

	private DocstarUser( Builder b ) {
		this.roles = b.roles;
		this.password = b.password;
		this.username = b.username;
		this.isAccountNonExpired = b.isAccountNonExpired;
		this.isAccountNonLocked = b.isAccountNonLocked;
		this.isCredentialsNonExpired = b.isCredentialsNonExpired;
		this.isEnabled = b.isEnabled;
	}
	
	public void setRoles( List<String> roles ) {
		this.roles = roles;
	}
	
	public List<String> getRoles() {
		return this.roles;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		for( String s : roles ) {
			authorities.add( new SimpleGrantedAuthority( s ) );
		}
		
		return authorities;
	}
	
	public void setPassword( String password ) {
		this.password = password;
	}
	
	public void setUsername( String username ) {
		this.username = username;
	}
	
	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return this.isAccountNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return this.isAccountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return this.isCredentialsNonExpired;
	}

	@Override
	public boolean isEnabled() {
		return this.isEnabled;
	}
	
	public static class Builder {
		private List<String> roles;
		private String password;
		private String username;
		private boolean isAccountNonExpired;
		private boolean isAccountNonLocked;
		private boolean isCredentialsNonExpired;
		private boolean isEnabled;
		
		public Builder roles( List<String> roles ) { this.roles = roles; return this; }
		public Builder username( String username ) { this.username = username; return this; }
		public Builder password( String password ) { this.password = password; return this; }
		public Builder isAccountNonExpired( boolean f ) { this.isAccountNonExpired = f; return this; }
		public Builder isAccountNonLocked( boolean f ) { this.isAccountNonLocked = f; return this; }
		public Builder isCredentialsNonExpired( boolean f) { this.isCredentialsNonExpired = f; return this; }
		public Builder isEnabled( boolean f ) { this.isEnabled = f; return this; }
		
		public DocstarUser build() { return new DocstarUser(this); }
	}

	public void setEnabled(boolean enabled) {
		this.isEnabled = enabled;
		
	}
}
