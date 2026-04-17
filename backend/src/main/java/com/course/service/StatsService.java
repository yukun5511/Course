package com.course.service;

import com.course.dto.response.AttendanceStatsDTO;
import com.course.dto.response.DashboardStatsDTO;
import com.course.dto.response.InstructorStatsDTO;

import java.util.Map;

/**
 * 统计服务接口
 */
public interface StatsService {
    
    /**
     * 获取仪表盘统计数据
     */
    DashboardStatsDTO getDashboardStats();
    
    /**
     * 获取出勤率统计
     */
    AttendanceStatsDTO getAttendanceStats(Long classId, Long courseId);
    
    /**
     * 获取作业完成率统计
     */
    Map<String, Object> getAssignmentCompletionStats(Long classId, Long courseId);
    
    /**
     * 获取课程上座率统计
     */
    Map<String, Object> getCourseOccupancyStats(Long classId, Long courseId);
    
    /**
     * 获取导师数据统计
     */
    InstructorStatsDTO getInstructorStats(Long instructorId);
}
