const subjectSel = document.getElementById("subjectSelect");
const pyqSel = document.getElementById("pyqSelect");
const paperSec = document.getElementById("paperSection");
const pdfViewer = document.getElementById("pdfViewer");
const uploadSec = document.getElementById("uploadSection");
const fileInp = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const submitBtn = document.getElementById("submitAnswersBtn");
const evalBox = document.getElementById("evaluationResult");
const aiOut = document.getElementById("aiFeedback");
const randomBtn = document.getElementById("randomBtn");
const startBtn = document.getElementById("startExamBtn");
const timerDisp = document.getElementById("timerDisplay");

const PYQS = {
  devc: ["devc-1.pdf", "devc-2.pdf", "devc-nov23.pdf"],
  physics: ["physics-1.pdf", "physics-2.pdf", "physics-nov23.pdf"],
  ds: ["ds-1.pdf", "ds-2.pdf", "ds-nov23.pdf"],
  beee: ["beee-1.pdf", "beee-2.pdf", "beee-nov23.pdf"]
};

const TIMER_SECONDS = 3 * 60 * 60; // 3 hours
let countdownInterval = null;

/*************** Populate PYQs When Subject Changes ***************/
subjectSel.addEventListener("change", () => {
  const subj = subjectSel.value;
  pyqSel.innerHTML = `<option disabled selected>-- Choose Paper --</option>`;
  pdfViewer.style.display = "none";
  timerDisp.textContent = "";
  uploadSec.style.display = "none";
  evalBox.style.display = "none";
  submitBtn.style.display = "none";
  fileInp.value = "";
  fileList.innerHTML = "";
  aiOut.value = "";

  if (PYQS[subj]) {
    paperSec.style.display = "block";
    PYQS[subj].forEach(pdf => {
      const opt = document.createElement("option");
      opt.value = pdf;
      opt.textContent = pdf;
      pyqSel.appendChild(opt);
    });
  }
});

/*************** Display PDF when a PYQ is selected ***************/
pyqSel.addEventListener("change", () => {
  const selectedPdf = pyqSel.value;
  if (selectedPdf) {
    pdfViewer.src = `pyqs/${selectedPdf}`;
    pdfViewer.style.display = "block";

    // Reset stuff
    uploadSec.style.display = "none";
    timerDisp.textContent = "";
    evalBox.style.display = "none";
    submitBtn.style.display = "none";
    fileInp.value = "";
    fileList.innerHTML = "";
    aiOut.value = "";
    clearInterval(countdownInterval);
  }
});

/*************** Random PYQ Button ***************/
randomBtn.addEventListener("click", () => {
  const subj = subjectSel.value;
  if (!subj || !PYQS[subj]) return alert("Please select a subject first!");

  const randomPdf = PYQS[subj][Math.floor(Math.random() * PYQS[subj].length)];
  pyqSel.innerHTML = `<option selected value="${randomPdf}">${randomPdf}</option>`;
  paperSec.style.display = "block";

  pdfViewer.src = `pyqs/${randomPdf}`;
  pdfViewer.style.display = "block";

  // Reset everything
  timerDisp.textContent = "";
  uploadSec.style.display = "none";
  evalBox.style.display = "none";
  submitBtn.style.display = "none";
  fileInp.value = "";
  fileList.innerHTML = "";
  aiOut.value = "";
  clearInterval(countdownInterval);
});

/*************** Start Exam Button ***************/
startBtn.addEventListener("click", () => {
  const pdf = pyqSel.value;
  if (!pdf) return alert("Pick a PYQ first.");

  pdfViewer.src = `pyqs/${pdf}`;
  pdfViewer.style.display = "block";

  // Reset sections
  uploadSec.style.display = "none";
  evalBox.style.display = "none";
  submitBtn.style.display = "none";
  fileInp.value = "";
  fileList.innerHTML = "";
  aiOut.value = "";

  runTimer(TIMER_SECONDS);
});

/*************** Timer Function ***************/
function runTimer(duration) {
  let remaining = duration;
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    timerDisp.textContent = `⏳ Time Left: ${hours}h ${minutes}m ${seconds}s`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      timerDisp.textContent = "✅ Time's up! Upload your answers.";
      pdfViewer.style.display = "none";
      uploadSec.style.display = "block";
      submitBtn.style.display = "block";
    }

    remaining--;
  }, 1000);
}

/*************** File Upload Section ***************/
fileInp.addEventListener("change", () => {
  fileList.innerHTML = "";
  const files = Array.from(fileInp.files);

  if (files.length > 34) {
    alert("You can only upload up to 34 files.");
    fileInp.value = "";
    return;
  }

  files.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });

  submitBtn.style.display = "block";
});

/*************** Fake AI Evaluation ***************/
submitBtn.addEventListener("click", () => {
  evalBox.style.display = "block";
  aiOut.value = "🔍 Analyzing answers with GPT-4...\n\n📊 You scored 49/70.\n📝 Feedback:\n- Great attempt overall\n- Improve derivation clarity in Q3\n- Q5 needs detailed diagram\n- Very good time management.\n\n👍 Keep it up!";
});
