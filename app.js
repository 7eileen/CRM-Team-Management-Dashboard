const PIPELINE_STAGES = [
  { id: "waiting-connect", label: "待建联", sourceStages: ["待触达", "已触达", "已流失", "公海达人"], color: "#7b8794", soft: "#f5f8fb", icon: "user-check" },
  { id: "connecting", label: "建联中", sourceStages: ["沟通中"], color: "#ff7a3d", soft: "#fff4ed", icon: "handshake" },
  { id: "sampled", label: "已寄样", sourceStages: ["已寄样"], color: "#ff9a63", soft: "#fff8f4", icon: "truck" },
  { id: "scheduling", label: "待排期", sourceStages: ["试播中", "洽谈排期"], color: "#ffc75a", soft: "#fff9ed", icon: "calendar" },
  { id: "partnered", label: "已合作", color: "#7ca6e8", soft: "#f0f6ff", icon: "star", predicate: (record) => record.stage === "已签约" && !isDeepPartner(record) },
  { id: "deep-partnered", label: "深度合作", color: "#5f91d0", soft: "#edf5ff", icon: "star", predicate: isDeepPartner },
];
const DISPLAY_STAGE_SOURCE_FALLBACK = {
  待触达: "待建联",
  已触达: "待建联",
  沟通中: "建联中",
  已寄样: "已寄样",
  试播中: "待排期",
  洽谈排期: "待排期",
  已签约: "已合作",
  已流失: "待建联",
  公海达人: "待建联",
  待建联: "待建联",
  建联中: "建联中",
  待排期: "待排期",
  已合作: "已合作",
  深度合作: "深度合作",
};
const DISPLAY_STAGE_TO_SOURCE = {
  待建联: "已触达",
  建联中: "沟通中",
  已寄样: "已寄样",
  待排期: "洽谈排期",
  已合作: "已签约",
  深度合作: "已签约",
};

const PRODUCTS = ["定型", "定妆", "粉底", "防晒喷雾", "气垫", "遮瑕", "防晒素颜霜", "防晒定妆喷雾", "双头修容", "四色修容盘", "防晒水", "其他"];
const FORMATS = ["专场", "混播", "短视频挂车", "切片号", "单品直播间", "美垂日播"];
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

const SALES_TEAM_META = [
  { label: "A组", color: "#ff7a3d", soft: "#fff4ed" },
  { label: "B组", color: "#ffc75a", soft: "#fff9ed" },
  { label: "C组", color: "#7ca6e8", soft: "#f0f6ff" },
];

