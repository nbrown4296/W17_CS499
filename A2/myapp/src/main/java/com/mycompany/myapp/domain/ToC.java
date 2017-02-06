package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A ToC.
 */
@Entity
@Table(name = "toc")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ToC implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "chapters", nullable = false)
    private String chapters;

    @ManyToOne(optional = false)
    @NotNull
    private Book pages;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChapters() {
        return chapters;
    }

    public ToC chapters(String chapters) {
        this.chapters = chapters;
        return this;
    }

    public void setChapters(String chapters) {
        this.chapters = chapters;
    }

    public Book getPages() {
        return pages;
    }

    public ToC pages(Book book) {
        this.pages = book;
        return this;
    }

    public void setPages(Book book) {
        this.pages = book;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ToC toC = (ToC) o;
        if (toC.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, toC.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "ToC{" +
            "id=" + id +
            ", chapters='" + chapters + "'" +
            '}';
    }
}
