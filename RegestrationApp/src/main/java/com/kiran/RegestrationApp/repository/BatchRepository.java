package com.kiran.RegestrationApp.repository;

import com.kiran.RegestrationApp.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}