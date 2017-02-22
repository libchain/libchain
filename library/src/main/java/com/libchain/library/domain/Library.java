package com.libchain.library.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * The Library entity.
 */
@ApiModel(description = "The Library entity.")
@Entity
@Table(name = "library")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Library implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "pub_key")
    private String pubKey;

    @Column(name = "priv_key")
    private String privKey;

    @OneToMany(mappedBy = "library")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<LibUser> members = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Library name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPubKey() {
        return pubKey;
    }

    public Library pubKey(String pubKey) {
        this.pubKey = pubKey;
        return this;
    }

    public void setPubKey(String pubKey) {
        this.pubKey = pubKey;
    }

    public String getPrivKey() {
        return privKey;
    }

    public Library privKey(String privKey) {
        this.privKey = privKey;
        return this;
    }

    public void setPrivKey(String privKey) {
        this.privKey = privKey;
    }

    public Set<LibUser> getMembers() {
        return members;
    }

    public Library members(Set<LibUser> libUsers) {
        this.members = libUsers;
        return this;
    }

    public Library addMember(LibUser libUser) {
        this.members.add(libUser);
        libUser.setLibrary(this);
        return this;
    }

    public Library removeMember(LibUser libUser) {
        this.members.remove(libUser);
        libUser.setLibrary(null);
        return this;
    }

    public void setMembers(Set<LibUser> libUsers) {
        this.members = libUsers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Library library = (Library) o;
        if (library.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, library.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Library{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", pubKey='" + pubKey + "'" +
            ", privKey='" + privKey + "'" +
            '}';
    }
}
