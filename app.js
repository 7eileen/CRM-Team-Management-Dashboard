const state = {
  selectedMonth: "2026-05",
  activePage: "aggregate",
  aggregateMode: "person",
  settlementSort: "desc",
  configTab: "tier",
  query: "",
  team: "all",
  filterMode: "all",
  config: {
    tiers: [
      { id: "t1", label: "≤ 29%", min: 0, max: 0.29, rate: 0.025 },
      { id: "t2", label: "30% - 39%", min: 0.3, max: 0.39, rate: 0.02 },
      { id: "t3", label: "40% - 45%", min: 0.4, max: 0.45, rate: 0.015 },
      { id: "t4", label: "46% - 55%", min: 0.46, max: 0.55, rate: 0.01 },
      { id: "t5", label: "56% - 60%", min: 0.56, max: 0.6, rate: 0.005 },
      { id: "t6", label: "61% - 65%", min: 0.61, max: 0.65, rate: 0.003 },
      { id: "t7", label: "> 65%", min: 0.6501, max: null, rate: 0 },
    ],
    special: {
      specialCoef: 0.5,
      normalCoef: 1,
    },
    customer: {
      rollingMonths: 2,
      newCoef: 1,
      oldCoef: 0.5,
    },
    incentive: {
      categories: ["气垫", "素颜霜"],
      threshold: 150000,
      multiplier: 2,
    },
    leaderShare: 0.5,
    yangjie: {
      cutoff: "2023-05-31",
      useSpecialCoef: false,
    },
    customCoefficients: [
      {
        id: "custom-1",
        name: "活动加权系数",
        scope: "交易层",
        value: 1,
        enabled: true,
        note: "用于记录临时活动加权，暂不参与正式结算公式。",
      },
    ],
  },
};

const people = [
  { id: "p1", name: "林予乔", team: "B组", role: "member", performance: 1.08, arrears: 1200 },
  { id: "p2", name: "周岚", team: "B组", role: "member", performance: 0.96, arrears: 0 },
  { id: "p3", name: "沈夏", team: "C组", role: "member", performance: 1.12, arrears: 600 },
  { id: "p4", name: "唐可", team: "C组", role: "member", performance: 0.9, arrears: -300 },
  { id: "p5", name: "秦若言", team: "B组", role: "leader", performance: 1.05, arrears: 0 },
  { id: "p6", name: "赵澄", team: "C组", role: "leader", performance: 1, arrears: 0 },
  { id: "p7", name: "杨洁", team: "A组", role: "member", performance: 1.1, arrears: 0 },
  { id: "p8", name: "高烁", team: "A组", role: "member", performance: 0.88, arrears: 0 },
  { id: "p9", name: "罗曼", team: "A组", role: "leader", performance: 1.02, arrears: 0 },
  { id: "m1", name: "内容中台-小莫", team: "中台", role: "middle", fixed: 18000 },
  { id: "m2", name: "内容中台-阿知", team: "中台", role: "middle", fixed: 13500 },
];

