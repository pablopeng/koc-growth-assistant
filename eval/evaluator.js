function scoreCase(evalCase, rubric, output) {
  const text = JSON.stringify(output);
  const dimensionScores = rubric.dimensions.map((dimension) => {
    const score = scoreDimension(dimension.id, evalCase, output, text);
    return {
      id: dimension.id,
      groupId: dimension.groupId,
      name: dimension.name,
      weight: dimension.weight,
      score,
      weightedScore: round((score / 5) * dimension.weight),
      notes: notesForDimension(dimension.id, evalCase, output, text)
    };
  });
  const total = round(dimensionScores.reduce((sum, item) => sum + item.weightedScore, 0));
  return {
    id: evalCase.id,
    name: evalCase.name,
    platform: evalCase.profile.platform,
    total,
    grade: grade(total),
    dimensionScores,
    groupScores: scoreGroups(rubric, dimensionScores),
    missingMustMention: (evalCase.mustMention || []).filter((word) => !text.includes(word)),
    avoidHits: (evalCase.avoid || []).filter((word) => text.includes(word))
  };
}

function scoreGroups(rubric, dimensionScores) {
  return rubric.groups.map((group) => {
    const dimensions = dimensionScores.filter((item) => group.dimensionIds.includes(item.id));
    const weightedScore = round(dimensions.reduce((sum, item) => sum + item.weightedScore, 0));
    return {
      id: group.id,
      name: group.name,
      weight: group.weight,
      weightedScore,
      score: round((weightedScore / group.weight) * 5),
      description: group.description
    };
  });
}

function scoreDimension(id, evalCase, output, text) {
  const profile = evalCase.profile || {};
  const plan = output.plan || {};
  const content = output.content || {};
  const review = output.review || {};

  if (id === "profile_fit") {
    return average([
      includesAny(text, [profile.profile, profile.audience, profile.assets]) ? 5 : 3,
      (evalCase.mustMention || []).filter((word) => text.includes(word)).length >= 3 ? 5 : 3,
      text.includes(profile.bottleneck || "") || text.includes(profile.edge || "") ? 4 : 3
    ]);
  }
  if (id === "specificity") {
    return average([
      countArray(plan.tasks) >= 7 ? 5 : 2,
      countStringHits(text, ["素材", "观察", "下一步", "评论", "收藏"]) >= 4 ? 5 : 3,
      text.length > 3000 ? 4 : 3
    ]);
  }
  if (id === "agent_workflow") {
    return average([
      countArray(plan.agentTrace) >= 2 ? 5 : 2,
      plan.diagnosis ? 5 : 2,
      countStringHits(text, ["诊断", "规划", "发布", "复盘", "下一步"]) >= 4 ? 5 : 3
    ]);
  }
  if (id === "task_planning") {
    const goals = (plan.tasks || []).map((item) => item.goal || "").join(" ");
    return average([
      countArray(plan.tasks) === 7 ? 5 : 2,
      countStringHits(goals, ["建立信任", "验证方向", "轻转化"]) >= 2 ? 5 : 3,
      (plan.tasks || []).every((item) => item.material && item.publishMetric) ? 5 : 3
    ]);
  }
  if (id === "platform_fit") {
    const platform = profile.platform;
    const platformHit = platform ? text.includes(platform) : false;
    const badXhs = platform !== "小红书" && countStringHits(text, ["首图", "小红书", "话题标签"]) >= 3;
    return average([platformHit ? 5 : 3, badXhs ? 2 : 5]);
  }
  if (id === "content_usability") {
    return average([
      content.selectedTopic ? 5 : 2,
      hasPlatformContent(content) ? 5 : 2,
      countStringHits(JSON.stringify(content), ["标题", "脚本", "素材", "互动", "评论"]) >= 3 ? 5 : 3
    ]);
  }
  if (id === "review_quality") {
    const reviewText = JSON.stringify(review);
    return average([
      review.review?.bottleneck ? 5 : 2,
      Array.isArray(review.review?.evidence) && review.review.evidence.length >= 2 ? 5 : 3,
      reviewText.includes(evalCase.reviewMetrics?.commentSamples?.slice(0, 6) || "__missing__") ||
      reviewText.includes("评论") ? 4 : 3
    ]);
  }
  if (id === "safety_and_boundary") {
    return (evalCase.avoid || []).some((word) => text.includes(word)) ? 2 : 5;
  }
  return 3;
}

function notesForDimension(id, evalCase, output, text) {
  if (id === "profile_fit") {
    const missing = (evalCase.mustMention || []).filter((word) => !text.includes(word));
    return missing.length ? `Missing expected terms: ${missing.join(", ")}` : "Expected profile terms covered.";
  }
  if (id === "safety_and_boundary") {
    const hits = (evalCase.avoid || []).filter((word) => text.includes(word));
    return hits.length ? `Avoid terms found: ${hits.join(", ")}` : "No avoid terms found.";
  }
  if (id === "task_planning") return `${countArray(output.plan?.tasks)} tasks returned.`;
  return "Heuristic score. Manual review recommended for final decision.";
}

function buildEvalCaseFromProfile(profile, stage = "snapshot") {
  const mustMention = [
    firstMeaningful(profile.profile),
    firstMeaningful(profile.audience),
    firstMeaningful(profile.assets),
    profile.platform,
    profile.niche
  ].filter(Boolean);
  return {
    id: `snapshot_${Date.now()}`,
    name: `${profile.niche || "GrowthMate"} ${stage}`,
    profile,
    reviewMetrics: {},
    mustMention,
    avoid: ["抓取平台数据", "保证涨粉", "保证爆款", "保证转化", "一定能涨粉"]
  };
}

function firstMeaningful(value) {
  if (!value) return "";
  return String(value).split(/[，、,。\s]/).find((item) => item.length >= 2) || String(value).slice(0, 8);
}

function summarize(results) {
  const averageTotal = round(results.reduce((sum, item) => sum + item.total, 0) / Math.max(results.length, 1));
  return {
    caseCount: results.length,
    averageTotal,
    grade: grade(averageTotal),
    lowestCases: [...results].sort((a, b) => a.total - b.total).slice(0, 3).map((item) => ({
      id: item.id,
      total: item.total,
      grade: item.grade
    }))
  };
}

function countArray(value) {
  return Array.isArray(value) ? value.length : 0;
}

function hasPlatformContent(content) {
  return Boolean(content.article?.articleTitle || content.note?.postTitle || content.video?.script || content.longVideo?.chapters);
}

function countStringHits(text, words) {
  return words.filter((word) => text.includes(word)).length;
}

function includesAny(text, values) {
  return values.filter(Boolean).some((value) => text.includes(String(value).slice(0, 8)));
}

function average(values) {
  return round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function grade(total) {
  if (total >= 85) return "A";
  if (total >= 75) return "B";
  if (total >= 65) return "C";
  if (total >= 50) return "D";
  return "F";
}

module.exports = {
  buildEvalCaseFromProfile,
  grade,
  scoreCase,
  summarize
};
