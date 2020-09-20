package com.hms.radarui.domain;

import java.io.Serializable;

public class Csv implements Serializable{
	private String name;
	private String quadrant;
	private String ring;
	//private String description = description + "<p>" + hmsview +"</p>" ;
	private String description;
	private String isNew;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getQuadrant() {
		return quadrant;
	}
	public void setQuadrant(String quadrant) {
		this.quadrant = quadrant;
	}
	public String getRing() {
		return ring;
	}
	public void setRing(String ring) {
		this.ring = ring;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getIsNew() {
		return isNew;
	}
	public void setIsNew(String isNew) {
		this.isNew = isNew;
	}

}
