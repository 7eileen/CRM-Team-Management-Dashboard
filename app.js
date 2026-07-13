const PIPELINE_STAGES = [
  { id: "pool", label: "公海达人", sourceStages: ["待触达", "已流失"], color: "#f97316", soft: "#fff7ed", icon: "target" },
  { id: "waiting-connect", label: "待建联", sourceStages: ["已触达"], color: "#64748b", soft: "#f8fafc", icon: "user-check" },
  { id: "connecting", label: "建联中", sourceStages: ["沟通中"], color: "#2563eb", soft: "#eaf2ff", icon: "handshake" },
  { id: "sampled", label: "已寄样", sourceStages: ["已寄样"], color: "#8b5cf6", soft: "#f3edff", icon: "truck" },
  { id: "scheduling", label: "待排期", sourceStages: ["试播中", "洽谈排期"], color: "#f59e0b", soft: "#fff7e6", icon: "calendar" },
  { id: "partnered", label: "已合作", color: "#22c55e", soft: "#eaf8f1", icon: "star", predicate: (record) => record.stage === "已签约" && !isDeepPartner(record) },
  { id: "deep-partnered", label: "深度合作", color: "#0f766e", soft: "#ecfdf5", icon: "star", predicate: isDeepPartner },
];
const DISPLAY_STAGE_SOURCE_FALLBACK = {
  待触达: "公海达人",
  已触达: "待建联",
  沟通中: "建联中",
  已寄样: "已寄样",
  试播中: "待排期",
  洽谈排期: "待排期",
  已签约: "已合作",
  已流失: "公海达人",
  公海达人: "公海达人",
  待建联: "待建联",
  建联中: "建联中",
  待排期: "待排期",
  已合作: "已合作",
  深度合作: "深度合作",
};
const DISPLAY_STAGE_TO_SOURCE = {
  公海达人: "待触达",
  待建联: "已触达",
  建联中: "沟通中",
  已寄样: "已寄样",
  待排期: "洽谈排期",
  已合作: "已签约",
  深度合作: "已签约",
};

const PRODUCTS = ["定妆喷雾", "气垫pro", "防晒素颜霜", "防晒喷雾"];
const FORMATS = ["专场", "混播", "单品直播间", "短视频挂车", "IP小号"];
const TYPES = ["美垂", "生活分享", "三农", "时尚穿搭", "美食", "母婴", "剧情搞笑", "其他"];
const TIERS = ["S", "A", "B", "C"];
const MANAGER = "六六";
const BUSINESS_PEOPLE = [
  { name: "戴娜", group: "A3组" },
  { name: "周鸿美", group: "A3组" },
  { name: "窦婉婷", group: "B1组" },
  { name: "池维杞", group: "B1组" },
  { name: "姚慧英", group: "B1组" },
  { name: "刘则宇黄娇", group: "达播合作" },
  { name: "马雯", group: "专场B组" },
  { name: "郑若楠", group: "专场B组" },
  { name: "谭燕琳", group: "专场B组" },
  { name: "郭洁玲", group: "专场B组" },
  { name: "徐怀玉", group: "B2组" },
  { name: "王娅兰", group: "B2组" },
  { name: "俞梦薇", group: "B2组" },
  { name: "邓斯婕", group: "B2组" },
  { name: "黄建新", group: "数据中台组" },
  { name: "叶倩文", group: "数据中台组" },
  { name: "黄欣瑜", group: "A1组" },
  { name: "张如茜", group: "A1组" },
  { name: "郎嘉欣", group: "A1组" },
  { name: "欧阳婉怡", group: "A1组" },
  { name: "杨洁", group: "专场A组" },
  { name: "辛思怡", group: "专场A组" },
  { name: "曹艳媚", group: "专场A组" },
  { name: "陈思奇", group: "专场A组" },
  { name: "许嘉敏", group: "A2组" },
  { name: "王蕾媛", group: "A2组" },
];
const PERSONS = BUSINESS_PEOPLE.map((person) => person.name);
const GROUPS = Array.from(new Set(BUSINESS_PEOPLE.map((person) => person.group)));
const BUSINESS_GROUP_BY_PERSON = BUSINESS_PEOPLE.reduce((acc, person) => {
  acc[person.name] = person.group;
  return acc;
}, {});

const chartPalette = ["#2563eb", "#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#3b82f6", "#ef4444", "#84cc16"];
const SALES_METRICS_STORAGE_KEY = "crm-sales-metrics-v1";

