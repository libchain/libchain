package com.libchain.library.repository;

import com.libchain.library.domain.LibUser;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the LibUser entity.
 */
@SuppressWarnings("unused")
public interface LibUserRepository extends JpaRepository<LibUser,Long> {

}
