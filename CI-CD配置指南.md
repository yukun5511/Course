# CI/CD 配置指南

**创建时间**: 2026-04-16 14:49  
**CI平台**: GitHub Actions  
**工作流文件**: [.github/workflows/ci.yml](../.github/workflows/ci.yml)

---

## 📋 概述

项目已配置完整的CI/CD流程，包括：
- ✅ 自动化测试
- ✅ 代码覆盖率检查
- ✅ 前端构建
- ✅ 代码质量检查
- ✅ 构建产物管理

---

## 🔄 工作流程

### 触发条件

工作流在以下情况自动运行：
1. **推送到分支**: `main`, `master`, `develop`
2. **Pull Request**:  targeting `main`, `master`

### 工作流程图

```
代码提交/Pull Request
        ↓
   ┌─────────────┐
   │ 并行执行     │
   └─────────────┘
        ↓
   ┌────┴────┬────────────┐
   ↓         ↓            ↓
后端测试   前端构建    代码质量检查
   ↓         ↓            ↓
  ✅/❌     ✅/❌        ✅/❌
   └────┬────┴────────────┘
        ↓
   所有任务成功？
        ↓
   ┌────┴────┐
   │         │
  是        否
   ↓         ↓
部署预览   标记失败
(可选)
```

---

## 📊 工作流任务详解

### 1. 后端测试 (backend-test)

**运行环境**: Ubuntu LTS  
**执行时间**: 预计3-5分钟

#### 步骤
1. **Checkout代码** - 拉取最新代码
2. **设置JDK 17** - 配置Java环境
3. **缓存Maven依赖** - 加速构建
4. **运行测试** - 执行`mvn clean test`
5. **上传测试结果** - 保存测试报告
6. **上传覆盖率报告** - 保存JaCoCo报告
7. **检查覆盖率阈值** - 验证最低覆盖率要求

#### 数据库配置
```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: course_management
```

#### 环境变量
```yaml
env:
  SPRING_DATASOURCE_URL: jdbc:mysql://localhost:3306/course_management
  SPRING_DATASOURCE_USERNAME: root
  SPRING_DATASOURCE_PASSWORD: root
```

---

### 2. 前端构建 (frontend-build)

**运行环境**: Ubuntu LTS  
**执行时间**: 预计1-2分钟

#### 步骤
1. **Checkout代码** - 拉取最新代码
2. **设置Node.js 18** - 配置Node环境
3. **缓存npm依赖** - 加速安装
4. **安装依赖** - 执行`npm ci`
5. **代码检查** - 执行`npm run lint`（如有）
6. **构建项目** - 执行`npm run build`
7. **上传构建产物** - 保存dist目录

---

### 3. 代码质量检查 (code-quality)

**运行环境**: Ubuntu LTS  
**执行时间**: 预计1-2分钟

#### 步骤
1. **Checkout代码** - 拉取最新代码
2. **设置JDK 17** - 配置Java环境
3. **PMD代码分析** - 检查代码质量（可选）
4. **Checkstyle检查** - 检查代码风格（可选）

---

### 4. 部署预览 (deploy-preview)

**运行环境**: Ubuntu LTS  
**触发条件**: 仅Pull Request  
**状态**: 可选配置

#### 步骤
1. **下载前端构建产物**
2. **部署到预览环境**（需配置）

---

## 📦 构建产物

### 后端产物
- **测试报告**: `backend/target/surefire-reports/`
- **覆盖率报告**: `backend/target/site/jacoco/`
  - HTML报告: `index.html`
  - CSV报告: `jacoco.csv`
  - XML报告: `jacoco.xml`

### 前端产物
- **构建文件**: `frontend/dist/`

---

## ⚙️ 自定义配置

### 1. 修改覆盖率阈值

编辑 `.github/workflows/ci.yml`:

```yaml
- name: Check coverage threshold
  run: |
    # 修改这里的阈值
    MIN_COVERAGE=80  # 设置最低80%
    # 添加检查逻辑
```