const tierMeta = {
  S: { color: "#d97706", soft: "#fff7e6", score: 35 },
  A: { color: "#2563eb", soft: "#eaf2ff", score: 28 },
  B: { color: "#64748b", soft: "#f1f5f9", score: 20 },
  C: { color: "#94a3b8", soft: "#f8fafc", score: 14 },
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

const productSalesBase = {
  定妆喷雾: 82000,
  "气垫pro": 96000,
  防晒素颜霜: 76000,
  防晒喷雾: 68000,
};

const stageSalesFactor = {
  待触达: 0.18,
  已触达: 0.28,
  沟通中: 0.48,
  已寄样: 0.68,
  试播中: 0.82,
  洽谈排期: 0.92,
  已签约: 1.18,
  已流失: 0.08,
};

const formatSalesFactor = {
  专场: 1.28,
  混播: 1.05,
  单品直播间: 1.12,
  短视频挂车: 0.78,
  IP小号: 0.52,
};

const initialRecords = [
  { id: 1, name: "小美酱", tier: "S", type: "美垂", product: "定妆喷雾", group: "A3组", format: "专场", stage: "已签约", person: "戴娜", bottleneck: "" },
  { id: 2, name: "乡村阿花", tier: "A", type: "三农", product: "防晒素颜霜", group: "A3组", format: "短视频挂车", stage: "试播中", person: "周鸿美", bottleneck: "排期冲突，等达人档期" },
  { id: 3, name: "生活达人Lily", tier: "A", type: "生活分享", product: "气垫pro", group: "B1组", format: "混播", stage: "沟通中", person: "窦婉婷", bottleneck: "达人对佣金比例有异议" },
  { id: 4, name: "潮流小K", tier: "B", type: "时尚穿搭", product: "定妆喷雾", group: "B1组", format: "单品直播间", stage: "已寄样", person: "池维杞", bottleneck: "" },
  { id: 5, name: "美食控阿强", tier: "C", type: "美食", product: "防晒喷雾", group: "B1组", format: "IP小号", stage: "待触达", person: "姚慧英", bottleneck: "" },
  { id: 6, name: "辣妈CC", tier: "S", type: "母婴", product: "气垫pro", group: "达播合作", format: "专场", stage: "洽谈排期", person: "刘则宇黄娇", bottleneck: "报价超出预算30%" },
  { id: 7, name: "化妆师老罗", tier: "A", type: "美垂", product: "定妆喷雾", group: "专场B组", format: "混播", stage: "已触达", person: "马雯", bottleneck: "" },
  { id: 8, name: "田野阿宝", tier: "B", type: "三农", product: "防晒喷雾", group: "专场B组", format: "短视频挂车", stage: "沟通中", person: "郑若楠", bottleneck: "" },
  { id: 9, name: "Vicky爱分享", tier: "A", type: "生活分享", product: "防晒素颜霜", group: "专场B组", format: "专场", stage: "已寄样", person: "谭燕琳", bottleneck: "样品物流延迟" },
  { id: 10, name: "段子手大刘", tier: "B", type: "剧情搞笑", product: "防晒喷雾", group: "专场B组", format: "短视频挂车", stage: "待触达", person: "郭洁玲", bottleneck: "" },
  { id: 11, name: "美妆课代表", tier: "S", type: "美垂", product: "气垫pro", group: "B2组", format: "单品直播间", stage: "已签约", person: "徐怀玉", bottleneck: "" },
  { id: 12, name: "小城日记", tier: "C", type: "生活分享", product: "定妆喷雾", group: "B2组", format: "IP小号", stage: "已触达", person: "王娅兰", bottleneck: "" },
  { id: 13, name: "穿搭达人Nina", tier: "A", type: "时尚穿搭", product: "防晒素颜霜", group: "B2组", format: "混播", stage: "试播中", person: "俞梦薇", bottleneck: "试播数据不达标，需二次评估" },
  { id: 14, name: "农家胖哥", tier: "B", type: "三农", product: "防晒喷雾", group: "B2组", format: "单品直播间", stage: "洽谈排期", person: "邓斯婕", bottleneck: "" },
  { id: 15, name: "小白的美妆日记", tier: "B", type: "美垂", product: "定妆喷雾", group: "数据中台组", format: "短视频挂车", stage: "沟通中", person: "黄建新", bottleneck: "" },
  { id: 16, name: "厨神阿欢", tier: "C", type: "美食", product: "防晒素颜霜", group: "数据中台组", format: "IP小号", stage: "已流失", person: "叶倩文", bottleneck: "达人明确拒绝合作" },
  { id: 17, name: "国际庄小马", tier: "B", type: "剧情搞笑", product: "气垫pro", group: "A1组", format: "短视频挂车", stage: "待触达", person: "黄欣瑜", bottleneck: "" },
  { id: 18, name: "辣妹CC酱", tier: "A", type: "美垂", product: "防晒喷雾", group: "A1组", format: "混播", stage: "已寄样", person: "张如茜", bottleneck: "" },
  { id: 19, name: "宝妈的精致生活", tier: "C", type: "母婴", product: "气垫pro", group: "A1组", format: "专场", stage: "沟通中", person: "郎嘉欣", bottleneck: "需等618大促结束后再谈" },
  { id: 20, name: "三叔的院子", tier: "A", type: "三农", product: "防晒素颜霜", group: "A1组", format: "短视频挂车", stage: "已签约", person: "欧阳婉怡", bottleneck: "" },
];

const state = {
  view: "dashboard",
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
  salesMetrics: null,
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
  managementProductSales: document.getElementById("managementProductSales"),
  managementTypeSales: document.getElementById("managementTypeSales"),
  managementTeamSales: document.getElementById("managementTeamSales"),
  managementPersonRank: document.getElementById("managementPersonRank"),
  managementTierSales: document.getElementById("managementTierSales"),
  managementStageSales: document.getElementById("managementStageSales"),
  managementTalentRank: document.getElementById("managementTalentRank"),
  personalTitle: document.getElementById("personalTitle"),
  personalScopeBadge: document.getElementById("personalScopeBadge"),
  personalSummary: document.getElementById("personalSummary"),
  personalProductSales: document.getElementById("personalProductSales"),
  personalTierSales: document.getElementById("personalTierSales"),
  personalStageSales: document.getElementById("personalStageSales"),
  personalTalentRank: document.getElementById("personalTalentRank"),
  dashboardTableCount: document.getElementById("dashboardTableCount"),
  tierLegend: document.getElementById("tierLegend"),
  kanbanColumns: document.getElementById("kanbanColumns"),
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

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function displayStageMeta(label) {
  return PIPELINE_STAGES.find((stage) => stage.label === label) || PIPELINE_STAGES[0];
}

function sourceStageForDisplay(label) {
  return DISPLAY_STAGE_TO_SOURCE[label] || label;
}

function isDeepPartner(record) {
  return record.stage === "已签约" && (record.tier === "S" || record.format === "专场");
}

function pipelineStageRecords(data, stage) {
  if (typeof stage.predicate === "function") return data.filter(stage.predicate);
  return data.filter((record) => stage.sourceStages.includes(record.stage));
}

function displayStageLabelForRecord(record) {
  const stage = PIPELINE_STAGES.find((stageItem) => pipelineStageRecords([record], stageItem).length > 0);
  return stage?.label || DISPLAY_STAGE_SOURCE_FALLBACK[record.stage] || PIPELINE_STAGES[0].label;
}

function displayStageForRecord(record) {
  return displayStageMeta(displayStageLabelForRecord(record));
}

function displayStageIndexForRecord(record) {
  return Math.max(PIPELINE_STAGES.findIndex((stage) => stage.label === displayStageLabelForRecord(record)), 0);
}

function displayStageRows(data, selector = () => 1) {
  const totals = new Map(PIPELINE_STAGES.map((stage) => [stage.label, 0]));
  data.forEach((record) => {
    const label = displayStageLabelForRecord(record);
    totals.set(label, (totals.get(label) || 0) + selector(record));
  });
  return PIPELINE_STAGES.map((stage) => ({
    label: stage.label,
    value: totals.get(stage.label) || 0,
    count: totals.get(stage.label) || 0,
    icon: stage.icon,
    color: stage.color,
    soft: stage.soft,
  }));
}

function typeIcon(type) {
  return typeIconMap[type] || "user-check";
}

function formatIcon(format) {
  return formatIconMap[format] || "tag";
}

function currency(value) {
  return `¥${Math.round(value).toLocaleString("zh-CN")}`;
}

function compactCurrency(value) {
  if (Math.abs(value) >= 10000) return `¥${(value / 10000).toFixed(1)}万`;
  return currency(value);
}

function signedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function recordSales(record) {
  const base = productSalesBase[record.product] || 60000;
  const stageFactor = stageSalesFactor[record.stage] || 0.4;
  const formatFactor = formatSalesFactor[record.format] || 1;
  const tierFactor = { S: 1.45, A: 1.18, B: 0.92, C: 0.72 }[record.tier] || 1;
  const seedFactor = 0.92 + ((record.id * 17) % 19) / 100;
  return Math.round((base * stageFactor * formatFactor * tierFactor * seedFactor) / 100) * 100;
}

function recordLastMonthSales(record) {
  const factor = 0.82 + ((record.id * 11) % 17) / 100;
  return Math.round((recordSales(record) * factor) / 100) * 100;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMetricMonth(month) {
  const match = String(month || "").match(/^(\d{4})-(\d{2})$/);
  return match ? `${match[1]}年${Number(match[2])}月` : "当月";
}

function moneyInputValue(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : fallback;
}

function recordSpecialCount(record) {
  if (record.format !== "专场") return 0;
  return Math.max(1, { S: 5, A: 4, B: 3, C: 2 }[record.tier] - (record.stage === "已流失" ? 2 : 0));
}

function recordLastMonthSpecialCount(record) {
  return Math.max(0, recordSpecialCount(record) - (record.id % 2));
}

function enrichRecord(record) {
  return {
    ...record,
    sales: recordSales(record),
    lastMonthSales: recordLastMonthSales(record),
    specialCount: recordSpecialCount(record),
    lastMonthSpecialCount: recordLastMonthSpecialCount(record),
  };
}

function enrichedRecords(data = filteredRecords()) {
  return data.map(enrichRecord);
}

function sumBy(data, selector) {
  return data.reduce((sum, item) => sum + selector(item), 0);
}

function defaultSalesMetrics() {
  const data = enrichedRecords();
  const currentMonthSales = sumBy(data, (record) => record.sales);
  const previousMonthSales = sumBy(data, (record) => record.lastMonthSales);
  return {
    month: currentMonthKey(),
    currentMonthSales,
    previousMonthSales,
    annualTarget: 6800000,
    annualCompletedSales: Math.round((currentMonthSales * 6.4) / 100) * 100,
  };
}

function normalizeSalesMetrics(metrics = {}, defaults = defaultSalesMetrics()) {
  return {
    month: String(metrics.month || defaults.month),
    currentMonthSales: moneyInputValue(metrics.currentMonthSales, defaults.currentMonthSales),
    previousMonthSales: moneyInputValue(metrics.previousMonthSales, defaults.previousMonthSales),
    annualTarget: Math.max(1, moneyInputValue(metrics.annualTarget, defaults.annualTarget)),
    annualCompletedSales: moneyInputValue(metrics.annualCompletedSales, defaults.annualCompletedSales),
  };
}

function loadSalesMetrics() {
  const defaults = defaultSalesMetrics();
  try {
    const saved = JSON.parse(localStorage.getItem(SALES_METRICS_STORAGE_KEY) || "null");
    return normalizeSalesMetrics(saved || defaults, defaults);
  } catch {
    return defaults;
  }
}

function getSalesMetrics() {
  if (!state.salesMetrics) state.salesMetrics = loadSalesMetrics();
  return state.salesMetrics;
}

function groupSales(data, key, orderedKeys) {
  const totals = data.reduce((acc, record) => {
    acc[record[key]] = (acc[record[key]] || 0) + record.sales;
    return acc;
  }, {});
  const keys = orderedKeys || Object.keys(totals);
  return keys.map((label) => ({ label, value: totals[label] || 0 }));
}

function personSalesRows(data = enrichedRecords()) {
  return PERSONS.map((person) => {
    const items = data.filter((record) => record.person === person);
    return {
      person,
      sales: sumBy(items, (record) => record.sales),
      lastMonthSales: sumBy(items, (record) => record.lastMonthSales),
      specialCount: sumBy(items, (record) => record.specialCount),
      lastMonthSpecialCount: sumBy(items, (record) => record.lastMonthSpecialCount),
      talentCount: items.length,
    };
  }).sort((a, b) => b.sales - a.sales);
}

function selectedPerson() {
  return state.filters.person || PERSONS[0];
}

function recordsForPerson(person = selectedPerson()) {
  return enrichedRecords(filteredRecords({ ignorePerson: true })).filter((record) => record.person === person);
}

function optionHtml(defaultLabel, values) {
  return [
    `<option value="">${defaultLabel}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`),
  ].join("");
}

function renderFilterOptions() {
  els.filterProduct.innerHTML = optionHtml("全部产品", PRODUCTS);
  els.filterGroup.innerHTML = optionHtml("全部组", GROUPS);
  els.filterFormat.innerHTML = optionHtml("全部玩法", FORMATS);
  els.filterType.innerHTML = optionHtml("全部类型", TYPES);
  els.filterTier.innerHTML = optionHtml("全部等级", TIERS);
  els.filterStage.innerHTML = optionHtml("全部状态", PIPELINE_STAGES.map((stage) => stage.label));
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
    displayStageLabelForRecord(record),
    record.person,
    record.bottleneck,
  ].join(" ").toLowerCase();
}

function filteredRecords(options = {}) {
  return state.records.filter((record) => {
    const filters = state.filters;
    const matchesFilters =
      (!filters.product || record.product === filters.product) &&
      (!filters.group || record.group === filters.group) &&
      (!filters.format || record.format === filters.format) &&
      (!filters.type || record.type === filters.type) &&
      (!filters.tier || record.tier === filters.tier) &&
      (!filters.stage || displayStageLabelForRecord(record) === filters.stage) &&
      (options.ignorePerson || !filters.person || record.person === filters.person);

    return matchesFilters && (!state.query || recordSearchText(record).includes(state.query));
  });
}

function statsFor(data) {
  const total = data.length;
  const signed = data.filter((record) => ["已合作", "深度合作"].includes(displayStageLabelForRecord(record))).length;
  const deepPartnered = data.filter((record) => displayStageLabelForRecord(record) === "深度合作").length;
  const active = total;
  const bottlenecks = data.filter((record) => record.bottleneck).length;
  const sTier = data.filter((record) => record.tier === "S").length;
  const inPipeline = Math.max(active - signed, 0);
  const conversion = active ? signed / active : 0;
  return { total, signed, deepPartnered, active, bottlenecks, sTier, inPipeline, conversion };
}

function countBy(data, key) {
  return data.reduce((acc, record) => {
    acc[record[key]] = (acc[record[key]] || 0) + 1;
    return acc;
  }, {});
}

function conicGradient(items, total) {
  if (!total) return "#e8eef8 0deg 360deg";
  let cursor = 0;
  return items
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = cursor;
      const end = cursor + (item.count / total) * 360;
      cursor = end;
      return `${item.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`;
    })
    .join(", ");
}

