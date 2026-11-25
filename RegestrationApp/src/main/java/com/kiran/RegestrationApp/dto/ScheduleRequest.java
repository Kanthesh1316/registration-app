package com.kiran.RegestrationApp.dto;

import java.time.LocalDateTime;

public record ScheduleRequest(Long batchId, String title, String meetLink, LocalDateTime startTime) {
}