# 审查日志

> 每次 `/code-reviewer` 审查后自动追加记录。
> 审查范围：需求文档、测试用例、代码变更。
> 高频问题统计基于此日志自动生成。

---

<!-- 审查记录将追加在此处 -->

---

## 审查记录 #1

- **审查日期**: 2026-05-27
- **审查类型**: 需求审查
- **文档**: `docs/requirements/2026-05-27-dashboard-user-growth.md`
- **结论**: 补充后可进入
- **评分**: 完整性 8/10 | 清晰度 7/10 | 可测试性 6/10 | 综合 7/10

### Critical
| 编号 | 问题 | 状态 |
|------|------|------|
| C1 | PlainCard 复用与 StatCard 组件拆分矛盾：3.2节要求复用 PlainCard，但 PlainCard 组件（title/extra/children 接口）不支持 value/icon/rate 等属性，与 3.5节 StatCard = Card + Statistic + ComparedRate 的定义冲突 | 待修复 |
| C2 | 缺少明确验收标准（Acceptance Criteria / Definition of Done），无法判断需求是否完成 | 待补充 |

### Important
| 编号 | 问题 | 状态 |
|------|------|------|
| I1 | 日环比增长率（dayOverDayGrowthRate）计算公式缺失，正值/负值含义不明确 | 待澄清 |
| I2 | Mock 数据与 Service 函数的关联方式未定义，未说明 mock 模式切换机制 | 待澄清 |
| I3 | 响应式断点仅覆盖 <768px，缺少中等屏幕和大屏布局规则，折线图小屏适配未定义 | 待澄清 |
| I4 | 错误处理策略过于笼统，未覆盖部分失败、超时重试、空态文案等场景 | 待澄清 |

### Minor
| 编号 | 问题 | 状态 |
|------|------|------|
| M1 | 页面标题栏样式（文字、字号、颜色）未具体定义 | 建议优化 |
| M2 | 示例值是否作为 Mock 默认值未说明 | 建议优化 |
| M3 | 折线图区域填充渐变方向（线性/径向）未明确 | 建议优化 |

---

## 审查记录 #2

- **审查日期**: 2026-05-27
- **审查类型**: 测试用例审查
- **文档**: `docs/test-reports/2026-05-27-dashboard-user-growth.md`
- **需求文档**: `docs/requirements/2026-05-27-dashboard-user-growth.md`
- **结论**: 补充后可执行
- **评分**: 覆盖率 8/10 | 步骤明确性 7/10 | 预期结果 8/10 | 前置条件 8/10 | 综合 7.5/10

### 覆盖率分析

| 需求章节 | 需求功能点 | 对应用例 | 覆盖情况 |
|----------|-----------|---------|---------|
| 7.1 | 页面加载后三个卡片数值与 Mock 数据一致 | TC-001 | 已覆盖 |
| 7.2 | 折线图 X 轴显示近 7 天日期，Y 轴从 0 开始 | TC-002 | 已覆盖 |
| 7.3 | Hover 折线显示 Tooltip | TC-003 | 已覆盖 |
| 7.4 | 小屏卡片垂直堆叠，图表最小高度 300px | TC-004 | 已覆盖 |
| 7.5 | 请求失败显示 Empty + "重新加载"按钮 | TC-008 | 已覆盖 |
| 7.6 | Loading 状态显示 Skeleton 占位 | TC-007 | 已覆盖 |
| 7.7 | 代码遵循项目规范 | 无 | 未覆盖（属代码审查） |
| 3.2 | 卡片图标（UserAddOutlined / UserOutlined / RiseOutlined） | 无 | **未覆盖** |
| 3.2 | "总用户数"辅助指标文案 "较昨日 +xxx" | TC-001 | 部分覆盖 |
| 3.3.3 | 折线图渐变填充色值 | TC-012 | 已覆盖（定性） |
| 4.1 | 响应式 768px~1024px 两列 | TC-005 | 已覆盖 |
| 4.1 | 响应式 >=1024px 三列 | TC-006 | 已覆盖 |
| 4.2 | 国际化中文文案 | TC-018 | 已覆盖 |
| 3.6 | 页面首次加载完整流程 | TC-014 | 已覆盖 |

