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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

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
         *              - Response: Forbidden
         * 3. create transaction lib --> pubkey
         * Response: OK
         */

        try {
            String output = exec("truffle exec borrow.js");

            if (output.equals("OK")) {
                return new ResponseEntity(output, HttpStatus.OK);
            } else {
                return new ResponseEntity(output, HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/info/truffleVersion")
    @ApiOperation(value = "truffle version",
        notes = "returns the installed truffle version")
    @Timed
    public ResponseEntity truffleVersion() {
        String output = "";
        try {
            output = exec("truffle version");
        } catch (IOException | InterruptedException | RuntimeException e) {
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity(output, HttpStatus.OK);
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

    private String exec(String cmd) throws IOException, InterruptedException {
        Runtime rt = Runtime.getRuntime();

        String output = "";

        String line;
        Process pr = rt.exec(cmd);
        BufferedReader in = new BufferedReader(
            new InputStreamReader(pr.getInputStream()));
        while ((line = in.readLine()) != null) {
            output += line;
        }
        in.close();
        pr.waitFor();
        if (pr.exitValue() != 0)
            throw new RuntimeException();

        return output;
    }

}
