package com.cpe.springboot.gen_card_service.model;

/**
 * DTO local, structure identique à com.cpe.springboot.card.model.CardDTO du store
 * pour que le store puisse désérialiser sans problème.
 */
public class CardDTO extends CardBasics {
    private Integer id;
    private float energy;
    private float hp;
    private float defence;
    private float attack;
    private float price;
    private Integer userId;

    public CardDTO() {}

    // Getters & setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public float getEnergy() { return energy; }
    public void setEnergy(float energy) { this.energy = energy; }

    public float getHp() { return hp; }
    public void setHp(float hp) { this.hp = hp; }

    public float getDefence() { return defence; }
    public void setDefence(float defence) { this.defence = defence; }

    public float getAttack() { return attack; }
    public void setAttack(float attack) { this.attack = attack; }

    public float getPrice() { return price; }
    public void setPrice(float price) { this.price = price; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
