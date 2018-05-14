package com.hw6.docstar.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Doc {
	@Id
	private String id;
	private String owner;
	private String title;
	private boolean reviewed;
	private String type;
	private int rating;
	private String url;
		
	public Doc() {
	}
	
	private Doc( Builder b) {
		this.owner = b.owner;
		this.title = b.title;
		this.url = b.url;
		this.type = b.type;
		this.reviewed = false;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String documentType) {
		this.type = documentType;
	}

	public String getOwner() {
		return owner;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}

	public String getUrl() {
		return url;
	}
	
	public void setRating(int rating) {
		this.rating = rating;
	}

	public int getRating() {
		return rating;
	}
	
	public void setReviewed(boolean reviewed) {
		this.reviewed = reviewed;
	}
	
	public boolean getReviewed() {
		return reviewed;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}
	
	public static class Builder {
		private String owner;
		private String title;
		private String type;
		private String url;
		
		public Builder url( String url ) { this.url = url; return this; }
		public Builder title( String title ) { this.title = title; return this; }
		public Builder type( String documentType) { this.type = documentType; return this; }
		public Builder owner( String owner) { this.owner = owner; return this; }
		public Doc build( ) { return new Doc( this ); }
	}
}