**覆盖率**: 14/16 可测需求点 = **87.5%**

### Critical

| 编号 | 问题 | 状态 |
|------|------|------|
| TC-C1 | 卡片图标显示完全缺失：需求 3.2 明确定义了三个卡片的图标（UserAddOutlined / UserOutlined / RiseOutlined），但无任何用例验证图标是否存在及是否对应正确 | 待补充 |

### Important

| 编号 | 问题 | 状态 |
|------|------|------|
| TC-I1 | TC-001 预期结果缺少"总用户数"卡片辅助指标文案的精确断言，需求定义为"较昨日 +128"格式，但预期结果仅提及示例值 | 待补充 |
| TC-I2 | TC-008/TC-009 前置条件"修改接口返回异常"操作方式不明确，Playwright 环境下如何触发未给出可行方案 | 待澄清 |
| TC-I3 | TC-009 依赖 TC-008 的 Empty 状态作为前置条件，用例独立性不足，应合并或明确标记为串行用例 | 待优化 |

### Minor

| 编号 | 问题 | 状态 |
|------|------|------|
| TC-M1 | TC-001 步骤 3 "观察三个数据卡片" 缺乏具体操作指引，未说明是否截图对比或 DOM 查询 | 建议优化 |
| TC-M2 | 缺少 Mock 数据边界值用例：新增用户数 50/200、总用户数 20000/30000 时的显示正确性 | 建议补充 |

---

## 高频问题统计（自动更新）

