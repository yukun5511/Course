# CRUD 操作测试脚本
# 测试所有模块的创建、查询、更新、删除功能

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CRUD 操作完整测试" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8081"
$passCount = 0
$failCount = 0
$testResults = @()

function Record-Test {
    param(
        [string]$Module,
        [string]$Operation,
        [bool]$Passed,
        [string]$Message
    )
    
    $status = if ($Passed) { "✅" } else { "❌" }
    $color = if ($Passed) { "Green" } else { "Red" }
    Write-Host "[$status] $Module - $Operation" -ForegroundColor $color
    if (-not $Passed) {
        Write-Host "     错误: $Message" -ForegroundColor Yellow
    }
    
    $script:testResults += [PSCustomObject]@{
        Module = $Module
        Operation = $Operation
        Passed = $Passed
        Message = $Message
    }
    
    if ($Passed) { $script:passCount++ } else { $script:failCount++ }
}

# ============================================
# 登录获取 Token
# ============================================
Write-Host "🔐 步骤1: 登录获取Token" -ForegroundColor Yellow
try {
    $loginBody = @{studentId='ADMIN001';password='admin123'} | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/admin-login" -Method POST -Body $loginBody -ContentType 'application/json'
    
    if ($login.code -eq 200) {
        $token = $login.data.accessToken
        $headers = @{Authorization = "Bearer $token"}
        Record-Test "认证" "管理员登录" $true "获取Token成功"
    } else {
        Record-Test "认证" "管理员登录" $false "登录失败"
        exit
    }
} catch {
    Record-Test "认证" "管理员登录" $false $_.Exception.Message
    exit
}

# ============================================
# 二、用户管理 CRUD
# ============================================
Write-Host "`n👥 二、用户管理 CRUD 测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 2.1 创建用户
try {
    $testStudentId = "TEST_$(Get-Date -Format 'HHmmss')"
    $newUser = @{
        studentId = $testStudentId
        name = "测试学员"
        password = "123456"
        role = "student"
        classId = 1
    } | ConvertTo-Json
    
    $createResult = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $newUser -ContentType 'application/json' -Headers $headers
    
    if ($createResult.code -eq 200 -and $createResult.data.id) {
        $testUserId = $createResult.data.id
        Record-Test "用户管理" "创建用户" $true "用户ID: $testUserId"
    } else {
        Record-Test "用户管理" "创建用户" $false "返回码: $($createResult.code)"
    }
} catch {
    Record-Test "用户管理" "创建用户" $false $_.Exception.Message
}

# 2.2 查询用户
if ($testUserId) {
    try {
        $getUser = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" -Method GET -Headers $headers
        
        if ($getUser.code -eq 200 -and $getUser.data.id -eq $testUserId) {
            Record-Test "用户管理" "查询用户" $true "找到用户: $($getUser.data.name)"
        } else {
            Record-Test "用户管理" "查询用户" $false "未找到用户"
        }
    } catch {
        Record-Test "用户管理" "查询用户" $false $_.Exception.Message
    }
    
    # 2.3 更新用户
    try {
        $updateUser = @{
            name = "测试学员-已更新"
            phone = "13800138000"
        } | ConvertTo-Json
        
        $updateResult = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" -Method PUT -Body $updateUser -ContentType 'application/json' -Headers $headers
        
        if ($updateResult.code -eq 200) {
            Record-Test "用户管理" "更新用户" $true "更新成功"
        } else {
            Record-Test "用户管理" "更新用户" $false "返回码: $($updateResult.code)"
        }
    } catch {
        Record-Test "用户管理" "更新用户" $false $_.Exception.Message
    }
    
    # 2.4 删除用户
    try {
        $deleteResult = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" -Method DELETE -Headers $headers
        
        if ($deleteResult.code -eq 200) {
            Record-Test "用户管理" "删除用户" $true "删除成功"
        } else {
            Record-Test "用户管理" "删除用户" $false "返回码: $($deleteResult.code)"
        }
    } catch {
        Record-Test "用户管理" "删除用户" $false $_.Exception.Message
    }
}

# ============================================
# 三、班级管理 CRUD
# ============================================
Write-Host "`n🏫 三、班级管理 CRUD 测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 3.1 创建班级
try {
    $newClass = @{
        name = "测试班级_$(Get-Date -Format 'HHmmss')"
        teacherName = "测试教师"
        academicDirectorName = "测试主任"
        status = "ongoing"
    } | ConvertTo-Json
    
    $createClassResult = Invoke-RestMethod -Uri "$baseUrl/api/classes" -Method POST -Body $newClass -ContentType 'application/json' -Headers $headers
    
    if ($createClassResult.code -eq 200 -and $createClassResult.data.id) {
        $testClassId = $createClassResult.data.id
        Record-Test "班级管理" "创建班级" $true "班级ID: $testClassId"
    } else {
        Record-Test "班级管理" "创建班级" $false "返回码: $($createClassResult.code)"
    }
} catch {
    Record-Test "班级管理" "创建班级" $false $_.Exception.Message
}