const transactions = [
  {
    orderId: "DB202605001",
    owner: "林予乔",
    team: "B组",
    uid: "1253874928453015",
    influencer: "LAOCOU老奏",
    category: "气垫",
    payment: 88000,
    isSpecial: false,
    firstLive: "2026-04-08",
    commissionRate: 0.28,
    attribution: "达播",
  },
  {
    orderId: "DB202605002",
    owner: "林予乔",
    team: "B组",
    uid: "1253874928453015",
    influencer: "LAOCOU老奏",
    category: "素颜霜",
    payment: 72000,
    isSpecial: true,
    firstLive: "2026-02-20",
    commissionRate: 0.28,
    attribution: "达播",
  },
  {
    orderId: "DB202605003",
    owner: "周岚",
    team: "B组",
    uid: "932817055777428",
    influencer: "豫东兵嫂",
    category: "精华",
    payment: 98000,
    isSpecial: false,
    firstLive: "2025-11-02",
    commissionRate: 0.43,
    attribution: "达播",
  },
  {
    orderId: "DB202605004",
    owner: "唐可",
    team: "C组",
    uid: "61270212367",
    influencer: "豫东兵嫂（好物分享号）",
    category: "口红",
    payment: 60000,
    isSpecial: true,
    firstLive: "2026-05-09",
    commissionRate: 0.37,
    attribution: "达播",
  },
  {
    orderId: "DB202605005",
    owner: "沈夏",
    team: "C组",
    uid: "6524464400",
    influencer: "盈儿♡",
    category: "面膜",
    payment: 110000,
    isSpecial: false,
    firstLive: "2026-03-18",
    commissionRate: 0.58,
    attribution: "达播",
  },
  {
    orderId: "DB202605006",
    owner: "沈夏",
    team: "C组",
    uid: "6524464400",
    influencer: "盈儿♡",
    category: "素颜霜",
    payment: 160000,
    isSpecial: false,
    firstLive: "2026-03-18",
    commissionRate: 0.52,
    attribution: "达播",
  },
  {
    orderId: "DB202605007",
    owner: "杨洁",
    team: "A组",
    uid: "3492464775403479",
    influencer: "大小与",
    category: "气垫",
    payment: 120000,
    isSpecial: true,
    firstLive: "2026-04-18",
    commissionRate: 0.34,
    attribution: "达播",
  },
  {
    orderId: "DB202605008",
    owner: "杨洁",
    team: "A组",
    uid: "3492464775403479",
    influencer: "大小与",
    category: "素颜霜",
    payment: 65000,
    isSpecial: true,
    firstLive: "2026-03-12",
    commissionRate: 0.34,
    attribution: "达播",
  },
  {
    orderId: "DB202605009",
    owner: "杨洁",
    team: "A组",
    uid: "3492464775403479",
    influencer: "大小与",
    category: "口红",
    payment: 42000,
    isSpecial: false,
    firstLive: "2023-04-20",
    commissionRate: 0.24,
    attribution: "达播",
  },
  {
    orderId: "DB202605010",
    owner: "高烁",
    team: "A组",
    uid: "59092920806",
    influencer: "沙妹肉姐",
    category: "防晒",
    payment: 75000,
    isSpecial: false,
    firstLive: "2026-05-03",
    commissionRate: 0.41,
    attribution: "#N/A",
  },
  {
    orderId: "DB202605011",
    owner: "林予乔",
    team: "B组",
    uid: "1253874928453015",
    influencer: "LAOCOU老奏",
    category: "防晒",
    payment: 49000,
    isSpecial: false,
    firstLive: "2026-04-08",
    commissionRate: null,
    attribution: "达播",
  },
  {
    orderId: "DB202605012",
    owner: "周岚",
    team: "B组",
    uid: "77352891999421",
    influencer: "小璐美妆",
    category: "气垫",
    payment: 155000,
    isSpecial: false,
    firstLive: "2026-05-13",
    commissionRate: 0.66,
    attribution: "达播",
  },
  {
    orderId: "DB202605013",
    owner: "秦若言",
    team: "B组",
    uid: "771282918812",
    influencer: "玲子护肤日记",
    category: "面霜",
    payment: 56000,
    isSpecial: false,
    firstLive: "2026-01-22",
    commissionRate: 0.31,
    attribution: "达播",
  },
  {
    orderId: "DB202605014",
    owner: "赵澄",
    team: "C组",
    uid: "88210919900",
    influencer: "张张变美课",
    category: "粉底液",
    payment: 82000,
    isSpecial: true,
    firstLive: "2026-05-16",
    commissionRate: 0.47,
    attribution: "达播",
  },
  {
    orderId: "DB202605015",
    owner: "唐可",
    team: "C组",
    uid: "61270212367",
    influencer: "豫东兵嫂（好物分享号）",
    category: "卸妆油",
    payment: 33000,
    isSpecial: false,
    firstLive: "2026-05-09",
    commissionRate: 0.62,
    attribution: "非达播",
  },
];

const currency = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 0,
});

const els = {
  metricFlow: document.getElementById("metricFlow"),
  settlementBody: document.getElementById("settlementBody"),
  transactionBody: document.getElementById("transactionBody"),
  configPanel: document.getElementById("configPanel"),
  teamCards: document.getElementById("teamCards"),
  leaderRanking: document.getElementById("leaderRanking"),
  middleGrid: document.getElementById("middleGrid"),
  searchInput: document.getElementById("searchInput"),
  monthSelect: document.getElementById("monthSelect"),
  teamSelect: document.getElementById("teamSelect"),
  settlementSortBtn: document.getElementById("settlementSortBtn"),
  settlementSortIcon: document.getElementById("settlementSortIcon"),
  pageHeading: document.getElementById("pageHeading"),
  drawer: document.getElementById("detailDrawer"),
  drawerTitle: document.getElementById("drawerTitle"),
  drawerBody: document.getElementById("drawerBody"),
  toast: document.getElementById("toast"),
};

function money(value) {
  return currency.format(Math.round(value || 0));
}

function pct(value) {
  return `${trimNumber((value || 0) * 100)}%`;
}

