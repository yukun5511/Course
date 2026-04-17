package com.course.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * 导师数据统计DTO
 */
@Data
public class InstructorStatsDTO {
    private Long instructorId;
    private String instructorName;
    
    // 授课统计
    private Long totalCourses;
    private Long completedCourses;
    private Long ongoingCourses;
    
    // 学生评价
    private Double averageRating;
    private Long totalEvaluations;
    
    // 出勤率
    private Double attendanceRate;
    
    // 作业批改
    private Long totalAssignments;
    private Double gradedRate;
    
    // 月度授课趋势
    private List<Map<String, Object>> monthlyTrend;
}
