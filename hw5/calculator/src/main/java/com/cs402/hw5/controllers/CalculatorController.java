package com.cs402.hw5.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cs402.hw5.models.Calculation;
import com.cs402.hw5.services.CalculatorService;

@RestController
@RequestMapping( "/api/v1/" )
public class CalculatorController {
	
	@Autowired
	private CalculatorService calcService;
	
	@RequestMapping( value = "{operation}", method = RequestMethod.GET )
	public Calculation calculateG( @PathVariable String operation, 
			@RequestParam(value = "x", defaultValue = "") String x, 
			@RequestParam(value = "y", defaultValue = "") String y,
			@RequestHeader("hash-alg") String hashAlg) {
		return calcService.calculate(operation, x, y, hashAlg);
	}
	
	@RequestMapping( value = "{operation}", method = RequestMethod.POST )
	public Calculation calculateP( @PathVariable String operation, 
			@RequestParam(value = "x", defaultValue = "") String x, 
			@RequestParam(value = "y", defaultValue = "") String y,
			@RequestHeader("hash-alg") String hashAlg) {
		calcService.updateDefaults(x,y, operation);
		return calcService.calculate(operation, x, y, hashAlg);
	}
}
