package com.hw6.docstar.controllers;

import java.util.List;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hw6.docstar.models.FedDoc;
import com.hw6.docstar.models.FedRes;

@RestController
public class AdminController {
	
	public String queryFedRegrestry(int page) throws URISyntaxException, ClientProtocolException, IOException{
		URI uri = new URIBuilder()
		        .setScheme("https")
		        .setHost("federalregister.gov")
		        .setPath("/api/v1/documents.json" )
		        .setParameter("page", page+"")
		        .build();
		HttpGet httpget = new HttpGet(uri);
		
		CloseableHttpClient client = HttpClients.createDefault();
		CloseableHttpResponse response = client.execute( httpget );
		
		String result = null;
		try {
			HttpEntity e = response.getEntity();
			result = EntityUtils.toString( e );			
		} finally {
			response.close();
		}
		return result;
	}
	
	public FedRes toFedRes(String res) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper()
				  .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.readValue( res, FedRes.class );
	}
	
	@RequestMapping(value="/api/v1/documents", method=RequestMethod.GET)
	public FedRes getDocuments( @RequestParam (value = "page", defaultValue = "1") int page ) throws ClientProtocolException, URISyntaxException, IOException {
		String docs = queryFedRegrestry(page);
		return toFedRes(docs);
	}
}
