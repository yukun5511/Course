package com.course.dto.response;

import lombok.Data;

/**
 * 出勤率统计DTO
 */
@Data
public class AttendanceStatsDTO {
    private Long classId;
    private String className;
    private Long courseId;
    private String courseName;
    
    // 出勤数据
    private Long totalStudents;
    private Long presentCount;
    private Long lateCount;
    private Long absentCount;
    private Long leaveCount;
    
    // 比率
    private Double attendanceRate;
    private Double lateRate;
    private Double absentRate;
    private Double leaveRate;
}
