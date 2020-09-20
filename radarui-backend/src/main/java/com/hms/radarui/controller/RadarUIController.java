package com.hms.radarui.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import com.hms.radarui.service.FileService;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.*;
import com.hms.radarui.domain.Csv;



@RestController
@RequestMapping("/hmsRadar")
public class RadarUIController {

	//protected final static Logger logger = LoggerFactory.getLogger(RadaruiController.class);
	
	@Autowired
	private FileService fileService;
	
	//file to DB
	@Autowired
	private RestTemplate restTemplate;

	@RequestMapping(value = "/csv", method = RequestMethod.POST)
	public String uploadCsvFile(@RequestParam("csv") MultipartFile file)
	{
		fileService.processCsv(file);
		return "success";
	}
	
	@CrossOrigin
	@RequestMapping(value = "/demo", method = RequestMethod.GET)
	public String demo()
	{
		return "demo running on azure";
	}
	
	
	@CrossOrigin
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	public ResponseEntity<Object> uploadFile(@RequestParam("uploadfile") MultipartFile file) {
		System.out.println("Alert--- Reached upload");
		fileService.processCsv(file);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	//DB to REST
	@CrossOrigin
	@RequestMapping(value="/getRecords",method=RequestMethod.GET)
	public List<Csv> getCsvData()
	{
		return fileService.getCsvRecords();
	}
		
	}
