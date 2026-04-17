# 课程管理系统自动化测试脚本
# 测试环境：开发环境
# 日期：2026-04-14

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  课程管理系统 - 自动化测试" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"
$frontendUrl = "http://localhost:3000"
$testResults = @()
$passCount = 0
$failCount = 0

# 测试结果记录函数
function Record-Test {
    param(
        [string]$Module,
        [string]$TestName,
        [bool]$Passed,
        [string]$Message
    )
    
    $status = if ($Passed) { "✅ PASS" } else { "❌ FAIL" }
    Write-Host "[$status] $Module - $TestName" -ForegroundColor $(if ($Passed) { "Green" } else { "Red" })
    
    if (-not $Passed) {
        Write-Host "       错误: $Message" -ForegroundColor Yellow
    }
    
    $script:testResults += [PSCustomObject]@{
        Module = $Module
        TestName = $TestName
        Passed = $Passed
        Message = $Message
    }
    
    if ($Passed) {
        $script:passCount++
    } else {
        $script:failCount++
    }
}

# ============================================
# 一、服务可用性测试
# ============================================
Write-Host "`n📡 一、服务可用性测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 测试后端服务
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/swagger-ui.html" -Method GET -TimeoutSec 5
    Record-Test "服务可用性" "后端服务运行正常" $true "Swagger UI 可访问"
}
catch {
    Record-Test "服务可用性" "后端服务运行正常" $false $_.Exception.Message
}

# 测试前端服务
try {
    $response = Invoke-WebRequest -Uri "$frontendUrl" -Method GET -TimeoutSec 5 -UseBasicParsing
    Record-Test "服务可用性" "前端服务运行正常" ($response.StatusCode -eq 200) "HTTP $($response.StatusCode)"
}
catch {
    Record-Test "服务可用性" "前端服务运行正常" $false $_.Exception.Message
}

# ============================================
# 二、认证模块测试
# ============================================
Write-Host "`n🔐 二、认证模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# 2.1 管理员登录
try {
    $loginBody = @{
        studentId = "ADMIN001"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/auth/admin-login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResult.code -eq 200 -and $loginResult.data.accessToken) {
        Record-Test "认证模块" "管理员登录成功" $true "返回 Access Token"
        $adminToken = $loginResult.data.accessToken
        $adminRefreshToken = $loginResult.data.refreshToken
    } else {
        Record-Test "认证模块" "管理员登录成功" $false "返回码: $($loginResult.code)"
    }
} catch {
    Record-Test "认证模块" "管理员登录成功" $false $_.Exception.Message
}

# 2.2 Token 有效性验证
if ($adminToken) {
    try {
        $headers = @{
            Authorization = "Bearer $adminToken"
        }
        $userResult = Invoke-RestMethod -Uri "$baseUrl/api/users?page=1&size=10" -Method GET -Headers $headers
        
        if ($userResult.code -eq 200) {
            Record-Test "认证模块" "Token 有效性验证" $true "成功获取用户列表"
        } else {
            Record-Test "认证模块" "Token 有效性验证" $false "返回码: $($userResult.code)"
        }
    } catch {
        Record-Test "认证模块" "Token 有效性验证" $false $_.Exception.Message
    }
}

# 2.3 学员登录测试
try {
    $studentLoginBody = @{
        studentId = "S001"
        password = "123456"
    } | ConvertTo-Json
    
    $studentLoginResult = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $studentLoginBody -ContentType "application/json"
    
    if ($studentLoginResult.code -eq 200) {
        Record-Test "认证模块" "学员登录接口" $true "接口正常响应"
        $studentToken = $studentLoginResult.data.accessToken
    } else {
        Record-Test "认证模块" "学员登录接口" $false "返回码: $($studentLoginResult.code) (可能账号不存在)"
    }
} catch {
    Record-Test "认证模块" "学员登录接口" $false $_.Exception.Message
}

