package com.kiran.RegestrationApp.service;

import com.kiran.RegestrationApp.dto.ScheduleRequest;
import com.kiran.RegestrationApp.entity.Batch;
import com.kiran.RegestrationApp.entity.LiveClass;
import com.kiran.RegestrationApp.entity.User;
import com.kiran.RegestrationApp.repository.BatchRepository;
import com.kiran.RegestrationApp.repository.LiveClassRepository;
import com.kiran.RegestrationApp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import com.kiran.RegestrationApp.entity.BatchStatus;

import java.util.List;

@Service
public class ClassService {

    private final BatchRepository batchRepository;
    private final LiveClassRepository classRepository;
    private final UserRepository userRepository;

    public ClassService(BatchRepository batchRepository,
                        LiveClassRepository classRepository,
                        UserRepository userRepository) {
        this.batchRepository = batchRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    public Batch createBatch(String name) {
        Batch batch = new Batch();
        batch.setName(name);
        return batchRepository.save(batch);
    }

    public List<Batch> getBatches() {
        return batchRepository.findAll();
    }

    @Transactional
    public void addStudent(Long batchId, String email) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        batch.getStudents().add(user);
        batchRepository.save(batch);
    }

    public LiveClass scheduleClass(ScheduleRequest request) {
        if (request.meetLink() == null || !request.meetLink().startsWith("https://meet.google.com/")) {
            throw new RuntimeException("Enter a valid Google Meet link");
        }
        Batch batch = batchRepository.findById(request.batchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        if (batch.getStatus() == BatchStatus.COMPLETED) {
            throw new RuntimeException("Batch is completed");
        }
        batch.setMeetLink(request.meetLink());
        batchRepository.save(batch);
        LiveClass liveClass = new LiveClass();
        liveClass.setTitle(request.title());
        liveClass.setMeetLink(request.meetLink());
        liveClass.setStartTime(request.startTime());
        liveClass.setBatch(batch);
        return classRepository.save(liveClass);
    }

    public List<LiveClass> getAllClasses() {
        return classRepository.findAll();
    }

    public List<LiveClass> getMyClasses(String email) {
        return classRepository.findForStudent(email);
    }

    public Map<String, Object> createBatchFromExcel(String batchName, MultipartFile file) {
        Set<String> emails = extractEmails(file);
        if (emails.isEmpty()) {
            throw new RuntimeException("No emails found in the file");
        }
        Batch batch = new Batch();
        batch.setName(batchName);
        List<String> notRegistered = new ArrayList<>();
        int added = 0;
        for (String email : emails) {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                batch.getStudents().add(user.get());
                added++;
            } else {
                notRegistered.add(email);
            }
        }
        batchRepository.save(batch);
        return Map.of(
                "batchName", batchName,
                "added", added,
                "notRegistered", notRegistered);
    }

    private Set<String> extractEmails(MultipartFile file) {
        Set<String> emails = new LinkedHashSet<>();
        DataFormatter formatter = new DataFormatter();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            for (Sheet sheet : workbook) {
                for (Row row : sheet) {
                    for (Cell cell : row) {
                        String text = formatter.formatCellValue(cell).trim().toLowerCase();
                        if (text.matches("^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$")) {
                            emails.add(text);
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read the Excel file");
        }
        return emails;
    }
    public Batch updateStatus(Long batchId, String status) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        try {
            batch.setStatus(BatchStatus.valueOf(status));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid status");
        }
        return batchRepository.save(batch);
    }

    public Batch updateLink(Long batchId, String meetLink) {
        if (meetLink == null || !meetLink.startsWith("https://meet.google.com/")) {
            throw new RuntimeException("Enter a valid Google Meet link");
        }
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        batch.setMeetLink(meetLink);
        return batchRepository.save(batch);
    }
}