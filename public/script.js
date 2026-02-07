const analyzeBtn = document.getElementById("analyzeBtn");
const codeInput = document.getElementById("codeInput");
const resultDiv = document.getElementById("result");
const explanationDiv = document.getElementById("explanation");
const hintsList = document.getElementById("hints");
const loader = document.getElementById("loader");
const btnText = document.getElementById("btnText");

analyzeBtn.addEventListener("click", async () => {
  const code = codeInput.value;

  if (!code.trim()) {
    alert("Please paste some code first!");
    return;
  }

  // UI loading state
  resultDiv.classList.add("hidden");
  loader.classList.remove("hidden");
  btnText.textContent = "Analyzing...";
  analyzeBtn.disabled = true;

  explanationDiv.textContent = "";
  hintsList.innerHTML = "";

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (data.error) {
      explanationDiv.textContent = "❌ Error: " + data.error;
      resultDiv.classList.remove("hidden");
      return;
    }

    explanationDiv.textContent = data.explanation;

    hintsList.innerHTML = "";
    data.hints.forEach((hint) => {
      const li = document.createElement("li");
      li.textContent = hint;
      hintsList.appendChild(li);
    });

    resultDiv.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    explanationDiv.textContent = "❌ Failed to contact server.";
    resultDiv.classList.remove("hidden");
  } finally {
    // Reset button
    loader.classList.add("hidden");
    btnText.textContent = "🔍 Analyze with AI";
    analyzeBtn.disabled = false;
  }
});