# ============================================
# 三、用户管理模块测试
# ============================================
Write-Host "`n👥 三、用户管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 3.1 获取用户列表
    try {
        $userUrl = "$baseUrl/api/users"
        $queryParams = @{page=1; size=10}
        $users = Invoke-RestMethod -Uri $userUrl -Method GET -Headers $headers -Body $queryParams
        
        if ($users.code -eq 200 -and $users.data.records.Count -gt 0) {
            Record-Test "用户管理" "获取用户列表" $true "获取到 $($users.data.records.Count) 个用户"
        } else {
            Record-Test "用户管理" "获取用户列表" $false "返回数据为空"
        }
    } catch {
        Record-Test "用户管理" "获取用户列表" $false $_.Exception.Message
    }
    
    # 3.2 搜索用户
    try {
        $searchUrl = "$baseUrl/api/users"
        $searchParams = @{page=1; size=10; keyword='管理员'}
        $searchUsers = Invoke-RestMethod -Uri $searchUrl -Method GET -Headers $headers -Body $searchParams
        
        if ($searchUsers.code -eq 200) {
            Record-Test "用户管理" "搜索用户功能" $true "搜索接口正常"
        } else {
            Record-Test "用户管理" "搜索用户功能" $false "返回码: $($searchUsers.code)"
        }
    } catch {
        Record-Test "用户管理" "搜索用户功能" $false $_.Exception.Message
    }
    
    # 3.3 创建新用户
    try {
        $newUser = @{
            studentId = "S_TEST_$(Get-Date -Format 'yyyyMMddHHmmss')"
            name = "测试学员"
            password = "123456"
            role = "student"
            company = "测试公司"
            position = "测试职位"
        } | ConvertTo-Json
        
        $createResult = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $newUser -ContentType "application/json" -Headers $headers
        
        if ($createResult.code -eq 200) {
            Record-Test "用户管理" "创建新用户" $true "用户创建成功"
            $testUserId = $createResult.data.id
        } else {
            Record-Test "用户管理" "创建新用户" $false "返回码: $($createResult.code)"
        }
    } catch {
        Record-Test "用户管理" "创建新用户" $false $_.Exception.Message
    }
    
    # 3.4 更新用户信息
    if ($testUserId) {
        try {
            $updateUser = @{
                name = "测试学员-已更新"
                company = "更新后的公司"
                position = "测试职位"
            } | ConvertTo-Json
            
            $updateResult = Invoke-RestMethod -Uri "$baseUrl/api/users/$testUserId" -Method PUT -Body $updateUser -ContentType "application/json" -Headers $headers
            
            if ($updateResult.code -eq 200) {
                Record-Test "用户管理" "更新用户信息" $true "更新成功"
            } else {
                Record-Test "用户管理" "更新用户信息" $false "返回码: $($updateResult.code)"
            }
        } catch {
            Record-Test "用户管理" "更新用户信息" $false $_.Exception.Message
        }
    }
}

# ============================================
# 四、班级管理模块测试
# ============================================
Write-Host "`n🏫 四、班级管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 4.1 获取班级列表
    try {
        $classUrl = "$baseUrl/api/classes"
        $classParams = @{page=1; size=10}
        $classes = Invoke-RestMethod -Uri $classUrl -Method GET -Headers $headers -Body $classParams
        
        if ($classes.code -eq 200) {
            $classCount = if ($classes.data.records) { $classes.data.records.Count } else { 0 }
            Record-Test "班级管理" "获取班级列表" $true "获取到 $classCount 个班级"
        } else {
            Record-Test "班级管理" "获取班级列表" $false "返回码: $($classes.code)"
        }
    } catch {
        Record-Test "班级管理" "获取班级列表" $false $_.Exception.Message
    }
    
    # 4.2 创建新班级
    try {
        $newClass = @{
            name = "测试班级_$(Get-Date -Format 'yyyyMMddHHmmss')"
            description = "自动化测试创建的班级"
            status = "active"
        } | ConvertTo-Json
        
        $createClassResult = Invoke-RestMethod -Uri "$baseUrl/api/classes" -Method POST -Body $newClass -ContentType "application/json" -Headers $headers
        
        if ($createClassResult.code -eq 200) {
            Record-Test "班级管理" "创建新班级" $true "班级创建成功"
            $testClassId = $createClassResult.data.id
        } else {
            Record-Test "班级管理" "创建新班级" $false "返回码: $($createClassResult.code)"
        }
    } catch {
        Record-Test "班级管理" "创建新班级" $false $_.Exception.Message
    }
}

# ============================================
# 五、课程管理模块测试
# ============================================
Write-Host "`n📚 五、课程管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 5.1 获取课程列表
    try {
        $courseUrl = "$baseUrl/api/courses"
        $courseParams = @{page=1; size=10}
        $courses = Invoke-RestMethod -Uri $courseUrl -Method GET -Headers $headers -Body $courseParams
        
        if ($courses.code -eq 200) {
            $courseCount = if ($courses.data.records) { $courses.data.records.Count } else { 0 }
            Record-Test "课程管理" "获取课程列表" $true "获取到 $courseCount 个课程"
        } else {
            Record-Test "课程管理" "获取课程列表" $false "返回码: $($courses.code)"
        }
    } catch {
        Record-Test "课程管理" "获取课程列表" $false $_.Exception.Message
    }
}

