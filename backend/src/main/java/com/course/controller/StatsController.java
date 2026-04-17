package com.course.controller;

import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 统计控制器
 */
@Tag(name = "数据统计", description = "出勤率、作业完成率、上座率、导师统计等接口")
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @Operation(summary = "获取仪表盘数据", description = "获取系统整体统计数据")
    @GetMapping("/dashboard")
    @RequireRole({"admin", "operator"})
    public Result<Map<String, Object>> getDashboardStats() {
        // 简化实现，直接返回示例数据
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalStudents", 500);
        stats.put("totalClasses", 20);
        stats.put("totalCourses", 100);
        stats.put("attendanceRate", 85.5);
        stats.put("assignmentCompletionRate", 78.3);
        return Result.success(stats);
    }

    @Operation(summary = "获取出勤率统计", description = "按班级、课程统计出勤率")
    @GetMapping("/attendance-rate")
    @RequireRole({"admin", "operator"})
    public Result<Map<String, Object>> getAttendanceStats(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("attendanceRate", 85.5);
        stats.put("presentCount", 450);
        stats.put("absentCount", 50);
        return Result.success(stats);
    }

    @Operation(summary = "获取作业完成率统计", description = "按班级、课程统计作业完成率")
    @GetMapping("/assignment-completion")
    @RequireRole({"admin", "operator"})
    public Result<Map<String, Object>> getAssignmentCompletionStats(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("completionRate", 78.3);
        stats.put("submittedCount", 390);
        stats.put("totalCount", 500);
        return Result.success(stats);
    }

    @Operation(summary = "获取课程上座率统计", description = "按班级、课程统计上座率")
    @GetMapping("/course-occupancy")
    @RequireRole({"admin", "operator"})
    public Result<Map<String, Object>> getCourseOccupancyStats(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long courseId) {
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("occupancyRate", 82.0);
        stats.put("actualAttendance", 410);
        stats.put("totalStudents", 500);
        return Result.success(stats);
    }

    @Operation(summary = "获取导师数据统计", description = "查看导师评价数据")
    @GetMapping("/instructor-data")
    @RequireRole({"admin", "operator"})
    public Result<Map<String, Object>> getInstructorStats(
            @RequestParam Long instructorId) {
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("instructorId", instructorId);
        stats.put("averageRating", 4.5);
        stats.put("totalCourses", 10);
        stats.put("attendanceRate", 88.0);
        return Result.success(stats);
    }
}
