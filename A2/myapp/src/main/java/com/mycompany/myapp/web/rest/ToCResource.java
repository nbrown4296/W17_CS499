package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.ToC;

import com.mycompany.myapp.repository.ToCRepository;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ToC.
 */
@RestController
@RequestMapping("/api")
public class ToCResource {

    private final Logger log = LoggerFactory.getLogger(ToCResource.class);

    private static final String ENTITY_NAME = "toC";
        
    private final ToCRepository toCRepository;

    public ToCResource(ToCRepository toCRepository) {
        this.toCRepository = toCRepository;
    }

    /**
     * POST  /to-cs : Create a new toC.
     *
     * @param toC the toC to create
     * @return the ResponseEntity with status 201 (Created) and with body the new toC, or with status 400 (Bad Request) if the toC has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/to-cs")
    @Timed
    public ResponseEntity<ToC> createToC(@Valid @RequestBody ToC toC) throws URISyntaxException {
        log.debug("REST request to save ToC : {}", toC);
        if (toC.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new toC cannot already have an ID")).body(null);
        }
        ToC result = toCRepository.save(toC);
        return ResponseEntity.created(new URI("/api/to-cs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /to-cs : Updates an existing toC.
     *
     * @param toC the toC to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated toC,
     * or with status 400 (Bad Request) if the toC is not valid,
     * or with status 500 (Internal Server Error) if the toC couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/to-cs")
    @Timed
    public ResponseEntity<ToC> updateToC(@Valid @RequestBody ToC toC) throws URISyntaxException {
        log.debug("REST request to update ToC : {}", toC);
        if (toC.getId() == null) {
            return createToC(toC);
        }
        ToC result = toCRepository.save(toC);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, toC.getId().toString()))
            .body(result);
    }

    /**
     * GET  /to-cs : get all the toCS.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of toCS in body
     */
    @GetMapping("/to-cs")
    @Timed
    public List<ToC> getAllToCS() {
        log.debug("REST request to get all ToCS");
        List<ToC> toCS = toCRepository.findAll();
        return toCS;
    }

    /**
     * GET  /to-cs/:id : get the "id" toC.
     *
     * @param id the id of the toC to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the toC, or with status 404 (Not Found)
     */
    @GetMapping("/to-cs/{id}")
    @Timed
    public ResponseEntity<ToC> getToC(@PathVariable Long id) {
        log.debug("REST request to get ToC : {}", id);
        ToC toC = toCRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(toC));
    }

    /**
     * DELETE  /to-cs/:id : delete the "id" toC.
     *
     * @param id the id of the toC to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/to-cs/{id}")
    @Timed
    public ResponseEntity<Void> deleteToC(@PathVariable Long id) {
        log.debug("REST request to delete ToC : {}", id);
        toCRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}
