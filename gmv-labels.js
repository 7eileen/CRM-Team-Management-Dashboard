(() => {
  const metricRules = [
    [/CRM销售管理看板/g, "CRM管理看板"],
    [/SABC Sales/g, "SABC GMV"],
    [/Personal Sales/g, "个人GMV"],
    [/Product Sales/g, "Product GMV"],
    [/Team Sales/g, "Team GMV"],
    [/Sales Target/g, "GMV Target"],
    [/Sales Trend/g, "GMV Trend"],
    [/\bGSV\b/g, "GMV"],
    [/成交金额/g, "GMV"],
    [/成交额/g, "GMV"],
    [/销售金额/g, "GMV"],
    [/销售数据/g, "GMV数据"],
    [/销售业绩/g, "GMV业绩"],
    [/销售汇总/g, "GMV汇总"],
    [/销售明细/g, "GMV明细"],
    [/销售概览/g, "GMV概览"],
    [/销售排行榜/g, "GMV排行榜"],
    [/销售排行/g, "GMV排行"],
    [/销售排名/g, "GMV排名"],
    [/销售趋势/g, "GMV趋势"],
    [/销售目标/g, "GMV目标"],
    [/销售指标/g, "GMV指标"],
    [/销售贡献/g, "GMV贡献"],
    [/销售完成率/g, "GMV完成率"],
    [/销售进度/g, "GMV进度"],
    [/销售结构/g, "GMV结构"],
    [/销售占比/g, "GMV占比"],
    [/销售榜/g, "GMV榜"],
    [/总销售/g, "总GMV"],
    [/本月销售/g, "本月GMV"],
    [/当月销售/g, "当月GMV"],
    [/上月销售/g, "上月GMV"],
    [/今日销售/g, "今日GMV"],
    [/年度销售/g, "年度GMV"],
    [/分品销售/g, "分品GMV"],
    [/个人销售/g, "个人GMV"],
    [/团队销售/g, "团队GMV"],
    [/分团队销售/g, "分团队GMV"],
    [/分达人类型销售/g, "分达人类型GMV"],
    [/品类销售/g, "品类GMV"],
    [/达人销售/g, "达人GMV"],
    [/商务销售/g, "商务GMV"],
    [/销售额/g, "GMV"],
    [/GMV金额/g, "GMV"],
    [/GMVGMV/g, "GMV"],
    [/GMV GMV/g, "GMV"]
  ];

  const attributes = ["title", "aria-label", "placeholder"];

  function normalize(value) {
    return metricRules.reduce(
      (result, [pattern, replacement]) => result.replace(pattern, replacement),
      value
    );
  }

  function normalizeMetricLabels(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      if (node.parentElement?.closest("script, style, noscript")) return;
      const normalized = normalize(node.nodeValue);
      if (normalized !== node.nodeValue) node.nodeValue = normalized;
    });

    const elements = root.matches?.("[title], [aria-label], [placeholder]")
      ? [root, ...root.querySelectorAll("[title], [aria-label], [placeholder]")]
      : root.querySelectorAll?.("[title], [aria-label], [placeholder]") || [];

    elements.forEach((element) => {
      attributes.forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (!value) return;
        const normalized = normalize(value);
        if (normalized !== value) element.setAttribute(attribute, normalized);
      });
    });
  }

  let queued = false;
  function queueNormalization() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      normalizeMetricLabels();
    });
  }

  normalizeMetricLabels();
  new MutationObserver(queueNormalization).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();
