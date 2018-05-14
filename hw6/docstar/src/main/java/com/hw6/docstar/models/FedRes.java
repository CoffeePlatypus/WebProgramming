package com.hw6.docstar.models;

public class FedRes {
	private int count;
	private int total_pages;
	private String next_page_url;
	//private String previousPageUrl;
	private FedDoc[]  results;
	
	public int getCount() {
		return count;
	}
	
	public void setCount(int count) {
		this.count = count;
	}
	
	public int getTotal_pages() {
		return total_pages;
	}
	
	public void setTotalPages(int total_pages) {
		this.total_pages = total_pages;
	}
	
	public void setNext_page_url(String url) {
		this.next_page_url = url;
	}
	
	public String getNext_page_url() {
		return next_page_url;
	}

	public FedDoc[] getResults() {
		return results;
	}
	
	public void setResults(FedDoc[] results) {
		this.results = results;
	}
}
