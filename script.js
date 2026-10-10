// ===== DATA =====
const DEFAULT_QUESTIONS = [
  { emoji: "🎤", text: "Какой твой любимый певец / певица?", options: ["Billie Eilish", "The Weeknd", "Taylor Swift", "BTS", "Другой"] },
  { emoji: "🎨", text: "Какой твой любимый цвет?", options: ["Розовый", "Голубой", "Чёрный", "Зелёный", "Фиолетовый"] },
  { emoji: "🍕", text: "Какое твоё любимое блюдо?", options: ["Пицца", "Суши", "Паста", "Бургеры", "Салаты"] },
  { emoji: "✈️", text: "Куда бы ты хотел(а) поехать в путешествие?", options: ["Япония", "Италия", "Мальдивы", "Нью-Йорк", "Париж"] },
  { emoji: "🎬", text: "Какой твой любимый фильм / сериал?", options: ["Игра престолов", "Друзья", "Интерстеллар", "Очень странные дела", "Титаник"] },
  { emoji: "🌙", text: "Какой твой идеальный вечер?", options: ["Кино и плед", "Прогулка с друзьями", "Игры", "Чтение книги", "Музыка и чай"] },
  { emoji: "🧋", text: "Какой твой любимый напиток?", options: ["Кофе", "Чай", "Бабл-ти", "Лимонад", "Какао"] },
  { emoji: "🐱", text: "Какое животное тебе больше всего нравится?", options: ["Кошка", "Собака", "Кролик", "Панда", "Лиса"] },
  { emoji: "🍂", text: "Какой твой любимый сезон года?", options: ["Весна", "Лето", "Осень", "Зима"] },
  { emoji: "🎧", text: "Какая твоя любимая песня прямо сейчас?", options: ["Популярный хит", "Старый любимый трек", "Что-то грустное", "Энергичный бэнгер", "Инди"] },
  { emoji: "☕", text: "Что ты обычно заказываешь в кафе?", options: ["Латте", "Капучино", "Чай с десертом", "Смузи", "Просто воду"] },
  { emoji: "🦸", text: "Какой персонаж тебе ближе?", options: ["Гарри Поттер", "Человек-паук", "Вонка", "Эльза", "Шрек", "Другой"] },
  { emoji: "🛋️", text: "Какой у тебя любимый способ проводить выходные?", options: ["Дома на диване", "Прогулки", "Встречи с друзьями", "Хобби", "Путешествия"] },
  { emoji: "🍰", text: "Какой твой любимый десерт?", options: ["Тирамису", "Чизкейк", "Мороженое", "Брауни", "Макаруны"] },
  { emoji: "🎮", text: "Какая твоя любимая игра / приложение?", options: ["TikTok", "Instagram", "Игра на телефоне", "Minecraft", "Among Us"] },
  { emoji: "🌸", text: "Какой твой любимый запах?", options: ["Цветы", "Ваниль", "Кофе", "Свежесть после дождя", "Парфюм"] },
  { emoji: "🌊", text: "Что бы ты выбрал(а): море или горы?", options: ["Море", "Горы", "И то, и другое", "Ни то, ни другое"] },
  { emoji: "😂", text: "Какой твой любимый мем / тренд?", options: ["Классические мемы", "Тикток-тренды", "Реакции с котами", "Абсурдный юмор", "Старые мемы"] },
  { emoji: "🎉", text: "Какой твой любимый праздник?", options: ["Новый год", "День рождения", "Хэллоуин", "8 марта", "Просто выходной"] },
  { emoji: "💕", text: "Что тебя больше всего радует в друзьях?", options: ["Юмор", "Поддержка", "Честность", "Общие интересы", "Верность"] }
];

let state = {
  name: "",
  age: "",
  bday: "",
  photo: null, // base64
  questions: [],
  currentQuizId: null,
  answers: {}
};

// ===== NAVIGATION =====
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add("active");
  window.scrollTo(0, 0);
}

// ===== HOME =====
document.getElementById("btn-create").addEventListener("click", () => {
  goTo("create-profile");
});

// ===== PHOTO UPLOAD =====
document.getElementById("photo-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    state.photo = ev.target.result;
    const preview = document.getElementById("photo-preview");
    preview.innerHTML = `<img src="${state.photo}" alt="photo">`;
    preview.classList.add("has-photo");
  };
  reader.readAsDataURL(file);
});

// ===== TO QUESTIONS =====
document.getElementById("btn-to-questions").addEventListener("click", () => {
  const name = document.getElementById("input-name").value.trim();
  const age = document.getElementById("input-age").value.trim();
  const bday = document.getElementById("input-bday").value.trim();

  if (!name) {
    alert("Пожалуйста, введи своё имя 💕");
    return;
  }

  state.name = name;
  state.age = age;
  state.bday = bday;

  // Init questions if empty
  if (state.questions.length === 0) {
    state.questions = DEFAULT_QUESTIONS.map(q => ({
      emoji: q.emoji,
      text: q.text,
      options: [...q.options],
      correctIndex: 0 // first option is "correct" by default
    }));
  }

  renderQuestionsEditor();
  goTo("questions-editor");
});

