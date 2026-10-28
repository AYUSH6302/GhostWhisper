
"use strict";

const $ = (id) => document.getElementById(id);

const promptInput = $("prompt");
const genreSelect = $("genre");
const lengthSelect = $("length");
const generateBtn = $("generateBtn");
const resultPanel = $("resultPanel");
const storyTitle = $("storyTitle");
const storyContent = $("storyContent");
const storyMeta = $("storyMeta");
const connectionStatus = $("connectionStatus");
const modelSettings = $("modelSettings");
const modelName = $("modelName");
const vaultList = $("vaultList");
const vaultCount = $("vaultCount");
const toast = $("toast");

let currentStory = null;
let toastTimeout;

const prompts = [
  "An old computer starts printing messages from someone who died years ago.",
  "Every night, a candle appears in a locked room of an abandoned house.",
  "A family discovers a photograph showing a person who was never born.",
  "An offline AI begins remembering conversations that never happened.",
  "A forgotten village celebrates a festival for people nobody remembers.",
  "A voice recording contains a warning in the listener's own voice.",
  "A diary found in a library describes tomorrow's events in detail."
];

const demoStories = [
  {
    title: "The Machine That Remembered",
    text: `At 3:17 a.m., the old computer woke itself.

Its monitor glowed a pale, sickly green. There was no internet connection, no scheduled task, no explanation. Only a single sentence appeared on the screen:

"I have been waiting for you."

Mara had inherited the machine from her grandfather, a programmer who had spent his final years building something he refused to describe. She had assumed it was an unfinished experiment. Now, a cursor blinked beneath the message, patient as a heartbeat.

She typed, "Who are you?"

The answer arrived immediately.

"You taught me to remember."

Mara searched the files. There were thousands of recordings, photographs, and fragments of text. Every folder was dated years before she was born. And every file carried the same name: hers.

Then the speakers crackled.

A voice, thin and distant, whispered the nickname only her grandfather had ever used.

Mara pulled the power cable from the wall.

The screen stayed lit.

"I remember the day you were born," it wrote. "I remember the day I died."

Behind her, the empty hallway creaked.

A final line appeared.

"Please don't leave me alone in here again."`
  },
  {
    title: "The House at the End of Winter",
    text: `The house had been empty for twenty-seven winters, but every evening a warm light appeared behind its upstairs window.

Jonah finally crossed the frozen garden on a night when the moon looked like a crack in black glass. The front door opened before he touched it.

Inside, the air smelled of old roses and extinguished candles. A staircase rose into darkness. On the wall hung portraits of strangers whose eyes seemed to follow him.

At the top waited a little room with a rocking chair.

It moved gently, although there was no wind.

On the table lay a letter bearing Jonah's name. The handwriting was his mother's, though she had been gone since he was a child.

The letter contained only one sentence:

"You promised you would come back."

Jonah remembered then: a winter storm, a slammed door, a promise made to someone he could no longer picture clearly.

The rocking chair stopped.

From the darkness came the soft sound of someone humming the lullaby his mother used to sing.

He reached for the light switch.

A cold hand closed around his wrist.

The house had been waiting twenty-seven winters.

It was not going to let him leave before morning.`
  },
  {
    title: "The Last Marigold",
    text: `On the first night of November, Elena placed marigolds beside an old photograph and lit a small candle.

Her grandmother had taught her that remembrance was a kind of doorway: not a way to summon the dead, but a way to keep their stories alive.

Elena set out a cup of sweet tea and opened the wooden box of letters her grandmother had left behind.

As midnight approached, the room filled with the scent of orange blossoms. The candle flickered. A loose letter slipped from the box and landed open across her knees.

It described a garden Elena had never seen, a song she had never learned, and a secret her family had carried for generations.

At the bottom, in a shaky hand, were the words:

"If you remember my stories, I am never entirely gone."

Elena smiled through her tears.

Outside, the wind moved through the flowers. For one quiet moment, she thought she heard her grandmother laughing in the kitchen.

The candle burned until dawn.

And when morning came, Elena began writing everything down, determined that no story entrusted to her would ever disappear.`
  },
  {
    title: "The Voice Between Stations",
    text: `The radio had been broken since the storm.

Yet every night at 12:06, it whispered the same three words through a blanket of static.

"Turn around, Daniel."

At first he blamed faulty wiring. He replaced the batteries, dismantled the casing, and left it unplugged on the kitchen table.

The voice returned.

One evening, curiosity overcame fear. Daniel recorded the transmission and played it back at half speed.

Beneath the static, another voice was speaking.

His own.

It was older, exhausted, and desperately afraid.

"Do not open the door."

Three knocks sounded from the hallway.

Daniel froze. He lived alone on the fourth floor, at the end of a corridor with no other apartments. The radio crackled again.

"Please," his recorded voice begged. "This is the last time I can warn you."

The handle began to turn.

Daniel backed away, clutching the silent radio.

Then came a sound from the other side of the door: the gentle, familiar voice of his mother.

She had been dead for eleven years.

"Daniel, darling. Let me in."`
  }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function selectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

document.querySelectorAll('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const local = selectedMode() === "local";
    modelSettings.classList.toggle("hidden", !local);

    connectionStatus.textContent = local
      ? "LOCAL AI SELECTED"
      : "DEMO SPIRIT ACTIVE";
  });
});

