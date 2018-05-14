package com.hw6.docstar.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hw6.docstar.services.DocstarUserService;
import com.hw6.docstar.models.DocstarUser;
import com.hw6.docstar.models.NewUser;

@RestController
public class UserController {
	@Autowired
	private DocstarUserService userService;
	
	@RequestMapping(value="/user", method=RequestMethod.GET)
	@Nullable
	public UserDetails getUser( Principal p ) {
		if( p == null || p.getName() == null ) return null;
		return userService.loadUserByUsername( p.getName() );
	}
	
	@RequestMapping(value="/api/v1/users", method=RequestMethod.GET)
	public List<DocstarUser> getUsers() {
		return userService.findAll();
	}
	
	@RequestMapping(value="/api/v1/user", method=RequestMethod.POST)
	public DocstarUser createUser(@RequestBody NewUser user) {
		System.out.println(user);
		return userService.saveUser(user);
	}
	
	@RequestMapping(value="/api/v1/user", method=RequestMethod.PUT)
	public DocstarUser updateUser(@RequestBody NewUser user) {
		System.out.println(user);
		return userService.updateUser(user);
	}
}
