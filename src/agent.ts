// Local LLM operator console via WebLLM (WebGPU). Opt-in; nothing loads until boot.
// Grounding strategy: strict answer-from-notes rules plus per-question retrieval
// of relevant knowledge chunks (see knowledge.ts) to curb hallucination.
import { buildSystemPrompt } from './knowledge';

type LogKind = 'dim' | 'user' | 'agent' | 'sys' | 'err';

export function setupAgentConsole() {
  const log = document.getElementById('console-log')!;
  const form = document.getElementById('console-form') as HTMLFormElement;
  const input = document.getElementById('console-input') as HTMLInputElement;
  const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
  const bootBtn = document.getElementById('boot-btn') as HTMLButtonElement;
  const status = document.getElementById('agent-status')!;
  const modelSelect = document.getElementById('model-select') as HTMLSelectElement;

  const savedModel = localStorage.getItem('agent-model');
  if (savedModel && [...modelSelect.options].some((o) => o.value === savedModel)) {
    modelSelect.value = savedModel;
  }

  const addLine = (text: string, kind: LogKind): HTMLElement => {
    const div = document.createElement('div');
    div.className = `log-line log-${kind}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  };

  let engine: import('@mlc-ai/web-llm').MLCEngine | null = null;
  const history: { role: 'user' | 'assistant'; content: string }[] = [];

  bootBtn.addEventListener('click', async () => {
    const MODEL = modelSelect.value;
    localStorage.setItem('agent-model', MODEL);
    bootBtn.disabled = true;
    modelSelect.disabled = true;
    status.textContent = 'BOOTING';

    if (!('gpu' in navigator)) {
      addLine('ERROR: WebGPU not available in this browser. The agent needs a recent Chrome, Edge, Safari, or Firefox with GPU access.', 'err');
      status.textContent = 'UNSUPPORTED';
      status.classList.add('tag-err');
      return;
    }

    addLine('## boot sequence initiated', 'sys');
    addLine(`## loading ${MODEL} — first run downloads the model, then cached`, 'sys');
    const progress = addLine('## …', 'dim');

    try {
      const webllm = await import('@mlc-ai/web-llm');
      engine = await webllm.CreateMLCEngine(MODEL, {
        initProgressCallback: (p) => {
          progress.textContent = `## ${p.text}`;
          log.scrollTop = log.scrollHeight;
        },
      });
    } catch (err) {
      addLine(`ERROR: model failed to load — ${err instanceof Error ? err.message : String(err)}`, 'err');
      status.textContent = 'FAULT';
      status.classList.add('tag-err');
      bootBtn.disabled = false;
      modelSelect.disabled = false;
      return;
    }

    addLine('## agent online. ask about Ron’s projects, gpCAM, Lightfall…', 'sys');
    status.textContent = 'ONLINE';
    status.classList.add('tag-live');
    bootBtn.style.display = 'none';
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || !engine) return;
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    addLine(`> ${q}`, 'user');
    history.push({ role: 'user', content: q });
    const out = addLine('…', 'agent');

    try {
      const chunks = await engine.chat.completions.create({
        messages: [{ role: 'system', content: buildSystemPrompt(q) }, ...history.slice(-6)],
        stream: true,
        temperature: 0,
        max_tokens: 400,
      });
      let reply = '';
      for await (const chunk of chunks) {
        reply += chunk.choices[0]?.delta?.content ?? '';
        out.textContent = reply;
        log.scrollTop = log.scrollHeight;
      }
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      out.textContent = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
      out.className = 'log-line log-err';
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });
}
