package com.hw6.docstar.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hw6.docstar.models.Doc;
import com.hw6.docstar.services.DocumentService;

@RestController
public class DocumentController {
	@Autowired
	private DocumentService documentService;
	
	private void validateOwner( Principal p, String uname ) throws Exception {
		if( p == null || !p.getName().equals( uname ) ) throw new Exception(); 
	}
	
	@RequestMapping(value="/api/v1/users/{uname}/docs", method=RequestMethod.POST)
	public Doc assignDoc(@PathVariable String uname, @RequestBody Doc doc) {
		return documentService.saveDoc(doc);
	}
	
	@RequestMapping(value="/api/v1/users/{uname}/all/docs", method=RequestMethod.GET) 
	public List<Doc> getAllDocs(@PathVariable String uname, Principal p) throws Exception{
		validateOwner(p,uname);
		return documentService.getDocs(uname);
	}
	
	@RequestMapping(value="/api/v1/users/{uname}/docs", method=RequestMethod.GET) 
	public List<Doc> getDocs(
			@PathVariable String uname, 
			@RequestParam String queryString, 
			@RequestParam String type,
			@RequestParam boolean reviewed,
			Principal p) throws Exception{
		validateOwner(p,uname);
		System.out.println(reviewed);
		return documentService.getDocsByNameAndTypeAndReviewed(uname,queryString,type,reviewed);
	}
	
	@RequestMapping(value="/api/v1/users/{uname}/docs/{docId}", method=RequestMethod.PUT)
	public Doc rateDoc(@PathVariable String uname, @PathVariable String docId, @RequestParam int rating, Principal p) throws Exception {
		validateOwner(p,uname);
		System.out.println("Update doc: "+docId+" with rating: "+rating);
		return documentService.review(docId, rating);
	}
}
