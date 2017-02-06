package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.MyappApp;

import com.mycompany.myapp.domain.ToC;
import com.mycompany.myapp.domain.Book;
import com.mycompany.myapp.repository.ToCRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ToCResource REST controller.
 *
 * @see ToCResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MyappApp.class)
public class ToCResourceIntTest {

    private static final String DEFAULT_CHAPTERS = "AAAAAAAAAA";
    private static final String UPDATED_CHAPTERS = "BBBBBBBBBB";

    @Autowired
    private ToCRepository toCRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private EntityManager em;

    private MockMvc restToCMockMvc;

    private ToC toC;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            ToCResource toCResource = new ToCResource(toCRepository);
        this.restToCMockMvc = MockMvcBuilders.standaloneSetup(toCResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ToC createEntity(EntityManager em) {
        ToC toC = new ToC()
                .chapters(DEFAULT_CHAPTERS);
        // Add required entity
        Book pages = BookResourceIntTest.createEntity(em);
        em.persist(pages);
        em.flush();
        toC.setPages(pages);
        return toC;
    }

    @Before
    public void initTest() {
        toC = createEntity(em);
    }

    @Test
    @Transactional
    public void createToC() throws Exception {
        int databaseSizeBeforeCreate = toCRepository.findAll().size();

        // Create the ToC

        restToCMockMvc.perform(post("/api/to-cs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toC)))
            .andExpect(status().isCreated());

        // Validate the ToC in the database
        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeCreate + 1);
        ToC testToC = toCList.get(toCList.size() - 1);
        assertThat(testToC.getChapters()).isEqualTo(DEFAULT_CHAPTERS);
    }

    @Test
    @Transactional
    public void createToCWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = toCRepository.findAll().size();

        // Create the ToC with an existing ID
        ToC existingToC = new ToC();
        existingToC.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restToCMockMvc.perform(post("/api/to-cs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingToC)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkChaptersIsRequired() throws Exception {
        int databaseSizeBeforeTest = toCRepository.findAll().size();
        // set the field null
        toC.setChapters(null);

        // Create the ToC, which fails.

        restToCMockMvc.perform(post("/api/to-cs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toC)))
            .andExpect(status().isBadRequest());

        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllToCS() throws Exception {
        // Initialize the database
        toCRepository.saveAndFlush(toC);

        // Get all the toCList
        restToCMockMvc.perform(get("/api/to-cs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(toC.getId().intValue())))
            .andExpect(jsonPath("$.[*].chapters").value(hasItem(DEFAULT_CHAPTERS.toString())));
    }

    @Test
    @Transactional
    public void getToC() throws Exception {
        // Initialize the database
        toCRepository.saveAndFlush(toC);

        // Get the toC
        restToCMockMvc.perform(get("/api/to-cs/{id}", toC.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(toC.getId().intValue()))
            .andExpect(jsonPath("$.chapters").value(DEFAULT_CHAPTERS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingToC() throws Exception {
        // Get the toC
        restToCMockMvc.perform(get("/api/to-cs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateToC() throws Exception {
        // Initialize the database
        toCRepository.saveAndFlush(toC);
        int databaseSizeBeforeUpdate = toCRepository.findAll().size();

        // Update the toC
        ToC updatedToC = toCRepository.findOne(toC.getId());
        updatedToC
                .chapters(UPDATED_CHAPTERS);

        restToCMockMvc.perform(put("/api/to-cs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedToC)))
            .andExpect(status().isOk());

        // Validate the ToC in the database
        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeUpdate);
        ToC testToC = toCList.get(toCList.size() - 1);
        assertThat(testToC.getChapters()).isEqualTo(UPDATED_CHAPTERS);
    }

    @Test
    @Transactional
    public void updateNonExistingToC() throws Exception {
        int databaseSizeBeforeUpdate = toCRepository.findAll().size();

        // Create the ToC

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restToCMockMvc.perform(put("/api/to-cs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(toC)))
            .andExpect(status().isCreated());

        // Validate the ToC in the database
        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteToC() throws Exception {
        // Initialize the database
        toCRepository.saveAndFlush(toC);
        int databaseSizeBeforeDelete = toCRepository.findAll().size();

        // Get the toC
        restToCMockMvc.perform(delete("/api/to-cs/{id}", toC.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ToC> toCList = toCRepository.findAll();
        assertThat(toCList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ToC.class);
    }
}
