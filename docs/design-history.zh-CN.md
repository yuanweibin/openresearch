# OpenResearch 实时设计

> 这是形成 `v0.1.x` 的中文设计历史，保留关键取舍与来源。当前可执行合同以仓库的 `workflows/`、`schemas/` 和 [design.md](design.md) 为准；历史中的未决项可能已经在实现中解决。

**文档状态：** `living-design`

**最后更新：** 2026-09-04

**文档范围：** 只定义 OpenResearch 的通用抽象、状态语义、artifact 合同与安装形态；不放任何具体研究 Cycle 的参数、任务或结果。

本页是 OpenResearch 的持续设计入口。用户与 agent 应当能够只看这一页，理解 OpenResearch 要解决的流程问题、采用的研究抽象、已冻结的产品设计与尚未决定的产品问题。具体研究的新 Evidence 只更新对应 Cycle；只有当 Evidence 暴露了通用流程问题时，才更新本设计。

## 1. 为什么不能直接把 OpenSpec 政名

OpenSpec 默认优化的是“需求是否被完整实现”，而研究优化的是“关键不确定性是否被有效减少”。两者的基本对象不同：

| 软件开发 | 科研探索 |
|---|---|
| requirement | research question / hypothesis |
| implementation task | experiment / diagnostic |
| acceptance test | evidence criterion |
| pass / fail | supported / refuted / inconclusive / failed-with-diagnosis |
| change complete | uncertainty reduced enough to choose the next variable |
| scope stability | evidence-driven scope adaptation |

因此 OpenResearch 不应把 proposal、spec、design、tasks 机械地全部做完作为研究启动门。计划只需要精确到足以运行最小实验；实验结果可以推翻计划，并要求立即修改下一步。

## 2. 产品目标

OpenResearch 的目标是让 agent 和研究者共同完成以下闭环：

```text
research question
    ↓
minimum experiment contract
    ↓
run the full evidence chain
    ↓
results: evidence artifacts + anomalies
    ↓
diagnose the first supported bottleneck
    ↓
change one main variable
    ↓
next research cycle
```

默认优化目标是尽快形成可解释证据，而不是提前把每个模块生产化。

## 3. 核心研究对象

### 3.1 Program

长期研究方向。Program 保存不会因单轮实验频繁变化的科学问题、模块边界和结论标准。

### 3.2 Program design

Program design 是 Program 与 Cycle 之间的长期科研系统合同。它保存当前 Decoder 架构、公式表示、数值 case 和 AD 策略等会约束多轮实验的决定，并随用户决定或足以改变默认方法的 Evidence 更新。

顶层设计中的 `frozen` 表示默认必须继承，而不是永远不能改变。Cycle 可以显式声明 experimental override 来检验是否应解冻；结果只有经主对话/用户 promote 并回写顶层设计后，才成为后续 Cycle 的默认合同。代码与单轮 artifact 不能自行覆盖顶层设计。

#### 文献可追溯合同

顶层方案不能只在文末附一个 bibliography。每个会改变科学结论、数值可比性或模型能力的设计项，必须在对应设计附近保存一条 literature map：

| 字段 | 含义 |
|---|---|
| `relation` | `adopted`（在声明范围内直接采用）、`adapted`（改造后采用）、`motivation-only`（只支持方向）或 `project-hypothesis`（本项目自行提出） |
| `reference` | 稳定 citation key 与 DOI/arXiv/公开全文链接 |
| `borrowed` | 究竟借鉴 case、数值设置、指标、架构还是物理观察 |
| `match` | 本项目与文献真正相同的 flow、Re、grid、filter、discretization、架构或 objective |
| `deviation` | 哪些关键条件不同，因而文献不能替本项目证明什么 |
| `local evidence` | 哪个 Cycle 已支持、修正或反驳这项借鉴 |

例如，“`Re=1600, 64^3` 与某论文相同”不足以声明“数值设置与文献一致”；若 Mach、filter、离散和 reference 不同，它只是 contextual anchor。同样，“参考 Transformer symbolic regression”必须说明是借鉴 attention 对公式 token 依赖的建模，不能暗示当前 typed-DAG autoencoder 已被该论文验证。

若没有直接文献，仍可设计和运行，但必须标记 `project-hypothesis`，并给出最接近的类比及其断裂点。文献提供先验和可比口径，本项目 Evidence 决定它在当前系统中是否仍成立。

### 3.3 Cycle

