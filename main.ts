import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import mermaid from "mermaid";
import { v4 as uuidv4 } from "uuid";

// Remember to rename these classes and interfaces!

type Anything = {
	[key: string]: any;
};

type ThemePalette = {
	name: string;
	group: "Light" | "Dark";
	bg: string;
	fg: string;
	accent: string;
	muted: string;
	surface: string;
	border: string;
	seriesColors?: string[];
	seriesFills?: string[];
};

const THEME_PALETTES: Record<string, ThemePalette> = {
	"zinc-light": { name: "Zinc Light", group: "Light", bg: "#ffffff", fg: "#27272a", accent: "#52525b", muted: "#71717a", surface: "#f4f4f5", border: "#d4d4d8" },
	"zinc-dark": { name: "Zinc Dark", group: "Dark", bg: "#18181b", fg: "#e4e4e7", accent: "#a1a1aa", muted: "#a1a1aa", surface: "#27272a", border: "#3f3f46" },
	"tokyo-night": { name: "Tokyo Night", group: "Dark", bg: "#1a1b26", fg: "#a9b1d6", accent: "#7aa2f7", muted: "#565f89", surface: "#24283b", border: "#3b4261" },
	"tokyo-night-storm": { name: "Tokyo Night Storm", group: "Dark", bg: "#24283b", fg: "#a9b1d6", accent: "#7aa2f7", muted: "#565f89", surface: "#2f3549", border: "#414868" },
	"tokyo-night-light": { name: "Tokyo Night Light", group: "Light", bg: "#d5d6db", fg: "#343b58", accent: "#34548a", muted: "#6172b0", surface: "#e1e2e7", border: "#b4b5bc" },
	"catppuccin-mocha": { name: "Catppuccin Mocha", group: "Dark", bg: "#1e1e2e", fg: "#cdd6f4", accent: "#cba6f7", muted: "#a6adc8", surface: "#313244", border: "#45475a" },
	"catppuccin-latte": { name: "Catppuccin Latte", group: "Light", bg: "#eff1f5", fg: "#4c4f69", accent: "#8839ef", muted: "#6c6f85", surface: "#e6e9ef", border: "#ccd0da" },
	nord: { name: "Nord", group: "Dark", bg: "#2e3440", fg: "#eceff4", accent: "#88c0d0", muted: "#d8dee9", surface: "#3b4252", border: "#4c566a" },
	"nord-light": { name: "Nord Light", group: "Light", bg: "#eceff4", fg: "#2e3440", accent: "#5e81ac", muted: "#4c566a", surface: "#e5e9f0", border: "#c7ced8" },
	dracula: { name: "Dracula", group: "Dark", bg: "#282a36", fg: "#f8f8f2", accent: "#bd93f9", muted: "#b6b6c6", surface: "#343746", border: "#4b4d5e" },
	"github-light": { name: "GitHub Light", group: "Light", bg: "#ffffff", fg: "#1f2328", accent: "#0969da", muted: "#656d76", surface: "#f6f8fa", border: "#d1d9e0" },
	"github-dark": { name: "GitHub Dark", group: "Dark", bg: "#0d1117", fg: "#e6edf3", accent: "#4493f8", muted: "#8b949e", surface: "#161b22", border: "#30363d" },
	"solarized-light": { name: "Solarized Light", group: "Light", bg: "#fdf6e3", fg: "#657b83", accent: "#268bd2", muted: "#839496", surface: "#eee8d5", border: "#d6ceb9" },
	"solarized-dark": { name: "Solarized Dark", group: "Dark", bg: "#002b36", fg: "#eee8d5", accent: "#2aa198", muted: "#93a1a1", surface: "#073642", border: "#586e75" },
	"one-dark": { name: "One Dark", group: "Dark", bg: "#282c34", fg: "#abb2bf", accent: "#c678dd", muted: "#7f848e", surface: "#353b45", border: "#4b5263" },
	"obsidian-light": { name: "Obsidian Light", group: "Light", bg: "#ffffff", fg: "#252525", accent: "#6b7cff", muted: "#858585", surface: "#f6f7fb", border: "#dfe2eb" },
	"obsidian-dark": { name: "Obsidian Dark", group: "Dark", bg: "#202020", fg: "#dcddde", accent: "#a78bfa", muted: "#999999", surface: "#2b2b2b", border: "#414141" },
	"paper-amber": { name: "Paper & Amber", group: "Light", bg: "#fffdf7", fg: "#29251f", accent: "#b7791f", muted: "#81766a", surface: "#fbf3df", border: "#e8d9b8" },
	"mint-night": { name: "Mint Night", group: "Dark", bg: "#101c1b", fg: "#d6eee8", accent: "#55d6be", muted: "#8ab8ae", surface: "#192927", border: "#2d4b45" },
	"lavender-dusk": { name: "Lavender Dusk", group: "Dark", bg: "#211d2b", fg: "#eee8f5", accent: "#c4a7e7", muted: "#aaa0b8", surface: "#30283b", border: "#51415f" },
	"coral-slate": { name: "Coral & Slate", group: "Light", bg: "#f7f8fa", fg: "#354052", accent: "#ff6547", muted: "#687b94", surface: "#f4e0db", border: "#5c718d", seriesColors: ["#ff6547", "#5c718d", "#149b9a", "#d29a36", "#8d63a9", "#528765", "#c75170", "#397eb2", "#df773d", "#398a91", "#7665a8", "#778b43"], seriesFills: ["#f4e0db", "#d9dfe7", "#d7eeeb", "#f6edda", "#e9e0f0", "#dfede4", "#f2dce2", "#dce9f3", "#f5e3d5", "#d9ecee", "#e5e0f1", "#e8ecd9"] },
	"pastel-reverie": { name: "Pastel Reverie", group: "Light", bg: "#fbfafc", fg: "#403b4a", accent: "#91A8D0", muted: "#77778f", surface: "#f1eff6", border: "#d8d4e2", seriesColors: ["#91A8D0", "#A8C5B5", "#C5B4D8", "#D8A7A7", "#DDB892", "#B8B8D1"], seriesFills: ["#e6ebf4", "#e6efe9", "#eee8f3", "#f2e5e5", "#f3ece2", "#ebebf3"] },
	default: { name: "Mermaid Default", group: "Light", bg: "#ffffff", fg: "#333333", accent: "#9370db", muted: "#666666", surface: "#ececff", border: "#9370db" },
	neutral: { name: "Mermaid Neutral", group: "Light", bg: "#f4f4f4", fg: "#333333", accent: "#777777", muted: "#777777", surface: "#eeeeee", border: "#999999" },
	dark: { name: "Mermaid Dark", group: "Dark", bg: "#1f2020", fg: "#cccccc", accent: "#81b1db", muted: "#aaaaaa", surface: "#333333", border: "#666666" },
	forest: { name: "Mermaid Forest", group: "Dark", bg: "#1b1b1b", fg: "#cde498", accent: "#cde498", muted: "#aaaaaa", surface: "#2a2a2a", border: "#519975" },
	base: { name: "Mermaid Base", group: "Light", bg: "#ffffff", fg: "#333333", accent: "#9370db", muted: "#666666", surface: "#ececff", border: "#9370db" },
};