// ===== QUESTIONS EDITOR =====
function renderQuestionsEditor() {
  const list = document.getElementById("questions-list");
  list.innerHTML = "";

  state.questions.forEach((q, qi) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
      <div class="question-header">
        <span class="question-emoji">${q.emoji}</span>
        <input class="question-text-input" value="${escapeHtml(q.text)}" data-qi="${qi}" data-field="text">
        <button class="btn-remove-q" data-qi="${qi}" title="Удалить вопрос">✕</button>
      </div>
      <div class="options-list" id="opts-${qi}"></div>
      <button class="btn-add-opt" data-qi="${qi}">+ вариант ответа</button>
      <p class="correct-hint">💡 Нажми на вариант, чтобы отметить правильный ответ (зелёная рамка)</p>
    `;
    list.appendChild(card);

    const optsList = card.querySelector(`#opts-${qi}`);
    q.options.forEach((opt, oi) => {
      const row = document.createElement("div");
      row.className = "option-row";
      row.innerHTML = `
        <input type="text" value="${escapeHtml(opt)}" data-qi="${qi}" data-oi="${oi}" class="${oi === q.correctIndex ? 'correct' : ''}">
        <button class="btn-remove-opt" data-qi="${qi}" data-oi="${oi}">✕</button>
      `;
      optsList.appendChild(row);

      // Click to set correct
      row.querySelector("input").addEventListener("click", (e) => {
        // only if not editing text much
      });
      row.querySelector("input").addEventListener("dblclick", () => {
        state.questions[qi].correctIndex = oi;
        renderQuestionsEditor();
      });
      // Also single click on the border area – simpler: click the input sets correct if already focused? Better: add a small mark button
    });
  });

  // Re-bind events
  bindEditorEvents();
}

function bindEditorEvents() {
  // Text change
  document.querySelectorAll(".question-text-input").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const qi = +e.target.dataset.qi;
      state.questions[qi].text = e.target.value;
    });
  });

  // Option text change
  document.querySelectorAll(".option-row input").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const qi = +e.target.dataset.qi;
      const oi = +e.target.dataset.oi;
      state.questions[qi].options[oi] = e.target.value;
    });
    // Single click to mark correct
    inp.addEventListener("click", (e) => {
      const qi = +e.target.dataset.qi;
      const oi = +e.target.dataset.oi;
      if (state.questions[qi].correctIndex !== oi) {
        state.questions[qi].correctIndex = oi;
        renderQuestionsEditor();
      }
    });
  });

  // Remove question
  document.querySelectorAll(".btn-remove-q").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const qi = +e.target.dataset.qi;
      if (state.questions.length <= 1) {
        alert("Должен остаться хотя бы один вопрос!");
        return;
      }
      state.questions.splice(qi, 1);
      renderQuestionsEditor();
    });
  });

  // Remove option
  document.querySelectorAll(".btn-remove-opt").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const qi = +e.target.dataset.qi;
      const oi = +e.target.dataset.oi;
      if (state.questions[qi].options.length <= 2) {
        alert("Минимум 2 варианта ответа");
        return;
      }
      state.questions[qi].options.splice(oi, 1);
      if (state.questions[qi].correctIndex >= state.questions[qi].options.length) {
        state.questions[qi].correctIndex = 0;
      } else if (oi < state.questions[qi].correctIndex) {
        state.questions[qi].correctIndex--;
      }
      renderQuestionsEditor();
    });
  });

  // Add option
  document.querySelectorAll(".btn-add-opt").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const qi = +e.target.dataset.qi;
      state.questions[qi].options.push("Новый вариант");
      renderQuestionsEditor();
    });
  });
}

document.getElementById("btn-add-question").addEventListener("click", () => {
  state.questions.push({
    emoji: "❓",
    text: "Новый вопрос?",
    options: ["Вариант 1", "Вариант 2", "Вариант 3"],
    correctIndex: 0
  });
  renderQuestionsEditor();
  // scroll to bottom
  setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
});

// ===== SAVE QUIZ =====
document.getElementById("btn-save-quiz").addEventListener("click", () => {
  // Validate
  for (let q of state.questions) {
    if (!q.text.trim()) {
      alert("Есть пустые вопросы!");
      return;
    }
    if (q.options.some(o => !o.trim())) {
      alert("Есть пустые варианты ответов!");
      return;
    }
  }

  const id = "quiz_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const quizData = {
    id,
    name: state.name,
    age: state.age,
    bday: state.bday,
    photo: state.photo,
    questions: state.questions,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(id, JSON.stringify(quizData));
  state.currentQuizId = id;

  // Share link (simulated – works on same browser)
  const link = window.location.origin + window.location.pathname + "?quiz=" + id;
  document.getElementById("share-link").value = link;
  goTo("share");
});

