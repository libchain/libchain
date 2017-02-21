package com.libchain.library.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.libchain.library.security.AuthoritiesConstants;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created by gerrit on 16.02.17.
 */
@RestController
@RequestMapping("/api/blockchain/library")
public class LibraryBlockchainResource {
    private final Logger log = LoggerFactory.getLogger(LibraryBlockchainResource.class);

    @Secured(AuthoritiesConstants.USER)
    @GetMapping("/borrow/{bookInstanceId}/{pubkey}")
    @ApiOperation(value = "borrow a book",
        notes = "borrow a book with a bookId and a public key that is used in transaction")
    @Timed
    public ResponseEntity borrow(@PathVariable Long bookInstanceId, @PathVariable String pubkey) {

        /**
         * 1. Get the logged in user
         * 2. Get Book
         *      - check whether an instance is available
         *          not available:
         *              - Response: Failed
         * 3. create transaction lib --> pubkey
         * Response: OK
         */

        /*truffle exec <path/to/file.js>*/

        Runtime rt = Runtime.getRuntime();
        try {
            Process pr = rt.exec("truffle exec borrow.js");
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/books/all")
    @ApiOperation(value = "list books",
        notes = "list all available books")
    @Timed
    public ResponseEntity listAllBooks() {

        /*
        *       databaseQuery on book repository
        *
         */

        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @Secured(AuthoritiesConstants.ADMIN)
    @GetMapping("/statistics/allBooks")
    @Timed
    public ResponseEntity statisticsAll() {

        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @Secured(AuthoritiesConstants.ADMIN)
    @GetMapping("/statistics/publisher/{publisherId}")
    @Timed
    public ResponseEntity statisticsPublisher(@PathVariable String publisherId) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

    @Secured(AuthoritiesConstants.ADMIN)
    @GetMapping("/statistics/book/{bookId}")
    @Timed
    public ResponseEntity statisticsBooks(@PathVariable String bookId) {
        return new ResponseEntity(HttpStatus.NOT_IMPLEMENTED);
    }

}