function trimNumber(value) {
  return Number(value.toFixed(2)).toString();
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toInputPercent(value) {
  return trimNumber((value || 0) * 100);
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function getMonthWindow(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(year, monthIndex - 1 - state.config.customer.rollingMonths, 1);
  const end = new Date(year, monthIndex, 0);
  return { start, end };
}

function isNewCustomer(firstLive) {
  const { start, end } = getMonthWindow(state.selectedMonth);
  const liveDate = parseDate(firstLive);
  return liveDate >= start && liveDate <= end;
}

function isYangjieRule(tx) {
  return tx.team === "A组" && tx.owner === "杨洁";
}

function getTier(commissionRate) {
  if (commissionRate == null || Number.isNaN(commissionRate)) return null;
  return state.config.tiers.find((tier) => {
    const aboveMin = commissionRate >= tier.min;
    const belowMax = tier.max == null ? true : commissionRate <= tier.max;
    return aboveMin && belowMax;
  }) || state.config.tiers[state.config.tiers.length - 1];
}

function getPerson(name) {
  return people.find((person) => person.name === name);
}

function getInitial(name) {
  return name.replace(/[A-Za-z0-9\-\s]/g, "").slice(0, 1) || name.slice(0, 1);
}

function getCalculations() {
  const initialRows = transactions.map((tx) => {
    const tier = getTier(tx.commissionRate);
    const reasons = [];
    const yangjieRule = isYangjieRule(tx);
    const dateBeforeCutoff = yangjieRule && parseDate(tx.firstLive) < parseDate(state.config.yangjie.cutoff);
    const newCustomer = isNewCustomer(tx.firstLive);
    const specialCoef = yangjieRule && !state.config.yangjie.useSpecialCoef
      ? 1
      : tx.isSpecial
        ? state.config.special.specialCoef
        : state.config.special.normalCoef;
    const customerCoef = newCustomer ? state.config.customer.newCoef : state.config.customer.oldCoef;

    if (tx.attribution === "#N/A") reasons.push("达人归属 = #N/A");
    if (tx.attribution === "非达播") reasons.push("达人归属 = 非达播");
    if (tx.commissionRate == null) reasons.push("合作佣金 = #N/A");
    if (dateBeforeCutoff) reasons.push("A组杨洁表：首播日期早于 2023-05-31");

    const computable = reasons.length === 0;
    const tierRate = tier ? tier.rate : 0;
    const baseAmount = computable ? tx.payment * specialCoef * customerCoef * tierRate : 0;

    return {
      ...tx,
      tier,
      tierRate,
      reasons,
      computable,
      specialCoef,
      customerCoef,
      newCustomer,
      yangjieRule,
      baseAmount,
      incentiveSales: 0,
      incentiveMultiplier: 1,
      finalAmount: 0,
      status: "排除",
    };
  });

  const salesByUid = initialRows.reduce((acc, row) => {
    const isIncentiveCategory = state.config.incentive.categories.includes(row.category);
    if (row.computable && isIncentiveCategory) {
      acc[row.uid] = (acc[row.uid] || 0) + row.payment;
    }
    return acc;
  }, {});

  return initialRows.map((row) => {
    const incentiveSales = salesByUid[row.uid] || 0;
    const isIncentiveCategory = state.config.incentive.categories.includes(row.category);
    const incentiveMultiplier = row.computable
      && isIncentiveCategory
      && incentiveSales > state.config.incentive.threshold
        ? state.config.incentive.multiplier
        : 1;
    const finalAmount = row.baseAmount * incentiveMultiplier;
    const status = row.computable
      ? row.tierRate === 0
        ? "佣金超档"
        : "已计算"
      : "排除";

    return {
      ...row,
      incentiveSales,
      incentiveMultiplier,
      finalAmount,
      status,
    };
  });
}

function getSettlement() {
  const rows = getCalculations();
  const rawByPerson = rows.reduce((acc, row) => {
    acc[row.owner] = (acc[row.owner] || 0) + row.finalAmount;
    return acc;
  }, {});
  const countByPerson = rows.reduce((acc, row) => {
    acc[row.owner] = (acc[row.owner] || 0) + 1;
    return acc;
  }, {});
  const teamBase = rows.reduce((acc, row) => {
    const person = getPerson(row.owner);
    if (person && person.role !== "middle") {
      acc[row.team] = (acc[row.team] || 0) + row.finalAmount;
    }
    return acc;
  }, {});

  const personRows = people
    .filter((person) => person.role !== "middle")
    .map((person) => {
      const rawAmount = rawByPerson[person.name] || 0;
      const orderCount = countByPerson[person.name] || 0;
      const isLeader = person.role === "leader";
      const finalAmount = isLeader
        ? (teamBase[person.team] || 0) * state.config.leaderShare * person.performance
        : rawAmount * person.performance + (person.arrears || 0);
      return {
        ...person,
        rawAmount,
        orderCount,
        teamBase: teamBase[person.team] || 0,
        finalAmount,
        logic: isLeader
          ? `团队原始提成 ${money(teamBase[person.team] || 0)} × ${pct(state.config.leaderShare)} × ${person.performance}`
          : `个人原始提成 × ${person.performance} + 补发 ${money(person.arrears || 0)}`,
      };
    });

  const middleRows = people
    .filter((person) => person.role === "middle")
    .map((person) => ({
      ...person,
      rawAmount: person.fixed || 0,
      finalAmount: person.fixed || 0,
      orderCount: 0,
      logic: "中台支持按月度合计金额直接发放",
    }));

  return { rows, personRows, middleRows, teamBase };
}

function matchesQuery(text) {
  if (!state.query) return true;
  return text.toLowerCase().includes(state.query.toLowerCase());
}

function getFilteredTransactions() {
  return getCalculations().filter((row) => {
    const pool = [
      row.orderId,
      row.owner,
      row.team,
      row.uid,
      row.influencer,
      row.category,
      row.status,
    ].join(" ");
    const byTeam = state.team === "all" || row.team === state.team;
    const byMode = state.filterMode === "invalid"
      ? !row.computable || row.tierRate === 0
      : state.filterMode === "incentive"
        ? row.incentiveMultiplier > 1
        : state.filterMode === "yangjie"
          ? row.yangjieRule
          : true;
    return matchesQuery(pool) && byTeam && byMode;
  });
}

function getFilteredPeople() {
  const { personRows } = getSettlement();
  return personRows.filter((person) => {
    const pool = [person.name, person.team, person.role, person.logic].join(" ");
    const byTeam = state.team === "all" || person.team === state.team;
    return matchesQuery(pool) && byTeam;
  });
}

function renderMetrics() {
  const { rows, personRows, middleRows } = getSettlement();
  const memberRows = personRows.filter((person) => person.role === "member");
  const leaderRows = personRows.filter((person) => person.role === "leader");
  const totalPayable = personRows.reduce((sum, item) => sum + item.finalAmount, 0);
  const middlePayable = middleRows.reduce((sum, item) => sum + item.finalAmount, 0);
  const yangjiePayable = personRows.find((person) => person.name === "杨洁")?.finalAmount || 0;
  const invalidCount = rows.filter((row) => !row.computable || row.tierRate === 0).length;
  const incentiveCount = rows.filter((row) => row.incentiveMultiplier > 1).length;

  const cards = [
    {
      id: "all",
      label: "最终应发提成",
      value: money(totalPayable),
      metaLeft: `交易 ${rows.length}`,
      metaRight: `人员 ${personRows.length}`,
      orange: true,
    },
    {
      id: "member",
      label: "普通成员结算",
      value: money(memberRows.reduce((sum, item) => sum + item.finalAmount, 0)),
      metaLeft: `成员 ${memberRows.length}`,
      metaRight: `绩效后`,
    },
    {
      id: "leader",
      label: "负责人团队分成",
      value: money(leaderRows.reduce((sum, item) => sum + item.finalAmount, 0)),
      metaLeft: `负责人 ${leaderRows.length}`,
      metaRight: `50% 基数`,
    },
    {
      id: "yangjie",
      label: "A组杨洁特殊表",
      value: money(yangjiePayable),
      metaLeft: `不打专场折扣`,
      metaRight: `独立规则`,
      badge: rows.filter((row) => row.yangjieRule).length,
    },
    {
      id: "invalid",
      label: "需复核记录",
      value: number.format(invalidCount),
      metaLeft: `排除/超档`,
      metaRight: `点击查看`,
      badge: invalidCount,
    },
    {
      id: "incentive",
      label: "气垫/素颜霜激励",
      value: number.format(incentiveCount),
      metaLeft: `UID过15万`,
      metaRight: `提成翻倍`,
      badge: incentiveCount,
    },
    {
      id: "middle",
      label: "中台独立结算",
      value: money(middlePayable),
      metaLeft: `内容支持`,
      metaRight: `直接发放`,
    },
  ];

  els.metricFlow.innerHTML = cards.map((card) => `
    <button class="metric-card ${state.filterMode === card.id ? "active" : ""}" data-metric="${card.id}">
      ${card.badge ? `<span class="metric-badge">${card.badge}</span>` : ""}
      <span class="label">${card.label}</span>
      <span class="value ${card.orange ? "orange" : ""}">${card.value}</span>
      <span class="meta"><span>${card.metaLeft}</span><span>${card.metaRight}</span></span>
    </button>
  `).join("");
}

function sortFinalAmountRows(rows) {
  const direction = state.settlementSort === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => (a.finalAmount - b.finalAmount) * direction);
}

function renderSettlementSortIcon() {
  if (!els.settlementSortIcon) return;
  els.settlementSortIcon.textContent = state.settlementSort === "asc" ? "↑" : "↓";
}

function renderSettlement() {
  const rows = sortFinalAmountRows(getFilteredPeople());
  renderSettlementSortIcon();
  if (state.aggregateMode === "team") {
    renderTeamSettlement(rows);
    return;
  }

  els.settlementBody.innerHTML = rows.length ? rows.map((person) => `
    <tr>
      <td>
        <div class="person-cell">
          <span class="person-avatar">${getInitial(person.name)}</span>
          <span class="person-title">
            <strong>${person.name}</strong>
            <span>${person.role === "leader" ? "团队负责人" : "普通成员"} · ${person.orderCount} 条交易</span>
          </span>
        </div>
      </td>
      <td><span class="tag ${person.team === "A组" ? "orange" : ""}">${person.team}</span></td>
      <td class="money">${money(person.rawAmount)}</td>
      <td>${person.role === "leader" ? `${pct(state.config.leaderShare)} × ${person.performance}` : person.performance}</td>
      <td>${person.role === "leader" ? "-" : money(person.arrears || 0)}</td>
      <td class="money orange-text">${money(person.finalAmount)}</td>
      <td class="muted">${person.logic}</td>
      <td><button class="action-link" data-person-detail="${person.name}">查看明细</button></td>
    </tr>
  `).join("") : `<tr><td colspan="8"><div class="empty-state">暂无匹配的结算记录</div></td></tr>`;
}

function renderTeamSettlement(rows) {
  const teams = sortFinalAmountRows(Array.from(new Set(rows.map((person) => person.team))).map((team) => {
    const members = rows.filter((person) => person.team === team);
    return {
      team,
      rawAmount: members.reduce((sum, item) => sum + item.rawAmount, 0),
      finalAmount: members.reduce((sum, item) => sum + item.finalAmount, 0),
      count: members.length,
      leaders: members.filter((person) => person.role === "leader").map((person) => person.name).join("、") || "-",
    };
  }));

  els.settlementBody.innerHTML = teams.length ? teams.map((team) => `
    <tr>
      <td>
        <div class="person-cell">
          <span class="person-avatar">${team.team.slice(0, 1)}</span>
          <span class="person-title">
            <strong>${team.team}</strong>
            <span>${team.count} 个结算对象</span>
          </span>
        </div>
      </td>
      <td><span class="tag">${team.leaders}</span></td>
      <td class="money">${money(team.rawAmount)}</td>
      <td>成员绩效 + 负责人分成</td>
      <td>-</td>
      <td class="money orange-text">${money(team.finalAmount)}</td>
      <td class="muted">团队聚合视图，保留个人与负责人两套结算口径。</td>
      <td><button class="action-link" data-team-detail="${team.team}">查看团队</button></td>
    </tr>
  `).join("") : `<tr><td colspan="8"><div class="empty-state">暂无匹配的团队记录</div></td></tr>`;
}

function renderTransactions() {
  const rows = getFilteredTransactions();
  els.transactionBody.innerHTML = rows.length ? rows.map((row) => {
    const statusClass = row.status === "已计算" ? "green" : row.status === "佣金超档" ? "orange" : "red";
    return `
      <tr>
        <td>
          <strong>${row.orderId}</strong>
          <div class="muted">${row.influencer}</div>
        </td>
        <td>${row.owner}<div class="muted">${row.team}</div></td>
        <td>${row.uid}</td>
        <td>${row.category}${row.yangjieRule ? `<div><span class="tag orange">杨洁表</span></div>` : ""}</td>
        <td class="money">${money(row.payment)}</td>
        <td>${row.commissionRate == null ? "#N/A" : pct(row.commissionRate)}</td>
        <td>
          <div class="coef-stack">
            <span class="coef-pill">专场 ${row.specialCoef}</span>
            <span class="coef-pill">${row.newCustomer ? "新客" : "老客"} ${row.customerCoef}</span>
            <span class="coef-pill">比例 ${pct(row.tierRate)}</span>
            <span class="coef-pill">激励 ×${row.incentiveMultiplier}</span>
          </div>
        </td>
        <td class="money orange-text">${money(row.finalAmount)}</td>
        <td><span class="tag ${statusClass}">${row.status}</span></td>
        <td><button class="action-link" data-order="${row.orderId}">查看计算</button></td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="10"><div class="empty-state">暂无匹配的交易记录</div></td></tr>`;
}

function renderConfigPanel() {
  const tab = state.configTab;
  if (tab === "tier") {
    els.configPanel.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>佣金区间</th>
              <th>最小佣金率</th>
              <th>最大佣金率</th>
              <th>商务提成比例</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            ${state.config.tiers.map((tier) => `
              <tr>
                <td><strong>${tier.label}</strong></td>
                <td><input class="rate-input" type="number" min="0" step="0.01" value="${toInputPercent(tier.min)}" data-edit="tier-min" data-tier="${tier.id}" /> %</td>
                <td><input class="rate-input" type="number" min="0" step="0.01" value="${tier.max == null ? "" : toInputPercent(tier.max)}" data-edit="tier-max" data-tier="${tier.id}" placeholder="无限制" /> %</td>
                <td><input class="rate-input" type="number" min="0" step="0.01" value="${toInputPercent(tier.rate)}" data-edit="tier-rate" data-tier="${tier.id}" /> %</td>
                <td class="muted">合作佣金越高，商务提成比例越低。</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  if (tab === "base") {
    els.configPanel.innerHTML = `
      <div class="setting-grid">
        <div class="setting-card">
          <h3>专场计算系数</h3>
          <div class="edit-field">
            <label>专场</label>
            <input type="number" min="0" step="0.01" value="${state.config.special.specialCoef}" data-edit="special-coef" />
          </div>
          <div class="edit-field">
            <label>非专场</label>
            <input type="number" min="0" step="0.01" value="${state.config.special.normalCoef}" data-edit="normal-coef" />
          </div>
        </div>
        <div class="setting-card">
          <h3>新老客系数</h3>
          <div class="edit-field">
            <label>滚动窗口（月）</label>
            <input type="number" min="0" step="1" value="${state.config.customer.rollingMonths}" data-edit="rolling-months" />
          </div>
          <div class="edit-field">
            <label>新客系数</label>
            <input type="number" min="0" step="0.01" value="${state.config.customer.newCoef}" data-edit="new-coef" />
          </div>
          <div class="edit-field">
            <label>老客系数</label>
            <input type="number" min="0" step="0.01" value="${state.config.customer.oldCoef}" data-edit="old-coef" />
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (tab === "incentive") {
    els.configPanel.innerHTML = `
      <div class="setting-grid">
        <div class="setting-card">
          <h3>气垫/素颜霜销售激励</h3>
          <div class="edit-field">
            <label>激励品类</label>
            <input type="text" value="${state.config.incentive.categories.join("、")}" data-edit="incentive-categories" />
          </div>
          <div class="edit-field">
            <label>销售额门槛</label>
            <input type="number" min="0" step="1000" value="${state.config.incentive.threshold}" data-edit="incentive-threshold" />
          </div>
          <div class="edit-field">
            <label>激励倍数</label>
            <input type="number" min="1" step="0.1" value="${state.config.incentive.multiplier}" data-edit="incentive-multiplier" />
          </div>
        </div>
        <div class="setting-card">
          <h3>当前命中 UID</h3>
          <div class="note-box">${renderIncentivePreview()}</div>
        </div>
      </div>
    `;
    return;
  }

  if (tab === "performance") {
    const editablePeople = people.filter((person) => person.role !== "middle");
    els.configPanel.innerHTML = `
      <div class="setting-grid">
        <div class="setting-card">
          <h3>负责人分成比例</h3>
          <div class="edit-field">
            <label>团队分成比例</label>
            <input type="number" min="0" max="100" step="0.1" value="${toInputPercent(state.config.leaderShare)}" data-edit="leader-share" /> %
          </div>
        </div>
        <div class="setting-card">
          <h3>绩效口径</h3>
        </div>
      </div>
      <div class="table-wrap" style="margin-top:16px">
        <table>
          <thead>
            <tr>
              <th>商务</th>
              <th>角色</th>
              <th>团队</th>
              <th>绩效系数</th>
              <th>上月补发</th>
            </tr>
          </thead>
          <tbody>
            ${editablePeople.map((person) => `
              <tr>
                <td><strong>${person.name}</strong></td>
                <td>${person.role === "leader" ? "团队负责人" : "普通成员"}</td>
                <td>${person.team}</td>
                <td><input type="number" min="0" step="0.01" value="${person.performance}" data-edit="person-performance" data-person="${person.id}" /></td>
                <td><input type="number" step="100" value="${person.arrears || 0}" data-edit="person-arrears" data-person="${person.id}" ${person.role === "leader" ? "disabled" : ""} /></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  if (tab === "custom") {
    const customCoefficients = state.config.customCoefficients;
    els.configPanel.innerHTML = `
      <div class="custom-config-head">
        <div>
          <h3>自定义系数</h3>
        </div>
        <button class="ghost-button" type="button" data-add-custom-coef>+ 新增系数</button>
      </div>
      <div class="table-wrap custom-coef-table">
        <table>
          <thead>
            <tr>
              <th>系数名称</th>
              <th>适用环节</th>
              <th>系数值</th>
              <th>状态</th>
              <th>说明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${customCoefficients.length ? customCoefficients.map((coef) => `
              <tr>
                <td><input class="custom-name-input" type="text" value="${escapeAttr(coef.name)}" data-edit="custom-name" data-coef="${coef.id}" /></td>
                <td>
                  <select data-edit="custom-scope" data-coef="${coef.id}">
                    <option value="交易层" ${coef.scope === "交易层" ? "selected" : ""}>交易层</option>
                    <option value="达人层" ${coef.scope === "达人层" ? "selected" : ""}>达人层</option>
                    <option value="个人结算" ${coef.scope === "个人结算" ? "selected" : ""}>个人结算</option>
                    <option value="团队结算" ${coef.scope === "团队结算" ? "selected" : ""}>团队结算</option>
                    <option value="中台结算" ${coef.scope === "中台结算" ? "selected" : ""}>中台结算</option>
                  </select>
                </td>
                <td><input type="number" min="0" step="0.01" value="${coef.value}" data-edit="custom-value" data-coef="${coef.id}" /></td>
                <td>
                  <label class="switch-field compact-switch">
                    <input type="checkbox" data-edit="custom-enabled" data-coef="${coef.id}" ${coef.enabled ? "checked" : ""} />
                    ${coef.enabled ? "启用" : "停用"}
                  </label>
                </td>
                <td><input class="custom-note-input" type="text" value="${escapeAttr(coef.note)}" data-edit="custom-note" data-coef="${coef.id}" /></td>
                <td><button class="action-link" type="button" data-delete-coef="${coef.id}">删除</button></td>
              </tr>
            `).join("") : `<tr><td colspan="6"><div class="empty-state">暂无自定义系数，点击“新增系数”开始配置。</div></td></tr>`}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  if (tab === "yangjie") {
    els.configPanel.innerHTML = `
      <div class="setting-grid">
        <div class="setting-card">
          <h3>A组杨洁结算表</h3>
          <div class="edit-field">
            <label>首播截止日</label>
            <input type="date" value="${state.config.yangjie.cutoff}" data-edit="yangjie-cutoff" />
          </div>
          <label class="switch-field" style="margin-top:16px">
            <input type="checkbox" data-edit="yangjie-special" ${state.config.yangjie.useSpecialCoef ? "checked" : ""} />
            A组杨洁表也使用专场 0.5 折扣
          </label>
        </div>
        <div class="setting-card">
          <h3>规则差异</h3>
          <div class="note-box">
            当前杨洁表命中 ${getCalculations().filter((row) => row.yangjieRule).length} 条订单，
            被截止日排除 ${getCalculations().filter((row) => row.yangjieRule && !row.computable).length} 条。
          </div>
        </div>
      </div>
    `;
  }
}

function renderIncentivePreview() {
  const rows = getCalculations().filter((row) => row.incentiveMultiplier > 1);
  if (!rows.length) return "当前没有 UID 达到激励门槛。";
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.uid]) acc[row.uid] = { uid: row.uid, sales: row.incentiveSales, orders: 0 };
    acc[row.uid].orders += 1;
    return acc;
  }, {});
  return Object.values(grouped)
    .map((item) => `${item.uid}：${money(item.sales)}，${item.orders} 条订单翻倍`)
    .join("<br>");
}

function renderTeams() {
  const { personRows, teamBase } = getSettlement();
  const leaders = personRows.filter((person) => person.role === "leader");
  const maxFinal = Math.max(...leaders.map((leader) => leader.finalAmount), 1);

  els.teamCards.innerHTML = leaders.map((leader) => {
    const memberCount = personRows.filter((person) => person.team === leader.team && person.role === "member").length;
    const width = Math.max(8, (leader.finalAmount / maxFinal) * 100);
    return `
      <div class="team-card">
        <h3>${leader.team} · ${leader.name}</h3>
        <div class="team-stat">
          <div class="stat-box">
            <span>团队基数</span>
            <strong>${money(teamBase[leader.team] || 0)}</strong>
          </div>
          <div class="stat-box">
            <span>负责人应发</span>
            <strong>${money(leader.finalAmount)}</strong>
          </div>
          <div class="stat-box">
            <span>绩效系数</span>
            <strong>${leader.performance}</strong>
          </div>
          <div class="stat-box">
            <span>团队成员</span>
            <strong>${memberCount}</strong>
          </div>
        </div>
        <div class="bar"><span style="width:${width}%"></span></div>
      </div>
    `;
  }).join("");

  els.leaderRanking.innerHTML = leaders
    .sort((a, b) => b.finalAmount - a.finalAmount)
    .map((leader, index) => `
      <div class="rank-row">
        <span>${index + 1}. ${leader.name}</span>
        <strong>${money(leader.finalAmount)}</strong>
      </div>
    `).join("");
}

function renderMiddle() {
  const middleRows = people.filter((person) => person.role === "middle");
  els.middleGrid.innerHTML = middleRows.map((person) => `
    <div class="middle-card">
      <h3>${person.name}</h3>
      <span class="tag green">内容支持独立结算</span>
      <span class="amount">${money(person.fixed || 0)}</span>
      <div class="edit-field">
        <label>月度合计</label>
        <input type="number" min="0" step="100" value="${person.fixed || 0}" data-edit="middle-fixed" data-person="${person.id}" />
      </div>
    </div>
  `).join("");
}

function addCustomCoefficient() {
  const nextIndex = state.config.customCoefficients.length + 1;
  state.config.customCoefficients.push({
    id: `custom-${Date.now()}`,
    name: `新系数 ${nextIndex}`,
    scope: "交易层",
    value: 1,
    enabled: true,
    note: "",
  });
  setPage("config");
  setConfigTab("custom");
  showToast("已新增系数，可直接编辑");
}

function deleteCustomCoefficient(id) {
  state.config.customCoefficients = state.config.customCoefficients.filter((coef) => coef.id !== id);
  setConfigTab("custom");
  showToast("已删除自定义系数");
}

function renderAll() {
  renderMetrics();
  renderSettlement();
  renderTransactions();
  renderConfigPanel();
  renderTeams();
  renderMiddle();
}

function setPage(page) {
  state.activePage = page;
  document.querySelectorAll("[data-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });
  const commissionPages = ["aggregate", "transactions", "config", "team", "middle"];
  document.querySelectorAll("[data-commission-entry]").forEach((item) => {
    item.classList.toggle("active", commissionPages.includes(page));
  });
  document.querySelectorAll(".page-view").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.pagePanel === page);
  });
  if (els.pageHeading) els.pageHeading.textContent = "达播提成";
}

function setConfigTab(tab) {
  state.configTab = tab;
  document.querySelectorAll(".config-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.configTab === tab);
  });
  renderConfigPanel();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function openDrawer(orderId) {
  const row = getCalculations().find((item) => item.orderId === orderId);
  if (!row) return;
  els.drawerTitle.textContent = row.orderId;
  els.drawerBody.innerHTML = `
    <div class="detail-line"><span>商务归属</span><strong>${row.owner} · ${row.team}</strong></div>
    <div class="detail-line"><span>达人 UID</span><strong>${row.uid}</strong></div>
    <div class="detail-line"><span>产品品类</span><strong>${row.category}</strong></div>
    <div class="detail-line"><span>支付金额</span><strong>${money(row.payment)}</strong></div>
    <div class="detail-line"><span>合作佣金</span><strong>${row.commissionRate == null ? "#N/A" : pct(row.commissionRate)}</strong></div>
    <div class="detail-line"><span>专场计算系数</span><strong>${row.specialCoef}</strong></div>
    <div class="detail-line"><span>新老客系数</span><strong>${row.newCustomer ? "新客 " : "老客 "}${row.customerCoef}</strong></div>
    <div class="detail-line"><span>提成比例</span><strong>${pct(row.tierRate)}</strong></div>
    <div class="detail-line"><span>激励判断</span><strong>${money(row.incentiveSales)} / 门槛 ${money(state.config.incentive.threshold)}</strong></div>
    <div class="detail-line"><span>激励倍数</span><strong>×${row.incentiveMultiplier}</strong></div>
    <div class="detail-line"><span>最终提成</span><strong class="orange-text">${money(row.finalAmount)}</strong></div>
    <div class="detail-formula">
      ${row.computable
        ? `公式：${money(row.payment)} × ${row.specialCoef} × ${row.customerCoef} × ${pct(row.tierRate)} × ${row.incentiveMultiplier} = <strong>${money(row.finalAmount)}</strong>`
        : `该订单不计算：<strong>${row.reasons.join("、")}</strong>`}
      ${row.yangjieRule ? `<br>A组杨洁表：${state.config.yangjie.useSpecialCoef ? "当前启用专场折扣" : "当前不使用专场折扣"}，首播截止日 ${state.config.yangjie.cutoff}。` : ""}
    </div>
  `;
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function updateConfig(target) {
  const edit = target.dataset.edit;
  const value = target.type === "checkbox" ? target.checked : target.value;
  const asNumber = Number(value);
  const tier = target.dataset.tier
    ? state.config.tiers.find((item) => item.id === target.dataset.tier)
    : null;
  const person = target.dataset.person
    ? people.find((item) => item.id === target.dataset.person)
    : null;
  const customCoef = target.dataset.coef
    ? state.config.customCoefficients.find((item) => item.id === target.dataset.coef)
    : null;

  if (edit === "tier-min" && tier) tier.min = asNumber / 100;
  if (edit === "tier-max" && tier) tier.max = value === "" ? null : asNumber / 100;
  if (edit === "tier-rate" && tier) tier.rate = asNumber / 100;
  if (edit === "special-coef") state.config.special.specialCoef = asNumber;
  if (edit === "normal-coef") state.config.special.normalCoef = asNumber;
  if (edit === "rolling-months") state.config.customer.rollingMonths = Math.max(0, Math.round(asNumber));
  if (edit === "new-coef") state.config.customer.newCoef = asNumber;
  if (edit === "old-coef") state.config.customer.oldCoef = asNumber;
  if (edit === "incentive-categories") {
    state.config.incentive.categories = value
      .split(/[、,，\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (edit === "incentive-threshold") state.config.incentive.threshold = asNumber;
  if (edit === "incentive-multiplier") state.config.incentive.multiplier = asNumber;
  if (edit === "leader-share") state.config.leaderShare = asNumber / 100;
  if (edit === "person-performance" && person) person.performance = asNumber;
  if (edit === "person-arrears" && person) person.arrears = asNumber;
  if (edit === "yangjie-cutoff") state.config.yangjie.cutoff = value;
  if (edit === "yangjie-special") state.config.yangjie.useSpecialCoef = value;
  if (edit === "middle-fixed" && person) person.fixed = asNumber;
  if (edit === "custom-name" && customCoef) customCoef.name = value.trim() || "未命名系数";
  if (edit === "custom-scope" && customCoef) customCoef.scope = value;
  if (edit === "custom-value" && customCoef) customCoef.value = asNumber;
  if (edit === "custom-enabled" && customCoef) customCoef.enabled = value;
  if (edit === "custom-note" && customCoef) customCoef.note = value.trim();

  renderAll();
  setConfigTab(state.configTab);
  setPage(state.activePage);
  showToast("配置已更新，结算结果已重算");
}

document.addEventListener("click", (event) => {
  const commissionEntry = event.target.closest("[data-commission-entry]");
  if (commissionEntry) {
    setPage("aggregate");
    return;
  }

  const placeholderNav = event.target.closest("[data-placeholder-nav]");
  if (placeholderNav) {
    showToast("该模块已保留在左侧导航");
    return;
  }

  const nav = event.target.closest("[data-page]");
  if (nav) {
    setPage(nav.dataset.page);
    return;
  }

  const aggregateButton = event.target.closest("[data-aggregate-mode]");
  if (aggregateButton) {
    state.aggregateMode = aggregateButton.dataset.aggregateMode;
    document.querySelectorAll("[data-aggregate-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.aggregateMode === state.aggregateMode);
    });
    renderSettlement();
    return;
  }

  const configButton = event.target.closest("[data-config-tab]");
  if (configButton) {
    setConfigTab(configButton.dataset.configTab);
    return;
  }

  const addCustomCoef = event.target.closest("[data-add-custom-coef]");
  if (addCustomCoef) {
    addCustomCoefficient();
    return;
  }

  const deleteCustomCoef = event.target.closest("[data-delete-coef]");
  if (deleteCustomCoef) {
    deleteCustomCoefficient(deleteCustomCoef.dataset.deleteCoef);
    return;
  }

  const metric = event.target.closest("[data-metric]");
  if (metric) {
    const metricId = metric.dataset.metric;
    if (metricId === "middle") {
      setPage("middle");
      return;
    }
    if (["invalid", "incentive", "yangjie"].includes(metricId)) {
      state.filterMode = state.filterMode === metricId ? "all" : metricId;
      setPage("transactions");
      renderAll();
      return;
    }
    state.filterMode = "all";
    setPage("aggregate");
    renderAll();
    return;
  }

  const order = event.target.closest("[data-order]");
  if (order) {
    openDrawer(order.dataset.order);
    return;
  }

  const personDetail = event.target.closest("[data-person-detail]");
  if (personDetail) {
    state.query = personDetail.dataset.personDetail;
    els.searchInput.value = state.query;
    state.filterMode = "all";
    setPage("transactions");
    renderAll();
    return;
  }

  const teamDetail = event.target.closest("[data-team-detail]");
  if (teamDetail) {
    state.team = teamDetail.dataset.teamDetail;
    els.teamSelect.value = state.team;
    setPage("transactions");
    renderAll();
    return;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.edit) {
    updateConfig(target);
    return;
  }

  if (target.id === "monthSelect") {
    state.selectedMonth = target.value;
    renderAll();
    showToast("结算月已切换");
  }

  if (target.id === "teamSelect") {
    state.team = target.value;
    renderAll();
  }
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderSettlement();
  renderTransactions();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  state.query = "";
  state.team = "all";
  state.filterMode = "all";
  els.searchInput.value = "";
  els.teamSelect.value = "all";
  renderAll();
  showToast("筛选条件已清空");
});

document.getElementById("moreFilterBtn").addEventListener("click", () => {
  showToast("可继续扩展平台、是否专场、佣金档位等筛选");
});

document.getElementById("onlyInvalidBtn").addEventListener("click", () => {
  state.filterMode = state.filterMode === "invalid" ? "all" : "invalid";
  renderAll();
});

els.settlementSortBtn.addEventListener("click", () => {
  state.settlementSort = state.settlementSort === "desc" ? "asc" : "desc";
  renderSettlement();
  showToast(state.settlementSort === "desc" ? "最终应发已按降序排序" : "最终应发已按升序排序");
});

document.getElementById("importBtn").addEventListener("click", () => {
  showToast("批量导入入口已触发");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  showToast("结算结果导出入口已触发");
});

document.getElementById("saveConfigBtn").addEventListener("click", () => {
  showToast("提成系数配置已保存");
});

document.getElementById("closeDrawer").addEventListener("click", closeDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawer();
});

renderAll();
setPage("aggregate");