const NATIVE_MERMAID_THEMES = new Set(["default", "neutral", "dark", "forest", "base"]);

function mixHex(foreground: string, background: string, backgroundWeight: number): string {
	const foregroundValue = Number.parseInt(foreground.slice(1), 16);
	const backgroundValue = Number.parseInt(background.slice(1), 16);
	const channel = (shift: number) => {
		const front = (foregroundValue >> shift) & 255;
		const back = (backgroundValue >> shift) & 255;
		return Math.round(front * (1 - backgroundWeight) + back * backgroundWeight);
	};
	return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

const THEME_SECTIONS = [
	{ title: "Inspired by beautiful-mermaid", description: "Curated palettes with coordinated node, label, and connector colors.", ids: ["zinc-light", "zinc-dark", "tokyo-night", "tokyo-night-storm", "tokyo-night-light", "catppuccin-mocha", "catppuccin-latte", "nord", "nord-light", "dracula", "github-light", "github-dark", "solarized-light", "solarized-dark", "one-dark"] },
	{ title: "Obsidian & studio", description: "Additional palettes designed for focused notes and clear diagrams.", ids: ["obsidian-light", "obsidian-dark", "paper-amber", "mint-night", "lavender-dusk"] },
	{ title: "Data & analytics", description: "A chart inspired palette with clear series colors, soft fills, and slate grid tones.", ids: ["coral-slate"] },
	{ title: "Soft palettes", description: "Muted pastel colors with coordinated diagram and Gantt states.", ids: ["pastel-reverie"] },
	{ title: "Mermaid built-in", description: "Original Mermaid theme presets.", ids: ["default", "neutral", "dark", "forest", "base"] },
];

interface MermaidThemeSettings {
	theme: string;
	tweakStyle: boolean;
	themeTweaks: Anything;
}

const DEFAULT_SETTINGS: MermaidThemeSettings = {
	theme: "default",
	tweakStyle: false,
	themeTweaks: {},
};

export default class MermaidThemePlugin extends Plugin {
	settings: MermaidThemeSettings;
	mermaid: any;
	tab: MermaidThemeSettingTab;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MermaidThemeSettingTab(this.app, this));
		this.mermaid = mermaid;
		mermaid.initialize({ startOnLoad: true });
		// console.log("new", mermaid);
		this.setTheme(this.settings.theme);
		this.registerMarkdownCodeBlockProcessor("merm", this.draw_diagram());
	}

	refresh() {
		const leaf: any = this.app.workspace.activeLeaf
			? this.app.workspace.activeLeaf
			: null;
		leaf?.rebuildView();
	}

	private draw_diagram() {
		return (source: string, el: HTMLElement) => {
			const boxWidth = "100%";
			const boxHeight = "100%";

			el.setAttributeNS(null, "width", String(boxWidth));
			el.setAttributeNS(null, "height", String(boxHeight));
			el.setAttributeNS(
				null,
				"style",
				"text-align: left;display: block;"
			);

			const anID = `mermaid-${uuidv4().toString().replace(/-/gi, "")}`;
			this.mermaid
				.render(anID, source)
				.then((svg: any) => {
					this.mountZoomableDiagram(el, svg.svg);
				})
				.catch((err: any) => {
					console.log("error", err);
					el.innerHTML = `<pre>${err}</pre>`;
				});
		};
	}

	private mountZoomableDiagram(el: HTMLElement, svgMarkup: string) {
		el.empty();
		el.addClass("mermaid-theme-diagram");
		const viewport = el.createDiv("mermaid-zoom-viewport");
		const canvas = viewport.createDiv("mermaid-zoom-canvas");
		canvas.innerHTML = svgMarkup;
		const controls = el.createDiv("mermaid-zoom-controls");
		const makeButton = (label: string, title: string, action: () => void) => {
			const button = controls.createEl("button", { text: label, attr: { type: "button", title, "aria-label": title } });
			button.addEventListener("click", (event) => {
				event.stopPropagation();
				action();
			});
			return button;
		};
		const svg = canvas.querySelector("svg");
		if (!svg) return;

		const viewBox = svg.viewBox?.baseVal;
		const width = viewBox?.width || parseFloat(svg.getAttribute("width") || "") || svg.getBoundingClientRect().width || 300;
		const height = viewBox?.height || parseFloat(svg.getAttribute("height") || "") || svg.getBoundingClientRect().height || 200;
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
		svg.style.width = `${width}px`;
		svg.style.height = `${height}px`;
		svg.style.maxWidth = "none";
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		let scale = 1;
		let fitScale = 1;
		let x = 0;
		let y = 0;
		let dragging = false;
		let startX = 0;
		let startY = 0;
		let wheelZoom = false;
		const pointers = new Map<number, { x: number; y: number }>();
		let pinchStartDistance = 0;
		let pinchStartScale = 1;
		const getFitScale = () => Math.min(1, viewport.clientWidth / width, viewport.clientHeight / height);
		const applyTransform = () => {
			canvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
			canvas.style.cursor = scale > fitScale ? (dragging ? "grabbing" : "grab") : "default";
			zoomLevel.setText(`${Math.round(scale * 100)}%`);
		};
		const updateScale = (nextScale: number, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2) => {
			const next = Math.max(0.1, Math.min(5, nextScale));
			const ratio = next / scale;
			x = anchorX - (anchorX - x) * ratio;
			y = anchorY - (anchorY - y) * ratio;
			scale = next;
			applyTransform();
		};
		makeButton("−", "Zoom out", () => updateScale(scale / 1.2));
		makeButton("+", "Zoom in", () => updateScale(scale * 1.2));
		makeButton("↺", "Reset zoom", () => { scale = fitScale; x = 0; y = 0; applyTransform(); });
		makeButton("⛶", "Open diagram fullscreen", () => this.openZoomModal(svg));
		const zoomLevel = controls.createSpan({ cls: "mermaid-zoom-level", text: "100%" });
		const wheelButton = makeButton("Scroll", "Toggle wheel zoom", () => {
			wheelZoom = !wheelZoom;
			wheelButton.toggleClass("is-active", wheelZoom);
			wheelButton.setAttribute("aria-pressed", String(wheelZoom));
		});
		wheelButton.setAttribute("aria-pressed", "false");
		viewport.addEventListener("wheel", (event) => {
			if (!wheelZoom) return;
			event.preventDefault();
			const rect = viewport.getBoundingClientRect();
			updateScale(scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1), event.clientX - rect.left, event.clientY - rect.top);
		}, { passive: false });
		viewport.addEventListener("pointerdown", (event) => {
			if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
			pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			viewport.setPointerCapture(event.pointerId);
			if (pointers.size === 2) {
				const [first, second] = Array.from(pointers.values());
				pinchStartDistance = Math.hypot(second.x - first.x, second.y - first.y);
				pinchStartScale = scale;
				dragging = false;
				return;
			}
			dragging = true;
			startX = event.clientX - x;
			startY = event.clientY - y;
			applyTransform();
		});
		viewport.addEventListener("pointermove", (event) => {
			if (pointers.has(event.pointerId)) pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
			if (pointers.size >= 2 && pinchStartDistance > 0) {
				const [first, second] = Array.from(pointers.values());
				const distance = Math.hypot(second.x - first.x, second.y - first.y);
				const center = viewport.getBoundingClientRect();
				updateScale(pinchStartScale * distance / pinchStartDistance, (first.x + second.x) / 2 - center.left, (first.y + second.y) / 2 - center.top);
				return;
			}
			if (!dragging) return;
			x = event.clientX - startX;
			y = event.clientY - startY;
			applyTransform();
		});
		const stopDragging = (event: PointerEvent) => {
			pointers.delete(event.pointerId);
			pinchStartDistance = 0;
			dragging = false;
			applyTransform();
		};
		viewport.addEventListener("pointerup", stopDragging);
		viewport.addEventListener("pointercancel", stopDragging);
		window.requestAnimationFrame(() => {
			fitScale = getFitScale();
			scale = fitScale || 1;
			applyTransform();
		});
	}

	private openZoomModal(sourceSvg: SVGSVGElement) {
		const modal = document.createElement("div");
		modal.className = "mermaid-theme-zoom-modal";
		modal.setAttribute("role", "dialog");
		modal.setAttribute("aria-modal", "true");
		modal.setAttribute("aria-label", "Mermaid diagram fullscreen view");
		modal.tabIndex = -1;

		const viewport = document.createElement("div");
		viewport.className = "mermaid-theme-zoom-modal-viewport";
		const canvas = document.createElement("div");
		canvas.className = "mermaid-theme-zoom-modal-canvas";
		const svg = sourceSvg.cloneNode(true) as SVGSVGElement;
		const viewBox = svg.viewBox?.baseVal;
		const width = viewBox?.width || parseFloat(svg.getAttribute("width") || "") || sourceSvg.getBoundingClientRect().width || 300;
		const height = viewBox?.height || parseFloat(svg.getAttribute("height") || "") || sourceSvg.getBoundingClientRect().height || 200;
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
		svg.style.width = `${width}px`;
		svg.style.height = `${height}px`;
		svg.style.maxWidth = "none";
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		canvas.appendChild(svg);
		viewport.appendChild(canvas);

		const controls = document.createElement("div");
		controls.className = "mermaid-theme-zoom-modal-controls";
		const scaleLabel = document.createElement("span");
		scaleLabel.className = "mermaid-theme-zoom-modal-scale";
		const addControl = (label: string, title: string, action: () => void) => {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "mermaid-theme-zoom-modal-button";
			button.textContent = label;
			button.title = title;
			button.setAttribute("aria-label", title);
			button.addEventListener("click", (event) => {
				event.stopPropagation();
				action();
			});
			controls.appendChild(button);
			return button;
		};

		let scale = 1;
		let fitScale = 1;
		let x = 0;
		let y = 0;
		let dragging = false;
		let startX = 0;
		let startY = 0;
		const applyTransform = () => {
			canvas.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
			canvas.style.cursor = dragging ? "grabbing" : "grab";
			scaleLabel.textContent = `${Math.round(scale * 100)}%`;
		};
		const updateScale = (nextScale: number, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2) => {
			const next = Math.max(0.1, Math.min(5, nextScale));
			const ratio = next / scale;
			x = anchorX - (anchorX - x) * ratio;
			y = anchorY - (anchorY - y) * ratio;
			scale = next;
			applyTransform();
		};
		addControl("−", "Zoom out", () => updateScale(scale / 1.2));
		addControl("+", "Zoom in", () => updateScale(scale * 1.2));
		addControl("↺", "Fit diagram", () => {
			scale = fitScale;
			x = Math.max(0, (viewport.clientWidth - width * scale) / 2);
			y = Math.max(0, (viewport.clientHeight - height * scale) / 2);
			applyTransform();
		});
		controls.appendChild(scaleLabel);
		let isClosed = false;
		const closeButton = addControl("×", "Close fullscreen view", () => closeModal());
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeModal();
			else if (event.key === "+" || event.key === "=") updateScale(scale * 1.2);
			else if (event.key === "-") updateScale(scale / 1.2);
			else if (event.key === "0") {
				scale = fitScale;
				x = Math.max(0, (viewport.clientWidth - width * scale) / 2);
				y = Math.max(0, (viewport.clientHeight - height * scale) / 2);
				applyTransform();
			}
		};
		const closeModal = () => {
			if (isClosed) return;
			isClosed = true;
			document.removeEventListener("keydown", handleKeydown);
			modal.remove();
		};
		modal.addEventListener("click", (event) => {
			if (event.target === modal) closeModal();
		});
		viewport.addEventListener("wheel", (event) => {
			event.preventDefault();
			const rect = viewport.getBoundingClientRect();
			updateScale(scale * (event.deltaY < 0 ? 1.1 : 1 / 1.1), event.clientX - rect.left, event.clientY - rect.top);
		}, { passive: false });
		viewport.addEventListener("pointerdown", (event) => {
			if (event.button !== 0) return;
			dragging = true;
			startX = event.clientX - x;
			startY = event.clientY - y;
			viewport.setPointerCapture(event.pointerId);
			applyTransform();
		});
		viewport.addEventListener("pointermove", (event) => {
			if (!dragging) return;
			x = event.clientX - startX;
			y = event.clientY - startY;
			applyTransform();
		});
		const stopDragging = () => { dragging = false; applyTransform(); };
		viewport.addEventListener("pointerup", stopDragging);
		viewport.addEventListener("pointercancel", stopDragging);

		modal.appendChild(viewport);
		modal.appendChild(controls);
		document.body.appendChild(modal);
		document.addEventListener("keydown", handleKeydown);
		window.requestAnimationFrame(() => {
			fitScale = Math.min(1, 2, (viewport.clientWidth - 64) / width, (viewport.clientHeight - 64) / height);
			fitScale = fitScale > 0 ? fitScale : 1;
			scale = fitScale;
			x = Math.max(0, (viewport.clientWidth - width * scale) / 2);
			y = Math.max(0, (viewport.clientHeight - height * scale) / 2);
			applyTransform();
			modal.focus();
			closeButton.focus();
		});
	}

	onunload() {}

	setTheme(theme: string) {
		const palette = THEME_PALETTES[theme];
		const paletteConfig = palette
			? !this.settings.tweakStyle && NATIVE_MERMAID_THEMES.has(theme)
				? { theme, look: "classic" }
				: this.getPaletteConfig(palette)
			: { theme, look: "classic" };

		if (this.settings.tweakStyle) {
			const tweaks = this.settings.themeTweaks || {};
			this.mermaid.initialize({
				...paletteConfig,
				...tweaks,
				theme: "base",
				themeVariables: {
					...(paletteConfig as Anything).themeVariables,
					...tweaks.themeVariables,
				},
			});
		} else {
			this.mermaid.initialize(paletteConfig);
		}

		this.refresh();
		this.tab?.display();
	}

	private getPaletteConfig(palette: ThemePalette) {
		const { bg, fg, accent, muted, surface, border } = palette;
		const seriesColors = palette.seriesColors ?? [accent, muted, border, fg, accent, muted, border, fg, accent, muted, border, fg];
		const seriesFills = palette.seriesFills ?? [surface, bg, surface, bg, surface, bg, surface, bg, surface, bg, surface, bg];
		const accentSoft = mixHex(accent, bg, 0.78);
		const mutedSoft = mixHex(muted, bg, 0.78);
		const critical = mixHex("#e5484d", bg, 0.76);
		const colorVariables: Anything = {};
		seriesColors.forEach((color, index) => {
			colorVariables[`cScale${index}`] = color;
			colorVariables[`pie${index + 1}`] = color;
			colorVariables[`git${index}`] = color;
		});
		seriesFills.slice(0, 8).forEach((color, index) => {
			colorVariables[`fillType${index}`] = color;
		});
		return {
			theme: "base",
			look: "classic",
			themeVariables: {
				background: bg,
				primaryColor: surface,
				primaryTextColor: fg,
				primaryBorderColor: border,
				lineColor: accent,
				secondaryColor: bg,
				secondaryTextColor: fg,
				secondaryBorderColor: border,
				tertiaryColor: surface,
				tertiaryTextColor: fg,
				tertiaryBorderColor: border,
				textColor: fg,
				mainBkg: surface,
				secondBkg: bg,
				clusterBkg: bg,
				clusterBorder: border,
				nodeBorder: border,
				edgeLabelBackground: bg,
				actorBkg: surface,
				actorBorder: border,
				actorTextColor: fg,
				noteBkgColor: surface,
				noteTextColor: fg,
				noteBorderColor: border,
				sectionBkgColor: surface,
				sectionBkgColor2: bg,
				altSectionBkgColor: bg,
				excludeBkgColor: mutedSoft,
				taskBkgColor: surface,
			taskBorderColor: border,
				activeTaskBkgColor: accentSoft,
				activeTaskBorderColor: accent,
				doneTaskBkgColor: mutedSoft,
				doneTaskBorderColor: muted,
				critBkgColor: critical,
				critBorderColor: "#e5484d",
				gridColor: border,
				todayLineColor: accent,
				vertLineColor: muted,
				taskTextColor: fg,
				taskTextOutsideColor: fg,
				taskTextLightColor: fg,
				taskTextDarkColor: fg,
				taskTextClickableColor: accent,
				altBackground: bg,
				labelColor: fg,
				loopTextColor: fg,
				activationBkgColor: surface,
				activationBorderColor: border,
				sequenceNumberColor: bg,
				...colorVariables,
				xyChart: {
					backgroundColor: bg,
					xAxisLabelColor: muted,
					yAxisLabelColor: muted,
					xAxisLineColor: border,
					yAxisLineColor: border,
					plotColorPalette: seriesColors.join(","),
				},
				fontFamily: "var(--font-text), Inter, sans-serif",
				...({ mutedColor: muted, accentColor: accent } as Anything),
			},
		};
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MermaidThemeSettingTab extends PluginSettingTab {
	plugin: MermaidThemePlugin;

	constructor(app: App, plugin: MermaidThemePlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.plugin.tab = this;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Diagram appearance" });
		containerEl.createEl("p", {
			text: "Choose a palette for Mermaid diagrams. Each preview shows how node fills, labels, and connectors work together.",
			cls: "mermaid-theme-intro",
		});

		for (const section of THEME_SECTIONS) {
			const sectionEl = containerEl.createDiv("mermaid-theme-section");
			sectionEl.createEl("h3", { text: section.title });
			sectionEl.createEl("p", { text: section.description, cls: "setting-item-description" });
			const gallery = sectionEl.createDiv("mermaid-theme-gallery");

			for (const id of section.ids) {
				const palette = THEME_PALETTES[id];
				const selected = this.plugin.settings.theme === id;
				const button = gallery.createDiv({
					cls: `mermaid-theme-card${selected ? " is-selected" : ""}`,
					attr: { role: "button", tabindex: "0", "aria-pressed": String(selected), "aria-label": `Use ${palette.name} theme` },
				});
				button.style.setProperty("--preview-bg", palette.bg);
				button.style.setProperty("--preview-fg", palette.fg);
				button.style.setProperty("--preview-accent", palette.accent);
				button.style.setProperty("--preview-muted", palette.muted);
				button.style.setProperty("--preview-surface", palette.surface);
				button.style.setProperty("--preview-border", palette.border);
				const previewColors = palette.seriesColors ?? [palette.accent, palette.muted, palette.border, palette.fg, palette.accent, palette.muted];
				previewColors.slice(0, 6).forEach((color, index) => button.style.setProperty(`--preview-series-${index + 1}`, color));

				const preview = button.createDiv("mermaid-theme-preview");
				preview.createDiv("mermaid-theme-preview-node is-series-1").setText("Start");
				preview.createDiv("mermaid-theme-preview-edge");
				preview.createDiv("mermaid-theme-preview-node is-series-2").setText("Decision");
				preview.createDiv("mermaid-theme-preview-edge is-muted");
				preview.createDiv("mermaid-theme-preview-node is-series-3").setText("Done");
				const swatches = button.createDiv("mermaid-theme-swatches");
				previewColors.slice(0, 6).forEach((_, index) => swatches.createSpan({ cls: `mermaid-theme-swatch series-${index + 1}` }));
				const caption = button.createDiv("mermaid-theme-card-caption");
				caption.createSpan({ text: palette.name });
				caption.createSpan({ text: palette.group, cls: "mermaid-theme-mode" });
				const selectTheme = async () => {
					this.plugin.settings.theme = id;
					await this.plugin.saveSettings();
					this.plugin.setTheme(id);
				};
				button.addEventListener("click", selectTheme);
				button.addEventListener("keydown", (event: KeyboardEvent) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						void selectTheme();
					}
				});
			}
		}

		new Setting(containerEl)
			.setName("Use custom theme")
			.setDesc(
				"Use your selected palette as a starting point, then override Mermaid theme settings with JSON below."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.tweakStyle)
					.onChange(async (value) => {
						this.plugin.settings.tweakStyle = value;
						await this.plugin.saveSettings();
						this.plugin.setTheme(this.plugin.settings.theme);
					});
			});

		new Setting(containerEl)
			.setName("Theme customizations")
			.setDesc(
				"Configure a mermaid conf in valid JSON. These get applied to the base theme."
			)
			.setClass("mermaid-themes-settings")
			.addTextArea((text) =>
				text
					.setPlaceholder(
						`{
	"theme": "base",
	"themeVariables":
	{
		"nodeTextColor": "#F00"
	}
}`
					)
					.setValue(
						JSON.stringify(
							this.plugin.settings.themeTweaks,
							null,
							"\t"
						)
					)
					.onChange(async (value) => {
						let theme = {};
						try {
							theme = JSON.parse(value.trim());
						} catch (e) {
							console.log("Error parsing JSON", e);
							return;
						}
						this.plugin.settings.themeTweaks = theme;
						// await this.plugin.saveSettings();
						// this.plugin.refreshMarkdownCodeBlockProcessor();
					})
			)
			.addButton((button) => {
				button.setButtonText("Save").onClick(async () => {
					await this.plugin.saveSettings();
					this.plugin.setTheme(this.plugin.settings.theme);
					this.display();
				});
			});
	}
}
