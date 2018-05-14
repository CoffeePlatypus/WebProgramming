package com.cs402.hw5.models;


public class Calculation {
	
	private String x;
	private String y;
	private String op;
	private String result;
	private String hashAlg;
	private String hash;
	
	public Calculation(String x, String y, String op, String hashAlg) {
		this.x = x;
		this.y = y;
		this.op = op;
		this.hashAlg = hashAlg;
		result = "";
		hash = "";
	}

	// Setters
	public void setX(String newX) {
		x = newX;
	}
	
	public void setY(String newY) {
		y = newY;
	}
	
	public void setResult(String string) {
		result = string;
		System.out.println(string);
	}
	
	public void setHash(String hash2) {
		hash = hash2;		
	}
	
	// Getters
	public String getX() {
		return x;
	}

	public String getY() {
		return y;
	}

	public String getResult() {
		return result;
	}
	
	public String getOp() {
		return op;
	}
	
	public String getHashAlg() {
		return hashAlg;
	}
	
	public String getHash() {
		return hash;
	}

	

	
}
