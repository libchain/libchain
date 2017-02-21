package com.libchain.library.web.rest;

import com.libchain.library.LibchainApp;

import com.libchain.library.domain.LibUser;
import com.libchain.library.repository.LibUserRepository;
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
 * Test class for the LibUserResource REST controller.
 *
 * @see LibUserResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LibchainApp.class)
public class LibUserResourceIntTest {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private LibUserRepository libUserRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLibUserMockMvc;

    private LibUser libUser;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            LibUserResource libUserResource = new LibUserResource(libUserRepository);
        this.restLibUserMockMvc = MockMvcBuilders.standaloneSetup(libUserResource)
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
    public static LibUser createEntity(EntityManager em) {
        LibUser libUser = new LibUser()
                .firstName(DEFAULT_FIRST_NAME)
                .lastName(DEFAULT_LAST_NAME)
                .email(DEFAULT_EMAIL);
        return libUser;
    }

    @Before
    public void initTest() {
        libUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createLibUser() throws Exception {
        int databaseSizeBeforeCreate = libUserRepository.findAll().size();

        // Create the LibUser

        restLibUserMockMvc.perform(post("/api/lib-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(libUser)))
            .andExpect(status().isCreated());

        // Validate the LibUser in the database
        List<LibUser> libUserList = libUserRepository.findAll();
        assertThat(libUserList).hasSize(databaseSizeBeforeCreate + 1);
        LibUser testLibUser = libUserList.get(libUserList.size() - 1);
        assertThat(testLibUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testLibUser.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testLibUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createLibUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = libUserRepository.findAll().size();

        // Create the LibUser with an existing ID
        LibUser existingLibUser = new LibUser();
        existingLibUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLibUserMockMvc.perform(post("/api/lib-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingLibUser)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<LibUser> libUserList = libUserRepository.findAll();
        assertThat(libUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLibUsers() throws Exception {
        // Initialize the database
        libUserRepository.saveAndFlush(libUser);

        // Get all the libUserList
        restLibUserMockMvc.perform(get("/api/lib-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(libUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME.toString())))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME.toString())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }

    @Test
    @Transactional
    public void getLibUser() throws Exception {
        // Initialize the database
        libUserRepository.saveAndFlush(libUser);

        // Get the libUser
        restLibUserMockMvc.perform(get("/api/lib-users/{id}", libUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(libUser.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME.toString()))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME.toString()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLibUser() throws Exception {
        // Get the libUser
        restLibUserMockMvc.perform(get("/api/lib-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLibUser() throws Exception {
        // Initialize the database
        libUserRepository.saveAndFlush(libUser);
        int databaseSizeBeforeUpdate = libUserRepository.findAll().size();

        // Update the libUser
        LibUser updatedLibUser = libUserRepository.findOne(libUser.getId());
        updatedLibUser
                .firstName(UPDATED_FIRST_NAME)
                .lastName(UPDATED_LAST_NAME)
                .email(UPDATED_EMAIL);

        restLibUserMockMvc.perform(put("/api/lib-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLibUser)))
            .andExpect(status().isOk());

        // Validate the LibUser in the database
        List<LibUser> libUserList = libUserRepository.findAll();
        assertThat(libUserList).hasSize(databaseSizeBeforeUpdate);
        LibUser testLibUser = libUserList.get(libUserList.size() - 1);
        assertThat(testLibUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testLibUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testLibUser.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void updateNonExistingLibUser() throws Exception {
        int databaseSizeBeforeUpdate = libUserRepository.findAll().size();

        // Create the LibUser

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLibUserMockMvc.perform(put("/api/lib-users")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(libUser)))
            .andExpect(status().isCreated());

        // Validate the LibUser in the database
        List<LibUser> libUserList = libUserRepository.findAll();
        assertThat(libUserList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLibUser() throws Exception {
        // Initialize the database
        libUserRepository.saveAndFlush(libUser);
        int databaseSizeBeforeDelete = libUserRepository.findAll().size();

        // Get the libUser
        restLibUserMockMvc.perform(delete("/api/lib-users/{id}", libUser.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LibUser> libUserList = libUserRepository.findAll();
        assertThat(libUserList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LibUser.class);
    }
}