function sparkline(path = "M2 34 C12 23 17 31 25 20 C33 9 38 25 47 15 C56 5 61 20 70 7") {
  return `<svg class="sparkline" viewBox="0 0 72 42" aria-hidden="true"><path d="${path}"></path></svg>`;
}

function renderKpis() {
  const cards = state.view === "personal" ? personalKpiCards() : managementKpiCards();
  els.kpiGrid.classList.toggle("management-kpis", state.view !== "personal");
  els.kpiGrid.classList.toggle("personal-kpis", state.view === "personal");
  els.kpiGrid.innerHTML = cards.map((card) => `
    <article class="kpi-card" style="--metric-color:${card.color}; --metric-soft:${card.soft}">
      <div class="metric-icon">${icon(card.icon)}</div>
      <div class="metric-body">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <div class="metric-trend ${card.trendValue < 0 ? "down" : ""}">
          ${icon(card.trendValue < 0 ? "arrow-right" : "arrow-up")} ${card.trend}
          <span class="vs">${card.sub}</span>
        </div>
      </div>
      ${sparkline(card.path)}
    </article>
  `).join("");
}

function managementKpiCards() {
  const metrics = getSalesMetrics();
  const monthlySales = metrics.currentMonthSales;
  const lastMonthSales = metrics.previousMonthSales;
  const annualTarget = metrics.annualTarget;
  const yearlySales = metrics.annualCompletedSales;
  const progress = yearlySales / annualTarget;
  const mom = lastMonthSales ? (monthlySales - lastMonthSales) / lastMonthSales : 0;
  const monthLabel = formatMetricMonth(metrics.month);
  return [
    { label: "当月销售额", value: compactCurrency(monthlySales), sub: monthLabel, trend: signedPercent(mom * 100), trendValue: mom, icon: "chart", color: "#2563eb", soft: "#eaf2ff", path: "M2 34 C12 22 18 30 27 18 C36 6 43 24 51 15 C59 6 64 18 70 8" },
    { label: "全年销售额目标", value: compactCurrency(annualTarget), sub: "可编辑年度目标", trend: "目标锁定", trendValue: 1, icon: "target", color: "#8b5cf6", soft: "#f3edff", path: "M2 28 C13 19 20 24 29 15 C40 5 46 20 55 12 C62 7 66 11 70 5" },
    { label: "进度", value: percent(progress), sub: `${compactCurrency(yearlySales)} 已完成`, trend: "年度进度", trendValue: progress, icon: "pie", color: "#22c55e", soft: "#eaf8f1", path: "M2 36 C12 32 18 26 26 22 C35 17 43 15 51 11 C60 7 65 7 70 4" },
    { label: "环比上月", value: signedPercent(mom * 100), sub: `${compactCurrency(lastMonthSales)} 上月`, trend: mom >= 0 ? "增长" : "下降", trendValue: mom, icon: "arrow-up", color: mom >= 0 ? "#f59e0b" : "#ef4444", soft: mom >= 0 ? "#fff7e6" : "#feecec", path: "M2 22 C12 19 20 26 28 16 C36 7 44 18 52 12 C60 6 65 9 70 4" },
  ];
}