const chartPalette = ["#ff7a3d", "#ff9a63", "#ffb987", "#ffc75a", "#7ca6e8", "#a4c5ee", "#89a5c3", "#b7c9dd"];
const SALES_METRICS_STORAGE_KEY = "crm-sales-metrics-v1";
const TIME_RANGE_OPTIONS = [
  { id: "7d", label: "近7天", desc: "最近一周成交节奏", factor: 0.28, previousFactor: 0.26, targetFactor: 0.23, specialFactor: 0.34 },
  { id: "30d", label: "近30天", desc: "默认滚动月口径", factor: 1, previousFactor: 1, targetFactor: 1, specialFactor: 1 },
  { id: "90d", label: "近90天", desc: "滚动季度观察", factor: 2.9, previousFactor: 2.72, targetFactor: 3, specialFactor: 2.7 },
  { id: "month", label: "本月", desc: "自然月累计", factor: 1.08, previousFactor: 1, targetFactor: 1, specialFactor: 1 },
  { id: "quarter", label: "本季度", desc: "当前季度累计", factor: 3.05, previousFactor: 2.86, targetFactor: 3, specialFactor: 2.9 },
  { id: "year", label: "全年", desc: "年度累计视角", factor: 6.4, previousFactor: 5.9, targetFactor: 12, specialFactor: 6 },
];
const MANAGEMENT_TREND_RANGES = [
  { id: "today", label: "今日", factor: 0.038, labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"] },
  { id: "yesterday", label: "昨日", factor: 0.036, labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"] },
  { id: "7d", label: "近7天", factor: 0.27, pointCount: 7 },
  { id: "30d", label: "近30天", factor: 1, pointCount: 10 },
];

const tierMeta = {
  S: { color: "#ff7a3d", soft: "#fff4ed", score: 35 },
  A: { color: "#ffc75a", soft: "#fff9ed", score: 28 },
  B: { color: "#7ca6e8", soft: "#f0f6ff", score: 20 },
  C: { color: "#9eb5ce", soft: "#f4f8fc", score: 14 },
};

const tierChartMeta = {
  S: { color: "#ff7a3d" },
  A: { color: "#ffc75a" },
  B: { color: "#7ca6e8" },
  C: { color: "#c7d6e6" },
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
  短视频挂车: "play",
  切片号: "play",
  单品直播间: "package",
  美垂日播: "star",
};
const orderStatusMeta = [
  { label: "已支付", color: "#ff7a3d", soft: "#fff4ed" },
  { label: "待发货", color: "#ffc75a", soft: "#fff9ed" },
  { label: "已发货", color: "#89a5c3", soft: "#f4f8fc" },
  { label: "已完成", color: "#7ca6e8", soft: "#f0f6ff" },
];
const orderChannels = ["专场成交", "混播成交", "短视频挂车", "切片号成交", "单品直播间", "美垂日播"];

const productSalesBase = {
  定型: 82000,
  定妆: 78000,
  粉底: 88000,
  防晒喷雾: 68000,
  气垫: 96000,
  遮瑕: 64000,
  防晒素颜霜: 76000,
  防晒定妆喷雾: 92000,
  双头修容: 70000,
  四色修容盘: 84000,
  防晒水: 66000,
  其他: 52000,
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
  短视频挂车: 0.78,
  切片号: 0.62,
  单品直播间: 1.12,
  美垂日播: 1.18,
};

const initialRecords = [
  { id: 1, name: "小美酱", tier: "S", type: "美垂", product: "定型", group: "A3组", format: "专场", stage: "已签约", person: "戴娜", bottleneck: "" },
  { id: 2, name: "乡村阿花", tier: "A", type: "三农", product: "防晒素颜霜", group: "A3组", format: "短视频挂车", stage: "试播中", person: "周鸿美", bottleneck: "排期冲突，等达人档期" },
  { id: 3, name: "生活达人Lily", tier: "A", type: "生活分享", product: "气垫", group: "B1组", format: "混播", stage: "沟通中", person: "窦婉婷", bottleneck: "达人对佣金比例有异议" },
  { id: 4, name: "潮流小K", tier: "B", type: "时尚穿搭", product: "定妆", group: "B1组", format: "单品直播间", stage: "已寄样", person: "池维杞", bottleneck: "" },
  { id: 5, name: "美食控阿强", tier: "C", type: "美食", product: "防晒喷雾", group: "B1组", format: "切片号", stage: "待触达", person: "姚慧英", bottleneck: "" },
  { id: 6, name: "辣妈CC", tier: "S", type: "母婴", product: "粉底", group: "达播合作", format: "专场", stage: "洽谈排期", person: "刘则宇黄娇", bottleneck: "报价超出预算30%" },
  { id: 7, name: "化妆师老罗", tier: "A", type: "美垂", product: "定型", group: "专场B组", format: "混播", stage: "已触达", person: "马雯", bottleneck: "" },
  { id: 8, name: "田野阿宝", tier: "B", type: "三农", product: "遮瑕", group: "专场B组", format: "短视频挂车", stage: "沟通中", person: "郑若楠", bottleneck: "" },
  { id: 9, name: "Vicky爱分享", tier: "A", type: "生活分享", product: "防晒定妆喷雾", group: "专场B组", format: "专场", stage: "已寄样", person: "谭燕琳", bottleneck: "样品物流延迟" },
  { id: 10, name: "段子手大刘", tier: "B", type: "剧情搞笑", product: "双头修容", group: "专场B组", format: "切片号", stage: "待触达", person: "郭洁玲", bottleneck: "" },
  { id: 11, name: "美妆课代表", tier: "S", type: "美垂", product: "四色修容盘", group: "B2组", format: "单品直播间", stage: "已签约", person: "徐怀玉", bottleneck: "" },
  { id: 12, name: "小城日记", tier: "C", type: "生活分享", product: "定妆", group: "B2组", format: "切片号", stage: "已触达", person: "王娅兰", bottleneck: "" },
  { id: 13, name: "穿搭达人Nina", tier: "A", type: "时尚穿搭", product: "气垫", group: "B2组", format: "混播", stage: "试播中", person: "俞梦薇", bottleneck: "试播数据不达标，需二次评估" },
  { id: 14, name: "农家胖哥", tier: "B", type: "三农", product: "防晒水", group: "B2组", format: "单品直播间", stage: "洽谈排期", person: "邓斯婕", bottleneck: "" },
  { id: 15, name: "小白的美妆日记", tier: "B", type: "美垂", product: "防晒定妆喷雾", group: "数据中台组", format: "美垂日播", stage: "沟通中", person: "黄建新", bottleneck: "" },
  { id: 16, name: "厨神阿欢", tier: "C", type: "美食", product: "其他", group: "数据中台组", format: "切片号", stage: "已流失", person: "叶倩文", bottleneck: "达人明确拒绝合作" },
  { id: 17, name: "国际庄小马", tier: "B", type: "剧情搞笑", product: "粉底", group: "A1组", format: "短视频挂车", stage: "待触达", person: "黄欣瑜", bottleneck: "" },
  { id: 18, name: "辣妹CC酱", tier: "A", type: "美垂", product: "防晒喷雾", group: "A1组", format: "美垂日播", stage: "已寄样", person: "张如茜", bottleneck: "" },
  { id: 19, name: "宝妈的精致生活", tier: "C", type: "母婴", product: "气垫", group: "A1组", format: "专场", stage: "沟通中", person: "郎嘉欣", bottleneck: "需等618大促结束后再谈" },
  { id: 20, name: "三叔的院子", tier: "A", type: "三农", product: "防晒素颜霜", group: "A1组", format: "短视频挂车", stage: "已签约", person: "欧阳婉怡", bottleneck: "" },
];

const state = {
  view: "dashboard",
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
  managementTeamView: "team",
  managementTeamProduct: "全部",
  managementTeam: "",
  managementTrendProduct: "全部",
  managementTrendRange: "30d",
  managementTalentMetric: "sales",
  personalPerson: PERSONS[0],
  personalScheduleDate: "",
  rankSort: {
    managementPerson: "desc",
    managementTalent: "desc",
    personalOrders: "desc",
  },
  quarterPopoverOpen: false,
  timeRange: "30d",
  timeRangePopoverOpen: false,
  calendarMonth: "",
  customDateStart: "",
  customDateEnd: "",
  nextId: 21,
};

const els = {
  lastUpdate: document.getElementById("lastUpdate"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  exportBtn: document.getElementById("exportBtn"),
  addRecordBtn: document.getElementById("addRecordBtn"),
  quarterControlBtn: document.getElementById("quarterControlBtn"),
  quarterControlLabel: document.getElementById("quarterControlLabel"),
  quarterPopover: document.getElementById("quarterPopover"),
  timeRangeControlBtn: document.getElementById("timeRangeControlBtn"),
  timeRangeControlLabel: document.getElementById("timeRangeControlLabel"),
  timeRangePopover: document.getElementById("timeRangePopover"),
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
  managementTeamDetail: document.getElementById("managementTeamDetail"),
  managementTeamPeriod: document.getElementById("managementTeamPeriod"),
  managementTrendProduct: document.getElementById("managementTrendProduct"),
  managementTrendRange: document.getElementById("managementTrendRange"),
  managementTrendSummary: document.getElementById("managementTrendSummary"),
  managementTrendChart: document.getElementById("managementTrendChart"),
  managementPersonRank: document.getElementById("managementPersonRank"),
  managementTierSales: document.getElementById("managementTierSales"),
  managementStageSales: document.getElementById("managementStageSales"),
  managementTalentRank: document.getElementById("managementTalentRank"),
  managementTalentRankTabs: document.getElementById("managementTalentRankTabs"),
  personalProductSales: document.getElementById("personalProductSales"),
  personalTierSales: document.getElementById("personalTierSales"),
  personalStageSales: document.getElementById("personalStageSales"),
  personalTalentRank: document.getElementById("personalTalentRank"),
  personalGroupRank: document.getElementById("personalGroupRank"),
  personalGroupRankBadge: document.getElementById("personalGroupRankBadge"),
  personalKanbanColumns: document.getElementById("personalKanbanColumns"),
  personalPipelineBadge: document.getElementById("personalPipelineBadge"),
  personalSchedule: document.getElementById("personalSchedule"),
  personalScheduleBadge: document.getElementById("personalScheduleBadge"),
  dashboardTableCount: document.getElementById("dashboardTableCount"),
  tierLegend: document.getElementById("tierLegend"),
  kanbanColumns: document.getElementById("kanbanColumns"),
  ownerList: document.getElementById("ownerList"),
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

function rankSortDirection(key) {
  return state.rankSort[key] === "asc" ? "asc" : "desc";
}

function sortedRankRows(rows, key, valueGetter) {
  const direction = rankSortDirection(key);
  return rows.slice().sort((a, b) => {
    const diff = valueGetter(a) - valueGetter(b);
    return direction === "asc" ? diff : -diff;
  });
}

function renderSortToggles() {
  document.querySelectorAll("[data-rank-sort]").forEach((button) => {
    const direction = rankSortDirection(button.dataset.rankSort);
    const isAsc = direction === "asc";
    const label = button.dataset.sortLabel || "排行榜";
    button.classList.toggle("asc", isAsc);
    button.classList.toggle("desc", !isAsc);
    button.setAttribute("aria-label", `${label} ${isAsc ? "正序" : "倒序"}排列`);
    button.title = isAsc ? "正序排列" : "倒序排列";
  });
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
  const amount = Number(value);
  return `¥${Math.round(Number.isFinite(amount) ? amount : 0).toLocaleString("zh-CN")}`;
}

function compactCurrency(value) {
  const amount = Number(value);
  if (Number.isFinite(amount) && Math.abs(amount) >= 10000) return `¥${(amount / 10000).toFixed(1)}万`;
  return currency(amount);
}

function recordGmv(record) {
  const explicitGmv = Number(record.gmv);
  if (Number.isFinite(explicitGmv) && explicitGmv > 0) return Math.round(explicitGmv);
  const id = Number(record.id) || 1;
  return 23000 + (Math.max(id, 1) - 1) * 1200;
}

function signedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function isoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseIsoDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

function toIsoDate(date) {
  return isoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function shiftCalendarMonth(monthKey, offset) {
  const match = String(monthKey || "").match(/^(\d{4})-(\d{2})$/);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1 + offset, 1)
    : new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function presetDateRange(option, metrics = getSalesMetrics()) {
  const match = String(metrics.month || "").match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const monthIndex = match ? Number(match[2]) - 1 : new Date().getMonth();
  const end = new Date(year, monthIndex + 1, 0);
  let start = new Date(end);

  if (option.id === "month") start = new Date(year, monthIndex, 1);
  else if (option.id === "quarter") start = new Date(year, Math.floor(monthIndex / 3) * 3, 1);
  else if (option.id === "year") start = new Date(year, 0, 1);
  else {
    const days = { "7d": 7, "30d": 30, "90d": 90 }[option.id] || 30;
    start.setDate(end.getDate() - days + 1);
  }

  return { start: toIsoDate(start), end: toIsoDate(end) };
}

function customTimeRange() {
  const start = parseIsoDate(state.customDateStart);
  const end = parseIsoDate(state.customDateEnd);
  if (!start || !end) return null;
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
  const factor = days / 30;
  const label = `${String(start.getMonth() + 1).padStart(2, "0")}/${String(start.getDate()).padStart(2, "0")}-${String(end.getMonth() + 1).padStart(2, "0")}/${String(end.getDate()).padStart(2, "0")}`;
  return {
    id: "custom",
    label,
    desc: `自定义 ${days} 天`,
    factor,
    previousFactor: factor,
    targetFactor: factor,
    specialFactor: Math.max(0.1, factor),
  };
}

function selectedTimeRange() {
  if (state.timeRange === "custom") return customTimeRange() || TIME_RANGE_OPTIONS[1];
  return TIME_RANGE_OPTIONS.find((option) => option.id === state.timeRange) || TIME_RANGE_OPTIONS[1];
}

function scaleMoney(value, factor = 1) {
  return Math.round((value * factor) / 100) * 100;
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

function enrichRecord(record, options = {}) {
  const range = options.ignoreTimeRange ? TIME_RANGE_OPTIONS[1] : selectedTimeRange();
  const sales = scaleMoney(recordSales(record), range.factor);
  const lastMonthSales = scaleMoney(recordLastMonthSales(record), range.previousFactor);
  const specialCount = Math.max(0, Math.round(recordSpecialCount(record) * range.specialFactor));
  const lastMonthSpecialCount = Math.max(0, Math.round(recordLastMonthSpecialCount(record) * range.specialFactor));
  return {
    ...record,
    sales,
    lastMonthSales,
    specialCount,
    lastMonthSpecialCount,
  };
}

function enrichedRecords(data = filteredRecords(), options = {}) {
  return data.map((record) => enrichRecord(record, options));
}

function sumBy(data, selector) {
  return data.reduce((sum, item) => sum + selector(item), 0);
}

function defaultTeamSalesMetrics(data, annualTarget, annualCompletedSales) {
  const totalCurrent = sumBy(data, (record) => record.sales);
  const safeAnnualTarget = Math.max(0, moneyInputValue(annualTarget, 6800000));
  const safeAnnualCompleted = moneyInputValue(annualCompletedSales, Math.round((totalCurrent * 6.4) / 100) * 100);
  return SALES_TEAM_META.reduce((acc, team) => {
    const records = data.filter((record) => teamLabelForGroup(record.group) === team.label);
    const currentMonthSales = sumBy(records, (record) => record.sales);
    const previousMonthSales = sumBy(records, (record) => record.lastMonthSales);
    const share = totalCurrent ? currentMonthSales / totalCurrent : 1 / SALES_TEAM_META.length;
    acc[team.label] = {
      currentMonthSales,
      previousMonthSales,
      annualCompletedSales: Math.round((safeAnnualCompleted * share) / 100) * 100,
      annualTarget: Math.round((safeAnnualTarget * share) / 100) * 100,
    };
    return acc;
  }, {});
}

function normalizeTeamSalesMetrics(metrics = {}, defaults = {}) {
  const source = metrics && typeof metrics === "object" ? metrics : {};
  return SALES_TEAM_META.reduce((acc, team) => {
    const saved = source[team.label] || {};
    const fallback = defaults[team.label] || {};
    acc[team.label] = {
      currentMonthSales: moneyInputValue(saved.currentMonthSales, fallback.currentMonthSales || 0),
      previousMonthSales: moneyInputValue(saved.previousMonthSales, fallback.previousMonthSales || 0),
      annualCompletedSales: moneyInputValue(saved.annualCompletedSales, fallback.annualCompletedSales || 0),
      annualTarget: moneyInputValue(saved.annualTarget, fallback.annualTarget || 0),
    };
    return acc;
  }, {});
}

function defaultSalesMetrics() {
  const data = enrichedRecords(state.records, { ignoreTimeRange: true });
  const currentMonthSales = sumBy(data, (record) => record.sales);
  const previousMonthSales = sumBy(data, (record) => record.lastMonthSales);
  const annualTarget = 6800000;
  const annualCompletedSales = Math.round((currentMonthSales * 6.4) / 100) * 100;
  return {
    month: currentMonthKey(),
    currentMonthSales,
    previousMonthSales,
    annualTarget,
    annualCompletedSales,
    teamSales: defaultTeamSalesMetrics(data, annualTarget, annualCompletedSales),
  };
}

function normalizeSalesMetrics(metrics = {}, defaults = defaultSalesMetrics()) {
  const annualTarget = Math.max(1, moneyInputValue(metrics.annualTarget, defaults.annualTarget));
  const annualCompletedSales = moneyInputValue(metrics.annualCompletedSales, defaults.annualCompletedSales);
  return {
    month: String(metrics.month || defaults.month),
    currentMonthSales: moneyInputValue(metrics.currentMonthSales, defaults.currentMonthSales),
    previousMonthSales: moneyInputValue(metrics.previousMonthSales, defaults.previousMonthSales),
    annualTarget,
    annualCompletedSales,
    teamSales: normalizeTeamSalesMetrics(metrics.teamSales, defaults.teamSales),
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

function timeRangeTarget(option, metrics = getSalesMetrics()) {
  return scaleMoney(metrics.annualTarget / 12, option.targetFactor);
}

function timeRangeSales(option, metrics = getSalesMetrics()) {
  if (option.id === "year") return metrics.annualCompletedSales;
  return scaleMoney(metrics.currentMonthSales, option.factor);
}

function timeRangePreviousSales(option, metrics = getSalesMetrics()) {
  if (option.id === "year") return scaleMoney(metrics.annualCompletedSales, 0.86);
  return scaleMoney(metrics.previousMonthSales, option.previousFactor);
}

function teamSalesMetric(label, metrics = getSalesMetrics()) {
  return metrics.teamSales?.[label] || normalizeTeamSalesMetrics({}, defaultSalesMetrics().teamSales)[label] || {};
}

function timeRangeTeamSales(label, option = selectedTimeRange(), metrics = getSalesMetrics()) {
  const team = teamSalesMetric(label, metrics);
  if (option.id === "year") return team.annualCompletedSales || 0;
  return scaleMoney(team.currentMonthSales || 0, option.factor);
}

function timeRangeTeamPreviousSales(label, option = selectedTimeRange(), metrics = getSalesMetrics()) {
  const team = teamSalesMetric(label, metrics);
  if (option.id === "year") return scaleMoney(team.annualCompletedSales || 0, 0.86);
  return scaleMoney(team.previousMonthSales || 0, option.previousFactor);
}

function timeRangeTeamTarget(label, option = selectedTimeRange(), metrics = getSalesMetrics()) {
  const team = teamSalesMetric(label, metrics);
  return scaleMoney((team.annualTarget || 0) / 12, option.targetFactor);
}

function timeAdjustedSalesMetrics(metrics = getSalesMetrics()) {
  const range = selectedTimeRange();
  return {
    ...metrics,
    range,
    currentRangeSales: timeRangeSales(range, metrics),
    previousRangeSales: timeRangePreviousSales(range, metrics),
    rangeTarget: timeRangeTarget(range, metrics),
  };
}

function renderTimeRangePopover() {
  if (!els.timeRangeControlBtn || !els.timeRangePopover) return;
  const metrics = getSalesMetrics();
  const range = selectedTimeRange();

  if (els.timeRangeControlLabel) {
    els.timeRangeControlLabel.textContent = `时间：${range.label}`;
  }
  els.timeRangeControlBtn.setAttribute("aria-expanded", String(state.timeRangePopoverOpen));
  els.timeRangeControlBtn.classList.toggle("active", state.timeRangePopoverOpen);
  els.timeRangePopover.hidden = !state.timeRangePopoverOpen;
  if (!state.timeRangePopoverOpen) return;

  if (state.timeRange !== "custom") {
    const preset = presetDateRange(range, metrics);
    state.customDateStart = preset.start;
    state.customDateEnd = preset.end;
  }
  if (!state.calendarMonth) state.calendarMonth = String(metrics.month || currentMonthKey());

  const monthMatch = state.calendarMonth.match(/^(\d{4})-(\d{2})$/);
  const year = monthMatch ? Number(monthMatch[1]) : new Date().getFullYear();
  const month = monthMatch ? Number(monthMatch[2]) : new Date().getMonth() + 1;
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const gridStart = new Date(year, month - 1, 1 - firstWeekday);
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const value = toIsoDate(date);
    const isStart = value === state.customDateStart;
    const isEnd = value === state.customDateEnd;
    const inRange = state.customDateStart && state.customDateEnd && value > state.customDateStart && value < state.customDateEnd;
    return {
      value,
      day: date.getDate(),
      outside: date.getMonth() !== month - 1,
      isStart,
      isEnd,
      inRange,
    };
  });
  const rangeCaption = state.customDateEnd
    ? `${state.customDateStart.replaceAll("-", "/")} - ${state.customDateEnd.replaceAll("-", "/")}`
    : `${state.customDateStart.replaceAll("-", "/")} - 请选择结束日期`;

  els.timeRangePopover.innerHTML = `
    <div class="time-range-popover-head">
      <div>
        <span class="panel-kicker">Time Filter</span>
        <h3>选择日期范围</h3>
      </div>
      <span class="calendar-range-caption">${escapeHtml(rangeCaption)}</span>
    </div>

    <div class="calendar-toolbar">
      <div class="calendar-nav">
        <button type="button" data-calendar-shift="-12" aria-label="上一年">«</button>
        <button type="button" data-calendar-shift="-1" aria-label="上个月">‹</button>
      </div>
      <strong>${year} 年 ${month} 月</strong>
      <div class="calendar-nav">
        <button type="button" data-calendar-shift="1" aria-label="下个月">›</button>
        <button type="button" data-calendar-shift="12" aria-label="下一年">»</button>
      </div>
    </div>

    <div class="calendar-weekdays" aria-hidden="true">
      ${["日", "一", "二", "三", "四", "五", "六"].map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="calendar-grid" role="grid" aria-label="${year}年${month}月">
      ${calendarDays.map((day) => `
        <button
          type="button"
          class="calendar-day ${day.outside ? "outside" : ""} ${day.inRange ? "in-range" : ""} ${day.isStart ? "range-start" : ""} ${day.isEnd ? "range-end" : ""}"
          data-calendar-date="${day.value}"
          aria-label="${day.value}"
          aria-pressed="${day.isStart || day.isEnd}"
        >
          <span>${day.day}</span>
        </button>
      `).join("")}
    </div>

    <div class="time-range-shortcuts" aria-label="快捷时间范围">
      ${TIME_RANGE_OPTIONS.map((option) => `
        <button class="${option.id === range.id ? "active" : ""}" type="button" data-time-range="${option.id}">${escapeHtml(option.label)}</button>
      `).join("")}
    </div>
  `;
}

function currentQuarterInfo(metrics = getSalesMetrics()) {
  const match = String(metrics.month || "").match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const month = match ? Number(match[2]) : new Date().getMonth() + 1;
  return { year, quarter: Math.max(1, Math.min(4, Math.ceil(month / 3))) };
}

function quarterSalesRows(metrics = getSalesMetrics()) {
  const { quarter } = currentQuarterInfo(metrics);
  const targetWeights = [0.22, 0.24, 0.27, 0.27];
  const salesWeights = [0.2, 0.25, 0.32, 0.23];
  const annualTarget = metrics.annualTarget;
  const annualSales = metrics.annualCompletedSales;
  return targetWeights.map((targetWeight, index) => {
    const sales = Math.round((annualSales * salesWeights[index]) / 100) * 100;
    const target = Math.round((annualTarget * targetWeight) / 100) * 100;
    const previousSales = index === 0
      ? Math.round((annualSales * 0.19) / 100) * 100
      : Math.round((annualSales * salesWeights[index - 1]) / 100) * 100;
    const mom = previousSales ? (sales - previousSales) / previousSales : 0;
    return {
      label: `Q${index + 1}`,
      range: `${index * 3 + 1}-${index * 3 + 3}月`,
      sales,
      target,
      completion: target ? (sales / target) * 100 : 0,
      mom,
      active: index + 1 === quarter,
      color: chartPalette[index % chartPalette.length],
    };
  });
}

function renderQuarterPopover() {
  if (!els.quarterControlBtn || !els.quarterPopover) return;
  const metrics = getSalesMetrics();
  const { year, quarter } = currentQuarterInfo(metrics);
  const rows = quarterSalesRows(metrics);
  const annualTarget = sumBy(rows, (row) => row.target);
  const annualSales = sumBy(rows, (row) => row.sales);
  const bestQuarter = rows.slice().sort((a, b) => b.sales - a.sales)[0];

  if (els.quarterControlLabel) {
    els.quarterControlLabel.textContent = `${year} Q${quarter}`;
  }
  els.quarterControlBtn.setAttribute("aria-expanded", String(state.quarterPopoverOpen));
  els.quarterControlBtn.classList.toggle("active", state.quarterPopoverOpen);
  els.quarterPopover.hidden = !state.quarterPopoverOpen;
  if (!state.quarterPopoverOpen) return;

  els.quarterPopover.innerHTML = `
    <div class="quarter-popover-head">
      <div>
        <span class="panel-kicker">Quarter Sales</span>
        <h3>${year}年四季度销售情况</h3>
      </div>
      <strong>${compactCurrency(annualSales)}</strong>
    </div>
    <div class="quarter-summary">
      <div><span>全年目标</span><strong>${compactCurrency(annualTarget)}</strong></div>
      <div><span>整体完成率</span><strong>${Math.round(annualTarget ? (annualSales / annualTarget) * 100 : 0)}%</strong></div>
      <div><span>最高季度</span><strong>${bestQuarter.label}</strong></div>
    </div>
    <div class="quarter-card-grid">
      ${rows.map((row) => `
        <article class="quarter-card ${row.active ? "active" : ""}" style="--quarter-color:${row.color}">
          <div class="quarter-card-top">
            <div>
              <span>${row.range}</span>
              <h4>${row.label}</h4>
            </div>
            ${row.active ? `<em>当前</em>` : ""}
          </div>
          <strong>${compactCurrency(row.sales)}</strong>
          <div class="quarter-meta">
            <span>目标 ${compactCurrency(row.target)}</span>
            <span class="${row.mom < 0 ? "down" : ""}">${signedPercent(row.mom * 100)} 环比</span>
          </div>
          <div class="quarter-progress">
            <i style="--quarter-progress:${clamp(row.completion, 0, 100)}%"></i>
          </div>
          <small>完成率 ${Math.round(row.completion)}%</small>
        </article>
      `).join("")}
    </div>
  `;
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
  return state.personalPerson || PERSONS[0];
}

function recordsForPerson(person = selectedPerson()) {
  return enrichedRecords(state.records).filter((record) => record.person === person);
}

function optionHtml(defaultLabel, values) {
  return [
    `<option value="">${defaultLabel}</option>`,
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`),
  ].join("");
}

function renderFilterOptions() {
  els.filterProduct.innerHTML = optionHtml("全部品类", PRODUCTS);
  els.filterGroup.innerHTML = optionHtml("全部组", GROUPS);
  els.filterFormat.innerHTML = optionHtml("全部玩法", FORMATS);
  els.filterType.innerHTML = optionHtml("全部类型", TYPES);
  els.filterTier.innerHTML = optionHtml("全部等级", TIERS);
  els.filterStage.innerHTML = optionHtml("全部状态", PIPELINE_STAGES.map((stage) => stage.label));
  els.filterPerson.innerHTML = optionHtml("全部商务", PERSONS);
}

function filteredRecords(options = {}) {
  const shouldApplyFilters = options.applyFilters ?? state.view === "pipeline";
  return state.records.filter((record) => {
    const filters = shouldApplyFilters
      ? state.filters
      : { product: "", group: "", format: "", type: "", tier: "", stage: "", person: "" };
    const matchesFilters =
      (options.ignoreProduct || !filters.product || record.product === filters.product) &&
      (options.ignoreGroup || !filters.group || record.group === filters.group) &&
      (!filters.format || record.format === filters.format) &&
      (!filters.type || record.type === filters.type) &&
      (!filters.tier || record.tier === filters.tier) &&
      (!filters.stage || displayStageLabelForRecord(record) === filters.stage) &&
      (options.ignorePerson || !filters.person || record.person === filters.person);

    return matchesFilters;
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

function conicGradient(items, total, gapDegrees = 0, gapColor = "#ffffff") {
  if (!total) return "#eef2f6 0deg 360deg";
  const visibleItems = items.filter((item) => item.count > 0);
  const gap = visibleItems.length > 1 ? gapDegrees : 0;
  const drawableDegrees = Math.max(0, 360 - (visibleItems.length * gap));
  let cursor = 0;
  const segments = [];

  visibleItems.forEach((item) => {
    const start = cursor;
    const end = cursor + (item.count / total) * drawableDegrees;
    segments.push(`${item.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`);
    if (gap) {
      segments.push(`${gapColor} ${end.toFixed(2)}deg ${(end + gap).toFixed(2)}deg`);
    }
    cursor = end + gap;
  });

  return segments.join(", ");
}

function sparkline(path = "M2 34 C12 23 17 31 25 20 C33 9 38 25 47 15 C56 5 61 20 70 7") {
  return `<svg class="sparkline" viewBox="0 0 72 42" aria-hidden="true"><path d="${path}"></path></svg>`;
}

function renderKpis() {
  const cards = state.view === "personal" ? personalKpiCards() : managementKpiCards();
  els.kpiGrid.classList.toggle("management-kpis", state.view !== "personal");
  els.kpiGrid.classList.toggle("personal-kpis", state.view === "personal");
  els.kpiGrid.innerHTML = cards.map((card) => {
    const hasTrend = Boolean(card.trend);
    return `
      <article class="kpi-card" style="--metric-color:${card.color}; --metric-soft:${card.soft}">
        <div class="metric-icon">${icon(card.icon)}</div>
        <div class="metric-body">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          <div class="metric-trend ${hasTrend && card.trendValue < 0 ? "down" : ""} ${hasTrend ? "" : "no-label"}">
            ${hasTrend ? `${icon(card.trendValue < 0 ? "arrow-right" : "arrow-up")} ${card.trend}` : ""}
          </div>
        </div>
        ${sparkline(card.path)}
      </article>
    `;
  }).join("");
}

function managementKpiCards() {
  const metrics = timeAdjustedSalesMetrics();
  const monthlySales = metrics.currentRangeSales;
  const lastMonthSales = metrics.previousRangeSales;
  const annualTarget = metrics.annualTarget;
  const monthlyTarget = annualTarget / 12;
  const yearlySales = metrics.annualCompletedSales;
  const progress = yearlySales / annualTarget;
  const mom = lastMonthSales ? (monthlySales - lastMonthSales) / lastMonthSales : 0;
  const monthLabel = formatMetricMonth(metrics.month);
  const rangeLabel = metrics.range.label;
  return [
    { label: "当月销售额", value: compactCurrency(monthlySales), sub: `${monthLabel} · ${rangeLabel}`, trend: signedPercent(mom * 100), trendValue: mom, icon: "chart", color: "#ff7a3d", soft: "#fff4ed", path: "M2 34 C12 22 18 30 27 18 C36 6 43 24 51 15 C59 6 64 18 70 8" },
    { label: "当月目标销售额", value: compactCurrency(monthlyTarget), sub: `${monthLabel}目标`, trend: "月度目标", trendValue: 1, icon: "calendar", color: "#ff9a63", soft: "#fff8f4", path: "M2 31 C12 24 21 27 30 18 C39 9 47 20 55 12 C62 6 67 9 70 5" },
    { label: "全年销售额目标", value: compactCurrency(annualTarget), sub: "可编辑年度目标", trend: "目标锁定", trendValue: 1, icon: "target", color: "#ffc75a", soft: "#fff9ed", path: "M2 28 C13 19 20 24 29 15 C40 5 46 20 55 12 C62 7 66 11 70 5" },
    { label: "进度", value: percent(progress), sub: `${compactCurrency(yearlySales)} 已完成`, trend: "年度进度", trendValue: progress, icon: "pie", color: "#7ca6e8", soft: "#f0f6ff", path: "M2 36 C12 32 18 26 26 22 C35 17 43 15 51 11 C60 7 65 7 70 4" },
    { label: "环比上一周期", value: signedPercent(mom * 100), sub: `${compactCurrency(lastMonthSales)} 对比周期`, trend: mom >= 0 ? "增长" : "下降", trendValue: mom, icon: "arrow-up", color: mom >= 0 ? "#e9b15a" : "#d95656", soft: mom >= 0 ? "#fff7e8" : "#fceeee", path: "M2 22 C12 19 20 26 28 16 C36 7 44 18 52 12 C60 6 65 9 70 4" },
  ];
}

function personalKpiCards() {
  const person = selectedPerson();
  const rangeLabel = selectedTimeRange().label;
  const rows = personSalesRows(enrichedRecords(state.records));
  const row = rows.find((item) => item.person === person) || rows[0];
  const rank = rows.findIndex((item) => item.person === row.person) + 1;
  const previous = rows[rank - 2];
  const nextSpecialLeader = [...rows].sort((a, b) => b.specialCount - a.specialCount).find((item) => item.specialCount > row.specialCount);
  const gap = previous ? previous.sales - row.sales : 0;
  const specialGap = nextSpecialLeader ? nextSpecialLeader.specialCount - row.specialCount : 0;
  const mom = row.lastMonthSales ? (row.sales - row.lastMonthSales) / row.lastMonthSales : 0;
  return [
    { label: `${rangeLabel}销售额`, value: compactCurrency(row.sales), sub: `${row.person} · ${rangeLabel}`, trend: signedPercent(mom * 100), trendValue: mom, icon: "chart", color: "#ff7a3d", soft: "#fff4ed", path: "M2 34 C12 22 18 30 27 18 C36 6 43 24 51 15 C59 6 64 18 70 8" },
    { label: `${rangeLabel}销售额排名`, value: `第 ${rank}`, sub: `共 ${rows.length} 位商务`, trend: "", trendValue: rank === 1 ? 1 : -1, icon: "star", color: "#ffc75a", soft: "#fff9ed", path: "M2 30 C12 24 20 28 29 18 C38 8 45 16 53 11 C61 7 66 9 70 5" },
    { label: "距离上一名差距", value: rank === 1 ? "领先" : compactCurrency(gap), sub: rank === 1 ? "当前第一名" : `上一名 ${previous.person}`, trend: "", trendValue: rank === 1 ? 1 : -1, icon: "target", color: "#ff9a63", soft: "#fff8f4", path: "M2 28 C14 22 21 25 30 17 C40 8 48 21 57 13 C64 7 68 10 70 6" },
    { label: "专场数量", value: row.specialCount, sub: `${row.talentCount} 位达人`, trend: "", trendValue: row.specialCount, icon: "calendar", color: "#7ca6e8", soft: "#f0f6ff", path: "M2 32 C11 28 18 24 27 21 C36 18 43 13 52 11 C60 9 66 7 70 5" },
    { label: "专场数量差距", value: specialGap ? `${specialGap} 场` : "领先", sub: specialGap ? "距更高专场数" : "专场数领先", trend: "", trendValue: specialGap ? -1 : 1, icon: "file", color: "#89a5c3", soft: "#f4f8fc", path: "M2 20 C12 22 20 16 28 21 C38 28 45 18 54 22 C62 26 66 20 70 24" },
    { label: "环比上一周期", value: signedPercent(mom * 100), sub: `${compactCurrency(row.lastMonthSales)} 对比周期`, trend: "", trendValue: mom, icon: "arrow-up", color: mom >= 0 ? "#e9b15a" : "#d95656", soft: mom >= 0 ? "#fff7e8" : "#fceeee", path: "M2 34 C12 29 18 27 26 22 C35 16 43 13 51 10 C59 8 65 6 70 4" },
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
  const gradient = conicGradient(items, total, 4);
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

function teamSalesDetailRows(data) {
  const metrics = getSalesMetrics();
  const range = selectedTimeRange();
  const rows = SALES_TEAM_META.map((team, teamIndex) => {
    const records = data.filter((record) => teamLabelForGroup(record.group) === team.label);
    const sales = timeRangeTeamSales(team.label, range, metrics);
    const lastMonthSales = timeRangeTeamPreviousSales(team.label, range, metrics);
    const targetMultiplier = [1.1, 1.18, 1.14][teamIndex % 3];
    const target = timeRangeTeamTarget(team.label, range, metrics) || computedSalesTarget(sales, targetMultiplier);
    const sprintTarget = computedSalesTarget(sales, targetMultiplier + 0.16);
    const signedCount = records.filter((record) => ["已合作", "深度合作"].includes(displayStageLabelForRecord(record))).length;
    const bottleneckCount = records.filter((record) => record.bottleneck).length;
    const personSet = new Set(records.map((record) => record.person));
    const groupRows = GROUPS.filter((group) => teamLabelForGroup(group) === team.label).map((group, groupIndex) => {
      const groupRecords = records.filter((record) => record.group === group);
      const groupSales = sumBy(groupRecords, (record) => record.sales);
      return {
        label: group,
        sales: groupSales,
        target: computedSalesTarget(groupSales, 1.1 + ((teamIndex + groupIndex) % 3) * 0.05),
        talentCount: groupRecords.length,
        personCount: new Set(groupRecords.map((record) => record.person)).size,
        color: chartPalette[(teamIndex + groupIndex + 2) % chartPalette.length],
        icon: "users",
      };
    }).filter((row) => row.sales > 0 || row.talentCount > 0);
    const personRows = PERSONS.map((person) => {
      const personRecords = records.filter((record) => record.person === person);
      return {
        label: person,
        sales: sumBy(personRecords, (record) => record.sales),
        talentCount: personRecords.length,
        specialCount: sumBy(personRecords, (record) => record.specialCount),
        icon: "user-check",
      };
    }).filter((row) => row.sales > 0).sort((a, b) => b.sales - a.sales);
    const productRows = groupSales(records, "product", PRODUCTS)
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value)
      .map((row, index) => ({ ...row, sales: row.value, color: chartPalette[index % chartPalette.length], icon: "package" }));
    const stageRows = displayStageRows(records).filter((row) => row.value > 0);

    return {
      ...team,
      records,
      sales,
      lastMonthSales,
      target,
      sprintTarget,
      completion: completionPercent(sales, target),
      mom: lastMonthSales ? (sales - lastMonthSales) / lastMonthSales : 0,
      signedCount,
      bottleneckCount,
      personCount: personSet.size,
      conversion: records.length ? signedCount / records.length : 0,
      groupRows,
      personRows,
      productRows,
      stageRows,
    };
  });
  const totalSales = sumBy(rows, (row) => row.sales);
  return rows.map((row) => ({ ...row, share: totalSales ? row.sales / totalSales : 0 }));
}

function renderTeamDetailLines(rows, max, options = {}) {
  if (!rows.length) return `<div class="empty-state compact">暂无数据</div>`;
  const valueKey = options.valueKey || "sales";
  const formatter = options.formatter || compactCurrency;
  return rows.slice(0, options.limit || 6).map((row, index) => {
    const value = row[valueKey] || 0;
    const color = row.color || chartPalette[index % chartPalette.length];
    const meta = typeof options.meta === "function" ? options.meta(row) : row.meta;
    return `
      <div class="team-detail-line">
        <span class="team-line-title">
          ${row.icon ? icon(row.icon) : ""}
          <strong>${escapeHtml(row.label)}</strong>
          ${meta ? `<em>${escapeHtml(meta)}</em>` : ""}
        </span>
        <span class="team-line-meter"><i style="--line-width:${max ? (value / max) * 100 : 0}%; --line-color:${color}"></i></span>
        <b>${formatter(value)}</b>
      </div>
    `;
  }).join("");
}

function renderManagementProductTeamDetail(data) {
  const productOptions = ["全部", ...PRODUCTS];
  const product = productOptions.includes(state.managementTeamProduct) ? state.managementTeamProduct : "全部";
  state.managementTeamProduct = product;
  const productRecords = product === "全部" ? data : data.filter((record) => record.product === product);
  const metrics = getSalesMetrics();
  const range = selectedTimeRange();
  const rows = SALES_TEAM_META.map((team, index) => {
    const records = productRecords.filter((record) => teamLabelForGroup(record.group) === team.label);
    const sales = product === "全部" ? timeRangeTeamSales(team.label, range, metrics) : sumBy(records, (record) => record.sales);
    const lastMonthSales = product === "全部" ? timeRangeTeamPreviousSales(team.label, range, metrics) : sumBy(records, (record) => record.lastMonthSales);
    const target = product === "全部"
      ? timeRangeTeamTarget(team.label, range, metrics)
      : computedSalesTarget(sales, 1.14 + (index % 4) * 0.04);
    const sprintTarget = computedSalesTarget(sales, 1.28 + (index % 3) * 0.05);
    const groupCount = new Set(records.map((record) => record.group)).size;
    const fallbackOwner = BUSINESS_PEOPLE.find((person) => teamLabelForGroup(person.group) === team.label)?.name || "未分配";
    return {
      label: team.label,
      records,
      sales,
      lastMonthSales,
      target,
      sprintTarget,
      completion: completionPercent(sales, target),
      mom: lastMonthSales ? (sales - lastMonthSales) / lastMonthSales : 0,
      owner: records.length ? primaryOwner(records, team.label) : fallbackOwner,
      personCount: new Set(records.map((record) => record.person)).size,
      groupCount,
      bottleneckCount: records.filter((record) => record.bottleneck).length,
      color: team.color,
      soft: team.soft,
    };
  });
  const maxSales = Math.max(...rows.map((row) => row.sales), 1);
  const teamRows = rows.map((row) => ({
    label: row.label,
    color: row.color,
    soft: row.soft,
    sales: row.sales,
  }));

  if (!rows.length) {
    return `
      <div class="team-product-tabs" role="tablist" aria-label="品类切换">
        ${productOptions.map((item) => `
          <button type="button" class="${item === product ? "active" : ""}" data-management-team-product="${escapeHtml(item)}">
            ${escapeHtml(item)}
          </button>
        `).join("")}
      </div>
      <div class="empty-state">当前暂无「${escapeHtml(product)}」分组销售记录</div>
    `;
  }

  return `
    <div class="team-product-view">
      <div class="team-product-tabs" role="tablist" aria-label="品类切换">
        ${productOptions.map((item) => `
          <button type="button" class="${item === product ? "active" : ""}" data-management-team-product="${escapeHtml(item)}">
            ${escapeHtml(item)}
          </button>
        `).join("")}
      </div>

      <div class="team-product-team-strip">
        ${teamRows.map((team) => `
          <span style="--accent:${team.color}; --accent-soft:${team.soft}">
            <i></i>${escapeHtml(team.label)} <b>${compactCurrency(team.sales)}</b>
          </span>
        `).join("")}
      </div>

      <div class="team-product-group-list">
        ${rows.map((row) => `
          <article class="team-product-card" style="--accent:${row.color}; --accent-soft:${row.soft}">
            <div class="team-card-head">
              <div>
                <h3>${escapeHtml(row.label)}</h3>
                <span>负责人：${escapeHtml(row.owner)}</span>
              </div>
              <span class="tag">${row.records.length} 位达人</span>
            </div>
            <div class="team-metric-grid">
              <div><span>保底目标</span><strong>${row.target ? compactCurrency(row.target) : "--"}</strong></div>
              <div><span>本月实销</span><strong class="green">${compactCurrency(row.sales)}</strong></div>
              <div><span>完成率</span><strong class="blue">${Math.round(row.completion)}%</strong></div>
              <div><span>环比上期</span><strong class="${row.mom < 0 ? "danger" : "green"}">${signedPercent(row.mom * 100)}</strong></div>
            </div>
            <div class="team-product-progress">
              <span>分组贡献</span>
              <div class="sales-progress-track">
                <i style="--progress:${(row.sales / maxSales) * 100}%; --progress-color:${row.color}"></i>
              </div>
              <em>${compactCurrency(row.sales)} / ${row.sprintTarget ? compactCurrency(row.sprintTarget) : "--"}</em>
            </div>
            <div class="team-product-foot">
              <span>${row.records.length} 位达人</span>
              <span>${row.personCount || 1} 位商务</span>
              <span class="${row.bottleneckCount ? "danger" : ""}">卡点 ${row.bottleneckCount}</span>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderManagementTeamDetail(data) {
  if (!els.managementTeamDetail) return;
  const mode = state.managementTeamView === "product" ? "product" : "team";
  state.managementTeamView = mode;
  document.querySelectorAll("[data-management-team-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.managementTeamView === mode);
    button.setAttribute("aria-pressed", String(button.dataset.managementTeamView === mode));
  });
  if (els.managementTeamPeriod) els.managementTeamPeriod.textContent = `${formatMetricMonth(getSalesMetrics().month)} · ${selectedTimeRange().label}`;

  if (mode === "product") {
    els.managementTeamDetail.innerHTML = renderManagementProductTeamDetail(data);
    return;
  }

  const rows = teamSalesDetailRows(data);
  const topTeam = rows.slice().sort((a, b) => b.sales - a.sales)[0] || rows[0];
  const selected = rows.find((row) => row.label === state.managementTeam) || topTeam;
  state.managementTeam = selected?.label || "";

  if (!selected) {
    els.managementTeamDetail.innerHTML = `<div class="empty-state">暂无团队数据</div>`;
    return;
  }

  const maxTeamSales = Math.max(...rows.map((row) => row.sales), 1);
  const maxGroupSales = Math.max(...selected.groupRows.map((row) => row.sales), 1);
  const maxPersonSales = Math.max(...selected.personRows.map((row) => row.sales), 1);
  const maxProductSales = Math.max(...selected.productRows.map((row) => row.sales), 1);

  els.managementTeamDetail.innerHTML = `
    <div class="team-detail-layout">
      <div class="team-choice-list" role="tablist" aria-label="团队切换">
        ${rows.map((row) => `
          <button class="team-choice ${row.label === selected.label ? "active" : ""}" type="button" data-management-team="${escapeHtml(row.label)}" aria-pressed="${row.label === selected.label}" style="--team-color:${row.color}; --team-soft:${row.soft}">
            <span><i></i>${escapeHtml(row.label)}</span>
            <strong>${compactCurrency(row.sales)}</strong>
            <em>完成 ${Math.round(row.completion)}% · ${row.records.length} 位达人</em>
            <b><i style="--line-width:${(row.sales / maxTeamSales) * 100}%"></i></b>
          </button>
        `).join("")}
      </div>

      <div class="team-focus" style="--team-color:${selected.color}; --team-soft:${selected.soft}">
        <div class="team-focus-head">
          <div>
            <span class="panel-kicker">Selected Team</span>
            <h3>${escapeHtml(selected.label)} 完成概览</h3>
          </div>
          <strong>${compactCurrency(selected.sales)}</strong>
        </div>
        <div class="team-focus-progress">
          <span>保底目标完成率</span>
          <div class="team-progress-track"><i style="--line-width:${selected.completion}%"></i></div>
          <em>${Math.round(selected.completion)}%</em>
        </div>
        <div class="team-focus-metrics">
          <div><span>保底目标</span><strong>${selected.target ? compactCurrency(selected.target) : "¥0"}</strong></div>
          <div><span>冲刺目标</span><strong>${selected.sprintTarget ? compactCurrency(selected.sprintTarget) : "¥0"}</strong></div>
          <div><span>环比上期</span><strong class="${selected.mom < 0 ? "danger" : "success"}">${signedPercent(selected.mom * 100)}</strong></div>
          <div><span>团队商务</span><strong>${selected.personCount} 人</strong></div>
          <div><span>合作转化</span><strong>${percent(selected.conversion)}</strong></div>
          <div><span>卡点数量</span><strong class="${selected.bottleneckCount ? "danger" : ""}">${selected.bottleneckCount}</strong></div>
        </div>
        <div class="team-stage-strip">
          ${selected.stageRows.map((row) => `
            <span style="--stage-color:${row.color}">${icon(row.icon)}${escapeHtml(row.label)} <b>${row.value}</b></span>
          `).join("")}
        </div>
      </div>

      <div class="team-detail-columns">
        <section class="team-detail-section">
          <div class="team-section-head">
            <span>小组完成</span>
            <strong>${selected.groupRows.length} 组</strong>
          </div>
          ${renderTeamDetailLines(selected.groupRows, maxGroupSales, {
            meta: (row) => `${row.personCount} 商务 · ${row.talentCount} 达人`,
          })}
        </section>
        <section class="team-detail-section">
          <div class="team-section-head">
            <span>商务贡献</span>
            <strong>Top ${Math.min(selected.personRows.length, 6)}</strong>
          </div>
          ${renderTeamDetailLines(selected.personRows, maxPersonSales, {
            meta: (row) => `${row.talentCount} 达人 · ${row.specialCount} 专场`,
          })}
        </section>
        <section class="team-detail-section">
          <div class="team-section-head">
            <span>品类结构</span>
            <strong>${percent(selected.share)}</strong>
          </div>
          ${renderTeamDetailLines(selected.productRows, maxProductSales, {
            meta: (row) => `${percent(selected.sales ? row.sales / selected.sales : 0)} 占比`,
          })}
        </section>
      </div>
    </div>
  `;
}

function renderManagementDashboard() {
  const data = enrichedRecords();
  const productRows = groupSales(data, "product", PRODUCTS).map((row, index) => ({ ...row, icon: "package", color: chartPalette[index] }));
  const typeRows = groupSales(data, "type", TYPES).map((row, index) => ({ ...row, icon: typeIcon(row.label), color: chartPalette[index] }));
  const teamRows = groupSales(data, "group", GROUPS).map((row, index) => ({
    label: row.label,
    value: row.value,
    icon: "users",
    color: chartPalette[(index + 2) % chartPalette.length],
  }));
  const tierRows = groupSales(data, "tier", TIERS).map((row) => ({ ...row, label: `${row.label}级`, icon: "star", color: tierChartMeta[row.label]?.color || tierMeta[row.label]?.color }));
  const stageRows = displayStageRows(data, (record) => record.sales);

  renderSalesBars(els.managementProductSales, productRows);
  renderSalesBars(els.managementTypeSales, typeRows);
  renderSalesBars(els.managementTeamSales, teamRows);
  renderSalesDonut(els.managementTierSales, tierRows, "SABC Sales");
  renderSalesBars(els.managementStageSales, stageRows, { showPercent: true });
  renderManagementTeamDetail(data);
  renderManagementCategoryTrend(enrichedRecords(filteredRecords(), { ignoreTimeRange: true }));
  renderManagementPersonRank(data);
  renderManagementTalentRank(data);
  if (els.dashboardTableCount) {
    els.dashboardTableCount.textContent = `${PERSONS.length} 位商务`;
  }
}

function managementTalentMetricMeta() {
  const metrics = {
    sales: { label: "销售额", value: (record) => record.sales, display: compactCurrency },
    gmv: { label: "GMV", value: recordGmv, display: compactCurrency },
    special: { label: "专场数", value: (record) => record.specialCount, display: (value) => `${value} 场` },
  };
  return metrics[state.managementTalentMetric] || metrics.sales;
}

function renderManagementTalentRank(data) {
  if (!els.managementTalentRank) return;
  const metric = managementTalentMetricMeta();
  const rows = sortedRankRows(data, "managementTalent", metric.value);
  const descendingRows = [...data].sort((a, b) => metric.value(b) - metric.value(a) || a.id - b.id);
  const rankById = new Map(descendingRows.map((record, index) => [record.id, index + 1]));

  els.managementTalentRankTabs?.querySelectorAll("[data-management-talent-metric]").forEach((button) => {
    const active = button.dataset.managementTalentMetric === state.managementTalentMetric;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });

  els.managementTalentRank.innerHTML = rows.length ? rows.map((record) => {
    const tier = tierMeta[record.tier];
    const rank = rankById.get(record.id) || 1;
    const topClass = rank <= 3 ? `top-${rank}` : "";
    const rankMark = rank <= 3
      ? `<span class="compact-rank-medal" aria-hidden="true"></span>`
      : rank;
    return `
      <button class="compact-talent-rank-row ${topClass}" type="button" data-record-detail="${record.id}">
        <span class="compact-rank-number ${rank <= 3 ? "has-medal" : ""}" aria-label="第 ${rank} 名">${rankMark}</span>
        <span class="compact-rank-avatar" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${escapeHtml(record.name.slice(0, 1))}</span>
        <span class="compact-rank-info">
          <strong>${escapeHtml(record.name)}</strong>
          <em>${escapeHtml(record.type)} · ${escapeHtml(record.product)} · ${record.tier}级</em>
        </span>
        <span class="compact-rank-value">
          <em>${metric.label}</em>
          <strong>${metric.display(metric.value(record))}</strong>
        </span>
      </button>
    `;
  }).join("") : `<div class="empty-state">暂无匹配达人</div>`;
}

function managementTrendConfig() {
  return MANAGEMENT_TREND_RANGES.find((range) => range.id === state.managementTrendRange) || MANAGEMENT_TREND_RANGES[3];
}

function managementTrendLabels(range) {
  if (range.labels) return range.labels;
  const match = String(getSalesMetrics().month || currentMonthKey()).match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const month = match ? Number(match[2]) : new Date().getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const now = new Date();
  const endDay = now.getFullYear() === year && now.getMonth() + 1 === month ? Math.min(now.getDate(), daysInMonth) : daysInMonth;
  const pointCount = range.pointCount || 7;
  if (range.id === "7d") {
    const endDate = new Date(year, month - 1, endDay);
    return Array.from({ length: pointCount }, (_, index) => {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - pointCount + index + 1);
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    });
  }
  return Array.from({ length: pointCount }, (_, index) => {
    const day = 1 + Math.round(((daysInMonth - 1) * index) / Math.max(1, pointCount - 1));
    return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
  });
}

function managementTrendSeries(total, pointCount, productIndex, rangeIndex) {
  const weights = Array.from({ length: pointCount }, (_, index) => {
    const rise = 0.72 + index * 0.065;
    const wave = Math.sin((index + 1) * 1.18 + productIndex * 0.42) * 0.16;
    const pulse = ((index + productIndex + rangeIndex) % 4 === 2 ? 0.13 : 0);
    return Math.max(0.36, rise + wave + pulse);
  });
  const weightTotal = weights.reduce((sum, value) => sum + value, 0) || 1;
  return weights.map((weight) => Math.round((total * weight) / weightTotal / 100) * 100);
}

function managementTrendPath(points) {
  if (!points.length) return "";
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const middleX = (previous.x + point.x) / 2;
    return `${path} C ${middleX.toFixed(1)} ${previous.y.toFixed(1)}, ${middleX.toFixed(1)} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`);
}

function renderManagementCategoryTrend(data) {
  if (!els.managementTrendProduct || !els.managementTrendRange || !els.managementTrendSummary || !els.managementTrendChart) return;

  const selectedProduct = state.managementTrendProduct || "全部";
  const range = managementTrendConfig();
  const rangeLabels = managementTrendLabels(range);
  const rangeIndex = Math.max(0, MANAGEMENT_TREND_RANGES.findIndex((item) => item.id === range.id));
  const productIndex = Math.max(0, PRODUCTS.indexOf(selectedProduct));
  const selectedRows = selectedProduct === "全部" ? data : data.filter((record) => record.product === selectedProduct);
  const baseSales = sumBy(selectedRows, (record) => record.sales);
  const rangeSales = Math.max(0, Math.round((baseSales * range.factor) / 100) * 100);
  const series = managementTrendSeries(rangeSales, rangeLabels.length, productIndex, rangeIndex);
  const orderCount = Math.max(0, Math.round(rangeSales / (3900 + productIndex * 120)));
  const talentCount = new Set(selectedRows.map((record) => record.name)).size;
  const averageTalentSales = talentCount ? rangeSales / talentCount : 0;
  const changes = [9.8, 6.4, 12.5, 5.6].map((value, index) => value + ((productIndex + rangeIndex + index) % 4) * 0.7);

  els.managementTrendProduct.innerHTML = ["全部", ...PRODUCTS].map((product) => `
    <option value="${escapeHtml(product)}" ${product === selectedProduct ? "selected" : ""}>${product === "全部" ? "全部品类" : escapeHtml(product)}</option>
  `).join("");

  els.managementTrendRange.innerHTML = MANAGEMENT_TREND_RANGES.map((item) => `
    <button class="${item.id === range.id ? "active" : ""}" type="button" data-management-trend-range="${item.id}" aria-pressed="${item.id === range.id}">${item.label}</button>
  `).join("");

  const summaryRows = [
    { label: "品类销售额", value: compactCurrency(rangeSales), change: changes[0] },
    { label: "成交订单", value: `${orderCount.toLocaleString("zh-CN")} 单`, change: changes[1] },
    { label: "合作达人", value: `${talentCount} 人`, change: changes[2] },
    { label: "达人均产出", value: compactCurrency(averageTalentSales), change: changes[3] },
  ];
  els.managementTrendSummary.innerHTML = summaryRows.map((row) => `
    <div class="category-trend-metric">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
      <em>较上一周期 <b>+${row.change.toFixed(1)}%</b></em>
    </div>
  `).join("");

  const width = 960;
  const height = 280;
  const left = 66;
  const right = 22;
  const top = 24;
  const bottom = 44;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const maxValue = Math.max(...series, 1000);
  const axisMax = Math.ceil((maxValue * 1.18) / 1000) * 1000;
  const points = series.map((value, index) => ({
    value,
    label: rangeLabels[index],
    x: left + (chartWidth * index) / Math.max(1, series.length - 1),
    y: top + chartHeight - (value / axisMax) * chartHeight,
  }));
  const linePath = managementTrendPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(top + chartHeight).toFixed(1)} L ${points[0].x.toFixed(1)} ${(top + chartHeight).toFixed(1)} Z`;
  const gridRows = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    return {
      y: top + chartHeight * ratio,
      value: axisMax * (1 - ratio),
    };
  });
  const chartTitle = selectedProduct === "全部" ? "全部品类" : selectedProduct;

  els.managementTrendChart.innerHTML = `
    <div class="category-chart-caption">
      <span><i></i>${escapeHtml(chartTitle)}销售额</span>
      <em>${range.label} · 单位：元</em>
    </div>
    <div class="category-chart-scroll">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(chartTitle)}${range.label}销售趋势折线图" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="categoryTrendArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ff8a4c" stop-opacity="0.26"></stop>
            <stop offset="100%" stop-color="#ff8a4c" stop-opacity="0.02"></stop>
          </linearGradient>
        </defs>
        ${gridRows.map((row) => `
          <g class="category-chart-gridline">
            <line x1="${left}" y1="${row.y.toFixed(1)}" x2="${width - right}" y2="${row.y.toFixed(1)}"></line>
            <text x="${left - 12}" y="${(row.y + 4).toFixed(1)}" text-anchor="end">${compactCurrency(row.value).replace("¥", "")}</text>
          </g>
        `).join("")}
        <path class="category-chart-area" d="${areaPath}"></path>
        <path class="category-chart-line" d="${linePath}"></path>
        ${points.map((point) => {
          const tooltipX = clamp(point.x - 48, 8, width - 126);
          const tooltipY = Math.max(8, point.y - 66);
          return `
            <g class="category-chart-point" tabindex="0" aria-label="${escapeHtml(point.label)} ${currency(point.value)}">
              <line class="category-chart-guide" x1="${point.x.toFixed(1)}" y1="${point.y.toFixed(1)}" x2="${point.x.toFixed(1)}" y2="${(top + chartHeight).toFixed(1)}"></line>
              <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5"></circle>
              <g class="category-chart-tooltip" transform="translate(${tooltipX.toFixed(1)} ${tooltipY.toFixed(1)})">
                <rect width="118" height="50" rx="7"></rect>
                <text x="10" y="19">${escapeHtml(point.label)}</text>
                <text class="value" x="10" y="39">${currency(point.value)}</text>
              </g>
            </g>
          `;
        }).join("")}
        ${points.map((point) => `<text class="category-chart-axis-label" x="${point.x.toFixed(1)}" y="${height - 13}" text-anchor="middle">${escapeHtml(point.label)}</text>`).join("")}
      </svg>
    </div>
  `;
}

function renderManagementPersonRank(data) {
  if (!els.managementPersonRank) return;
  const personRows = personSalesRows(data);
  const rankByPerson = new Map([...personRows]
    .sort((a, b) => b.sales - a.sales)
    .map((row, index) => [row.person, index + 1]));
  const rows = sortedRankRows(personRows, "managementPerson", (row) => row.sales);
  els.managementPersonRank.innerHTML = rows.map((row, index) => {
    const mom = row.lastMonthSales ? (row.sales - row.lastMonthSales) / row.lastMonthSales : 0;
    const rank = rankByPerson.get(row.person) || index + 1;
    const rankClass = rank <= 3 ? `top-${rank}` : "";
    return `
      <button class="person-rank-row leaderboard-row ${rankClass}" type="button" data-person-filter="${escapeHtml(row.person)}">
        <span class="leaderboard-rank">${rank}</span>
        <span class="leaderboard-profile">
          <span class="leaderboard-avatar">${escapeHtml(row.person.slice(0, 1))}</span>
          <span>
            <strong>${escapeHtml(row.person)}</strong>
            <em>${escapeHtml(BUSINESS_GROUP_BY_PERSON[row.person] || "未分组")}</em>
          </span>
        </span>
        <span class="leaderboard-metric primary">
          <em>当月销售额及环比</em>
          <strong>${compactCurrency(row.sales)} <i class="${mom < 0 ? "down" : ""}">${signedPercent(mom * 100)}</i></strong>
        </span>
        <span class="leaderboard-metric">
          <em>上月销售额</em>
          <strong>${compactCurrency(row.lastMonthSales)}</strong>
        </span>
        <span class="leaderboard-metric">
          <em>专场数量</em>
          <strong>${row.specialCount} 场</strong>
        </span>
        <span class="leaderboard-metric">
          <em>合作达人数</em>
          <strong>${row.talentCount} 人</strong>
        </span>
      </button>
    `;
  }).join("");
}

function groupRankMovement(currentRank, previousRank) {
  const change = previousRank - currentRank;
  if (change > 0) return { label: `↑ ${change}`, className: "up" };
  if (change < 0) return { label: `↓ ${Math.abs(change)}`, className: "down" };
  return { label: "持平", className: "flat" };
}

function renderPersonalGroupRank(person) {
  if (!els.personalGroupRank) return;
  const personGroup = BUSINESS_GROUP_BY_PERSON[person] || "";
  const teamLabel = teamLabelForGroup(personGroup);
  const teamMeta = SALES_TEAM_META.find((team) => team.label === teamLabel) || SALES_TEAM_META[0];
  const rows = personSalesRows(enrichedRecords())
    .filter((row) => teamLabelForGroup(BUSINESS_GROUP_BY_PERSON[row.person] || "") === teamLabel)
    .sort((a, b) => b.sales - a.sales || a.person.localeCompare(b.person, "zh-CN"));
  const previousRows = [...rows].sort((a, b) => b.lastMonthSales - a.lastMonthSales || a.person.localeCompare(b.person, "zh-CN"));
  const previousRankByPerson = new Map(previousRows.map((row, index) => [row.person, index + 1]));
  const currentRank = Math.max(1, rows.findIndex((row) => row.person === person) + 1);
  const podiumRows = [rows[1], rows[0], rows[2]].filter(Boolean);

  if (els.personalGroupRankBadge) {
    els.personalGroupRankBadge.textContent = `${teamLabel} · 我的排名 第 ${currentRank}`;
  }

  els.personalGroupRank.innerHTML = `
    <div class="group-ranking-intro">
      <div>
        <span>${escapeHtml(teamLabel)}实时销售榜</span>
        <strong>${rows.length} 位商务</strong>
      </div>
      <p><b>${escapeHtml(person)}</b><span>当前组内第 ${currentRank}</span></p>
    </div>
    <div class="group-ranking-podium" style="--team-color:${teamMeta.color}; --team-soft:${teamMeta.soft}">
      ${podiumRows.map((row) => {
        const rank = rows.indexOf(row) + 1;
        const movement = groupRankMovement(rank, previousRankByPerson.get(row.person) || rank);
        return `
          <button class="group-podium-card rank-${rank} ${row.person === person ? "current" : ""}" type="button" data-person-filter="${escapeHtml(row.person)}">
            <span class="group-rank-avatar"><span>${escapeHtml(row.person.slice(0, 1))}</span></span>
            <span class="group-rank-medal" aria-label="第 ${rank} 名"><i aria-hidden="true"></i></span>
            <strong>${escapeHtml(row.person)}</strong>
            <span class="group-rank-metric-label">当月销售额</span>
            <b>${compactCurrency(row.sales)}</b>
            <em class="group-rank-change ${movement.className}">${movement.label}</em>
          </button>
        `;
      }).join("")}
    </div>
    <div class="group-ranking-list" aria-label="${escapeHtml(teamLabel)}组内排行榜">
      ${rows.slice(3).map((row, index) => {
        const rank = index + 4;
        const movement = groupRankMovement(rank, previousRankByPerson.get(row.person) || rank);
        return `
          <button class="group-ranking-row ${row.person === person ? "current" : ""}" type="button" data-person-filter="${escapeHtml(row.person)}">
            <span class="rank-number">${rank}</span>
            <span class="group-row-avatar">${escapeHtml(row.person.slice(0, 1))}</span>
            <span class="rank-info"><strong>${escapeHtml(row.person)}</strong><em>${row.talentCount} 位达人 · ${row.specialCount} 场专场</em></span>
            <span class="group-rank-change ${movement.className}">${movement.label}</span>
            <span class="group-row-value"><em>当月销售额</em><b>${compactCurrency(row.sales)}</b></span>
          </button>
        `;
      }).join("") || `<div class="group-ranking-empty">本组其余名次暂无数据</div>`}
    </div>
  `;
}

function renderPersonalPipeline(person, data) {
  if (!els.personalKanbanColumns) return;
  els.personalKanbanColumns.innerHTML = kanbanColumnsMarkup(data, false);
  if (els.personalPipelineBadge) {
    els.personalPipelineBadge.textContent = `${person} · ${data.length} 位达人`;
  }
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function personalScheduleEntries(data, person) {
  const monthKey = String(getSalesMetrics().month || currentMonthKey()).slice(0, 7);
  const days = [2, 2, 5, 7, 7, 10, 12, 14, 14, 17, 20, 22, 25, 28];
  const times = ["19:30", "20:00", "20:30", "21:00"];
  const rooms = ["直播间A", "直播间B", "直播间C", "直播间D"];
  const source = data.length ? data : enrichedRecords().filter((record) => record.person === person);
  const fallback = source.length ? source : enrichedRecords().slice(0, 4);

  return days.map((day, index) => {
    const record = fallback[index % fallback.length];
    const status = index < 5
      ? { label: "已完成", color: "#7ca6e8", soft: "#f0f6ff" }
      : index === 5
        ? { label: "进行中", color: "#ff7a3d", soft: "#fff4ed" }
        : { label: "待开始", color: "#89a5c3", soft: "#f4f8fc" };
    return {
      id: `SPECIAL-${monthKey.replace("-", "")}-${String(index + 1).padStart(2, "0")}`,
      date: `${monthKey}-${String(day).padStart(2, "0")}`,
      time: times[index % times.length],
      talent: record?.name || `模拟达人 ${index + 1}`,
      product: record?.product || PRODUCTS[index % PRODUCTS.length],
      room: rooms[index % rooms.length],
      amount: 480000 + ((index * 370000) % 1380000),
      status,
    };
  });
}

function renderPersonalSchedule(person, data) {
  if (!els.personalSchedule) return;
  const entries = personalScheduleEntries(data, person);
  const availableDates = new Set(entries.map((entry) => entry.date));
  if (!state.personalScheduleDate || !availableDates.has(state.personalScheduleDate)) {
    state.personalScheduleDate = entries[7]?.date || entries[0]?.date || localDateKey(new Date());
  }

  const selectedDate = new Date(`${state.personalScheduleDate}T12:00:00`);
  const mondayOffset = (selectedDate.getDay() + 6) % 7;
  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - mondayOffset);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const selectedEntries = entries.filter((entry) => entry.date === state.personalScheduleDate);
  const monthLabel = `${selectedDate.getFullYear()}年${String(selectedDate.getMonth() + 1).padStart(2, "0")}月`;
  const fullDateLabel = `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  if (els.personalScheduleBadge) {
    els.personalScheduleBadge.textContent = `${monthLabel} · 本月专场 ${entries.length} 个`;
  }

  els.personalSchedule.innerHTML = `
    <div class="schedule-date-head">
      <div><strong>${fullDateLabel}</strong><span>${weekdays[selectedDate.getDay()]}</span></div>
      <em>${escapeHtml(person)}的专场日程</em>
    </div>
    <div class="schedule-week" role="tablist" aria-label="专场排期日期">
      ${weekDates.map((date) => {
        const dateKey = localDateKey(date);
        const count = entries.filter((entry) => entry.date === dateKey).length;
        return `
          <button class="schedule-day ${dateKey === state.personalScheduleDate ? "active" : ""}" type="button" data-personal-schedule-date="${dateKey}" role="tab" aria-selected="${dateKey === state.personalScheduleDate}">
            <span>${weekdays[date.getDay()].replace("周", "")}</span>
            <strong>${date.getDate()}</strong>
            ${count ? `<i>${count}场</i>` : `<i aria-hidden="true">-</i>`}
          </button>
        `;
      }).join("")}
    </div>
    <div class="schedule-agenda">
      ${selectedEntries.length ? selectedEntries.map((entry) => `
        <article class="schedule-entry" style="--schedule-color:${entry.status.color}; --schedule-soft:${entry.status.soft}">
          <time>${entry.time}</time>
          <span class="schedule-entry-line"></span>
          <span class="schedule-entry-copy">
            <strong>${escapeHtml(entry.talent)} · ${escapeHtml(entry.product)}专场</strong>
            <em>${icon("calendar")}${escapeHtml(entry.room)} · ${escapeHtml(person)}</em>
          </span>
          <b>${compactCurrency(entry.amount)}</b>
          <span class="schedule-status">${entry.status.label}</span>
        </article>
      `).join("") : `<div class="schedule-empty">当日暂无专场安排，可选择有场次标记的日期查看</div>`}
    </div>
  `;
}

function renderPersonalDashboard() {
  const person = selectedPerson();
  const data = recordsForPerson(person);

  const productRows = groupSales(data, "product", PRODUCTS).map((item, index) => ({ ...item, icon: "package", color: chartPalette[index] }));
  const tierRows = groupSales(data, "tier", TIERS).map((item) => ({ ...item, label: `${item.label}级`, icon: "star", color: tierChartMeta[item.label]?.color || tierMeta[item.label]?.color }));
  const stageRows = displayStageRows(data, (record) => record.sales);

  renderSalesBars(els.personalProductSales, productRows);
  renderSalesDonut(els.personalTierSales, tierRows, "Personal Sales");
  renderSalesBars(els.personalStageSales, stageRows, { showPercent: true });
  renderPersonalTalentList(els.personalTalentRank, sortedRankRows(data, "personalOrders", (record) => record.sales), person);
  renderPersonalGroupRank(person);
  renderPersonalPipeline(person, data);
  renderPersonalSchedule(person, data);
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

function renderPersonalTalentList(container, data, person) {
  if (!container) return;
  const max = Math.max(...data.map((record) => record.sales), 1);
  container.innerHTML = data.length ? data.map((record, index) => {
    const tier = tierMeta[record.tier];
    const stage = displayStageForRecord(record);
    return `
      <button class="talent-sales-row talent-list-row" type="button" data-record-detail="${record.id}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-avatar" style="--tier-color:${tier.color}; --tier-soft:${tier.soft}">${icon(typeIcon(record.type))}</span>
        <span class="rank-info">
          <strong>${escapeHtml(record.name)}</strong>
          <em>${escapeHtml(record.product)} · ${escapeHtml(record.format)} · ${record.tier}级</em>
        </span>
        <span class="stage-pill compact" style="--stage-color:${stage.color}; --stage-soft:${stage.soft}">${stage.label}</span>
        <span class="rank-meter">
          <i style="--rank-width:${(record.sales / max) * 100}%; --rank-color:${tier.color}"></i>
        </span>
        <b>${compactCurrency(record.sales)}</b>
      </button>
    `;
  }).join("") : `<div class="empty-state">${escapeHtml(person)} 暂无合作达人</div>`;
}

function personalTalentOrders(data, person) {
  const allRecords = enrichedRecords(state.records);
  const sourceRecords = data.length
    ? data
    : allRecords.filter((record) => record.person === person);
  const personRecords = sourceRecords.length ? sourceRecords : allRecords.slice(0, 4);
  if (!personRecords.length) return [];

  return Array.from({ length: 20 }, (_, index) => {
    const record = personRecords[index % personRecords.length];
    const status = orderStatusMeta[index % orderStatusMeta.length];
    const amountFactor = 0.075 + ((index % 6) * 0.012) + ((index % 3) * 0.006);
    const day = String(Math.max(1, 13 - (index % 13))).padStart(2, "0");
    return {
      id: `ORD-202607-${String(index + 1).padStart(3, "0")}`,
      recordId: record.id,
      talent: record.name,
      product: record.product,
      format: record.format,
      date: `07/${day}`,
      channel: orderChannels[index % orderChannels.length],
      amount: Math.max(1800, Math.round(record.sales * amountFactor)),
      status,
    };
  });
}

function renderTalentOrders(container, orders) {
  if (!container) return;
  container.innerHTML = orders.length ? orders.map((order, index) => {
    const formatColor = chartPalette[index % chartPalette.length];
    return `
      <button class="talent-sales-row order-row" type="button" data-record-detail="${order.recordId}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-avatar" style="--tier-color:${formatColor}; --tier-soft:#f5f8fb">${icon(formatIcon(order.format))}</span>
        <span class="rank-info">
          <strong>${escapeHtml(order.id)} · ${escapeHtml(order.talent)}</strong>
          <em>${escapeHtml(order.date)} · ${escapeHtml(order.product)} · ${escapeHtml(order.channel)}</em>
        </span>
        <span class="order-status" style="--order-color:${order.status.color}; --order-soft:${order.status.soft}">${escapeHtml(order.status.label)}</span>
        <b>${compactCurrency(order.amount)}</b>
      </button>
    `;
  }).join("") : `<div class="empty-state">暂无订单数据</div>`;
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
      <td><strong class="gmv-value">${currency(recordGmv(record))}</strong></td>
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

function kanbanColumnsMarkup(data, interactive = true) {
  return PIPELINE_STAGES.map((stage) => {
    const stageRecords = pipelineStageRecords(data, stage);
    return `
      <section class="kanban-col"${interactive ? ` data-drop-stage="${escapeHtml(stage.label)}"` : ""}>
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

function renderKanban() {
  const data = filteredRecords();
  els.kanbanColumns.innerHTML = kanbanColumnsMarkup(data);
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
          <div class="progress-fill" style="--progress:${(owned.length / max) * 100}%; --progress-color:#ff9a63"></div>
        </div>
        <span class="muted">已合作 ${signed} · 卡点 ${blocked}</span>
      </div>
    `;
  }).join("");
}

function teamLabelForGroup(group) {
  if (String(group).includes("A")) return "A组";
  if (String(group).includes("B")) return "B组";
  return "C组";
}

function computedSalesTarget(value, multiplier) {
  return value ? Math.max(10000, Math.round((value * multiplier) / 1000) * 1000) : 0;
}

function completionPercent(value, target) {
  return target ? clamp((value / target) * 100, 0, 100) : 0;
}

function primaryOwner(records, group) {
  if (!records.length) {
    return BUSINESS_PEOPLE.find((person) => person.group === group)?.name || "未分配";
  }

  const ownerRows = PERSONS.map((person) => ({
    person,
    sales: sumBy(records.filter((record) => record.person === person), (record) => record.sales),
  })).filter((row) => row.sales > 0);
  return ownerRows.sort((a, b) => b.sales - a.sales)[0]?.person || records[0].person;
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
      <td><strong class="gmv-value">${currency(recordGmv(record))}</strong></td>
    </tr>
  `;
}

function renderAll() {
  renderKpis();
  renderQuarterPopover();
  renderTimeRangePopover();
  renderManagementDashboard();
  renderPersonalDashboard();
  renderLegend();
  renderKanban();
  renderOwners();
  renderFormatGrid();
  renderDirectory();
  renderSortToggles();
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
          <div class="detail-line"><span>品类</span><strong>${escapeHtml(record.product)}</strong></div>
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
    : { id: "", name: "", tier: "A", type: "美垂", product: PRODUCTS[0], group: BUSINESS_PEOPLE[0].group, format: "专场", stage: "待建联", person: BUSINESS_PEOPLE[0].name, bottleneck: "" };
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
        ${selectField("product", "合作品类", PRODUCTS, record.product)}
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
  const teamMetricRows = SALES_TEAM_META.map((team) => ({
    ...team,
    metric: teamSalesMetric(team.label, metrics),
  }));
  const teamAnnualTargetTotal = sumBy(teamMetricRows, (row) => row.metric.annualTarget || 0);

  openDrawer({
    kicker: "销售指标",
    title: "月度销售额维护",
    body: `
      <div class="detail-stack">
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
          <section class="metric-team-editor full">
            <div class="metric-section-head">
              <div>
                <h4>分组销售额指标</h4>
                <p>A/B/C 组销售额会同步到分团队销售额、团队完成情况和年度视图。</p>
              </div>
              <span>目标合计 ${compactCurrency(teamAnnualTargetTotal)}</span>
            </div>
            <div class="metric-team-grid">
              ${teamMetricRows.map((row) => `
                <section class="metric-team-card" style="--accent:${row.color}; --accent-soft:${row.soft}">
                  <h5><i></i>${escapeHtml(row.label)}</h5>
                  <label class="form-field">
                    <span>本月销售额目标（元）</span>
                    <input name="team_${escapeHtml(row.label)}_currentMonthSales" type="number" min="0" step="1" value="${row.metric.currentMonthSales || 0}" required />
                  </label>
                  <label class="form-field">
                    <span>全年目标（元）</span>
                    <input name="team_${escapeHtml(row.label)}_annualTarget" type="number" min="0" step="1" value="${row.metric.annualTarget || 0}" required />
                  </label>
                </section>
              `).join("")}
            </div>
          </section>
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
  const teamSales = SALES_TEAM_META.reduce((acc, team) => {
    const prefix = `team_${team.label}_`;
    const existing = teamSalesMetric(team.label);
    acc[team.label] = {
      currentMonthSales: data.get(`${prefix}currentMonthSales`),
      previousMonthSales: existing.previousMonthSales,
      annualCompletedSales: existing.annualCompletedSales,
      annualTarget: data.get(`${prefix}annualTarget`),
    };
    return acc;
  }, {});
  const nextMetrics = normalizeSalesMetrics({
    month: data.get("month"),
    currentMonthSales: data.get("currentMonthSales"),
    previousMonthSales: data.get("previousMonthSales"),
    annualTarget: data.get("annualTarget"),
    annualCompletedSales: data.get("annualCompletedSales"),
    teamSales,
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
  state.filters = { product: "", group: "", format: "", type: "", tier: "", stage: "", person: "" };
  Object.values(filterMap()).forEach((select) => {
    select.value = "";
  });
  renderAll();
  showToast("筛选已重置");
}

function exportCsv() {
  const header = ["ID", "达人名称", "等级", "类型", "品类", "组", "玩法", "状态", "商务", "卡点", "GMV"];
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
    recordGmv(record),
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
    const quarterControl = event.target.closest("#quarterControl");
    const quarterPopover = event.target.closest("#quarterPopover");
    if (!quarterControl && !quarterPopover && state.quarterPopoverOpen) {
      state.quarterPopoverOpen = false;
      renderQuarterPopover();
    }

    const timeRangeControl = event.target.closest("#timeRangeControl");
    const timeRangePopover = event.target.closest("#timeRangePopover");
    if (!timeRangeControl && !timeRangePopover && state.timeRangePopoverOpen) {
      state.timeRangePopoverOpen = false;
      renderTimeRangePopover();
    }

    const quarterButton = event.target.closest("#quarterControlBtn");
    if (quarterButton) {
      state.quarterPopoverOpen = !state.quarterPopoverOpen;
      state.timeRangePopoverOpen = false;
      renderQuarterPopover();
      renderTimeRangePopover();
      return;
    }

    const timeRangeButton = event.target.closest("#timeRangeControlBtn");
    if (timeRangeButton) {
      state.timeRangePopoverOpen = !state.timeRangePopoverOpen;
      state.quarterPopoverOpen = false;
      renderTimeRangePopover();
      renderQuarterPopover();
      return;
    }

    const timeRangeOption = event.target.closest("[data-time-range]");
    if (timeRangeOption) {
      state.timeRange = timeRangeOption.dataset.timeRange;
      state.customDateStart = "";
      state.customDateEnd = "";
      state.calendarMonth = String(getSalesMetrics().month || currentMonthKey());
      state.timeRangePopoverOpen = false;
      renderAll();
      showToast(`已切换为${selectedTimeRange().label}维度`);
      return;
    }

    const calendarShift = event.target.closest("[data-calendar-shift]");
    if (calendarShift) {
      state.calendarMonth = shiftCalendarMonth(state.calendarMonth, Number(calendarShift.dataset.calendarShift));
      renderTimeRangePopover();
      return;
    }

    const calendarDate = event.target.closest("[data-calendar-date]");
    if (calendarDate) {
      const pickedDate = calendarDate.dataset.calendarDate;
      if (!state.customDateStart || state.customDateEnd) {
        state.customDateStart = pickedDate;
        state.customDateEnd = "";
        state.timeRange = "custom";
        renderTimeRangePopover();
        return;
      }

      if (pickedDate < state.customDateStart) {
        state.customDateEnd = state.customDateStart;
        state.customDateStart = pickedDate;
      } else {
        state.customDateEnd = pickedDate;
      }
      state.timeRange = "custom";
      renderAll();
      showToast(`已筛选 ${selectedTimeRange().label}`);
      return;
    }

    if (event.target.closest("#quarterPopover")) {
      return;
    }

    if (event.target.closest("#timeRangePopover")) {
      return;
    }

    const personalScheduleDate = event.target.closest("[data-personal-schedule-date]");
    if (personalScheduleDate) {
      state.personalScheduleDate = personalScheduleDate.dataset.personalScheduleDate;
      renderPersonalSchedule(selectedPerson(), recordsForPerson());
      return;
    }

    const nav = event.target.closest("[data-view]");
    if (nav) {
      setView(nav.dataset.view);
      return;
    }

    const personFilter = event.target.closest("[data-person-filter]");
    if (personFilter) {
      state.personalPerson = personFilter.dataset.personFilter;
      setView("personal");
      showToast(`已切换到 ${state.personalPerson} 的个人看板`);
      return;
    }

    const managementTeamView = event.target.closest("[data-management-team-view]");
    if (managementTeamView) {
      state.managementTeamView = managementTeamView.dataset.managementTeamView;
      renderManagementTeamDetail(enrichedRecords());
      return;
    }

    const managementTeamProduct = event.target.closest("[data-management-team-product]");
    if (managementTeamProduct) {
      state.managementTeamView = "product";
      state.managementTeamProduct = managementTeamProduct.dataset.managementTeamProduct;
      renderManagementTeamDetail(enrichedRecords());
      return;
    }

    const managementTeam = event.target.closest("[data-management-team]");
    if (managementTeam) {
      state.managementTeam = managementTeam.dataset.managementTeam;
      renderManagementTeamDetail(enrichedRecords());
      return;
    }

    const managementTrendRange = event.target.closest("[data-management-trend-range]");
    if (managementTrendRange) {
      state.managementTrendRange = managementTrendRange.dataset.managementTrendRange;
      renderManagementCategoryTrend(enrichedRecords(filteredRecords(), { ignoreTimeRange: true }));
      return;
    }

    const managementTalentMetric = event.target.closest("[data-management-talent-metric]");
    if (managementTalentMetric) {
      state.managementTalentMetric = managementTalentMetric.dataset.managementTalentMetric;
      renderManagementTalentRank(enrichedRecords());
      return;
    }

    const rankSort = event.target.closest("[data-rank-sort]");
    if (rankSort) {
      const key = rankSort.dataset.rankSort;
      state.rankSort[key] = rankSortDirection(key) === "asc" ? "desc" : "asc";
      renderAll();
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (state.quarterPopoverOpen || state.timeRangePopoverOpen)) {
      const focusTarget = state.timeRangePopoverOpen ? els.timeRangeControlBtn : els.quarterControlBtn;
      state.quarterPopoverOpen = false;
      state.timeRangePopoverOpen = false;
      renderQuarterPopover();
      renderTimeRangePopover();
      focusTarget?.focus();
    }
  });

  els.managementTrendProduct?.addEventListener("change", (event) => {
    state.managementTrendProduct = event.target.value;
    renderManagementCategoryTrend(enrichedRecords(filteredRecords(), { ignoreTimeRange: true }));
  });

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
