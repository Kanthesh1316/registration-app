package com.kiran.RegestrationApp.repository;

import com.kiran.RegestrationApp.entity.LiveClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LiveClassRepository extends JpaRepository<LiveClass, Long> {

    @Query("select c from LiveClass c join c.batch b join b.students s " +
            "where s.email = :email order by c.startTime")
    List<LiveClass> findForStudent(@Param("email") String email);
}