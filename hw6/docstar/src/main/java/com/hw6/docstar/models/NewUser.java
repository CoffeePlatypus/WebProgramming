package com.hw6.docstar.models;


public class NewUser {
	private String username;
	private String password;
	private String role;
	private boolean enabled;
	
	public NewUser() {}
	
	public NewUser(Builder b) {
		username = b.username;
		password = b.password;
		setRole(b.role);
	}	
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	private static class Builder{
		private String role;
		private String username;
		private String password;

		public Builder username( String username ) { this.username = username; return this; }
		public Builder password( String password ) { this.password = password; return this; }
		public Builder role( String role ) { this.role = role; return this; }
		public NewUser build() {return new NewUser(this);}
	}
}
