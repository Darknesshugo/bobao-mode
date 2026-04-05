const MODULE_ID = "bobao-mode";
const FLAG_KEY = "isBobao";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializado`);
});

Hooks.on("renderPlayerList", (app, html) => {
  injectBobaoControls(html);
});

Hooks.on("updateUser", () => {
  rerenderPlayerList();
});

Hooks.on("createUser", () => {
  rerenderPlayerList();
});

Hooks.on("deleteUser", () => {
  rerenderPlayerList();
});

function rerenderPlayerList() {
  try {
    ui.players?.render(true);
  } catch (err) {
    console.warn(`${MODULE_ID} | Falha ao rerenderizar player list`, err);
  }
}

function injectBobaoControls(html) {
  const root = html?.[0] ?? html;
  if (!root) return;

  const playerElements = root.querySelectorAll("[data-user-id]");
  for (const element of playerElements) {
    const userId = element.dataset.userId;
    const user = game.users.get(userId);
    if (!user) continue;

    element.querySelector(`.${MODULE_ID}-toggle`)?.remove();
    element.querySelector(`.${MODULE_ID}-badge`)?.remove();

    const nameNode =
      element.querySelector(".player-name") ||
      element.querySelector("h3") ||
      element.querySelector("span") ||
      element;

    if (user.getFlag(MODULE_ID, FLAG_KEY)) {
      const badge = document.createElement("span");
      badge.classList.add(`${MODULE_ID}-badge`);
      badge.textContent = game.i18n.localize(`${MODULE_ID}.badgeLabel`);
      nameNode.appendChild(badge);
    }

    const button = document.createElement("a");
    button.classList.add(`${MODULE_ID}-toggle`);
    button.dataset.tooltip = game.i18n.localize(`${MODULE_ID}.toggleHint`);
    button.setAttribute("aria-label", game.i18n.localize(`${MODULE_ID}.toggleHint`));
    button.innerHTML = '<i class="fa-solid fa-face-clown"></i>';

    if (!game.user.isGM) {
      button.classList.add("disabled");
    } else {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const current = Boolean(user.getFlag(MODULE_ID, FLAG_KEY));
        await user.setFlag(MODULE_ID, FLAG_KEY, !current);
      });
    }

    element.appendChild(button);
  }
}
