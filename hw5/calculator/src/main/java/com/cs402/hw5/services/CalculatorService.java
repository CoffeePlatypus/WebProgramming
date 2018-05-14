package com.cs402.hw5.services;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.cs402.hw5.models.Calculation;
import com.cs402.hw5.repositories.DefaultRepository;

@Service
public class CalculatorService {
	
	@Autowired
	DefaultRepository defaults;

	public Calculation calculate(String op, String x, String y, String hashAlg) {
		System.out.println("calc "+x+" "+op+" "+y);
		Calculation calc = new Calculation(x, y, op, hashAlg);
		
		switch(op) {
			case "add" : calc = add(calc); break;
			case "sub" : calc = sub(calc); break;
			case "mul" : calc = mul(calc); break;
			case "div" : calc = div(calc); break;
			case "exp" : calc = exp(calc); break; 
			default : ; // TODO change to throw exception but too lazy
		}
		calc = addHash(calc, hashAlg);
		return calc;
	}

	private Calculation addHash(Calculation calc, String hashAlg) {
		// TODO figure out hashes
		try  {
			switch(hashAlg) {
				case "sha1"   : return sha1Hash(calc);
				case "md5"    : return md5Hash(calc);
				case "sha256" : return sha256Hash(calc);
				case "sha512" : return sha512Hash(calc);
				default       : throw new NoSuchAlgorithmException(); // TODO change to throw exeption
			}
		} catch (NoSuchAlgorithmException e) {
			
		}
				
		return calc;
	}
	
	private String stringy(Calculation calc) {
		switch(calc.getOp()) {
			case "add" : return calc.getX() + "+" + calc.getY() + "=" + calc.getResult();
			case "sub" : return calc.getX() + "-" + calc.getY() + "=" + calc.getResult();
			case "mul" : return calc.getX() + "x" + calc.getY() + "=" + calc.getResult();
			case "div" : return calc.getX() + "/" + calc.getY() + "=" + calc.getResult();
			case "exp" : return calc.getX() + "^" + calc.getY() + "=" + calc.getResult();
		}
		return "";
	}

	private Calculation sha1Hash(Calculation calc) throws NoSuchAlgorithmException {
		MessageDigest hasher = MessageDigest.getInstance("sha1");
		byte[] hashbytes = hasher.digest(stringy(calc).getBytes()); // todo fix format
		BigInteger num = new BigInteger(1, hashbytes);
		String hash = num.toString(16);
		while(hash.length() < 32) {
			hash = "0" + hash;
		}
		System.out.println(hash);
		calc.setHash(hash);
		return calc;
	}

	private Calculation md5Hash(Calculation calc) throws NoSuchAlgorithmException {
		MessageDigest hasher = MessageDigest.getInstance("md5");
		byte[] hashbytes = hasher.digest(stringy(calc).getBytes()); // todo fix format
		BigInteger num = new BigInteger(1, hashbytes);
		String hash = num.toString(16);
		while(hash.length() < 32) {
			hash = "0" + hash;
		}
		System.out.println(hash);
		calc.setHash(hash);
		return calc;
	}

	private Calculation sha256Hash(Calculation calc) throws NoSuchAlgorithmException {
		MessageDigest hasher = MessageDigest.getInstance("sha-256");
		byte[] hashbytes = hasher.digest(stringy(calc).getBytes()); // todo fix format
		BigInteger num = new BigInteger(1, hashbytes);
		String hash = num.toString(16);
		while(hash.length() < 32) {
			hash = "0" + hash;
		}
		System.out.println(hash);
		calc.setHash(hash);
		return calc;
	}

	private Calculation sha512Hash(Calculation calc) throws NoSuchAlgorithmException {
		MessageDigest hasher = MessageDigest.getInstance("sha-512");
		byte[] hashbytes = hasher.digest(stringy(calc).getBytes()); // todo fix format
		BigInteger num = new BigInteger(1, hashbytes);
		String hash = num.toString(16);
		while(hash.length() < 32) {
			hash = "0" + hash;
		}
		System.out.println(hash);
		calc.setHash(hash);
		return calc;
	}

	private Calculation add(Calculation calc) {
		if(calc.getX().equals("")) {
			calc.setX(defaults.getAddXDefault());
		}
		if(calc.getY().equals("")) {
			calc.setY(defaults.getAddYDefault());
		}
		
		calc.setResult((new BigInteger(calc.getX()).add(new BigInteger(calc.getY()))).toString());
		
		return calc;
	}

	private Calculation sub(Calculation calc) {
		if(calc.getX().equals("")) {
			calc.setX(defaults.getSubXDefault());
		}
		if(calc.getY().equals("")) {
			calc.setY(defaults.getSubYDefault());
		}
		
		calc.setResult((new BigInteger(calc.getX()).subtract(new BigInteger(calc.getY()))).toString());
		
		return calc;
	}

	private Calculation mul(Calculation calc) {
		if(calc.getX().equals("")) {
			calc.setX(defaults.getMulXDefault());
		}
		if(calc.getY().equals("")) {
			calc.setY(defaults.getMulYDefault());
		}
		
		calc.setResult((new BigInteger(calc.getX()).multiply(new BigInteger(calc.getY()))).toString());
		
		return calc;
	}

	private Calculation div(Calculation calc) {
		if(calc.getX().equals("")) {
			calc.setX(defaults.getDivXDefault());
		}
		if(calc.getY().equals("")) {
			calc.setY(defaults.getDivYDefault());
		}
		
		calc.setResult((new BigInteger(calc.getX()).divide(new BigInteger(calc.getY()))).toString());
		
		return calc;
	}

	private Calculation exp(Calculation calc) {
		if(calc.getX().equals("")) {
			calc.setX(defaults.getExpXDefault());
		}
		if(calc.getY().equals("")) {
			calc.setY(defaults.getExpYDefault());
		}
		
		calc.setResult((new BigInteger(calc.getX()).pow(Integer.parseInt(calc.getY()))).toString());
		
		return calc;
	}

	public void updateDefaults(String x, String y, String op) {
		if(!x.equals("")) {
			switch(op) {
				case "add" : defaults.setAddXDefault(x); break;
				case "sub" : defaults.setSubXDefault(x); break;
				case "mul" : defaults.setMulXDefault(x); break;
				case "div" : defaults.setDivXDefault(x); break;
				case "exp" : defaults.setExpXDefault(x); break; 
				default : ; // TODO change to throw exception but too lazy
			}
		}
		if(!y.equals("")) {
			switch(op) {	
				case "add" : defaults.setAddYDefault(y); break;
				case "sub" : defaults.setSubYDefault(y); break;
				case "mul" : defaults.setMulYDefault(y); break;
				case "div" : defaults.setDivYDefault(y); break;
				case "exp" : defaults.setExpYDefault(y); break; 
				default : ; // TODO change to throw exception but too lazy
			}
		}
	}

}