### 2. 添加代码质量工具

#### PMD配置
在 `backend/pom.xml` 添加：
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-pmd-plugin</artifactId>
    <version>3.21.0</version>
</plugin>
```

#### Checkstyle配置
在 `backend/pom.xml` 添加：
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.1</version>
</plugin>
```

### 3. 配置部署目标

#### GitHub Pages
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./frontend/dist
```

#### Vercel
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🔍 查看结果

### GitHub Actions页面
1. 访问: `https://github.com/你的用户名/Course/actions`
2. 点击具体的工作流运行
3. 查看每个任务的详细日志

### 下载构建产物
1. 在工作流运行页面
2. 滚动到底部 "Artifacts" 部分
3. 点击下载需要的产物

### 查看覆盖率报告
1. 下载 `coverage-report` 产物
2. 解压后打开 `index.html`
3. 查看详细的覆盖率分析

---

## 🚨 常见问题

### Q1: 测试失败怎么办？

**步骤**:
1. 查看工作流日志
2. 定位失败的测试
3. 本地复现问题
4. 修复后重新提交

**查看日志**:
```
GitHub → Actions → 工作流运行 → 后端测试 → 查看日志
```

### Q2: 构建太慢如何优化？

**优化建议**:
1. ✅ 已配置Maven缓存
2. ✅ 已配置npm缓存
3. 减少不必要的依赖
4. 使用增量构建

### Q3: 如何跳过CI？

在commit message中添加:
```
[skip ci]
```

或

```
[ci skip]
```

### Q4: 数据库连接失败？

**检查**:
1. MySQL服务是否正常启动
2. 数据库配置是否正确
3. 环境变量是否设置

**本地测试**:
```bash
cd backend
mvn test
```

---

## 📈 最佳实践

### 1. 分支策略
```
main/master     - 生产环境（稳定）
develop         - 开发环境（集成）
feature/*       - 功能分支
bugfix/*        - 修复分支
```

### 2. Pull Request流程
1. 从 `develop` 创建功能分支
2. 开发并本地测试
3. 提交代码（自动触发CI）
4. 等待CI通过
5. 创建Pull Request
6. 代码审查
7. 合并到 `develop`

### 3. 覆盖率要求
- **最低要求**: 5%（当前）
- **短期目标**: 20%
- **中期目标**: 50%
- **长期目标**: 80%+

### 4. 代码审查清单
- [ ] CI测试全部通过
- [ ] 代码覆盖率未下降
- [ ] 无安全漏洞
- [ ] 代码符合规范
- [ ] 功能测试通过

---

## 🔐 安全配置

### 敏感信息处理

**不要**在代码中硬编码：
- ❌ 数据库密码
- ❌ API密钥
- ❌ Token

**使用GitHub Secrets**:
```yaml
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
  API_KEY: ${{ secrets.API_KEY }}
```

**配置Secrets**:
1. GitHub仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加密钥

---

## 📚 扩展阅读

- [GitHub Actions文档](https://docs.github.com/en/actions)
- [JaCoCo Maven插件](https://www.eclemma.org/jacoco/trunk/doc/maven.html)
- [Maven Surefire插件](https://maven.apache.org/surefire/maven-surefire-plugin/)
- [Vite构建优化](https://vitejs.dev/guide/build.html)

---

## 🎯 下一步优化

### 短期（1-2周）
- [ ] 添加覆盖率阈值检查
- [ ] 配置代码质量工具（PMD/Checkstyle）
- [ ] 添加安全扫描

### 中期（1-2月）
- [ ] 集成SonarQube
- [ ] 配置自动化部署
- [ ] 添加性能测试

### 长期（3-6月）
- [ ] 完整的CD流程
- [ ] 多环境部署（dev/staging/prod）
- [ ] 自动化回归测试

---

**配置版本**: v1.0  
**创建时间**: 2026-04-16 14:49  
**维护者**: 开发团队
