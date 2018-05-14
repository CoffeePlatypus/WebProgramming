package com.cs402.hw5.repositories;

import org.springframework.stereotype.Repository;

@Repository
public class DefaultRepository {
	// [] add, sub, mul, div, exp
	String[] xDefaults = {"0", "1", "2", "4", "8"};
	String[] yDefaults = {"0", "0", "3", "1", "2"};

	public String getAddXDefault() {
		return xDefaults[0];
	}

	public String getAddYDefault() {
		return yDefaults[0];
	}

	public String getSubXDefault() {
		return xDefaults[1];
	}

	public String getSubYDefault() {
		return yDefaults[1];
	}

	public String getMulXDefault() {
		return xDefaults[2];
	}
	
	public String getMulYDefault() {
		return yDefaults[2];
	}

	public String getDivXDefault() {
		return yDefaults[3];
	}

	public String getDivYDefault() {
		return xDefaults[3];
	}
	
	public String getExpXDefault() {
		return xDefaults[4];
	}

	public String getExpYDefault() {
		return yDefaults[4];
	}
	
    public void setAddXDefault(String s) {
		xDefaults[0] = s;
	}

	public void setAddYDefault(String s) {
		yDefaults[0] = s;
	}

	public void setSubXDefault(String s) {
		xDefaults[1] = s;
	}

	public void setSubYDefault(String s) {
		yDefaults[1] = s;
	}

	public void setMulXDefault(String s) {
		xDefaults[2] = s;
	}
	
	public void setMulYDefault(String s) {
		yDefaults[2] = s;
	}

	public void setDivXDefault(String s) {
		yDefaults[3] = s;
	}

	public void setDivYDefault(String s) {
		xDefaults[3] = s;
	}
	
	public void setExpXDefault(String s) {
		xDefaults[4] = s;
	}

	public void setExpYDefault(String s) {
		yDefaults[4] = s;
	}
   
}
