package com.libchain.library.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.libchain.library.domain.Library;

import com.libchain.library.repository.LibraryRepository;
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
 * REST controller for managing Library.
 */
@RestController
@RequestMapping("/api")
public class LibraryResource {

    private final Logger log = LoggerFactory.getLogger(LibraryResource.class);

    private static final String ENTITY_NAME = "library";
        
    private final LibraryRepository libraryRepository;

    public LibraryResource(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    /**
     * POST  /libraries : Create a new library.
     *
     * @param library the library to create
     * @return the ResponseEntity with status 201 (Created) and with body the new library, or with status 400 (Bad Request) if the library has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/libraries")
    @Timed
    public ResponseEntity<Library> createLibrary(@RequestBody Library library) throws URISyntaxException {
        log.debug("REST request to save Library : {}", library);
        if (library.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new library cannot already have an ID")).body(null);
        }
        Library result = libraryRepository.save(library);
        return ResponseEntity.created(new URI("/api/libraries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /libraries : Updates an existing library.
     *
     * @param library the library to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated library,
     * or with status 400 (Bad Request) if the library is not valid,
     * or with status 500 (Internal Server Error) if the library couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/libraries")
    @Timed
    public ResponseEntity<Library> updateLibrary(@RequestBody Library library) throws URISyntaxException {
        log.debug("REST request to update Library : {}", library);
        if (library.getId() == null) {
            return createLibrary(library);
        }
        Library result = libraryRepository.save(library);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, library.getId().toString()))
            .body(result);
    }

    /**
     * GET  /libraries : get all the libraries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of libraries in body
     */
    @GetMapping("/libraries")
    @Timed
    public List<Library> getAllLibraries() {
        log.debug("REST request to get all Libraries");
        List<Library> libraries = libraryRepository.findAll();
        return libraries;
    }

    /**
     * GET  /libraries/:id : get the "id" library.
     *
     * @param id the id of the library to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the library, or with status 404 (Not Found)
     */
    @GetMapping("/libraries/{id}")
    @Timed
    public ResponseEntity<Library> getLibrary(@PathVariable Long id) {
        log.debug("REST request to get Library : {}", id);
        Library library = libraryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(library));
    }

    /**
     * DELETE  /libraries/:id : delete the "id" library.
     *
     * @param id the id of the library to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/libraries/{id}")
    @Timed
    public ResponseEntity<Void> deleteLibrary(@PathVariable Long id) {
        log.debug("REST request to delete Library : {}", id);
        libraryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}
