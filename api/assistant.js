const assistantData = require("../assistant-data.js");

function normalizeText(value) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreDocument(questionText, document) {
  const haystack = normalizeText(
    [document.title, document.topic, document.content, ...(document.keywords ?? [])].join(" ")
  );
  const tokens = questionText.split(" ").filter(Boolean);
  let score = document.priorityBoost ?? 0;

  tokens.forEach((token) => {
    if (token.length < 3) {
      return;
    }
    if (haystack.includes(token)) {
      score += token.length > 6 ? 4 : 2;
    }
  });

  return score;
}

function buildStepDocuments(context = {}) {
  const relatedMessages = Array.isArray(context.relatedMessages) ? context.relatedMessages : [];
  const stepAlerts = Array.isArray(context.stepAlerts) ? context.stepAlerts : [];
  const stepDocuments = relatedMessages.map((message) => ({
    id: `context-${message.id ?? message.title ?? "context"}`,
    title: message.title ?? "Contexto del recorrido",
    topic: message.category ?? "Contexto",
    keywords: [
      message.title,
      message.subtitle,
      message.category,
      message.observation,
      message.takeaway,
    ].filter(Boolean),
    content: [message.observation, message.takeaway, message.source?.quote].filter(Boolean).join(" "),
    source: message.source?.document ?? context.circuitTitle ?? "Recorrido",
    section: message.source?.section ?? "Contexto",
    priorityBoost: 3,
  }));

  const routeDocument = {
    id: `step-${context.stepId ?? "current"}`,
    title: context.stepTitle ?? "Tramo actual",
    topic: "Tramo actual",
    keywords: [
      context.stepTitle,
      context.stepPrompt,
      context.stepCueNear,
      context.stepCueFar,
      context.circuitTitle,
      "aca",
      "doblar",
      "derecha",
      "izquierda",
      "cruce",
      "contramano",
    ].filter(Boolean),
    content: [
      context.stepDescription,
      context.stepPrompt,
      context.stepCueNear,
      context.stepCueFar,
    ]
      .filter(Boolean)
      .join(" "),
    source: context.circuitTitle ?? "Recorrido actual",
    section: "Recorrido actual",
    priorityBoost: 4,
  };

  const alertDocuments = stepAlerts.map((alert, index) => ({
    id: `alert-${context.stepId ?? "current"}-${index}`,
    title: alert.title ?? "Alerta",
    topic: "Alerta de maniobra",
    keywords: [alert.type, alert.title, alert.body, "maniobra", "giro", "cruce"].filter(Boolean),
    content: alert.body ?? "",
    source: context.circuitTitle ?? "Recorrido actual",
    section: "Alertas del hito",
    priorityBoost: 2,
  }));

  const activeRuleDocument = context.activeRule
    ? [
        {
          id: `rule-${context.activeRule.id ?? "active"}`,
          title: context.activeRule.title ?? "Regla contextual",
          topic: context.activeRule.label ?? "Contexto",
          keywords: [
            context.activeRule.title,
            context.activeRule.label,
            context.activeRule.text,
          ].filter(Boolean),
          content: context.activeRule.text ?? "",
          source: context.circuitTitle ?? "Recorrido actual",
          section: "Contexto del mapa",
          priorityBoost: 3,
        },
      ]
    : [];

  return [routeDocument, ...alertDocuments, ...stepDocuments, ...activeRuleDocument];
}

function selectKnowledge(question, context) {
  const normalizedQuestion = normalizeText(question);
  const documents = [...assistantData.knowledgeBase, ...buildStepDocuments(context)];

  return documents
    .map((document) => ({
      document,
      score: scoreDocument(normalizedQuestion, document),
    }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6)
    .map((match) => match.document);
}

function buildSystemPrompt(question, context, selectedDocs) {
  const contextBlock = [
    `Circuito: ${context.circuitTitle ?? "No informado"}`,
    `Tramo: ${context.stepTitle ?? "No informado"}`,
    `Instruccion actual: ${context.stepPrompt ?? "No informada"}`,
    `Modo: ${context.mode ?? "study"}`,
    `Pregunta del usuario: ${question}`,
  ].join("\n");

  const sourcesBlock = selectedDocs
    .map(
      (doc, index) =>
        `[Fuente ${index + 1}] ${doc.title}\nTema: ${doc.topic}\nOrigen: ${doc.source} · ${doc.section}\nContenido: ${doc.content}`
    )
    .join("\n\n");

  return `${assistantData.systemPrompt}

Contexto actual:
${contextBlock}

Fuentes disponibles:
${sourcesBlock}

Instrucciones finales:
- Responde solo usando las fuentes disponibles arriba.
- Si no aparece una medida exacta o regla exacta en las fuentes, decilo claramente y no inventes.
- Si la pregunta depende del lugar actual, podes apoyarte en el contexto del tramo.
- Si la pregunta es general, no fuerces el contexto del tramo.
- No cites leyes ni numeros que no esten en las fuentes.
- Termina con una indicacion util o una aclaracion prudente.`;
}

module.exports = async function assistantHandler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: "Anthropic API key missing",
      message: "Falta configurar ANTHROPIC_API_KEY en el entorno del servidor.",
    });
  }

  try {
    const { question, context = {}, history = [] } = req.body ?? {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const selectedDocs = selectKnowledge(question, context);
    const system = buildSystemPrompt(question, context, selectedDocs);
    const trimmedHistory = Array.isArray(history)
      ? history
          .filter((message) => message?.role === "user" || message?.role === "assistant")
          .slice(-8)
      : [];

    const anthropicPayload = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system,
      messages: [
        ...trimmedHistory.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        { role: "user", content: question },
      ],
    };

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicPayload),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return res.status(anthropicResponse.status).json({
        error: "Anthropic API Error",
        details: data,
      });
    }

    const reply = data.content?.[0]?.text?.trim() || "";
    return res.status(200).json({
      answer: reply,
      sources: selectedDocs.map((doc) => `${doc.source} · ${doc.section}`),
      model: anthropicPayload.model,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
