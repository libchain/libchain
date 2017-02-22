package com.libchain.library.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Book.
 */
@Entity
@Table(name = "book")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Book implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "pub_key")
    private String pubKey;

    @ManyToOne
    private LibUser libUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Book title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPubKey() {
        return pubKey;
    }

    public Book pubKey(String pubKey) {
        this.pubKey = pubKey;
        return this;
    }

    public void setPubKey(String pubKey) {
        this.pubKey = pubKey;
    }

    public LibUser getLibUser() {
        return libUser;
    }

    public Book libUser(LibUser libUser) {
        this.libUser = libUser;
        return this;
    }

    public void setLibUser(LibUser libUser) {
        this.libUser = libUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Book book = (Book) o;
        if (book.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, book.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Book{" +
            "id=" + id +
            ", title='" + title + "'" +
            ", pubKey='" + pubKey + "'" +
            '}';
    }
}
