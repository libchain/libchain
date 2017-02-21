package com.libchain.library.web.rest;

import com.libchain.library.LibchainApp;

import com.libchain.library.domain.Library;
import com.libchain.library.repository.LibraryRepository;
import com.libchain.library.web.rest.errors.ExceptionTranslator;

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
 * Test class for the LibraryResource REST controller.
 *
 * @see LibraryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LibchainApp.class)
public class LibraryResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PUB_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PUB_KEY = "BBBBBBBBBB";

    private static final String DEFAULT_PRIV_KEY = "AAAAAAAAAA";
    private static final String UPDATED_PRIV_KEY = "BBBBBBBBBB";

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLibraryMockMvc;

    private Library library;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            LibraryResource libraryResource = new LibraryResource(libraryRepository);
        this.restLibraryMockMvc = MockMvcBuilders.standaloneSetup(libraryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Library createEntity(EntityManager em) {
        Library library = new Library()
                .name(DEFAULT_NAME)
                .pubKey(DEFAULT_PUB_KEY)
                .privKey(DEFAULT_PRIV_KEY);
        return library;
    }

    @Before
    public void initTest() {
        library = createEntity(em);
    }

    @Test
    @Transactional
    public void createLibrary() throws Exception {
        int databaseSizeBeforeCreate = libraryRepository.findAll().size();

        // Create the Library

        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isCreated());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeCreate + 1);
        Library testLibrary = libraryList.get(libraryList.size() - 1);
        assertThat(testLibrary.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLibrary.getPubKey()).isEqualTo(DEFAULT_PUB_KEY);
        assertThat(testLibrary.getPrivKey()).isEqualTo(DEFAULT_PRIV_KEY);
    }

    @Test
    @Transactional
    public void createLibraryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = libraryRepository.findAll().size();

        // Create the Library with an existing ID
        Library existingLibrary = new Library();
        existingLibrary.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibraryMockMvc.perform(post("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingLibrary)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLibraries() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        // Get all the libraryList
        restLibraryMockMvc.perform(get("/api/libraries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(library.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].pubKey").value(hasItem(DEFAULT_PUB_KEY.toString())))
            .andExpect(jsonPath("$.[*].privKey").value(hasItem(DEFAULT_PRIV_KEY.toString())));
    }

    @Test
    @Transactional
    public void getLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);

        // Get the library
        restLibraryMockMvc.perform(get("/api/libraries/{id}", library.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(library.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.pubKey").value(DEFAULT_PUB_KEY.toString()))
            .andExpect(jsonPath("$.privKey").value(DEFAULT_PRIV_KEY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLibrary() throws Exception {
        // Get the library
        restLibraryMockMvc.perform(get("/api/libraries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);
        int databaseSizeBeforeUpdate = libraryRepository.findAll().size();

        // Update the library
        Library updatedLibrary = libraryRepository.findOne(library.getId());
        updatedLibrary
                .name(UPDATED_NAME)
                .pubKey(UPDATED_PUB_KEY)
                .privKey(UPDATED_PRIV_KEY);

        restLibraryMockMvc.perform(put("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLibrary)))
            .andExpect(status().isOk());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeUpdate);
        Library testLibrary = libraryList.get(libraryList.size() - 1);
        assertThat(testLibrary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLibrary.getPubKey()).isEqualTo(UPDATED_PUB_KEY);
        assertThat(testLibrary.getPrivKey()).isEqualTo(UPDATED_PRIV_KEY);
    }

    @Test
    @Transactional
    public void updateNonExistingLibrary() throws Exception {
        int databaseSizeBeforeUpdate = libraryRepository.findAll().size();

        // Create the Library

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLibraryMockMvc.perform(put("/api/libraries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(library)))
            .andExpect(status().isCreated());

        // Validate the Library in the database
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLibrary() throws Exception {
        // Initialize the database
        libraryRepository.saveAndFlush(library);
        int databaseSizeBeforeDelete = libraryRepository.findAll().size();

        // Get the library
        restLibraryMockMvc.perform(delete("/api/libraries/{id}", library.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Library> libraryList = libraryRepository.findAll();
        assertThat(libraryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Library.class);
    }
}