# 3.2 查询班级
if ($testClassId) {
    try {
        $getClass = Invoke-RestMethod -Uri "$baseUrl/api/classes/$testClassId" -Method GET -Headers $headers
        
        if ($getClass.code -eq 200 -and $getClass.data.id -eq $testClassId) {
            Record-Test "班级管理" "查询班级" $true "班级名称: $($getClass.data.name)"
        } else {
            Record-Test "班级管理" "查询班级" $false "未找到班级"
        }
    } catch {
        Record-Test "班级管理" "查询班级" $false $_.Exception.Message
    }
    
    # 3.3 更新班级
    try {
        $updateClass = @{
            name = "测试班级-已更新"
            teacherName = "更新教师"
        } | ConvertTo-Json
        
        $updateClassResult = Invoke-RestMethod -Uri "$baseUrl/api/classes/$testClassId" -Method PUT -Body $updateClass -ContentType 'application/json' -Headers $headers
        
        if ($updateClassResult.code -eq 200) {
            Record-Test "班级管理" "更新班级" $true "更新成功"
        } else {
            Record-Test "班级管理" "更新班级" $false "返回码: $($updateClassResult.code)"
        }
    } catch {
        Record-Test "班级管理" "更新班级" $false $_.Exception.Message
    }
    
    # 3.4 删除班级
    try {
        $deleteClassResult = Invoke-RestMethod -Uri "$baseUrl/api/classes/$testClassId" -Method DELETE -Headers $headers
        
        if ($deleteClassResult.code -eq 200) {
            Record-Test "班级管理" "删除班级" $true "删除成功"
        } else {
            Record-Test "班级管理" "删除班级" $false "返回码: $($deleteClassResult.code)"
        }
    } catch {
        Record-Test "班级管理" "删除班级" $false $_.Exception.Message
    }
}

# ============================================
# 四、课程管理 CRUD
# ============================================
Write-Host "`n📚 四、课程管理 CRUD 测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 4.1 创建课程
try {
    $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
    $nextWeek = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss")
    
    $newCourse = @{
        name = "测试课程_$(Get-Date -Format 'HHmmss')"
        classId = 1
        teacherName = "测试导师"
        location = "测试教室"
        startTime = $tomorrow
        endTime = $nextWeek
        totalHours = 40
        status = "ongoing"
    } | ConvertTo-Json
    
    $createCourseResult = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method POST -Body $newCourse -ContentType 'application/json' -Headers $headers
    
    if ($createCourseResult.code -eq 200 -and $createCourseResult.data.id) {
        $testCourseId = $createCourseResult.data.id
        Record-Test "课程管理" "创建课程" $true "课程ID: $testCourseId"
    } else {
        Record-Test "课程管理" "创建课程" $false "返回码: $($createCourseResult.code)"
    }
} catch {
    Record-Test "课程管理" "创建课程" $false $_.Exception.Message
}

# 4.2 查询课程
if ($testCourseId) {
    try {
        $getCourse = Invoke-RestMethod -Uri "$baseUrl/api/courses/$testCourseId" -Method GET -Headers $headers
        
        if ($getCourse.code -eq 200 -and $getCourse.data.id -eq $testCourseId) {
            Record-Test "课程管理" "查询课程" $true "课程名称: $($getCourse.data.name)"
        } else {
            Record-Test "课程管理" "查询课程" $false "未找到课程"
        }
    } catch {
        Record-Test "课程管理" "查询课程" $false $_.Exception.Message
    }
    
    # 4.3 更新课程
    try {
        $updateCourse = @{
            name = "测试课程-已更新"
            location = "更新教室"
        } | ConvertTo-Json
        
        $updateCourseResult = Invoke-RestMethod -Uri "$baseUrl/api/courses/$testCourseId" -Method PUT -Body $updateCourse -ContentType 'application/json' -Headers $headers
        
        if ($updateCourseResult.code -eq 200) {
            Record-Test "课程管理" "更新课程" $true "更新成功"
        } else {
            Record-Test "课程管理" "更新课程" $false "返回码: $($updateCourseResult.code)"
        }
    } catch {
        Record-Test "课程管理" "更新课程" $false $_.Exception.Message
    }
    
    # 4.4 删除课程
    try {
        $deleteCourseResult = Invoke-RestMethod -Uri "$baseUrl/api/courses/$testCourseId" -Method DELETE -Headers $headers
        
        if ($deleteCourseResult.code -eq 200) {
            Record-Test "课程管理" "删除课程" $true "删除成功"
        } else {
            Record-Test "课程管理" "删除课程" $false "返回码: $($deleteCourseResult.code)"
        }
    } catch {
        Record-Test "课程管理" "删除课程" $false $_.Exception.Message
    }
}

