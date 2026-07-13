const STAGES = [
  { id: "contact", label: "待触达", color: "#64748b", soft: "#f1f5f9", icon: "target" },
  { id: "reached", label: "已触达", color: "#2563eb", soft: "#eef4ff", icon: "user-check" },
  { id: "talking", label: "沟通中", color: "#d97706", soft: "#fff7e6", icon: "handshake" },
  { id: "sampled", label: "已寄样", color: "#7c3aed", soft: "#f3edff", icon: "truck" },
  { id: "trial", label: "试播中", color: "#db2777", soft: "#fdf2f8", icon: "play" },
  { id: "schedule", label: "洽谈排期", color: "#0f766e", soft: "#ecfdf5", icon: "calendar" },
  { id: "signed", label: "已签约", color: "#059669", soft: "#eaf8f1", icon: "star" },
  { id: "lost", label: "已流失", color: "#dc2626", soft: "#feecec", icon: "ban" },
];

const PRODUCTS = ["定妆喷雾", "气垫pro", "防晒素颜霜", "防晒喷雾"];
const GROUPS = ["A", "B", "C"];
const FORMATS = ["专场", "混播", "单品直播间", "短视频挂车", "IP小号"];
const TYPES = ["美垂", "生活分享", "三农", "时尚穿搭", "美食", "母婴", "剧情搞笑", "其他"];
const TIERS = ["S", "A", "B", "C"];
const PERSONS = ["张三", "李四", "王五", "赵六"];

const tierMeta = {
  S: { color: "#f59e0b", soft: "#fff7e6" },
  A: { color: "#2563eb", soft: "#eef4ff" },
  B: { color: "#64748b", soft: "#f1f5f9" },
  C: { color: "#94a3b8", soft: "#f8fafc" },
};

const typeIconMap = {
  美垂: "star",
  生活分享: "home",
  三农: "package",
  时尚穿搭: "tag",
  美食: "package",
  母婴: "users",
  剧情搞笑: "play",
  其他: "user-check",
};

const formatIconMap = {
  专场: "calendar",
  混播: "funnel",
  单品直播间: "package",
  短视频挂车: "play",
  IP小号: "users",
};

const initialRecords = [
  { id: 1, name: "小美酱", tier: "S", type: "美垂", product: "定妆喷雾", group: "A", format: "专场", stage: "已签约", person: "张三", bottleneck: "" },
  { id: 2, name: "乡村阿花", tier: "A", type: "三农", product: "防晒素颜霜", group: "B", format: "短视频挂车", stage: "试播中", person: "李四", bottleneck: "排期冲突，等达人档期" },
  { id: 3, name: "生活达人Lily", tier: "A", type: "生活分享", product: "气垫pro", group: "A", format: "混播", stage: "沟通中", person: "张三", bottleneck: "达人对佣金比例有异议" },
  { id: 4, name: "潮流小K", tier: "B", type: "时尚穿搭", product: "定妆喷雾", group: "C", format: "单品直播间", stage: "已寄样", person: "王五", bottleneck: "" },
  { id: 5, name: "美食控阿强", tier: "C", type: "美食", product: "防晒喷雾", group: "B", format: "IP小号", stage: "待触达", person: "李四", bottleneck: "" },
  { id: 6, name: "辣妈CC", tier: "S", type: "母婴", product: "气垫pro", group: "A", format: "专场", stage: "洽谈排期", person: "张三", bottleneck: "报价超出预算30%" },
  { id: 7, name: "化妆师老罗", tier: "A", type: "美垂", product: "定妆喷雾", group: "C", format: "混播", stage: "已触达", person: "王五", bottleneck: "" },
  { id: 8, name: "田野阿宝", tier: "B", type: "三农", product: "防晒喷雾", group: "B", format: "短视频挂车", stage: "沟通中", person: "李四", bottleneck: "" },
  { id: 9, name: "Vicky爱分享", tier: "A", type: "生活分享", product: "防晒素颜霜", group: "A", format: "专场", stage: "已寄样", person: "赵六", bottleneck: "样品物流延迟" },
  { id: 10, name: "段子手大刘", tier: "B", type: "剧情搞笑", product: "防晒喷雾", group: "C", format: "短视频挂车", stage: "待触达", person: "王五", bottleneck: "" },
  { id: 11, name: "美妆课代表", tier: "S", type: "美垂", product: "气垫pro", group: "A", format: "单品直播间", stage: "已签约", person: "张三", bottleneck: "" },
  { id: 12, name: "小城日记", tier: "C", type: "生活分享", product: "定妆喷雾", group: "B", format: "IP小号", stage: "已触达", person: "李四", bottleneck: "" },
  { id: 13, name: "穿搭达人Nina", tier: "A", type: "时尚穿搭", product: "防晒素颜霜", group: "C", format: "混播", stage: "试播中", person: "王五", bottleneck: "试播数据不达标，需二次评估" },
  { id: 14, name: "农家胖哥", tier: "B", type: "三农", product: "防晒喷雾", group: "B", format: "单品直播间", stage: "洽谈排期", person: "李四", bottleneck: "" },
  { id: 15, name: "小白的美妆日记", tier: "B", type: "美垂", product: "定妆喷雾", group: "A", format: "短视频挂车", stage: "沟通中", person: "赵六", bottleneck: "" },
  { id: 16, name: "厨神阿欢", tier: "C", type: "美食", product: "防晒素颜霜", group: "C", format: "IP小号", stage: "已流失", person: "王五", bottleneck: "达人明确拒绝合作" },
  { id: 17, name: "国际庄小马", tier: "B", type: "剧情搞笑", product: "气垫pro", group: "B", format: "短视频挂车", stage: "待触达", person: "李四", bottleneck: "" },
  { id: 18, name: "辣妹CC酱", tier: "A", type: "美垂", product: "防晒喷雾", group: "A", format: "混播", stage: "已寄样", person: "赵六", bottleneck: "" },
  { id: 19, name: "宝妈的精致生活", tier: "C", type: "母婴", product: "气垫pro", group: "C", format: "专场", stage: "沟通中", person: "王五", bottleneck: "需等618大促结束后再谈" },
  { id: 20, name: "三叔的院子", tier: "A", type: "三农", product: "防晒素颜霜", group: "B", format: "短视频挂车", stage: "已签约", person: "李四", bottleneck: "" },
];

