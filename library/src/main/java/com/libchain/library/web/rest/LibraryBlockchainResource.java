package com.libchain.library.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by gerrit on 16.02.17.
 */
@RestController
@RequestMapping("/blockchain/library")
public class LibraryBlockchainResource {

    @GetMapping("/borrow/{bookInstanceId}")
    @Timed
    public ResponseEntity borrow(@PathVariable Long bookInstanceId) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

}