> 最近更新: 2026-05-27 (审查 #3 已纳入)
> 统计周期: 全部

### 按审查类型分布
| 审查类型 | 总审查次数 | 总问题数 | Critical | Important | Minor |
|---|---|---|---|---|---|
| 需求审查 | 1 | 9 | 2 | 4 | 3 |
| 测试用例审查 | 1 | 6 | 1 | 3 | 2 |
| 代码审查 | 1 | 6 | 0 | 2 | 4 |

### Top 问题类型（跨所有审查）
| 排名 | 类型 | 审查领域 | 出现次数 | 最近出现 | 典型示例 |
|---|---|---|---|---|---|
| 1 | 用例覆盖遗漏 | 测试用例审查 | 1 | 2026-05-27 | TC #1 TC-C1 - 卡片图标显示无用例覆盖 |
| 2 | 组件引用矛盾 | 需求审查 | 1 | 2026-05-27 | PRD #1 C1 - PlainCard 复用声明与 StatCard 拆分冲突 |
| 3 | 缺少验收标准 | 需求审查 | 1 | 2026-05-27 | PRD #1 C2 - 无 Definition of Done |
| 4 | 计算规则模糊 | 需求审查 | 1 | 2026-05-27 | PRD #1 I1 - 环比增长率公式缺失 |
| 5 | 用例依赖性问题 | 测试用例审查 | 1 | 2026-05-27 | TC #1 TC-I3 - TC-009 依赖 TC-008 前置状态 |
| 6 | 执行步骤不明确 | 测试用例审查 | 1 | 2026-05-27 | TC #1 TC-I2 - 接口失败触发方式不明确 |

### 改进建议
1. **需求模板增加强制项**: 建议在需求模板中增加"验收标准"和"边界条件"章节，避免遗漏
2. **组件引用规范**: PRD 中引用现有组件时，应附带组件接口（Props）说明，避免功能不匹配
3. **数据计算规则**: 涉及指标计算的需求，应在文档中明确写出计算公式和正负值语义

---

## 审查记录 #3

- **审查日期**: 2026-05-27
- **审查类型**: 代码审查
- **变更范围**: Dashboard 用户增长看板功能（新增 5 个文件，修改 4 个文件）
- **结论**: 修复后可合并
- **评分**: 规范一致性 9/10 | 代码质量 8/10 | 需求符合度 9/10 | 综合 8.5/10

### 亮点

1. **组件拆分合理**: Dashboard 拆分为 StatCard、StatCardRow、GrowthTrendChart 三个子组件，职责单一，复用性好
2. **完整三态处理**: 主页面实现了 loading / success / error 三态渲染，包含 Skeleton 骨架屏和错误重试按钮
3. **性能优化到位**: GrowthTrendChart 中 ECharts option 使用 `useMemo` 缓存，所有组件均使用 `memo` 包裹
4. **类型定义规范**: `dashboard.d.ts` 接口字段均有 JSDoc 注释，类型语义清晰
5. **CSS 响应式布局**: 使用 CSS Grid + media query 实现 1/2/3 列自适应，符合移动端优先原则

### Critical

| 编号 | 文件 | 问题 | 建议 |
|------|------|------|------|
| - | - | 无 Critical 问题 | - |

### Important

| 编号 | 文件 | 问题 | 建议 |
|------|------|------|------|
| I1 | `src/services/user.ts` | 所有 service 函数使用 `as unknown as T` 双重类型断言绕过 TypeScript 类型检查。项目 axios 实例已在 `src/shared/axios.ts` 中扩展了泛型方法签名 `get<T>(): Promise<T>`，直接使用泛型参数即可获得正确类型推导，无需断言 | 改为 `axios.get<UserGrowthDashboardResult>('/user/growth-dashboard')` |
| I2 | `rspack.config.ts:89` | Mock 中间件使用 `(req: any, res: any, next: any)` 类型标注为 `any`，且 body 解析逻辑为手写实现（`req.on('data')` + `JSON.parse`），缺少异常处理分支中的 content-type 设置 | 为 req/res 定义最小接口类型；`JSON.parse` 失败时应返回 400 而非 200+ERROR |

### Minor

| 编号 | 文件 | 问题 | 建议 |
|------|------|------|------|
| M1 | `src/views/Dashboard/index.tsx:11` | 解构了 `const { Title } = Typography` 但 JSX 中使用 `<Title>` 时 TypeScript 会推导为 `typeof Typography.Title`，不使用解构可读性更一致 | 小问题，可接受 |
| M2 | `rspack.config.ts:97` | Mock 中间件使用 `require('./src/mock/user')` CommonJS 导入，在 ES Module 配置的 TypeScript 项目中不规范 | 改为动态 `import()` 或将 mock 提取为独立服务 |
| M3 | `src/views/Dashboard/components/StatCardRow.tsx:31` | formatter 箭头函数 `(v) => v.toLocaleString()` 每次渲染都会创建新引用，但由于 StatCard 已被 memo 包裹且 formatter 不参与 memo 比较（函数引用），实际无性能影响，但可读性上建议提取为具名函数 | 建议提取为 `const formatNumber = (v: number) => v.toLocaleString()` |
| M4 | `src/views/Dashboard/index.module.css:39` | `color: #1677ff` 使用了硬编码颜色值，未使用 Ant Design 主题 token（如 `var(--ant-primary-color)`） | 改为主题 token 以保持主题一致性 |

### 综合评估

- **项目规范一致性**: 文件命名（PascalCase 组件、小写 service）、import 顺序（三方库 -> @/ 别名 -> 相对路径）、CSS Modules 使用均符合项目规范。组件采用 `React.FC` + `memo` + props 解构模式，与现有 ComparedRate、ECharts 组件保持一致。类型定义文件放在 `src/types/` 目录下，命名规范。
- **代码质量**: 错误处理依赖 axios 拦截器（`message.error` 统一提示），Dashboard 组件只管理 UI 状态。边界条件处理较好（`data &&` 守卫、ComparedRate 的 `value == null` 判断）。Mock 数据生成逻辑（7 天增长趋势 + 随机抖动）设计合理。
- **需求符合度**: 实现了三个统计卡片（今日新增、总用户数、7日平均日增）+ 增长趋势折线图 + 日环比/周环比指标 + 三态加载 + 响应式布局，功能闭环完整。Mock 路由和 Service 函数均已对接。

### 审查结论: 修复后可合并

建议在合并前修复 I1（改用 axios 泛型替代 `as unknown as` 断言），I2/M2/M4 可作为后续优化项。