function personalKpiCards() {
  const person = selectedPerson();
  const rows = personSalesRows(enrichedRecords(filteredRecords({ ignorePerson: true })));
  const row = rows.find((item) => item.person === person) || rows[0];
  const rank = rows.findIndex((item) => item.person === row.person) + 1;
  const previous = rows[rank - 2];
  const nextSpecialLeader = [...rows].sort((a, b) => b.specialCount - a.specialCount).find((item) => item.specialCount > row.specialCount);
  const gap = previous ? previous.sales - row.sales : 0;
  const specialGap = nextSpecialLeader ? nextSpecialLeader.specialCount - row.specialCount : 0;
  const mom = row.lastMonthSales ? (row.sales - row.lastMonthSales) / row.lastMonthSales : 0;
  return [
    { label: "当月销售额", value: compactCurrency(row.sales), sub: `${row.person} 当月`, trend: signedPercent(mom * 100), trendValue: mom, icon: "chart", color: "#2563eb", soft: "#eaf2ff", path: "M2 34 C12 22 18 30 27 18 C36 6 43 24 51 15 C59 6 64 18 70 8" },
    { label: "当月销售额排名", value: `第 ${rank}`, sub: `共 ${rows.length} 位商务`, trend: rank === 1 ? "领先" : "追赶", trendValue: rank === 1 ? 1 : -1, icon: "star", color: "#f59e0b", soft: "#fff7e6", path: "M2 30 C12 24 20 28 29 18 C38 8 45 16 53 11 C61 7 66 9 70 5" },
    { label: "距离上一名差距", value: rank === 1 ? "领先" : compactCurrency(gap), sub: rank === 1 ? "当前第一名" : `上一名 ${previous.person}`, trend: rank === 1 ? "Top 1" : "差距", trendValue: rank === 1 ? 1 : -1, icon: "target", color: "#8b5cf6", soft: "#f3edff", path: "M2 28 C14 22 21 25 30 17 C40 8 48 21 57 13 C64 7 68 10 70 6" },
    { label: "专场数量", value: row.specialCount, sub: `${row.talentCount} 位达人`, trend: "专场", trendValue: row.specialCount, icon: "calendar", color: "#14b8a6", soft: "#e8fbf8", path: "M2 32 C11 28 18 24 27 21 C36 18 43 13 52 11 C60 9 66 7 70 5" },
    { label: "专场数量差距", value: specialGap ? `${specialGap} 场` : "领先", sub: specialGap ? "距更高专场数" : "专场数领先", trend: specialGap ? "待追赶" : "Top", trendValue: specialGap ? -1 : 1, icon: "file", color: "#ec4899", soft: "#fdf2f8", path: "M2 20 C12 22 20 16 28 21 C38 28 45 18 54 22 C62 26 66 20 70 24" },
    { label: "环比上月", value: signedPercent(mom * 100), sub: `${compactCurrency(row.lastMonthSales)} 上月`, trend: mom >= 0 ? "增长" : "下降", trendValue: mom, icon: "arrow-up", color: mom >= 0 ? "#22c55e" : "#ef4444", soft: mom >= 0 ? "#eaf8f1" : "#feecec", path: "M2 34 C12 29 18 27 26 22 C35 16 43 13 51 10 C59 8 65 6 70 4" },
  ];
}