一次短研究循环，只减少一个主要不确定性。Cycle 不是软件 milestone，不使用 `M0`、`P1` 等编号。

每个 Cycle 至少回答：

1. 当前最重要的不确定性是什么；
2. 哪个最小实验能减少它；
3. 哪些量在看到结果前冻结；
4. 实际观测是什么；
5. 失败首先落在哪个模块或接口；
6. 下一轮只改变哪个主要变量。

### 3.4 Experiment

一次真实运行。Experiment 保存配置、命令、seed、代码版本、资源、运行日志和输出 manifest。多个 Experiment 可以属于同一 Cycle，例如 baseline、candidate 和独立复算。

### 3.5 Evidence

能够改变研究决定的数字、图、视频、公式或失败复现。覆盖率、测试数量和 artifact 完整度只有在影响运行、解释或复现时才成为 Evidence。

### 3.6 Decision

Evidence 导出的下一动作。Decision 必须说明为什么选这个变量，以及为什么当前不扩展其他模块。

## 4. 推荐目录

```text
openresearch/
├── program.md
├── status.md
├── design/
│   ├── README.md
│   ├── formula-representation.md
│   ├── decoder.md
│   ├── tgv-numerics.md
│   ├── solver-in-loop-ad.md
│   ├── references.md
│   └── decisions.md
└── cycles/
    └── <NN>-<cycle-name>/
        ├── question.md
        ├── experiment.md
        ├── tasks.md
        ├── status.md
        ├── decisions.md
        └── results/
            ├── report.md
            └── assets/
                ├── figures/
                ├── videos/
                └── manifests/
```

`tasks.md` 只跟踪当前可执行动作；`status.md` 跟踪证据状态；`decisions.md` 记录计划为何改变。三者不能互相替代。

`openresearch/design/` 是研究内容的跨 Cycle source of truth。每个新 Cycle 必须在 `experiment.md` 中声明 Program design revision、继承的 frozen contracts、实验性 overrides、promotion evidence 和 rollback。用户决定应在下一个 Evidence 边界前写入该目录。

Cycle 目录必须使用两位、单调递增的创建序号，例如 `01-soft-accuracy-ceiling/`、`02-corpus-conditioned-ad-transfer/`。序号表达 Cycle 被建立的先后次序，而不是重要性、完成度或依赖层级；并行或作为支线建立的 Cycle 也占用下一个全局序号。Cycle 建立后不得重排或复用序号。实验 artifact 路径不强制跟随目录序号，以保持已经发布的 Evidence 标识稳定。

### 4.1 Task 粒度合同

OpenResearch 不反对 `1.x/2.x` 编号；稳定的两层 task id 有助于 agent 中断后继续、指向某一个运行与审查进展。应避免的是为了软件交付完整性进行穷尽式拆分。

一个叶子 task 应同时具备：

1. 一个明确动作；
2. 一个可保存的 artifact、观测或 Decision；
3. 一个可验证的完成、拒绝或停止条件；
4. 一个 agent 可以不重跑前置长计算而继续的断点。

叶子 task 的数量由执行成本、中断恢复成本和决策歧义决定，不由研究问题用一句还是十句描述决定。对重复实验循环，`tasks.md` 只定义一套可重复单元，用 ledger 实时记录每轮状态；只有 Evidence 允许继续时才实例化下一轮，不预先复制出大量假定必做的 checkbox。

## 5. 状态语义

实验执行状态建议使用：

- `designed`：最小实验合同已足够运行；
- `running`：真实计算正在进行；
- `evidence-ready`：结果已形成且可复算；
- `diagnosed`：已定位首个有证据的瓶颈；
- `blocked`：缺少权限、输入或外部资源，尚不能形成科研判断；
- `complete`：本轮不确定性已减少到足以选择下一变量。

科学结论单独使用：

- `supported`；
- `refuted`；
- `inconclusive`；
- `failed-with-diagnosis`。

程序正常退出不等于科学结论 `supported`。

### 5.1 主对话与执行子智能体

OpenResearch 将主对话视为用户的研究控制面，将子智能体视为 Cycle 的执行面。只要运行环境支持子智能体，进入 `running` 的 Cycle 必须交给一个明确命名的执行子智能体；主对话不占用自身回合持续轮询 GPU、等待长命令或搬运原始日志。

主对话负责：