const state = {
  view: "pipeline",
  query: "",
  filters: {
    product: "",
    group: "",
    format: "",
    type: "",
    tier: "",
    stage: "",
    person: "",
  },
  records: initialRecords.map((record) => ({ ...record })),
  nextId: 21,
};

const els = {
  lastUpdate: document.getElementById("lastUpdate"),
  searchInput: document.getElementById("searchInput"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  exportBtn: document.getElementById("exportBtn"),
  addRecordBtn: document.getElementById("addRecordBtn"),
  filterProduct: document.getElementById("filterProduct"),
  filterGroup: document.getElementById("filterGroup"),
  filterFormat: document.getElementById("filterFormat"),
  filterType: document.getElementById("filterType"),
  filterTier: document.getElementById("filterTier"),
  filterStage: document.getElementById("filterStage"),
  filterPerson: document.getElementById("filterPerson"),
  kpiGrid: document.getElementById("kpiGrid"),
  tierLegend: document.getElementById("tierLegend"),
  kanbanColumns: document.getElementById("kanbanColumns"),
  bottleneckList: document.getElementById("bottleneckList"),
  ownerList: document.getElementById("ownerList"),
  insightSummary: document.getElementById("insightSummary"),
  funnelChart: document.getElementById("funnelChart"),
  typeChart: document.getElementById("typeChart"),
  groupChart: document.getElementById("groupChart"),
  formatGrid: document.getElementById("formatGrid"),
  tableCount: document.getElementById("tableCount"),
  recordTableBody: document.getElementById("recordTableBody"),
  drawer: document.getElementById("detailDrawer"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
  drawerCloseBtn: document.getElementById("drawerCloseBtn"),
  drawerKicker: document.getElementById("drawerKicker"),
  drawerTitle: document.getElementById("drawerTitle"),
  drawerBody: document.getElementById("drawerBody"),
  toast: document.getElementById("toast"),
};

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stageMeta(label) {
  return STAGES.find((stage) => stage.label === label) || STAGES[0];
}

function stageIndex(label) {
  return STAGES.findIndex((stage) => stage.label === label);
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function optionHtml(defaultLabel, values) {
  return [
    `<option value="">${defaultLabel}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`),
  ].join("");
}

function typeIcon(type) {
  return typeIconMap[type] || "user-check";
}

function formatIcon(format) {
  return formatIconMap[format] || "tag";
}

function renderFilterOptions() {
  els.filterProduct.innerHTML = optionHtml("全部产品", PRODUCTS);
  els.filterGroup.innerHTML = optionHtml("全部组", GROUPS);
  els.filterFormat.innerHTML = optionHtml("全部玩法", FORMATS);
  els.filterType.innerHTML = optionHtml("全部类型", TYPES);
  els.filterTier.innerHTML = optionHtml("全部等级", TIERS);
  els.filterStage.innerHTML = optionHtml("全部状态", STAGES.map((stage) => stage.label));
  els.filterPerson.innerHTML = optionHtml("全部商务", PERSONS);
}

function recordSearchText(record) {
  return [
    record.name,
    record.tier,
    record.type,
    record.product,
    record.group,
    record.format,
    record.stage,
    record.person,
    record.bottleneck,
  ].join(" ").toLowerCase();
}

function filteredRecords() {
  return state.records.filter((record) => {
    const filters = state.filters;
    const matchesFilters =
      (!filters.product || record.product === filters.product) &&
      (!filters.group || record.group === filters.group) &&
      (!filters.format || record.format === filters.format) &&
      (!filters.type || record.type === filters.type) &&
      (!filters.tier || record.tier === filters.tier) &&
      (!filters.stage || record.stage === filters.stage) &&
      (!filters.person || record.person === filters.person);
    return matchesFilters && (!state.query || recordSearchText(record).includes(state.query));
  });
}

function statsFor(data) {
  const total = data.length;
  const signed = data.filter((record) => record.stage === "已签约").length;
  const lost = data.filter((record) => record.stage === "已流失").length;
  const active = data.filter((record) => record.stage !== "已流失").length;
  const bottlenecks = data.filter((record) => record.bottleneck).length;
  const sTier = data.filter((record) => record.tier === "S").length;
  const conversion = active ? signed / active : 0;
  return { total, signed, lost, active, bottlenecks, sTier, conversion };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function sparkline(path = "M2 34 C12 23 17 31 25 20 C33 9 38 25 47 15 C56 5 61 20 70 7") {
  return `<svg class="sparkline" viewBox="0 0 72 42" aria-hidden="true"><path d="${path}"></path></svg>`;
}

function renderKpis() {
  const stats = statsFor(filteredRecords());
  const cards = [
    { label: "达人总数", value: stats.total, sub: "筛选后记录", trend: "14.2%", icon: "users", color: "#8b5cf6", soft: "#f3edff" },
    { label: "活跃跟进", value: stats.active, sub: "不含已流失", trend: "9.8%", icon: "target", color: "#0fa66a", soft: "#e8f8f1" },
    { label: "已签约", value: stats.signed, sub: `转化率 ${percent(stats.conversion)}`, trend: "6.1%", icon: "star", color: "#f59e0b", soft: "#fff7e6" },
    { label: "有卡点", value: stats.bottlenecks, sub: stats.bottlenecks ? "需关注处理" : "暂无阻塞", trend: "4.1%", icon: "alert", color: "#ef4763", soft: "#fff0f3" },
    { label: "S级达人", value: stats.sTier, sub: "重点合作池", trend: "2.0%", icon: "user-check", color: "#2276f7", soft: "#eaf2ff" },
    { label: "已流失", value: stats.lost, sub: stats.total ? `流失率 ${percent(stats.lost / stats.total)}` : "无流失", trend: "1.3%", icon: "ban", color: "#14b8a6", soft: "#e8fbf8" },
  ];

  els.kpiGrid.innerHTML = cards.map((card) => `
    <article class="kpi-card" style="--metric-color:${card.color}; --metric-soft:${card.soft}">
      <div class="metric-icon">${icon(card.icon)}</div>
      <div class="metric-body">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <div class="metric-trend">${icon("arrow-up")} ${card.trend}<span class="vs">vs 近30天</span></div>
      </div>
      ${sparkline()}
    </article>
  `).join("");
}

function renderLegend() {
  els.tierLegend.innerHTML = TIERS.map((tier) => `
    <span class="legend-item">
      <span class="legend-dot" style="--tier-color:${tierMeta[tier].color}"></span>
      ${tier}级
    </span>
  `).join("");
}

function renderKanban() {
  const data = filteredRecords();
  els.kanbanColumns.innerHTML = STAGES.map((stage) => {
    const stageRecords = data.filter((record) => record.stage === stage.label);
    return `
      <section class="kanban-col" data-drop-stage="${escapeHtml(stage.label)}">
        <div class="kanban-col-head" style="--stage-color:${stage.color}">
          <div class="kanban-title">${icon(stage.icon)}<span>${stage.label}</span></div>
          <span class="count-pill">${stageRecords.length}</span>
        </div>
        <div class="kanban-stack">
          ${stageRecords.length ? stageRecords.map(renderTalentCard).join("") : `<div class="empty-state">暂无达人</div>`}
        </div>
      </section>
    `;
  }).join("");
}

function renderTalentCard(record) {
  const tier = tierMeta[record.tier];
  const stage = stageMeta(record.stage);
  return `
    <button class="talent-card" type="button" data-record-detail="${record.id}" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">
      <div class="talent-card-head">
        <div class="talent-title">
          <span class="talent-icon">${icon(typeIcon(record.type))}</span>
          <strong>${escapeHtml(record.name)}</strong>
        </div>
        <span class="tier-pill" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${record.tier}级</span>
      </div>
      <div class="card-meta">
        <span>${icon("tag")}${escapeHtml(record.type)}</span>
        <span>${icon("package")}${escapeHtml(record.product)}</span>
        <span>${icon(formatIcon(record.format))}${escapeHtml(record.format)}</span>
      </div>
      ${record.bottleneck ? `<div class="bottleneck-chip">${icon("alert")}<span>${escapeHtml(record.bottleneck)}</span></div>` : ""}
      <div class="talent-card-foot">
        <span class="muted">${escapeHtml(record.group)}组 · ${escapeHtml(record.person)}</span>
        <span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span>
      </div>
    </button>
  `;
}

function renderBottlenecks() {
  const items = filteredRecords().filter((record) => record.bottleneck);
  els.bottleneckList.innerHTML = items.length ? items.map((record) => {
    const stage = stageMeta(record.stage);
    return `
      <button class="bottleneck-item" type="button" data-record-detail="${record.id}">
        <div class="bottleneck-top">
          <div class="bottleneck-title">${icon("alert")}<strong>${escapeHtml(record.name)}</strong></div>
          <span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${record.stage}</span>
        </div>
        <p>${escapeHtml(record.bottleneck)}</p>
        <span class="muted">${escapeHtml(record.person)} · ${escapeHtml(record.product)}</span>
      </button>
    `;
  }).join("") : `<div class="empty-state">暂无卡点</div>`;
}

function renderOwners() {
  const data = filteredRecords();
  const max = Math.max(...PERSONS.map((person) => data.filter((record) => record.person === person).length), 1);
  els.ownerList.innerHTML = PERSONS.map((person) => {
    const owned = data.filter((record) => record.person === person);
    const signed = owned.filter((record) => record.stage === "已签约").length;
    const blocked = owned.filter((record) => record.bottleneck).length;
    return `
      <div class="owner-item">
        <div class="owner-top">
          <div class="owner-name">${icon("user-check")}<strong>${person}</strong></div>
          <span class="tag">${owned.length} 人</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="--progress:${(owned.length / max) * 100}%; --progress-color:#2276f7"></div>
        </div>
        <span class="muted">已签约 ${signed} · 卡点 ${blocked}</span>
      </div>
    `;
  }).join("");
}

function renderInsightSummary() {
  const data = filteredRecords();
  const stats = statsFor(data);
  const cards = [
    { title: "签约转化", desc: `${percent(stats.conversion)} active-to-signed`, icon: "chart", color: "#2276f7", soft: "#eaf2ff" },
    { title: "样品推进", desc: `${data.filter((r) => r.stage === "已寄样").length} 位达人已寄样`, icon: "truck", color: "#0fa66a", soft: "#e8f8f1" },
    { title: "试播观察", desc: `${data.filter((r) => r.stage === "试播中").length} 位达人试播中`, icon: "play", color: "#db2777", soft: "#fdf2f8" },
    { title: "卡点处理", desc: `${stats.bottlenecks} 项阻塞待跟进`, icon: "alert", color: "#ef4763", soft: "#fff0f3" },
    { title: "重点达人", desc: `${stats.sTier} 位 S 级达人`, icon: "star", color: "#f59e0b", soft: "#fff7e6" },
  ];

  els.insightSummary.innerHTML = cards.map((card) => `
    <article class="report-card" style="--report-color:${card.color}; --report-soft:${card.soft}">
      <div class="report-icon">${icon(card.icon)}</div>
      <div>
        <strong>${card.title}</strong>
        <span>${card.desc}</span>
      </div>
    </article>
  `).join("");
}

function renderFunnelChart() {
  const data = filteredRecords();
  const max = Math.max(...STAGES.map((stage) => data.filter((record) => record.stage === stage.label).length), 1);
  els.funnelChart.innerHTML = STAGES.map((stage) => {
    const count = data.filter((record) => record.stage === stage.label).length;
    const width = count ? Math.max((count / max) * 100, 12) : 0;
    return `
      <div class="funnel-row">
        <span class="chart-label">${stage.label}</span>
        <div class="chart-bar">
          <div class="chart-fill" style="--bar-width:${width}%; --bar-color:${stage.color}">${count}</div>
        </div>
        <span class="muted">${count} 人</span>
      </div>
    `;
  }).join("");
}

function renderTypeChart() {
  const data = filteredRecords();
  const max = Math.max(...TYPES.map((type) => data.filter((record) => record.type === type).length), 1);
  const palette = ["#2276f7", "#7c3aed", "#db2777", "#d97706", "#14b8a6", "#0fa66a", "#ef4763", "#64748b"];
  els.typeChart.innerHTML = TYPES.map((type, index) => {
    const count = data.filter((record) => record.type === type).length;
    const width = count ? Math.max((count / max) * 100, 10) : 0;
    return `
      <div class="bar-row">
        <span class="chart-label">${type}</span>
        <div class="chart-bar">
          <div class="chart-fill" style="--bar-width:${width}%; --bar-color:${palette[index]}">${count}</div>
        </div>
        <span class="muted">${count} 人</span>
      </div>
    `;
  }).join("");
}

function renderGroupChart() {
  const data = filteredRecords();
  els.groupChart.innerHTML = GROUPS.map((group) => {
    const groupRecords = data.filter((record) => record.group === group);
    const total = groupRecords.length || 1;
    return `
      <div class="stack-group">
        <div class="stack-head">
          <span>${group}组</span>
          <span class="muted">${groupRecords.length} 人</span>
        </div>
        <div class="stack-bar">
          ${STAGES.map((stage) => {
            const count = groupRecords.filter((record) => record.stage === stage.label).length;
            return count ? `<span class="stack-segment" title="${stage.label} ${count}" style="--segment-width:${(count / total) * 100}%; --segment-color:${stage.color}"></span>` : "";
          }).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderFormatGrid() {
  const data = filteredRecords();
  els.formatGrid.innerHTML = FORMATS.map((format) => {
    const count = data.filter((record) => record.format === format).length;
    const signed = data.filter((record) => record.format === format && record.stage === "已签约").length;
    return `
      <div class="format-card">
        <div class="format-card-head">${icon(formatIcon(format))}<span>${format}</span></div>
        <strong>${count}</strong>
        <span class="muted">已签约 ${signed}</span>
      </div>
    `;
  }).join("");
}

function renderDirectory() {
  const data = filteredRecords();
  els.tableCount.textContent = `${data.length} 条记录`;
  els.recordTableBody.innerHTML = data.length ? data.map((record) => {
    const stage = stageMeta(record.stage);
    const tier = tierMeta[record.tier];
    return `
      <tr>
        <td>
          <div class="record-name">
            <span class="record-name-icon" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${icon(typeIcon(record.type))}</span>
            <div>
              <strong>${escapeHtml(record.name)}</strong>
              <span>${escapeHtml(record.person)} · ${escapeHtml(record.group)}组</span>
            </div>
          </div>
        </td>
        <td><span class="tier-pill" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${record.tier}级</span></td>
        <td>${escapeHtml(record.type)}</td>
        <td>${escapeHtml(record.product)}</td>
        <td>${escapeHtml(record.group)}组</td>
        <td>${escapeHtml(record.format)}</td>
        <td><span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${record.stage}</span></td>
        <td>${escapeHtml(record.person)}</td>
        <td>${record.bottleneck ? `<span class="tag">有卡点</span>` : `<span class="muted">无</span>`}</td>
        <td><button class="small-button" type="button" data-record-detail="${record.id}">${icon("edit")}详情</button></td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="10"><div class="empty-state">暂无匹配记录</div></td></tr>`;
}

function renderAll() {
  renderKpis();
  renderLegend();
  renderKanban();
  renderBottlenecks();
  renderOwners();
  renderInsightSummary();
  renderFunnelChart();
  renderTypeChart();
  renderGroupChart();
  renderFormatGrid();
  renderDirectory();
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".nav-item").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === view);
  });
}

function openDrawer({ kicker, title, body }) {
  els.drawerKicker.textContent = kicker;
  els.drawerTitle.textContent = title;
  els.drawerBody.innerHTML = body;
  els.drawerBackdrop.hidden = false;
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
  els.drawerCloseBtn.focus();
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
  els.drawerBackdrop.hidden = true;
}

function openRecordDrawer(recordId) {
  const record = state.records.find((item) => item.id === Number(recordId));
  if (!record) return;
  const stage = stageMeta(record.stage);
  const tier = tierMeta[record.tier];
  const currentIndex = stageIndex(record.stage);
  const nextStage = STAGES[currentIndex + 1]?.label;
  const previousStage = STAGES[currentIndex - 1]?.label;

  openDrawer({
    kicker: "达人详情",
    title: record.name,
    body: `
      <div class="detail-stack">
        <div class="detail-block">
          <h4>基础信息</h4>
          <div class="detail-line"><span>等级</span><strong style="color:${tier.color}">${record.tier}级</strong></div>
          <div class="detail-line"><span>类型</span><strong>${escapeHtml(record.type)}</strong></div>
          <div class="detail-line"><span>产品</span><strong>${escapeHtml(record.product)}</strong></div>
          <div class="detail-line"><span>组别</span><strong>${escapeHtml(record.group)}组</strong></div>
          <div class="detail-line"><span>玩法</span><strong>${escapeHtml(record.format)}</strong></div>
          <div class="detail-line"><span>负责商务</span><strong>${escapeHtml(record.person)}</strong></div>
          <div class="detail-line"><span>状态</span><strong style="color:${stage.color}">${record.stage}</strong></div>
        </div>
        <div class="detail-block">
          <h4>卡点 / 备注</h4>
          <p>${record.bottleneck ? escapeHtml(record.bottleneck) : "暂无卡点。"}</p>
        </div>
        <div class="drawer-actions">
          ${previousStage ? `<button class="small-button" type="button" data-move-record="${record.id}" data-target-stage="${previousStage}">退回到${previousStage}</button>` : ""}
          ${nextStage ? `<button class="primary-button" type="button" data-move-record="${record.id}" data-target-stage="${nextStage}">${icon("arrow-right")}推进到${nextStage}</button>` : ""}
          <button class="small-button" type="button" data-edit-record="${record.id}">${icon("edit")}编辑</button>
        </div>
      </div>
    `,
  });
}

function openEditDrawer(recordId) {
  const record = recordId
    ? state.records.find((item) => item.id === Number(recordId))
    : { id: "", name: "", tier: "A", type: "美垂", product: "定妆喷雾", group: "A", format: "专场", stage: "待触达", person: "张三", bottleneck: "" };
  if (!record) return;

  openDrawer({
    kicker: record.id ? "编辑达人" : "添加达人",
    title: record.id ? record.name : "新达人",
    body: `
      <form class="form-grid two-col" id="recordForm">
        <input type="hidden" name="id" value="${record.id}" />
        <label class="form-field full">
          <span>达人名称</span>
          <input name="name" value="${escapeHtml(record.name)}" required placeholder="输入达人名称" />
        </label>
        ${selectField("tier", "达人等级", TIERS, record.tier)}
        ${selectField("type", "达人类型", TYPES, record.type)}
        ${selectField("product", "产品", PRODUCTS, record.product)}
        ${selectField("group", "组别", GROUPS, record.group)}
        ${selectField("format", "达人玩法", FORMATS, record.format)}
        ${selectField("stage", "当前状态", STAGES.map((stageItem) => stageItem.label), record.stage)}
        ${selectField("person", "负责商务", PERSONS, record.person)}
        <label class="form-field full">
          <span>卡点 / 备注</span>
          <textarea name="bottleneck" placeholder="输入当前卡点或备注信息">${escapeHtml(record.bottleneck)}</textarea>
        </label>
        <button class="primary-button full" type="submit">${record.id ? "保存修改" : "保存达人"}</button>
      </form>
    `,
  });
}

function selectField(name, label, options, value) {
  return `
    <label class="form-field">
      <span>${label}</span>
      <select name="${name}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function saveRecord(form) {
  const data = new FormData(form);
  const id = data.get("id") ? Number(data.get("id")) : null;
  const nextRecord = {
    id: id || state.nextId++,
    name: String(data.get("name") || "未命名").trim(),
    tier: String(data.get("tier")),
    type: String(data.get("type")),
    product: String(data.get("product")),
    group: String(data.get("group")),
    format: String(data.get("format")),
    stage: String(data.get("stage")),
    person: String(data.get("person")),
    bottleneck: String(data.get("bottleneck") || "").trim(),
  };

  if (id) {
    state.records = state.records.map((record) => (record.id === id ? nextRecord : record));
    showToast("达人信息已更新");
  } else {
    state.records.unshift(nextRecord);
    showToast("达人已添加");
  }
  updateTimestamp();
  renderAll();
  openRecordDrawer(nextRecord.id);
}

function moveRecord(recordId, targetStage) {
  const record = state.records.find((item) => item.id === Number(recordId));
  if (!record) return;
  record.stage = targetStage;
  if (targetStage !== "已流失") record.bottleneck = "";
  updateTimestamp();
  renderAll();
  openRecordDrawer(record.id);
  showToast(`${record.name} 已更新为「${targetStage}」`);
}

function resetFilters() {
  state.query = "";
  state.filters = { product: "", group: "", format: "", type: "", tier: "", stage: "", person: "" };
  els.searchInput.value = "";
  Object.values(filterMap()).forEach((select) => {
    select.value = "";
  });
  renderAll();
  showToast("筛选已重置");
}

function exportCsv() {
  const header = ["ID", "达人名称", "等级", "类型", "产品", "组", "玩法", "状态", "商务", "卡点"];
  const rows = filteredRecords().map((record) => [
    record.id,
    record.name,
    record.tier,
    record.type,
    record.product,
    record.group,
    record.format,
    record.stage,
    record.person,
    record.bottleneck,
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `达人跟进CRM_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV 已生成");
}

function filterMap() {
  return {
    product: els.filterProduct,
    group: els.filterGroup,
    format: els.filterFormat,
    type: els.filterType,
    tier: els.filterTier,
    stage: els.filterStage,
    person: els.filterPerson,
  };
}

let toastTimer;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function updateTimestamp() {
  els.lastUpdate.textContent = new Date().toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    if (nav) {
      setView(nav.dataset.view);
      return;
    }

    const recordDetail = event.target.closest("[data-record-detail]");
    if (recordDetail) {
      openRecordDrawer(recordDetail.dataset.recordDetail);
      return;
    }

    const editRecord = event.target.closest("[data-edit-record]");
    if (editRecord) {
      openEditDrawer(editRecord.dataset.editRecord);
      return;
    }

    const moveRecordButton = event.target.closest("[data-move-record]");
    if (moveRecordButton) {
      moveRecord(moveRecordButton.dataset.moveRecord, moveRecordButton.dataset.targetStage);
    }
  });

  els.searchInput.addEventListener("input", (event) => {
    state.query = normalize(event.target.value);
    renderAll();
  });

  Object.entries(filterMap()).forEach(([key, select]) => {
    select.addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      renderAll();
    });
  });

  els.resetFiltersBtn.addEventListener("click", resetFilters);
  els.exportBtn.addEventListener("click", exportCsv);
  els.addRecordBtn.addEventListener("click", () => openEditDrawer());
  els.drawerCloseBtn.addEventListener("click", closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);

  els.drawerBody.addEventListener("submit", (event) => {
    if (event.target.id === "recordForm") {
      event.preventDefault();
      saveRecord(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

function init() {
  renderFilterOptions();
  updateTimestamp();
  bindEvents();
  renderAll();
}

init();