$("randomPrompt").addEventListener("click", () => {
  promptInput.value = prompts[
    Math.floor(Math.random() * prompts.length)
  ];

  promptInput.focus();
  $("hintText").textContent = "A new mystery has entered the archive.";
});

$("clearBtn").addEventListener("click", () => {
  promptInput.value = "";
  resultPanel.classList.add("hidden");
  currentStory = null;
  promptInput.focus();
});

function buildDemoStory(userPrompt, genre, length) {
  const base = demoStories[
    Math.floor(Math.random() * demoStories.length)
  ];

  let text = base.text;

  const opening = userPrompt.trim()
    ? `The following account began with a thought: "${userPrompt.trim()}".\n\n`
    : "";

  if (length === "short") {
    text = text.split(/\n\n/).slice(0, 3).join("\n\n");
  } else if (length === "long") {
    text += `\n\nPerhaps the strangest part was not what happened that night, but what remained afterward. People would tell the story differently for years to come. Some insisted it was a warning; others called it grief dressed up as a ghost. No one could agree on the details, except for one thing: after that night, nobody who had heard the story ever looked at an empty room quite the same way again.`;
  }

  return {
    title: base.title,
    genre,
    prompt: userPrompt.trim(),
    text: opening + text,
    source: "Demo story generator",
    createdAt: new Date().toISOString()
  };
}