- 与用户澄清科学目标、冻结变量、判据和结论边界；
- 把用户的新决定传给 Cycle 执行者，并解释 Evidence 对研究方向的影响；
- 按里程碑和约定的时间间隔向用户主动报告进展，而不是只在全部结束后汇报；
- 在需要改变主要变量、扩展权限或违反停止规则时，保留最终决策权。

执行子智能体负责：

- 按 `experiment.md`、`tasks.md` 和 `decisions.md` 持续运行、监控、校验和恢复实验；
- 在 artifact 边界实时更新 `status.md`、任务 ledger 与阶段结果，不把状态只留在聊天消息中；
- 在冻结范围内处理可恢复的工程故障，但不得自行新增步长、改阈值、换数据或扩大研究问题；
- 在启动、Evidence ready、停止条件命中、需要改变冻结合同或发生不可恢复阻塞时通知主对话。

一个活跃 Cycle 应只有一个执行 owner；若需要多 GPU 或多个并行 worker，由该 owner 统一分片、去重和归约，避免多个 agent 同时修改同一 ledger。用户在主对话中提出的新要求优先于后台计划，主对话必须将变更显式转发给执行 owner。

进展报告采用“事件驱动 + 周期心跳”：关键 Evidence 产生时立即报告；长计算没有新 Evidence 时，按 Cycle 配置的 `report_interval` 给出运行状态、已完成比例、预计下一 Evidence 和异常。默认建议 `30 min`，但报告不得把未完成计算包装成科学结论。若运行环境不提供子智能体，主对话必须明确说明降级，并遵守同一 artifact、状态和报告合同。

## 6. 结果与媒体合同

### 6.1 图

凡图参与判据、诊断或结论，PNG 必须直接嵌入 Markdown；同时保存可缩放 PDF。轻量发布图镜像到 cycle 内可版本控制的 `results/assets/figures/`，不得只引用被 `.gitignore` 排除的运行目录。

统计量一律作为独立静态图，不嵌入视频。图必须明确横轴语义，不得将实验轮次、物理时间或训练步数混成一个序列。

### 6.2 视频

视频只在研究问题包含时空演化时才是必要 artifact。视频画面不放统计线图；定量指标必须作为独立静态图。

对比视频的各 panel 必须使用可直接比较的视觉合同，例如同一空间区域、物理量、等值级和颜色范围。每个视频必须同时保存：

- MP4 主文件；
- 可嵌入 Markdown 的轻量预览；
- frame manifest，列出每帧的真实自变量、方法或版本、输入 artifact 与视觉合同；
- 至少一张静态关键帧，确保不播放视频也能理解结论。

不得用未声明插值把稀疏样本伪装成连续轨迹。若现有数据不足以支持演化视频，Cycle 必须选择增加真实输出、降级为静态关键帧，或明确声明插值及其限制。

### 6.3 Artifact 的跨层消费资格

Artifact 的“有效”不能只表示它通过了生产模块自己的 schema 或静态规则。只要它的研究用途依赖下游消费者，发布与 fresh verification 就必须包含最小消费端检查，例如可解析、可编译、可执行一个代表性 step，或能被目标分析脚本重算。

生产端合法但消费端不可用的样本必须作为明确失败证据保留；修复应优先升级通用资格规则并从冻结候选池重选，不能为少数失败样本手工特调。这样可以区分“科学假设失败”和“模块接口没有真正闭合”。

失败路径本身也必须可发布：非有限数值、异常、拒绝原因和部分候选不能因为严格 JSON、绘图或报告层无法序列化而丢失。结构化 artifact 应用 `null` 或显式状态表达非有限量，同时保留 finite/rejection 字段；清洗应在完整 record 的最终序列化边界统一执行，不应依赖对 objective、stress 或其他子树逐字段补漏。记录层失败不得迫使重算已经验证且 hash 不变的长计算。

当同一 artifact 有多个下游用途时，readiness 必须按消费者命名，例如 `soft-ad-eligible`、`hard-decode-eligible`、`external-replay-eligible`，而不是压成一个无语义的 pass/fail。Cycle 只能使用与其研究动作对应的 eligibility；其他失败仍必须显式报告，不得因为当前不使用就删除。

### 6.4 可移植 provenance

每次运行应保存命令、环境、seed、输入 hash、资源和代码身份，但执行目录不保证是完整 Git checkout。代码 revision 可由版本库读取、由调度器显式注入，或如实记录为 `unavailable`；provenance 获取失败不得在长计算结束后使数值 artifact 整体发布失败。

### 6.5 长实验的分层资格与可续跑边界

