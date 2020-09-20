package com.hms.radarui.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Collection;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.hms.radarui.domain.Csv;

@Service
public class FileService {
	
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public void processCsv(MultipartFile file) {
		try
		{
			 BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(),"UTF-8"));
			 CSVParser csvParser=new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());
			
			 List<CSVRecord> csvRecords=csvParser.getRecords();
		
		String sql="insert into public.technology values(?,?,?,?,?)";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			public void setValues(PreparedStatement ps, int i) throws SQLException
			{
				ps.setString(1, csvRecords.get(i).get("name"));
				ps.setString(2, csvRecords.get(i).get("quadrant"));
				ps.setString(3, csvRecords.get(i).get("ring"));
				ps.setString(4, csvRecords.get(i).get("isNew"));
				ps.setString(5, csvRecords.get(i).get("description"));		
				//ps.setString(1, csvRecords.get(i).get("tech_nm"));
			}
			public int getBatchSize()
			{
				return csvRecords.size();
			}
		});
		}
	 catch (Exception e)
	{
	 e.printStackTrace();
      
 }
}
	
	public List<Csv> getCsvRecords()
	{
		String sql="select name, quadrant, ring,description, isNew from public.technology order by (case ring when 'Trial' then 1\r\n" + 
				"when 'Emerging' then 2\r\n" + 
				"when 'Standard' then 3\r\n" + 
				"when 'Contained' then 4\r\n" + 
				"when 'Retired' then 5 end) ";
		List<Csv> csvRecords=jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Csv.class));
		return csvRecords;
		
		
	}
	
	
}