# ============================================
# 六、作业管理模块测试
# ============================================
Write-Host "`n📝 六、作业管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 6.1 获取作业列表
    try {
        $assignmentUrl = "$baseUrl/api/assignments"
        $assignmentParams = @{page=1; size=10}
        $assignments = Invoke-RestMethod -Uri $assignmentUrl -Method GET -Headers $headers -Body $assignmentParams
        
        if ($assignments.code -eq 200) {
            $assignmentCount = if ($assignments.data.records) { $assignments.data.records.Count } else { 0 }
            Record-Test "作业管理" "获取作业列表" $true "获取到 $assignmentCount 个作业"
        } else {
            Record-Test "作业管理" "获取作业列表" $false "返回码: $($assignments.code)"
        }
    } catch {
        Record-Test "作业管理" "获取作业列表" $false $_.Exception.Message
    }
}

# ============================================
# 七、评价管理模块测试
# ============================================
Write-Host "`n⭐ 七、评价管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 7.1 获取评价列表
    try {
        $evaluationUrl = "$baseUrl/api/evaluations"
        $evaluationParams = @{page=1; size=10}
        $evaluations = Invoke-RestMethod -Uri $evaluationUrl -Method GET -Headers $headers -Body $evaluationParams
        
        if ($evaluations.code -eq 200) {
            $evaluationCount = if ($evaluations.data.records) { $evaluations.data.records.Count } else { 0 }
            Record-Test "评价管理" "获取评价列表" $true "获取到 $evaluationCount 个评价"
        } else {
            Record-Test "评价管理" "获取评价列表" $false "返回码: $($evaluations.code)"
        }
    } catch {
        Record-Test "评价管理" "获取评价列表" $false $_.Exception.Message
    }
}

# ============================================
# 八、考勤管理模块测试
# ============================================
Write-Host "`n📅 八、考勤管理模块测试" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($adminToken) {
    $headers = @{ Authorization = "Bearer $adminToken" }
    
    # 8.1 获取打卡任务列表
    try {
        $checkinUrl = "$baseUrl/api/attendance/checkins"
        $checkinParams = @{page=1; size=10}
        $checkins = Invoke-RestMethod -Uri $checkinUrl -Method GET -Headers $headers -Body $checkinParams
        
        if ($checkins.code -eq 200) {
            $checkinCount = if ($checkins.data.records) { $checkins.data.records.Count } else { 0 }
            Record-Test "考勤管理" "获取打卡任务列表" $true "获取到 $checkinCount 个打卡任务"
        } else {
            Record-Test "考勤管理" "获取打卡任务列表" $false "返回码: $($checkins.code)"
        }
    } catch {
        Record-Test "考勤管理" "获取打卡任务列表" $false $_.Exception.Message
    }
    
    # 8.2 创建打卡任务
    try {
        $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
        $newCheckin = @{
            courseId = 1
            title = "自动化测试打卡"
            startTime = $tomorrow
            endTime = $tomorrow
            status = "active"
        } | ConvertTo-Json
        
        $createCheckinResult = Invoke-RestMethod -Uri "$baseUrl/api/attendance/checkins" -Method POST -Body $newCheckin -ContentType "application/json" -Headers $headers
        
        if ($createCheckinResult.code -eq 200) {
            Record-Test "考勤管理" "创建打卡任务" $true "打卡任务创建成功"
        } else {
            Record-Test "考勤管理" "创建打卡任务" $false "返回码: $($createCheckinResult.code)"
        }
    } catch {
        Record-Test "考勤管理" "创建打卡任务" $false $_.Exception.Message
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

# 按模块分组显示
$testResults | Group-Object Module | ForEach-Object {
    Write-Host "`n📌 $($_.Name)" -ForegroundColor Yellow
    $_.Group | ForEach-Object {
        $status = if ($_.Passed) { "✅" } else { "❌" }
        Write-Host "  $status $($_.TestName)" -ForegroundColor $(if ($_.Passed) { "Green" } else { "Red" })
        if (-not $_.Passed) {
            Write-Host "     └─ 错误: $($_.Message)" -ForegroundColor Gray
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
if ($passRate -ge 80) {
    Write-Host "  ✅ 测试通过！系统运行正常" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  测试未完全通过，请检查失败项" -ForegroundColor Yellow
}
Write-Host "========================================`n" -ForegroundColor Cyan

# 保存测试报告到文件
$reportContent = @"
# 自动化测试报告
生成时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 测试概览
- 测试总数: $totalTests
- 通过数量: $passCount
- 失败数量: $failCount
- 通过率: $passRate%

## 详细结果
$(($testResults | ForEach-Object { "- $($_.Module) - $($_.TestName): $(if($_.Passed){'✅ PASS'}else{'❌ FAIL - ' + $_.Message})" }) -join "`n")
"@

$reportContent | Out-File -FilePath "$PSScriptRoot\TEST_REPORT.md" -Encoding UTF8
Write-Host "📄 测试报告已保存到: TEST_REPORT.md`n" -ForegroundColor Cyan