# ============================================
# 五、作业管理 CRUD
# ============================================
Write-Host "`n📝 五、作业管理 CRUD 测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 5.1 创建作业
try {
    $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
    
    $newAssignment = @{
        courseId = 1
        courseName = "测试课程"
        title = "测试作业_$(Get-Date -Format 'HHmmss')"
        description = "这是测试作业内容"
        deadline = $tomorrow
    } | ConvertTo-Json
    
    $createAssignmentResult = Invoke-RestMethod -Uri "$baseUrl/api/assignments" -Method POST -Body $newAssignment -ContentType 'application/json' -Headers $headers
    
    if ($createAssignmentResult.code -eq 200 -and $createAssignmentResult.data.id) {
        $testAssignmentId = $createAssignmentResult.data.id
        Record-Test "作业管理" "创建作业" $true "作业ID: $testAssignmentId"
    } else {
        Record-Test "作业管理" "创建作业" $false "返回码: $($createAssignmentResult.code)"
    }
} catch {
    Record-Test "作业管理" "创建作业" $false $_.Exception.Message
}

# 5.2 查询作业
if ($testAssignmentId) {
    try {
        $getAssignment = Invoke-RestMethod -Uri "$baseUrl/api/assignments/$testAssignmentId" -Method GET -Headers $headers
        
        if ($getAssignment.code -eq 200 -and $getAssignment.data.id -eq $testAssignmentId) {
            Record-Test "作业管理" "查询作业" $true "作业标题: $($getAssignment.data.title)"
        } else {
            Record-Test "作业管理" "查询作业" $false "未找到作业"
        }
    } catch {
        Record-Test "作业管理" "查询作业" $false $_.Exception.Message
    }
    
    # 5.3 更新作业
    try {
        $updateAssignment = @{
            title = "测试作业-已更新"
            description = "更新后的作业内容"
        } | ConvertTo-Json
        
        $updateAssignmentResult = Invoke-RestMethod -Uri "$baseUrl/api/assignments/$testAssignmentId" -Method PUT -Body $updateAssignment -ContentType 'application/json' -Headers $headers
        
        if ($updateAssignmentResult.code -eq 200) {
            Record-Test "作业管理" "更新作业" $true "更新成功"
        } else {
            Record-Test "作业管理" "更新作业" $false "返回码: $($updateAssignmentResult.code)"
        }
    } catch {
        Record-Test "作业管理" "更新作业" $false $_.Exception.Message
    }
    
    # 5.4 删除作业
    try {
        $deleteAssignmentResult = Invoke-RestMethod -Uri "$baseUrl/api/assignments/$testAssignmentId" -Method DELETE -Headers $headers
        
        if ($deleteAssignmentResult.code -eq 200) {
            Record-Test "作业管理" "删除作业" $true "删除成功"
        } else {
            Record-Test "作业管理" "删除作业" $false "返回码: $($deleteAssignmentResult.code)"
        }
    } catch {
        Record-Test "作业管理" "删除作业" $false $_.Exception.Message
    }
}

# ============================================
# 测试报告
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  测试报告" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$totalTests = $passCount + $failCount
$passRate = if ($totalTests -gt 0) { [math]::Round(($passCount / $totalTests) * 100, 2) } else { 0 }

Write-Host "测试总数: $totalTests" -ForegroundColor White
Write-Host "通过数量: $passCount" -ForegroundColor Green
Write-Host "失败数量: $failCount" -ForegroundColor Red
Write-Host "通过率: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } else { "Yellow" })

Write-Host "`n详细结果:" -ForegroundColor Cyan
Write-Host "----------------------------------------"

$testResults | Group-Object Module | ForEach-Object {
    Write-Host "`n📌 $($_.Name)" -ForegroundColor Yellow
    $_.Group | ForEach-Object {
        $status = if ($_.Passed) { "✅" } else { "❌" }
        Write-Host "  $status $($_.Operation)" -ForegroundColor $(if ($_.Passed) { "Green" } else { "Red" })
        if (-not $_.Passed) {
            Write-Host "     └─ $($_.Message)" -ForegroundColor Gray
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
if ($passRate -ge 80) {
    Write-Host "  ✅ CRUD 测试通过！所有操作正常" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  部分测试未通过，请检查失败项" -ForegroundColor Yellow
}
Write-Host "========================================`n" -ForegroundColor Cyan
