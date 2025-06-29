// 5分～60分（5分刻み）
const TIME_PRESETS = [];
for (let min = 5; min <= 60; min += 5) {
  TIME_PRESETS.push({ label: `${min}分`, seconds: min * 60 });
}
const TEST_PRESET = { label: '6秒テスト', seconds: 6 };

const timerDisplay = document.getElementById('timerDisplay');
const testBtnWrapper = document.getElementById('testBtnWrapper');
const timerBtnGrid = document.getElementById('timerBtnGrid');
const chime = document.getElementById('chime');
let timer = null;
let endTime = null;

// 小さめ6秒テストボタンを右上に配置
function createTestBtn() {
  testBtnWrapper.innerHTML = '';
  const btn = document.createElement('button');
  btn.textContent = TEST_PRESET.label;
  btn.className = "px-3 py-1 text-xs rounded-lg font-semibold bg-pink-400 text-white hover:bg-pink-500 shadow-sm";
  btn.addEventListener('click', () => startTimer(TEST_PRESET.seconds));
  testBtnWrapper.appendChild(btn);
}

// 5分～60分のタイマーを下部2列グリッド
function createTimerBtns() {
  timerBtnGrid.innerHTML = '';
  for (let i = 0; i < TIME_PRESETS.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = `▶ ${TIME_PRESETS[i].label}`;
    btn.className =
      "w-full min-w-[120px] max-w-[200px] px-6 py-4 text-base md:text-lg rounded-2xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg";
    btn.addEventListener('click', () => startTimer(TIME_PRESETS[i].seconds));
    timerBtnGrid.appendChild(btn);
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function showTimer(sec) {
  timerDisplay.textContent = formatTime(sec);
  timerDisplay.classList.remove("text-blue-500", "text-xl", "font-bold");
  timerDisplay.classList.add("text-white");
}

function endTimer() {
  chime.currentTime = 0;
  chime.play();
  timerDisplay.textContent = "✨ お疲れさま！よく頑張りました ✨";
  timerDisplay.classList.remove("text-white");
  timerDisplay.classList.add("text-xl", "text-blue-400", "font-bold");
  setTimeout(() => {
    alert("タイマー終了！お疲れさまでした🍀");
  }, 500);
  setTimeout(() => {
    testBtnWrapper.style.display = '';
    timerBtnGrid.style.display = '';
    timerDisplay.classList.remove("text-xl", "text-blue-400", "font-bold");
    timerDisplay.classList.add("text-white");
    showTimer(TIME_PRESETS[0].seconds); // 5分初期化
  }, 2000);
}

// Notification 権限取得
if (window.Notification && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

function startTimer(seconds) {
  if (timer) clearInterval(timer);
  let remain = seconds;
  showTimer(remain);
  testBtnWrapper.style.display = 'none';
  timerBtnGrid.style.display = 'none';
  endTime = Date.now() + seconds * 1000;
  timer = setInterval(() => {
    remain = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    showTimer(remain);
    if (remain <= 0) {
      clearInterval(timer);
      timer = null;
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('タイマー終了', { body: 'お疲れさま！よく頑張りました🍀', silent: false });
      }
      endTimer();
    }
  }, 1000);
}

createTestBtn();
createTimerBtns();
showTimer(TIME_PRESETS[0].seconds);