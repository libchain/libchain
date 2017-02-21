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

    @GetMapping("/borrow/{bookInstanceId}/{pubkey}")
    @Timed
    public ResponseEntity borrow(@PathVariable Long bookInstanceId, @PathVariable String pubkey) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/books/all")
    @Timed
    public ResponseEntity listAllBooks() {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/statistics/allBooks")
    @Timed
    public ResponseEntity statisticsAll() {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/statistics/publisher/{publisherId}")
    @Timed
    public ResponseEntity statisticsPublisher(@PathVariable String publisherId) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/statistics/book/{bookId}")
    @Timed
    public ResponseEntity statisticsBooks(@PathVariable String bookId) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

}
