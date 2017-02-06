package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ToC;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the ToC entity.
 */
@SuppressWarnings("unused")
public interface ToCRepository extends JpaRepository<ToC,Long> {

}