短 smoke 只能证明编译、局部 finite、近似资源峰值和早期稳定性，不能替代完整轨迹上的极值判据。凡结论依赖峰值 CFL、最小分辨率指标、谱尾或迟发不稳定性，Cycle 必须明确区分：

- `smoke-eligible`：允许启动长实验；
- `trajectory-complete`：冻结区间已完整运行；
- `scientifically-qualified`：完整 artifact 通过预注册科学阈值。

长实验应在有科学意义的 checkpoint 原子发布 partial structured artifact 和状态 checkpoint，使 agent 可以从最后已发布边界续跑。中断或资格失败的轨迹不得覆盖；若失败只落在一个可分离的数值变量上，应保持物理设置和其他冻结项不变，修改最小变量后重跑。例如“空间分辨率通过但时间步 CFL 失败”应先缩小时间步，而不是直接扩展到多卡或更高空间分辨率。

资源 smoke 的预测与完整轨迹实测冲突时，以完整轨迹为准，并把预测失准本身保留为调度/资格证据。这样既避免把早期通过误写成科学通过，也避免因单项失败机械地扩大整个实现范围。

## 7. 安装与 skill 形态

目标交付形态是 GitHub 上可版本化、可直接安装的 CLI/skill bundle。首版不发布到 npm registry；仓库仍保留标准 `package.json` 和 `bin`，使 npm/npx 可以直接从 GitHub git ref 安装。CLI 是跨 agent 的安装器、状态读取器和验证器；skill 是 agent 的研究行为合同；项目中的 `openresearch/` 是用户拥有的研究记录。三者不能混成同一层。

目标 GitHub 仓库为 `yuanweibin/openresearch`。开发期可跟踪 `main`，可复现安装必须固定 tag 或 commit：

```bash
# 一次性从 GitHub 运行
npx --yes github:yuanweibin/openresearch#v0.1.2 init --tools codex,claude

# 或从 GitHub 全局安装 CLI，不经过 npm registry
npm install -g github:yuanweibin/openresearch#v0.1.2
openresearch init --tools codex,claude
openresearch doctor
```

首版只包含四个公开 skill：

| skill | 职责 | 允许的权威变化 | 禁止的跨界 |
|---|---|---|---|
| `openresearch-explore` | 讨论设想、文献、可证伪性、可行性和顶层设计草案 | 可写 proposal/draft，不改 canonical design | 不启动 Cycle，不提升设计 |
| `openresearch-propose-cycle` | 将一个主要不确定性变成可审批的 Cycle 合同 | 创建或整体修改 `question.md`、`experiment.md`、`deliverables.md`、`tasks.md` 和 `status.md` | 未经用户批准不进入 `running` |
| `openresearch-run-cycle` | 执行已批准 Cycle，持续记录、诊断、发布 Evidence 并提交 Design Delta Proposal | 只改 Cycle artifact 和经批准的实验输出 | 不自行修改 canonical Program design |
| `openresearch-update-design` | 建立首次获批设计，或将获批 Design Delta 提升到顶层设计 | 是 `openresearch/design/` 和 Program design revision 的唯一 skill 写入口 | 不以“Cycle 正常结束”代替用户批准 |

`diagnose`、`conclude` 和 `publish` 是 `run-cycle` 的内部职责，不再独立成 skill。`init`、`status`、`validate`、`doctor` 和 `update` 是确定性 CLI 能力，不消耗 agent 推理去复制文件或判断 schema。

### 7.1 一份源码，两个 agent adapter

四个 workflow 的科研语义只编写一次。构建时用 adapter 生成 agent-specific wrapper，不手工维护 `4×2` 份完整指令。

| 项目 | Codex | Claude Code |
|---|---|---|
| project skill 位置 | `.agents/skills/<skill>/SKILL.md` | `.claude/skills/<skill>/SKILL.md` |
| 显式调用 | `$openresearch-explore` 等 | `/openresearch-explore` 等 |
| 原生 plugin manifest | `.codex-plugin/plugin.json` | `.claude-plugin/plugin.json` |
| 额外 metadata | 可选 `agents/openai.yaml` | 可选 Claude-specific frontmatter / agent definitions |
| 执行子智能体 | 有能力时由主对话委派 | 有能力时由主对话委派 |

共享源只使用 Agent Skills 共同语义：`name`、`description`、Markdown 指令、`references/`、`scripts/` 与 `assets/`。调用语法、frontmatter 扩展、plugin namespace 和子智能体 API 由 adapter 添加。共享正文应使用“委派给单一 Cycle execution owner”这类能力语义，不硬编码某一个 agent 的 tool name。