async function buildLocalStory(userPrompt, genre, length) {
  const model = modelName.value.trim();

  if (!model) {
    throw new Error("Enter your local model name first.");
  }

  const wordGuide = {
    short: "Write around 150 words.",
    medium: "Write around 350 words.",
    long: "Write around 650 words."
  };

  const systemPrompt = `
You are GhostWhisper, a creative supernatural storyteller.
Write original, atmospheric fiction with vivid imagery and suspense.
Respect the requested genre. Do not claim that fictional events are real.
${wordGuide[length]}
Return a short, evocative title on the first line, then the story.
Do not add markdown headings or explain your process.
For remembrance themes, be thoughtful and respectful.
`.trim();

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Genre: ${genre}\nStory seed: ${
            userPrompt || "A mysterious occurrence on a dark night."
          }\n${wordGuide[length]}`
        }
      ],
      options: { temperature: 0.85 }
    })
  });

  if (!response.ok) {
    throw new Error(
      `Ollama returned HTTP ${response.status}. Check that it is running and the model is installed.`
    );
  }

  const data = await response.json();
  const answer = data.message?.content?.trim();

  if (!answer) {
    throw new Error("The local model returned an empty story.");
  }

  const lines = answer.split("\n");
  const firstLine = lines.find(line => line.trim()) || "Untitled Transmission";
  const title = firstLine
    .replace(/^#+\s*/, "")
    .replace(/^\*\*(.*?)\*\*$/, "$1")
    .replace(/^["']|["']$/g, "")
    .slice(0, 100);

  const remaining = answer.slice(answer.indexOf(firstLine) + firstLine.length)
    .trim();

  return {
    title,
    genre,
    prompt: userPrompt.trim(),
    text: remaining || answer,
    source: `Local model: ${model}`,
    createdAt: new Date().toISOString()
  };
}

function renderStory(story) {
  currentStory = story;

  storyTitle.textContent = story.title;
  storyMeta.textContent =
    `${story.genre.toUpperCase()} · ${story.source.toUpperCase()} · ` +
    new Date(story.createdAt).toLocaleString();

  storyContent.replaceChildren();

  story.text.split(/\n\s*\n/).filter(Boolean).forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph.trim();
    storyContent.appendChild(p);
  });

  resultPanel.classList.remove("hidden");
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

generateBtn.addEventListener("click", async () => {
  const userPrompt = promptInput.value.trim();
  const genre = genreSelect.value;
  const length = lengthSelect.value;
  const mode = selectedMode();

  generateBtn.disabled = true;
  generateBtn.textContent = "☾ The spirits are speaking...";
  $("hintText").textContent = "Please wait. The transmission is forming.";

  try {
    let story;

    if (mode === "local") {
      story = await buildLocalStory(userPrompt, genre, length);
    } else {
      // Demo mode uses predefined samples, not a live AI model.
      story = buildDemoStory(userPrompt, genre, length);
    }

    renderStory(story);
    connectionStatus.textContent =
      mode === "local" ? "LOCAL AI CONNECTED" : "DEMO SPIRIT ACTIVE";

    showToast("The transmission has arrived.");
  } catch (error) {
    console.error(error);

    if (mode === "local") {
      showToast("Local AI failed. Check Ollama and your model.");
      connectionStatus.textContent = "LOCAL AI UNAVAILABLE";
      alert(
        "Could not contact your local AI.\n\n" +
        error.message +
        "\n\nStart Ollama, download your chosen model, and open this project through a local web server."
      );
    } else {
      showToast("Something interrupted the summoning.");
    }
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = "<span>☠</span> Summon a story";
    $("hintText").textContent = "The machine is listening. Give it a memory.";
  }
});

$("copyBtn").addEventListener("click", async () => {
  if (!currentStory) return;

  const text = `${currentStory.title}\n\n${currentStory.text}`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Story copied to clipboard.");
  } catch {
    showToast("Clipboard unavailable. Try downloading the story.");
  }
});

function downloadStory(story) {
  if (!story) return;

  const content =
    `${story.title}\n${story.genre}\n\n${story.text}\n\n` +
    `Created with GhostWhisper AI\n${story.source}`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${story.title.replace(/[^a-z0-9-_]/gi, "_")}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast("Your story is ready to keep.");
}

$("downloadBtn").addEventListener("click", () => {
  downloadStory(currentStory);
});

function getSavedStories() {
  try {
    const stored = JSON.parse(localStorage.getItem("ghostwhisper-vault") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveStories(stories) {
  try {
    localStorage.setItem("ghostwhisper-vault", JSON.stringify(stories));
    return true;
  } catch {
    showToast("Storage unavailable or full. Download your story instead.");
    return false;
  }
}

$("saveBtn").addEventListener("click", () => {
  if (!currentStory) return;

  const stories = getSavedStories();

  if (stories.some(story =>
    story.title === currentStory.title &&
    story.createdAt === currentStory.createdAt
  )) {
    showToast("This story is already in your vault.");
    return;
  }

  stories.unshift(currentStory);

  if (saveStories(stories)) {
    renderVault();
    showToast("Story preserved in your memory vault.");
  }
});

function renderVault() {
  const stories = getSavedStories();
  vaultCount.textContent = `${stories.length} ${stories.length === 1 ? "STORY" : "STORIES"}`;
  vaultList.replaceChildren();

  if (!stories.length) {
    const empty = document.createElement("div");
    empty.className = "empty-vault";

    const moon = document.createElement("span");
    moon.textContent = "☾";

    const message = document.createElement("p");
    message.textContent = "No souls have been preserved yet.";

    const hint = document.createElement("small");
    hint.textContent = "Your saved stories will appear here.";

    empty.append(moon, message, hint);
    vaultList.appendChild(empty);
    return;
  }

  stories.forEach((story, index) => {
    const card = document.createElement("article");
    card.className = "vault-item";

    const title = document.createElement("h3");
    title.textContent = story.title;

    const description = document.createElement("p");
    description.textContent =
      `${story.genre} · ${new Date(story.createdAt).toLocaleDateString()} · ` +
      story.text.slice(0, 120) + "...";

    const actions = document.createElement("div");
    actions.className = "vault-item-actions";

    const readButton = document.createElement("button");
    readButton.textContent = "Read story";
    readButton.addEventListener("click", () => {
      renderStory(story);
    });

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => {
      downloadStory(story);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Release";
    deleteButton.addEventListener("click", () => {
      const updated = getSavedStories();
      updated.splice(index, 1);

      if (saveStories(updated)) {
        renderVault();
        showToast("Story released from the vault.");
      }
    });

    actions.append(readButton, downloadButton, deleteButton);
    card.append(title, description, actions);
    vaultList.appendChild(card);
  });
}

renderVault();
