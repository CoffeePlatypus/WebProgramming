package com.hw6.docstar.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.hw6.docstar.models.Doc;

public interface DocumentRepository extends MongoRepository<Doc, String> {
//	@Query("{ $and : [ {'owner' : ?0}, { $or:[ {'name':{ $regex : ?1 }}, {'value':{ $regex : ?1 } } ] } ] }")
//	List<Doc> findThings(String uname, String filter);
	
	List<Doc> findByOwner( String owner );

	List<Doc> findByOwnerAndTitleContains(String uname, String title);

	List<Doc> findByOwnerAndTitleContainsAndType(String uname, String queryString, String type);

	List<Doc> findByOwnerAndTitleContainsAndTypeAndReviewed(String uname, String queryString, String type,
			boolean reviewed);
	
	List<Doc> findByOwnerAndReviewed(String uname, boolean reviewed);

	List<Doc> findByOwnerAndReviewedAndTitleContains(String uname, boolean reviewed, String title);

}