子智能体不是安装资格的硬依赖。宿主支持时，`run-cycle` 必须由主对话保留用户控制面，将执行交给单一 owner；不支持时，允许同一 agent 执行，但必须声明降级并保持相同 artifact 和审批合同。

### 7.2 npm CLI 的安装职责

`openresearch init --tools codex,claude` 在项目中创建：

```text
openresearch/
├── config.yaml
├── program.md
├── status.md
├── design/
│   ├── README.md
│   ├── decisions.md
│   └── references.md
└── cycles/
    └── README.md

.agents/skills/openresearch-*/       # selected when Codex is enabled
.claude/skills/openresearch-*/       # selected when Claude is enabled
```

CLI 首版只需要负责：

- `init`：检测/选择 agent，创建项目骨架并安装四个 skill；
- `status --json`：返回 Program design revision、活跃 Cycle、审批状态、owner 和下一合法动作；
- `validate [--cycle <id>] --json`：验证 artifact schema、链接、状态迁移和交付清单；
- `update`：刷新 CLI 管理的 skill/wrapper，不改用户研究内容；
- `doctor`：检查 Node 版本、skill 发现路径、重复安装和版本漂移。

CLI 不调度 GPU、不理解领域科学、不自动判定 hypothesis 是否 supported。这些必须保留给 skill 与研究 Evidence。

### 7.3 更新与用户数据安全

安装器生成的 skill 带 `generatedBy`、workflow version 和 content hash。`openresearch update` 只能替换它管理的 adapter 输出；遇到无标记或已被用户修改的 skill 时必须报告冲突，不静默覆盖。

以下内容永远属于项目，不能被 npm 升级改写：

- `openresearch/program.md`；
- `openresearch/design/`；
- `openresearch/cycles/`；
- 所有 Evidence、图、视频、日志和 Decision。

CLI package version、skill workflow version、artifact schema version 和项目 Program design revision 必须分开记录，不使用一个 version 字段混合表示。

### 7.4 原生 plugin 是补充发布面

GitHub-hosted CLI 是首版的跨 agent canonical installer。同一 workflow source 还应生成两个可独立验证的发布物：

```text
dist/codex-plugin/
├── .codex-plugin/plugin.json
└── skills/...

dist/claude-plugin/
├── .claude-plugin/plugin.json
└── skills/...
```

Codex 官方将 plugin 定义为可安装分发单元；Claude plugin 会对 skill 加 namespace，因此原生调用可以是 `/openresearch:explore`，而项目级 npm 安装仍是 `/openresearch-explore`。原生 plugin 不能反向成为 CLI 或 artifact schema 的另一份实现。

### 7.5 首版发布门

在发布首个 GitHub tag/release 前，至少验证：

1. `npm pack` 只包含声明的 CLI、templates、schemas 和 license；
2. 在空临时目录中分别运行 Codex-only、Claude-only 和 dual init；
3. 重复 `init/update` 是幂等的，且不覆盖伪造的用户 Program/Cycle Evidence；
4. 四个 skill 在两个 agent 中均可发现，调用名称与文档一致；
5. 使用同一个最小研究场景做行为测试：explore 不运行、propose 停在审批门、run 不改顶层设计、update-design 没有批准不提升。

## 8. 框架与研究内容的边界

`OPENRESEARCH_DESIGN.md` 只回答“OpenResearch 如何组织研究”，不回答某一项研究“本轮要做什么”。

| 内容 | 归属 |
|---|---|
| 通用抽象、状态语义、artifact 合同、skill/CLI 设计 | `OPENRESEARCH_DESIGN.md` |
| 长期科学问题、模块边界、总体结论标准 | `openresearch/program.md` |
| 当前公式表示、Decoder、case 数值策略与 AD 策略 | `openresearch/design/` |
| 活跃 Cycle、最新 Evidence 和下一动作索引 | `openresearch/status.md` |
| 具体研究问题、冻结项、实验、任务、状态、决策、结果 | `openresearch/cycles/<NN>-<cycle-name>/` |

Cycle 是 OpenResearch 中对应 OpenSpec change 的研究对象，但它的完成标准是“关键不确定性已降低到足以做决策”，而不是“所有计划任务均实现”。

## 9. OpenResearch 设计变更记录

