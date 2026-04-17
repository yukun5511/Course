package com.course.dto.response;

import lombok.Data;

/**
 * 仪表盘统计数据DTO
 */
@Data
public class DashboardStatsDTO {
    // 用户统计
    private Long totalStudents;
    private Long totalTeachers;
    private Long totalClasses;
    
    // 课程统计
    private Long totalCourses;
    private Long ongoingCourses;
    
    // 考勤统计
    private Double attendanceRate;
    private Long totalCheckins;
    
    // 作业统计
    private Double assignmentCompletionRate;
    private Long totalAssignments;
    
    // 活动统计
    private Long totalActivities;
    private Long totalRegistrations;
}
