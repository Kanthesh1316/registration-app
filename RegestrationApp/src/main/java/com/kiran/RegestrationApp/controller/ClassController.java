package com.kiran.RegestrationApp.controller;

import com.kiran.RegestrationApp.dto.ScheduleRequest;
import com.kiran.RegestrationApp.service.ClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @PostMapping("/batches")
    public ResponseEntity<?> createBatch(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(classService.createBatch(body.get("name")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/batches")
    public ResponseEntity<?> getBatches() {
        return ResponseEntity.ok(classService.getBatches());
    }

    @PostMapping("/batches/{id}/students")
    public ResponseEntity<?> addStudent(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            classService.addStudent(id, body.get("email"));
            return ResponseEntity.ok("Student added");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/classes")
    public ResponseEntity<?> schedule(@RequestBody ScheduleRequest request) {
        try {
            return ResponseEntity.ok(classService.scheduleClass(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/classes")
    public ResponseEntity<?> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/classes/my")
    public ResponseEntity<?> myClasses(Authentication authentication) {
        return ResponseEntity.ok(classService.getMyClasses(authentication.getName()));
    }
    @PostMapping("/batches/upload")
    public ResponseEntity<?> uploadBatch(@RequestParam("batchName") String batchName,
                                         @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(classService.createBatchFromExcel(batchName, file));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/batches/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(classService.updateStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/batches/{id}/link")
    public ResponseEntity<?> updateLink(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(classService.updateLink(id, body.get("meetLink")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}