// Copy link
document.getElementById("btn-copy").addEventListener("click", () => {
  const input = document.getElementById("share-link");
  input.select();
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById("btn-copy");
    btn.textContent = "Скопировано!";
    setTimeout(() => btn.textContent = "Копировать", 2000);
  }).catch(() => {
    alert("Ссылка: " + input.value);
  });
});

// Preview as friend
document.getElementById("btn-preview").addEventListener("click", () => {
  if (state.currentQuizId) {
    loadQuiz(state.currentQuizId);
  }
});

// ===== TAKE QUIZ =====
function loadQuiz(id) {
  const raw = localStorage.getItem(id);
  if (!raw) {
    alert("Анкета не найдена 😢 Возможно, она была создана в другом браузере.");
    goTo("home");
    return;
  }
  const quiz = JSON.parse(raw);
  state.currentQuizId = id;
  state.answers = {};

  // Header
  const photoEl = document.getElementById("quiz-photo");
  if (quiz.photo) {
    photoEl.innerHTML = `<img src="${quiz.photo}" alt="">`;
  } else {
    photoEl.innerHTML = "💖";
  }
  document.getElementById("quiz-title").textContent = `Анкета ${quiz.name}`;
  let meta = [];
  if (quiz.age) meta.push(`${quiz.age} лет`);
  if (quiz.bday) meta.push(`др: ${quiz.bday}`);
  document.getElementById("quiz-meta").textContent = meta.join(" · ");

  // Questions
  const container = document.getElementById("quiz-questions");
  container.innerHTML = "";
  quiz.questions.forEach((q, qi) => {
    const card = document.createElement("div");
    card.className = "quiz-q-card";
    card.innerHTML = `
      <div class="quiz-q-emoji">${q.emoji}</div>
      <div class="quiz-q-text">${qi + 1}. ${escapeHtml(q.text)}</div>
      <div class="quiz-options" id="qopts-${qi}"></div>
    `;
    container.appendChild(card);

    const opts = card.querySelector(`#qopts-${qi}`);
    q.options.forEach((opt, oi) => {
      const div = document.createElement("div");
      div.className = "quiz-option";
      div.textContent = opt;
      div.dataset.qi = qi;
      div.dataset.oi = oi;
      div.addEventListener("click", () => {
        // deselect siblings
        opts.querySelectorAll(".quiz-option").forEach(o => o.classList.remove("selected"));
        div.classList.add("selected");
        state.answers[qi] = oi;
        checkAllAnswered(quiz.questions.length);
      });
      opts.appendChild(div);
    });
  });

  document.getElementById("btn-submit-quiz").style.display = "none";
  goTo("take-quiz");
}

function checkAllAnswered(total) {
  if (Object.keys(state.answers).length >= total) {
    document.getElementById("btn-submit-quiz").style.display = "block";
  }
}

document.getElementById("btn-submit-quiz").addEventListener("click", () => {
  const raw = localStorage.getItem(state.currentQuizId);
  if (!raw) return;
  const quiz = JSON.parse(raw);

  let correct = 0;
  quiz.questions.forEach((q, qi) => {
    if (state.answers[qi] === q.correctIndex) correct++;
  });

  const total = quiz.questions.length;
  const percent = Math.round((correct / total) * 100);

  let emoji, title, comment;
  if (percent >= 90) {
    emoji = "🏆";
    title = "Настоящий знаток!";
    comment = `Ты почти идеально знаешь ${quiz.name}! Вы точно лучшие друзья 💖`;
  } else if (percent >= 70) {
    emoji = "🌟";
    title = "Отлично!";
    comment = `Ты хорошо знаешь ${quiz.name}. Ещё чуть-чуть — и будете неразлучны!`;
  } else if (percent >= 40) {
    emoji = "😊";
    title = "Неплохо!";
    comment = `Ты кое-что знаешь о ${quiz.name}, но есть куда расти. Самое время поболтать!`;
  } else {
    emoji = "🙈";
    title = "Упс...";
    comment = `Кажется, ты ещё мало знаешь ${quiz.name}. Пора провести время вместе и узнать друг друга лучше!`;
  }

  document.getElementById("result-emoji").textContent = emoji;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-score").textContent = `${correct} из ${total} правильных (${percent}%)`;
  document.getElementById("result-comment").textContent = comment;

  goTo("result");
});

// ===== HELPERS =====
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ===== INIT: check URL for quiz =====
(function init() {
  const params = new URLSearchParams(window.location.search);
  const quizId = params.get("quiz");
  if (quizId) {
    loadQuiz(quizId);
  } else {
    goTo("home");
  }
})();
