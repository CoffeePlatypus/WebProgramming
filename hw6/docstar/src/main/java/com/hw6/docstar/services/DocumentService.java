package com.hw6.docstar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.hw6.docstar.models.Doc;
import com.hw6.docstar.repositories.DocumentRepository;

@Service
public class DocumentService {
	
	@Autowired
	DocumentRepository documentRepository;

	public Doc saveDoc(Doc doc) {
		return documentRepository.save(doc);	
	}

	public List<Doc> getDocs(String owner) {
		return documentRepository.findByOwner(owner);
	}

	public Doc review(String docId, int rating) {
		Optional<Doc> document = documentRepository.findById(docId);
		if(document.isPresent()) {
			Doc doc = document.get();
			doc.setRating(rating);
			doc.setReviewed(true);
			documentRepository.save(doc);
			return doc;
		}
		return null;
	}

	public List<Doc> getDocsByNameAndTypeAndReviewed(String uname, String queryString, String type, boolean reviewed) {
		//return documentRepository.findByOwnerAndTitleContainsAndTypeAndReviewed(uname, queryString,type, reviewed);
		return documentRepository.findByOwnerAndReviewedAndTitleContains(uname,reviewed,queryString);
	}
}