| 日期 | 设计输入 | 框架变化 |
|---|---|---|
| 2026-08-31 | 软件规格流程在科研中容易过早将单模块生产化 | 默认先运行最小完整证据链，再由首个已定位瓶颈决定扩展 |
| 2026-09-01 | 研究结果需要在执行中持续沉淀 | 定义 Program/Cycle/Experiment/Evidence/Decision 及 living status/results artifact |
| 2026-09-01 | 媒体容易混淆定性演化与定量判据 | 视频只表达真实演化；统计量使用独立静态图；禁止未声明插值 |
| 2026-09-01 | 框架设计与具体研究计划曾写入同一文档 | 根设计文档只保留通用抽象；具体研究迁入 Cycle |
| 2026-09-01 | 过粗 task 不利于 agent 中断续做，穷尽式 task 又会把科研机械化 | 采用两层稳定 task id、可恢复叶子任务和 Evidence-driven round ledger |
| 2026-09-02 | 静态合法的生成物仍可能无法被下游表示或求解器消费 | Artifact 资格增加跨层 fresh consumer check；失败样本保留并用通用规则重建 |
| 2026-09-03 | 无序号 Cycle 名称不能直接表达研究推进顺序 | Cycle 目录采用不可重排的两位全局创建序号；artifact 标识保持稳定 |
| 2026-09-03 | 长 Cycle 的轮询与日志等待会占住科研讨论主对话 | Cycle 默认由单一执行子智能体持续运行；主对话作为研究控制面定期汇报并保留变更决策权 |
| 2026-09-04 | 用户无法从 Cycle 和旧 change 中直接找到当前 Decoder、TGV 与 AD 设计 | 在 Program 与 Cycle 之间增加顶层 living design contract；Cycle 显式继承或试验性 override，Evidence 经 promote 后才更新默认设计 |
| 2026-09-04 | 用户要求每个顶层设计显示参考文献和具体采用理由 | 建立逐设计项 literature map；强制区分直接采用、改造、方向动机与项目假设，并披露匹配、偏离和本地 Evidence |
| 2026-09-04 | 用户批准 explore / propose-cycle / run-cycle / update-design 四个 skill 边界，并要求 CLI 安装及 Codex/Claude 兼容 | 用职责与写入权限划分四个 skill；采用共享 workflow source、agent adapter、GitHub-hosted CLI 与两个原生 plugin 发布物 |
| 2026-09-04 | 用户决定暂不发布 npm registry，先在个人 GitHub 仓库持续更新并供其他项目安装 | 首版以 `yuanweibin/openresearch` Git ref 作为发布源；支持 npx/全局 CLI、Codex skill path 与 Claude marketplace 三种 GitHub 入口 |
| 2026-09-04 | 用户批准建立公开仓库并开始实现 | 首版 npm package 名冻结为 `openresearch`，采用 MIT；package 标记为 private 以阻止误发 registry，但保留 GitHub git-ref 安装能力 |
| 2026-09-04 | GitHub 安装 smoke 暴露 npm 11 会因 `build` lifecycle 与已有 package-specific `allow-scripts` 配置冲突 | 发布 `v0.1.2`，Git 安装路径不触发 lifecycle；构建改为显式 `npm run generate`，并完成 GitHub ref 的 npx 与全局安装复验 |
| 2026-09-02 | 远端 staging 不一定包含 Git 元数据，长计算可能在最后写 provenance 时失败 | provenance 改为可移植、可注入、可降级记录，不能反向破坏已完成数值结果 |
| 2026-09-02 | 同一表示可能可用于 soft AD、却无法 hard decode | readiness 按具体下游消费者拆分 eligibility，Cycle 只消费对应资格并完整保留其他失败 |
| 2026-09-02 | 非有限候选使严格 JSON 记录器失败，但前置 gradient 与有限候选仍有效 | failure artifact 必须可序列化；允许只重跑记录/消费阶段，不机械重算已验证长计算 |
| 2026-09-03 | 短 smoke 通过但完整轨迹的迟发 CFL 极值越线；空间分辨率本身已经合格 | 区分 smoke/complete/scientific qualification；长作业原子 checkpoint；失败后只改变最小数值变量，不机械扩展基础设施 |

## 10. 尚未冻结的产品问题

- OpenResearch 是兼容 OpenSpec artifact schema，还是定义独立 schema；
- 是否同时支持 `cycle` 和 `change` 作为 CLI 别名；
- 大型视频等 artifact 的默认发布与 Git LFS 策略。
