package com.hms.radarui.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.client.RestTemplate;

/**
 * 
 * @author EVRY IND
 *
 */
@Configuration
@PropertySource(value = { "classpath:db-queries.properties"})
public class AppConfig {

	@Value("${spring.datasource.driver-class-name}")
	String dataSourceDriver;
	@Value("${spring.datasource.url}")
	String dataSourceURL;
	@Value("${spring.datasource.username}")
	String dataSourceUserNm;
	@Value("${spring.datasource.password}")
	String dataSourcePass;

	
	//Uncomment datasource bean
	/**
	 * DataSource bean
	 * @return
	 *//*
	@Bean
	public DataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName(dataSourceDriver);
		dataSource.setUrl(dataSourceURL);
		dataSource.setUsername(dataSourceUserNm);
		dataSource.setPassword(dataSourcePass);
		return dataSource;
	}
*/
	/**
	 * Property Holder Config bean
	 * @return
	 */
	@Bean
	public static PropertySourcesPlaceholderConfigurer propertyConfigInDev() {
		return new PropertySourcesPlaceholderConfigurer();
	}
	
	/**
	 * Rest template bean
	 * @return
	 */
	@Bean
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}

}