function renderSalesBars(container, rows, options = {}) {
  if (!container) return;
  const max = Math.max(...rows.map((row) => row.value), 1);
  const total = sumBy(rows, (row) => row.value);
  const palette = options.palette || chartPalette;
  container.innerHTML = rows.map((row, index) => {
    const width = row.value ? Math.max((row.value / max) * 100, 6) : 0;
    const color = row.color || palette[index % palette.length];
    return `
      <div class="sales-bar-row">
        <span class="sales-bar-label">${row.icon ? icon(row.icon) : ""}${escapeHtml(row.label)}</span>
        <div class="sales-bar-track">
          <i style="--bar-width:${width}%; --bar-color:${color}"></i>
        </div>
        <strong>${compactCurrency(row.value)}</strong>
        ${options.showPercent ? `<em>${total ? percent(row.value / total) : "0.0%"}</em>` : ""}
      </div>
    `;
  }).join("");
}

function renderSalesDonut(container, rows, centerLabel) {
  if (!container) return;
  const total = sumBy(rows, (row) => row.value);
  const items = rows.map((row, index) => ({
    label: row.label,
    count: row.value,
    color: row.color || chartPalette[index % chartPalette.length],
    icon: row.icon,
  }));
  const gradient = conicGradient(items, total);
  container.innerHTML = `
    <div class="donut-layout sales-donut-layout">
      <div class="donut-chart">
        <div class="donut-ring" style="--donut: conic-gradient(${gradient})">
          <div>
            <strong>${compactCurrency(total)}</strong>
            <span>${centerLabel}</span>
          </div>
        </div>
      </div>
      <div class="legend-list">
        ${items.map((item) => `
          <div class="legend-row">
            <span class="legend-label">
              <span class="legend-dot" style="--legend-color:${item.color}"></span>
              ${item.icon ? icon(item.icon) : ""}
              ${escapeHtml(item.label)}
            </span>
            <strong>${compactCurrency(item.count)}</strong>
            <em>${total ? percent(item.count / total) : "0.0%"}</em>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderManagementDashboard() {
  const data = enrichedRecords();
  const productRows = groupSales(data, "product", PRODUCTS).map((row, index) => ({ ...row, icon: "package", color: chartPalette[index] }));
  const typeRows = groupSales(data, "type", TYPES).map((row, index) => ({ ...row, icon: typeIcon(row.label), color: chartPalette[index] }));
  const teamRows = groupSales(data, "group", GROUPS).map((row, index) => ({ label: row.label, value: row.value, icon: "users", color: chartPalette[(index + 2) % chartPalette.length] }));
  const tierRows = groupSales(data, "tier", TIERS).map((row) => ({ ...row, label: `${row.label}级`, icon: "star", color: tierMeta[row.label]?.color }));
  const stageRows = displayStageRows(data, (record) => record.sales);

  renderSalesBars(els.managementProductSales, productRows);
  renderSalesBars(els.managementTypeSales, typeRows);
  renderSalesBars(els.managementTeamSales, teamRows);
  renderSalesDonut(els.managementTierSales, tierRows, "SABC Sales");
  renderSalesBars(els.managementStageSales, stageRows, { showPercent: true });
  renderManagementPersonRank(data);
  renderTalentSalesRank(els.managementTalentRank, data.slice().sort((a, b) => b.sales - a.sales), "sales");
  if (els.dashboardTableCount) {
    els.dashboardTableCount.textContent = `${PERSONS.length} 位商务`;
  }
}

function renderManagementPersonRank(data) {
  if (!els.managementPersonRank) return;
  const rows = personSalesRows(data);
  const max = rows[0]?.sales || 1;
  els.managementPersonRank.innerHTML = rows.map((row, index) => {
    const mom = row.lastMonthSales ? (row.sales - row.lastMonthSales) / row.lastMonthSales : 0;
    return `
      <button class="person-rank-row" type="button" data-person-filter="${escapeHtml(row.person)}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-avatar person-avatar">${icon("user-check")}</span>
        <span class="rank-info">
          <strong>${escapeHtml(row.person)}</strong>
          <em>${row.talentCount} 位达人 · ${row.specialCount} 场专场</em>
        </span>
        <span class="rank-meter">
          <i style="--rank-width:${(row.sales / max) * 100}%; --rank-color:${chartPalette[index % chartPalette.length]}"></i>
        </span>
        <b>${compactCurrency(row.sales)}</b>
        <em class="rank-growth ${mom < 0 ? "negative" : ""}">${signedPercent(mom * 100)}</em>
      </button>
    `;
  }).join("");
}

function renderPersonalDashboard() {
  const person = selectedPerson();
  const data = recordsForPerson(person);
  const allRows = personSalesRows(enrichedRecords(filteredRecords({ ignorePerson: true })));
  const row = allRows.find((item) => item.person === person) || allRows[0];
  const rank = allRows.findIndex((item) => item.person === row.person) + 1;
  const previous = allRows[rank - 2];
  const gap = previous ? previous.sales - row.sales : 0;

  if (els.personalTitle) els.personalTitle.textContent = `${row.person} CRM 个人看板`;
  if (els.personalScopeBadge) els.personalScopeBadge.textContent = state.filters.person ? "当前商务" : `默认${PERSONS[0]}`;
  if (els.personalSummary) {
    els.personalSummary.innerHTML = `
      <div class="summary-tile">
        <span>${icon("chart")}当月销售额</span>
        <strong>${compactCurrency(row.sales)}</strong>
      </div>
      <div class="summary-tile">
        <span>${icon("star")}销售排名</span>
        <strong>第 ${rank}</strong>
      </div>
      <div class="summary-tile">
        <span>${icon("target")}距上一名</span>
        <strong>${rank === 1 ? "领先" : compactCurrency(gap)}</strong>
      </div>
      <div class="summary-tile">
        <span>${icon("calendar")}专场数量</span>
        <strong>${row.specialCount}</strong>
      </div>
    `;
  }

  const productRows = groupSales(data, "product", PRODUCTS).map((item, index) => ({ ...item, icon: "package", color: chartPalette[index] }));
  const tierRows = groupSales(data, "tier", TIERS).map((item) => ({ ...item, label: `${item.label}级`, icon: "star", color: tierMeta[item.label]?.color }));
  const stageRows = displayStageRows(data, (record) => record.sales);

  renderSalesBars(els.personalProductSales, productRows);
  renderSalesDonut(els.personalTierSales, tierRows, "Personal Sales");
  renderSalesBars(els.personalStageSales, stageRows, { showPercent: true });
  renderTalentSalesRank(els.personalTalentRank, data.slice().sort((a, b) => b.sales - a.sales), "sales");
}

function renderTalentSalesRank(container, data, metric = "sales") {
  if (!container) return;
  const max = Math.max(...data.map((record) => record[metric]), 1);
  container.innerHTML = data.length ? data.map((record, index) => {
    const tier = tierMeta[record.tier];
    return `
      <button class="talent-sales-row" type="button" data-record-detail="${record.id}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-avatar" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${icon(typeIcon(record.type))}</span>
        <span class="rank-info">
          <strong>${escapeHtml(record.name)}</strong>
          <em>${escapeHtml(record.product)} · ${escapeHtml(record.person)} · ${record.tier}级</em>
        </span>
        <span class="rank-meter">
          <i style="--rank-width:${(record[metric] / max) * 100}%; --rank-color:${tier.color}"></i>
        </span>
        <b>${compactCurrency(record[metric])}</b>
      </button>
    `;
  }).join("") : `<div class="empty-state">暂无匹配达人</div>`;
}

function renderTypeDonut() {
  const data = filteredRecords();
  const counts = countBy(data, "type");
  const items = TYPES.map((type, index) => ({
    label: type,
    count: counts[type] || 0,
    color: chartPalette[index],
    icon: typeIcon(type),
  }));
  const gradient = conicGradient(items, data.length);

  els.typeDonut.innerHTML = `
    <div class="donut-ring" style="--donut: conic-gradient(${gradient})">
      <div>
        <strong>${data.length}</strong>
        <span>Total Talents</span>
      </div>
    </div>
  `;

  els.typeLegend.innerHTML = items.map((item) => `
    <div class="legend-row">
      <span class="legend-label">
        <span class="legend-dot" style="--legend-color:${item.color}"></span>
        ${icon(item.icon)}
        ${escapeHtml(item.label)}
      </span>
      <strong>${item.count}</strong>
      <em>${data.length ? percent(item.count / data.length) : "0.0%"}</em>
    </div>
  `).join("");
}

function talentScore(record) {
  const stagePosition = displayStageIndexForRecord(record);
  const stageScore = stagePosition * 8;
  const tierScore = tierMeta[record.tier]?.score || 12;
  const blockerPenalty = record.bottleneck ? -8 : 5;
  const lostPenalty = record.stage === "已流失" ? -32 : 0;
  return clamp(35 + tierScore + stageScore + blockerPenalty + lostPenalty, 18, 99);
}

function renderTopTalents() {
  const topTalents = filteredRecords()
    .map((record) => ({ ...record, score: talentScore(record) }))
    .sort((a, b) => b.score - a.score);
  const max = topTalents[0]?.score || 1;

  els.topTalentBars.innerHTML = topTalents.length ? topTalents.map((record, index) => {
    const tier = tierMeta[record.tier];
    return `
      <button class="ranking-row" type="button" data-record-detail="${record.id}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-avatar" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${icon(typeIcon(record.type))}</span>
        <span class="rank-info">
          <strong>${escapeHtml(record.name)}</strong>
          <em>${escapeHtml(record.product)} · ${escapeHtml(record.type)}</em>
        </span>
        <span class="rank-meter">
          <i style="--rank-width:${(record.score / max) * 100}%; --rank-color:${tier.color}"></i>
        </span>
        <b>${record.score}</b>
      </button>
    `;
  }).join("") : `<div class="empty-state">暂无匹配达人</div>`;
}

function renderStageOverview() {
  const data = filteredRecords();
  const segments = displayStageRows(data);
  const total = Math.max(data.length, 1);
  const gradient = conicGradient(segments, total);

  els.stageOverview.innerHTML = `
    <div class="status-donut" style="--status-donut: conic-gradient(${gradient})">
      <div>
        <strong>${data.length}</strong>
        <span>Pipeline Total</span>
      </div>
    </div>
    <div class="status-list">
      ${segments.map((item) => `
        <div class="status-row">
          <span>${icon(item.icon)}<i style="--status-color:${item.color}"></i>${item.label}</span>
          <strong>${item.value}</strong>
          <em>${data.length ? percent(item.value / data.length) : "0.0%"}</em>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStageTrend() {
  const data = filteredRecords();
  const rows = displayStageRows(data);
  const max = Math.max(...rows.map((row) => row.value), 1);

  els.stageTrendChart.innerHTML = `
    <div class="trend-bars">
      ${rows.map((stage) => {
        const count = stage.value;
        return `
          <div class="trend-item" title="${stage.label} ${count} 人">
            <div class="trend-column">
              <span style="--bar-height:${count ? Math.max((count / max) * 100, 10) : 3}%; --bar-color:${stage.color}"></span>
            </div>
            <strong>${count}</strong>
            <em>${stage.label}</em>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderFormatContribution() {
  const data = filteredRecords();
  const counts = countBy(data, "format");
  const max = Math.max(...FORMATS.map((format) => counts[format] || 0), 1);

  els.formatContribution.innerHTML = FORMATS.map((format, index) => {
    const count = counts[format] || 0;
    return `
      <div class="contribution-row">
        <span>${icon(formatIcon(format))}${escapeHtml(format)}</span>
        <div class="contribution-track">
          <i style="--bar-width:${count ? Math.max((count / max) * 100, 8) : 0}%; --bar-color:${chartPalette[index]}"></i>
        </div>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");
}

function renderDashboardTable() {
  const data = filteredRecords();
  const rows = data;
  els.dashboardTableCount.textContent = `Showing ${rows.length} of ${data.length}`;
  els.dashboardTableBody.innerHTML = rows.length ? rows.map(renderDashboardRow).join("") : `<tr><td colspan="8"><div class="empty-state">暂无匹配记录</div></td></tr>`;
}

function renderDashboardRow(record) {
  const stage = displayStageForRecord(record);
  const tier = tierMeta[record.tier];
  return `
    <tr>
      <td>${recordNameCell(record)}</td>
      <td><span class="tier-pill" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${record.tier}级</span></td>
      <td>${escapeHtml(record.type)}</td>
      <td>${escapeHtml(record.product)}</td>
      <td><span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span></td>
      <td>${escapeHtml(record.person)}</td>
      <td>${record.bottleneck ? `<span class="risk-pill">${icon("alert")}有卡点</span>` : `<span class="muted">无</span>`}</td>
      <td><button class="small-button" type="button" data-record-detail="${record.id}">${icon("edit")}详情</button></td>
    </tr>
  `;
}

function recordNameCell(record) {
  const tier = tierMeta[record.tier];
  return `
    <div class="record-name">
      <span class="record-name-icon" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${icon(typeIcon(record.type))}</span>
      <div>
        <strong>${escapeHtml(record.name)}</strong>
        <span>${escapeHtml(record.group)} · ${escapeHtml(record.format)}</span>
      </div>
    </div>
  `;
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
  els.kanbanColumns.innerHTML = PIPELINE_STAGES.map((stage) => {
    const stageRecords = pipelineStageRecords(data, stage);
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
  const stage = displayStageForRecord(record);
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
        <span class="muted">${escapeHtml(record.group)} · ${escapeHtml(record.person)}</span>
        <span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span>
      </div>
    </button>
  `;
}

function renderBottlenecks() {
  const items = filteredRecords().filter((record) => record.bottleneck);
  els.bottleneckList.innerHTML = items.length ? items.map((record) => {
    const stage = displayStageForRecord(record);
    return `
      <button class="bottleneck-item" type="button" data-record-detail="${record.id}">
        <div class="bottleneck-top">
          <div class="bottleneck-title">${icon("alert")}<strong>${escapeHtml(record.name)}</strong></div>
          <span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span>
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
    const signed = owned.filter((record) => ["已合作", "深度合作"].includes(displayStageLabelForRecord(record))).length;
    const blocked = owned.filter((record) => record.bottleneck).length;
    return `
      <div class="owner-item">
        <div class="owner-top">
          <div class="owner-name">${icon("user-check")}<strong>${person}</strong></div>
          <span class="tag">${owned.length} 人</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="--progress:${(owned.length / max) * 100}%; --progress-color:#2563eb"></div>
        </div>
        <span class="muted">已合作 ${signed} · 卡点 ${blocked}</span>
      </div>
    `;
  }).join("");
}

function renderInsightSummary() {
  const data = filteredRecords();
  const stats = statsFor(data);
  const cards = [
    { title: "合作转化", desc: `${percent(stats.conversion)} 已合作/深度合作`, icon: "chart", color: "#2563eb", soft: "#eaf2ff" },
    { title: "样品推进", desc: `${data.filter((r) => displayStageLabelForRecord(r) === "已寄样").length} 位达人已寄样`, icon: "truck", color: "#22c55e", soft: "#eaf8f1" },
    { title: "排期推进", desc: `${data.filter((r) => displayStageLabelForRecord(r) === "待排期").length} 位达人待排期`, icon: "play", color: "#ec4899", soft: "#fdf2f8" },
    { title: "卡点处理", desc: `${stats.bottlenecks} 项阻塞待跟进`, icon: "alert", color: "#ef4444", soft: "#feecec" },
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
  const rows = displayStageRows(data);
  const max = Math.max(...rows.map((row) => row.value), 1);
  els.funnelChart.innerHTML = rows.map((stage) => {
    const count = stage.value;
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
  els.typeChart.innerHTML = TYPES.map((type, index) => {
    const count = data.filter((record) => record.type === type).length;
    const width = count ? Math.max((count / max) * 100, 10) : 0;
    return `
      <div class="bar-row">
        <span class="chart-label">${type}</span>
        <div class="chart-bar">
          <div class="chart-fill" style="--bar-width:${width}%; --bar-color:${chartPalette[index]}">${count}</div>
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
          <span>${group}</span>
          <span class="muted">${groupRecords.length} 人</span>
        </div>
        <div class="stack-bar">
          ${PIPELINE_STAGES.map((stage) => {
            const count = groupRecords.filter((record) => displayStageLabelForRecord(record) === stage.label).length;
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
    const signed = data.filter((record) => record.format === format && ["已合作", "深度合作"].includes(displayStageLabelForRecord(record))).length;
    return `
      <div class="format-card">
        <div class="format-card-head">${icon(formatIcon(format))}<span>${format}</span></div>
        <strong>${count}</strong>
        <span class="muted">已合作 ${signed}</span>
      </div>
    `;
  }).join("");
}

function renderDirectory() {
  const data = filteredRecords();
  els.tableCount.textContent = `${data.length} 条记录`;
  els.recordTableBody.innerHTML = data.length ? data.map(renderDirectoryRow).join("") : `<tr><td colspan="10"><div class="empty-state">暂无匹配记录</div></td></tr>`;
}

function renderDirectoryRow(record) {
  const stage = displayStageForRecord(record);
  const tier = tierMeta[record.tier];
  return `
    <tr>
      <td>${recordNameCell(record)}</td>
      <td><span class="tier-pill" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${record.tier}级</span></td>
      <td>${escapeHtml(record.type)}</td>
      <td>${escapeHtml(record.product)}</td>
      <td>${escapeHtml(record.group)}</td>
      <td>${escapeHtml(record.format)}</td>
      <td><span class="stage-pill" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span></td>
      <td>${escapeHtml(record.person)}</td>
      <td>${record.bottleneck ? `<span class="risk-pill">${icon("alert")}有卡点</span>` : `<span class="muted">无</span>`}</td>
      <td><button class="small-button" type="button" data-record-detail="${record.id}">${icon("edit")}详情</button></td>
    </tr>
  `;
}

function renderAll() {
  renderKpis();
  renderManagementDashboard();
  renderPersonalDashboard();
  renderLegend();
  renderKanban();
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
  renderAll();
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
  const stage = displayStageForRecord(record);
  const tier = tierMeta[record.tier];
  const currentIndex = displayStageIndexForRecord(record);
  const nextStage = PIPELINE_STAGES[currentIndex + 1]?.label;
  const previousStage = PIPELINE_STAGES[currentIndex - 1]?.label;

  openDrawer({
    kicker: "达人详情",
    title: record.name,
    body: `
      <div class="detail-stack">
        <div class="detail-profile" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">
          <span>${icon(typeIcon(record.type))}</span>
          <div>
            <strong>${escapeHtml(record.name)}</strong>
            <em>${record.tier}级 · ${escapeHtml(record.type)} · ${escapeHtml(record.product)}</em>
          </div>
        </div>
        <div class="detail-block">
          <h4>基础信息</h4>
          <div class="detail-line"><span>等级</span><strong style="color:${tier.color}">${record.tier}级</strong></div>
          <div class="detail-line"><span>类型</span><strong>${escapeHtml(record.type)}</strong></div>
          <div class="detail-line"><span>产品</span><strong>${escapeHtml(record.product)}</strong></div>
          <div class="detail-line"><span>组别</span><strong>${escapeHtml(record.group)}</strong></div>
          <div class="detail-line"><span>玩法</span><strong>${escapeHtml(record.format)}</strong></div>
          <div class="detail-line"><span>负责商务</span><strong>${escapeHtml(record.person)}</strong></div>
          <div class="detail-line"><span>状态</span><strong style="color:${stage.color}">${stage.label}</strong></div>
        </div>
        <div class="detail-block">
          <h4>卡点 / 备注</h4>
          <p>${record.bottleneck ? escapeHtml(record.bottleneck) : "暂无卡点。"}</p>
        </div>
        <div class="drawer-actions">
          ${previousStage ? `<button class="small-button" type="button" data-move-record="${record.id}" data-target-stage="${escapeHtml(previousStage)}">退回到${escapeHtml(previousStage)}</button>` : ""}
          ${nextStage ? `<button class="primary-button" type="button" data-move-record="${record.id}" data-target-stage="${escapeHtml(nextStage)}">${icon("arrow-right")}推进到${escapeHtml(nextStage)}</button>` : ""}
          <button class="small-button" type="button" data-edit-record="${record.id}">${icon("edit")}编辑</button>
        </div>
      </div>
    `,
  });
}

function openEditDrawer(recordId) {
  const record = recordId
    ? state.records.find((item) => item.id === Number(recordId))
    : { id: "", name: "", tier: "A", type: "美垂", product: "定妆喷雾", group: BUSINESS_PEOPLE[0].group, format: "专场", stage: "公海达人", person: BUSINESS_PEOPLE[0].name, bottleneck: "" };
  if (!record) return;
  const selectedStage = displayStageLabelForRecord(record);

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
        ${selectField("stage", "当前状态", PIPELINE_STAGES.map((stageItem) => stageItem.label), selectedStage)}
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

function openSalesMetricsDrawer() {
  const metrics = getSalesMetrics();
  const mom = metrics.previousMonthSales ? (metrics.currentMonthSales - metrics.previousMonthSales) / metrics.previousMonthSales : 0;
  const progress = metrics.annualTarget ? metrics.annualCompletedSales / metrics.annualTarget : 0;

  openDrawer({
    kicker: "销售指标",
    title: "月度销售额维护",
    body: `
      <div class="detail-stack">
        <div class="detail-block metric-editor-summary">
          <h4>当前指标预览</h4>
          <div class="metric-preview-grid">
            <span>
              <em>${formatMetricMonth(metrics.month)}</em>
              <strong>${compactCurrency(metrics.currentMonthSales)}</strong>
            </span>
            <span>
              <em>环比上月</em>
              <strong class="${mom < 0 ? "negative" : ""}">${signedPercent(mom * 100)}</strong>
            </span>
            <span>
              <em>年度进度</em>
              <strong>${percent(progress)}</strong>
            </span>
          </div>
        </div>
        <form class="form-grid two-col metric-form" id="salesMetricsForm">
          <label class="form-field">
            <span>月份</span>
            <input name="month" type="month" value="${escapeHtml(metrics.month)}" required />
          </label>
          <label class="form-field">
            <span>当月销售额（元）</span>
            <input name="currentMonthSales" type="number" min="0" step="1" value="${metrics.currentMonthSales}" required />
          </label>
          <label class="form-field">
            <span>上月销售额（元）</span>
            <input name="previousMonthSales" type="number" min="0" step="1" value="${metrics.previousMonthSales}" required />
          </label>
          <label class="form-field">
            <span>全年已完成销售额（元）</span>
            <input name="annualCompletedSales" type="number" min="0" step="1" value="${metrics.annualCompletedSales}" required />
          </label>
          <label class="form-field full">
            <span>全年销售额目标（元）</span>
            <input name="annualTarget" type="number" min="1" step="1" value="${metrics.annualTarget}" required />
          </label>
          <div class="drawer-actions full">
            <button class="small-button" type="button" data-reset-sales-metrics>恢复系统测算</button>
            <button class="primary-button" type="submit">${icon("edit")}保存指标</button>
          </div>
        </form>
      </div>
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
  const person = String(data.get("person"));
  const selectedStage = String(data.get("stage"));
  let nextFormat = String(data.get("format"));
  if (selectedStage === "深度合作" && nextFormat !== "专场") nextFormat = "专场";
  const nextRecord = {
    id: id || state.nextId++,
    name: String(data.get("name") || "未命名").trim(),
    tier: String(data.get("tier")),
    type: String(data.get("type")),
    product: String(data.get("product")),
    group: BUSINESS_GROUP_BY_PERSON[person] || String(data.get("group")),
    format: nextFormat,
    stage: sourceStageForDisplay(selectedStage),
    person,
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

function saveSalesMetrics(form) {
  const data = new FormData(form);
  const defaults = defaultSalesMetrics();
  const nextMetrics = normalizeSalesMetrics({
    month: data.get("month"),
    currentMonthSales: data.get("currentMonthSales"),
    previousMonthSales: data.get("previousMonthSales"),
    annualTarget: data.get("annualTarget"),
    annualCompletedSales: data.get("annualCompletedSales"),
  }, defaults);

  state.salesMetrics = nextMetrics;
  try {
    localStorage.setItem(SALES_METRICS_STORAGE_KEY, JSON.stringify(nextMetrics));
  } catch {
    // localStorage can be unavailable in restrictive browser modes; keep in-memory edits.
  }

  updateTimestamp();
  renderAll();
  closeDrawer();
  showToast("销售指标已更新");
}

function resetSalesMetrics() {
  state.salesMetrics = defaultSalesMetrics();
  try {
    localStorage.removeItem(SALES_METRICS_STORAGE_KEY);
  } catch {
    // Ignore storage failures and keep the reset value in memory.
  }
  updateTimestamp();
  renderAll();
  openSalesMetricsDrawer();
  showToast("已恢复系统测算");
}

function moveRecord(recordId, targetStage) {
  const record = state.records.find((item) => item.id === Number(recordId));
  if (!record) return;
  const sourceStage = sourceStageForDisplay(targetStage);
  record.stage = sourceStage;
  if (targetStage === "深度合作" && record.format !== "专场") record.format = "专场";
  if (sourceStage !== "已流失") record.bottleneck = "";
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
    displayStageLabelForRecord(record),
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

    const personFilter = event.target.closest("[data-person-filter]");
    if (personFilter) {
      state.filters.person = personFilter.dataset.personFilter;
      els.filterPerson.value = state.filters.person;
      setView("personal");
      showToast(`已切换到 ${state.filters.person} 的个人看板`);
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
      return;
    }

    const resetSalesButton = event.target.closest("[data-reset-sales-metrics]");
    if (resetSalesButton) {
      resetSalesMetrics();
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
  els.addRecordBtn.addEventListener("click", openSalesMetricsDrawer);
  els.drawerCloseBtn.addEventListener("click", closeDrawer);
  els.drawerBackdrop.addEventListener("click", closeDrawer);

  els.drawerBody.addEventListener("submit", (event) => {
    if (event.target.id === "recordForm") {
      event.preventDefault();
      saveRecord(event.target);
    } else if (event.target.id === "salesMetricsForm") {
      event.preventDefault();
      saveSalesMetrics(event.target);
    }
  });

  els.drawerBody.addEventListener("change", (event) => {
    if (event.target.name === "person") {
      const groupSelect = event.target.form?.elements.group;
      if (groupSelect && BUSINESS_GROUP_BY_PERSON[event.target.value]) {
        groupSelect.value = BUSINESS_GROUP_BY_PERSON[event.target.value];
      }
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
  setView(state.view);
}

init();
