package com.kiran.RegestrationApp.repository;
import java.util.Optional;
import com.kiran.RegestrationApp.entity.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {
    boolean existsByEmail(String email);
    Optional<PersonalDetails> findFirstByEmail(String email);
}