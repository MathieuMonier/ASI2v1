package com.cpe.springboot.gen_card_service.model;

public class CardBasics {
    private String name;
    private String description;
    private String family;
    private String affinity;
    private String imgUrl;
    private String smallImgUrl;

    public CardBasics() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFamily() { return family; }
    public void setFamily(String family) { this.family = family; }

    public String getAffinity() { return affinity; }
    public void setAffinity(String affinity) { this.affinity = affinity; }

    public String getImgUrl() { return imgUrl; }
    public void setImgUrl(String imgUrl) { this.imgUrl = imgUrl; }

    public String getSmallImgUrl() { return smallImgUrl; }
    public void setSmallImgUrl(String smallImgUrl) { this.smallImgUrl = smallImgUrl; }
}
