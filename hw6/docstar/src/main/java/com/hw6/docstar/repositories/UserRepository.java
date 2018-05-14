package com.hw6.docstar.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hw6.docstar.models.DocstarUser;

public interface UserRepository extends MongoRepository<DocstarUser, String> {
	public DocstarUser findByUsername( String username );
	public List<DocstarUser> findAll();
	
}
