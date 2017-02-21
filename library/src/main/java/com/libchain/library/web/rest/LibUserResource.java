package com.libchain.library.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.libchain.library.domain.LibUser;

import com.libchain.library.repository.LibUserRepository;
import com.libchain.library.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing LibUser.
 */
@RestController
@RequestMapping("/api")
public class LibUserResource {

    private final Logger log = LoggerFactory.getLogger(LibUserResource.class);

    private static final String ENTITY_NAME = "libUser";
        
    private final LibUserRepository libUserRepository;

    public LibUserResource(LibUserRepository libUserRepository) {
        this.libUserRepository = libUserRepository;
    }

    /**
     * POST  /lib-users : Create a new libUser.
     *
     * @param libUser the libUser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new libUser, or with status 400 (Bad Request) if the libUser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/lib-users")
    @Timed
    public ResponseEntity<LibUser> createLibUser(@RequestBody LibUser libUser) throws URISyntaxException {
        log.debug("REST request to save LibUser : {}", libUser);
        if (libUser.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new libUser cannot already have an ID")).body(null);
        }
        LibUser result = libUserRepository.save(libUser);
        return ResponseEntity.created(new URI("/api/lib-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /lib-users : Updates an existing libUser.
     *
     * @param libUser the libUser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated libUser,
     * or with status 400 (Bad Request) if the libUser is not valid,
     * or with status 500 (Internal Server Error) if the libUser couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/lib-users")
    @Timed
    public ResponseEntity<LibUser> updateLibUser(@RequestBody LibUser libUser) throws URISyntaxException {
        log.debug("REST request to update LibUser : {}", libUser);
        if (libUser.getId() == null) {
            return createLibUser(libUser);
        }
        LibUser result = libUserRepository.save(libUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, libUser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /lib-users : get all the libUsers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of libUsers in body
     */
    @GetMapping("/lib-users")
    @Timed
    public List<LibUser> getAllLibUsers() {
        log.debug("REST request to get all LibUsers");
        List<LibUser> libUsers = libUserRepository.findAll();
        return libUsers;
    }

    /**
     * GET  /lib-users/:id : get the "id" libUser.
     *
     * @param id the id of the libUser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the libUser, or with status 404 (Not Found)
     */
    @GetMapping("/lib-users/{id}")
    @Timed
    public ResponseEntity<LibUser> getLibUser(@PathVariable Long id) {
        log.debug("REST request to get LibUser : {}", id);
        LibUser libUser = libUserRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(libUser));
    }

    /**
     * DELETE  /lib-users/:id : delete the "id" libUser.
     *
     * @param id the id of the libUser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/lib-users/{id}")
    @Timed
    public ResponseEntity<Void> deleteLibUser(@PathVariable Long id) {
        log.debug("REST request to delete LibUser : {}", id);
        libUserRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}
