import { Component, For, Show, createMemo, createSignal, onCleanup } from "solid-js";
import { invoke } from "../../backend";
import { formatMonthYear, getMonthLabels, getWeekdayLabels, t } from "../../i18n";
import { vaultStore, type VaultEntry } from "../../stores/vault";
import { displayName } from "../../utils/displayName";

interface CalendarDay {
  day: number;
  dateStr: string;
  hasNote: boolean;
  hasDailyNote: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
}

type CalendarFileGroup = "daily" | "report" | "minutes" | "other";

function calendarFileInfo(name: string, date: string): { group: CalendarFileGroup; title: string; reporter?: string } {
  if (name === `${date}.md`) return { group: "daily", title: t("calendar.dailyNote") };
  const prefix = `${date}_`;
  if (!name.startsWith(prefix)) return { group: "other", title: displayName(name) };
  const stem = name.replace(/\.md$/i, "").slice(prefix.length);
  const group: CalendarFileGroup = stem.startsWith("minutes_") ? "minutes" : stem.startsWith("report_") ? "report" : "other";
  const labeled = group === "minutes" ? stem.slice("minutes_".length) : group === "report" ? stem.slice("report_".length) : stem;
  const splitAt = labeled.lastIndexOf("_");
  const title = splitAt > 0 ? labeled.slice(0, splitAt) : labeled;
  const reporter = splitAt > 0 ? labeled.slice(splitAt + 1) : undefined;
  return { group, title, reporter };
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayStr(): string {
  const now = new Date();
  return toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
}

function dailyNotePath(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `diary/${year}/${month}/${dateStr}.md`;
}

function collectDiaryDates(entries: VaultEntry[], result: { all: Set<string>; daily: Set<string> }) {
  for (const entry of entries) {
    if (entry.is_dir && entry.children) {
      collectDiaryDates(entry.children, result);
      continue;
    }

    if (!entry.relative_path.startsWith("diary/") || entry.extension !== "md") {
      continue;
    }

    const match = entry.name.match(/^(\d{4}-\d{2}-\d{2})(?:_|\.md$)/);
    if (match) {
      result.all.add(match[1]);
      if (entry.name === `${match[1]}.md`) result.daily.add(match[1]);
    }
  }
}

export const Calendar: Component = () => {
  const [year, setYear] = createSignal(new Date().getFullYear());
  const [month, setMonth] = createSignal(new Date().getMonth());
  // Currently-selected date in the grid (highlighted with an outline).
  // Drives the bottom "New note for selected date" button. Defaults to
  // today on first mount so the bottom button does something useful
  // even before the user clicks anything.
  const [selectedDate, setSelectedDate] = createSignal<string>(todayStr());
  const [documentType, setDocumentType] = createSignal<"report" | "minutes" | null>(null);
  const [reporterName, setReporterName] = createSignal("");
  const [documentTitle, setDocumentTitle] = createSignal("");
  // Currently-hovered date. Tracked as a signal so the background
  // style is computed reactively instead of being mutated imperatively
  // via `event.currentTarget.style`. Imperative mutation has a bug:
  // when the user hovers a day, then clicks it, the day re-renders
  // with `selectedDate === day.dateStr`, and the subsequent mouseLeave
  // is gated on `!isSelected()` and silently no-ops — leaving the
  // hover background stuck on the cell forever. With a signal-driven
  // approach, the background is recomputed on every relevant signal
  // change and there's no stale inline style to forget about.
  const [hoveredDate, setHoveredDate] = createSignal<string | null>(null);
  // Year/month picker popup state
  const [showPicker, setShowPicker] = createSignal(false);
  const [pickerYear, setPickerYear] = createSignal(new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = createSignal(new Date().getMonth());
  // (No right-click context menu state any more — date right-click
  // creates the note immediately, year/month right-click goes to today,
  // both are imperative one-shot actions with no popup.)

  const existingNotes = createMemo(() => {
    const result = { all: new Set<string>(), daily: new Set<string>() };
    collectDiaryDates(vaultStore.fileTree(), result);
    return result;
  });

  const selectedDateFiles = createMemo(() => {
    const date = selectedDate();
    const [yyyy, mm] = date.split("-");
    const folder = `diary/${yyyy}/${mm}/`;
    const result: VaultEntry[] = [];
    const visit = (entries: VaultEntry[]) => {
      for (const entry of entries) {
        if (entry.is_dir) {
          if (entry.children) visit(entry.children);
          continue;
        }
        if (
          entry.extension.toLowerCase() === "md" &&
          entry.relative_path.startsWith(folder) &&
          (entry.name === `${date}.md` || entry.name.startsWith(`${date}_`))
        ) {
          result.push(entry);
        }
      }
    };
    visit(vaultStore.fileTree());
    return result.sort((a, b) => a.name.localeCompare(b.name));
  });

  const selectedDateFileGroups = createMemo(() => {
    const groups: { id: CalendarFileGroup; label: string; entries: VaultEntry[] }[] = [
      { id: "daily", label: t("calendar.dailyNote"), entries: [] },
      { id: "report", label: t("calendar.newDailyReport"), entries: [] },
      { id: "minutes", label: t("calendar.newMeetingMinutes"), entries: [] },
      { id: "other", label: t("calendar.otherNotes"), entries: [] },
    ];
    for (const entry of selectedDateFiles()) {
      const info = calendarFileInfo(entry.name, selectedDate());
      groups.find((group) => group.id === info.group)?.entries.push(entry);
    }
    return groups.filter((group) => group.entries.length > 0);
  });

  const weekdayLabels = createMemo(() => getWeekdayLabels());
  const monthLabels = createMemo(() => getMonthLabels());

  const calendarDays = createMemo<CalendarDay[]>(() => {
    const days: CalendarDay[] = [];
    const now = todayStr();
    const firstDay = new Date(year(), month(), 1);
    const lastDay = new Date(year(), month() + 1, 0);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const prevMonthLast = new Date(year(), month(), 0).getDate();
    for (let index = startDow - 1; index >= 0; index -= 1) {
      const day = prevMonthLast - index;
      const prevMonth = month() === 0 ? 11 : month() - 1;
      const prevYear = month() === 0 ? year() - 1 : year();
      const dateStr = toDateStr(prevYear, prevMonth, day);
      days.push({
        day,
        dateStr,
        hasNote: existingNotes().all.has(dateStr),
        hasDailyNote: existingNotes().daily.has(dateStr),
        isCurrentMonth: false,
        isToday: dateStr === now,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const dateStr = toDateStr(year(), month(), day);
      days.push({
        day,
        dateStr,
        hasNote: existingNotes().all.has(dateStr),
        hasDailyNote: existingNotes().daily.has(dateStr),
        isCurrentMonth: true,
        isToday: dateStr === now,
      });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day += 1) {
      const nextMonth = month() === 11 ? 0 : month() + 1;
      const nextYear = month() === 11 ? year() + 1 : year();
      const dateStr = toDateStr(nextYear, nextMonth, day);
      days.push({
        day,
        dateStr,
        hasNote: existingNotes().all.has(dateStr),
        hasDailyNote: existingNotes().daily.has(dateStr),
        isCurrentMonth: false,
        isToday: dateStr === now,
      });
    }

    return days;
  });

  const goPrevMonth = () => {
    if (month() === 0) {
      setMonth(11);
      setYear((value) => value - 1);
      return;
    }
    setMonth((value) => value - 1);
  };

  const goNextMonth = () => {
    if (month() === 11) {
      setMonth(0);
      setYear((value) => value + 1);
      return;
    }
    setMonth((value) => value + 1);
  };

  const goToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(todayStr());
  };

  const openDailyNote = async (dateStr: string) => {
    if (!existingNotes().daily.has(dateStr)) return;
    const path = dailyNotePath(dateStr);
    try {
      await vaultStore.openFile(path);
    } catch (error) {
      console.error("Failed to open daily note:", error);
    }
  };

  // Create the daily note for the given date AND open it. Used by the
  // right-click context menu and the bottom "new note for selected
  // date" button. Idempotent: if the note already exists, just opens
  // it (no overwrite).
  const createOrOpenDailyNote = async (dateStr: string) => {
    const path = dailyNotePath(dateStr);
    // Try to open first — if it exists in the vault, openFile succeeds
    // and we're done. We can't rely solely on `existingNotes()` because
    // the file tree might not have refreshed yet.
    if (existingNotes().daily.has(dateStr)) {
      try {
        await vaultStore.openFile(path);
        return;
      } catch {
        // Fall through and create.
      }
    }

    try {
      const [yyyy, mm] = dateStr.split("-");
      // Best-effort directory creation. `create_dir` is idempotent on
      // existing dirs but errors get bubbled, so we swallow them.
      await invoke("create_dir", { relativePath: "diary" }).catch(() => {});
      await invoke("create_dir", { relativePath: `diary/${yyyy}` }).catch(() => {});
      await invoke("create_dir", { relativePath: `diary/${yyyy}/${mm}` }).catch(() => {});
      await vaultStore.createFile(path, "");
      await vaultStore.openFile(path);
    } catch (error) {
      console.error("Failed to create daily note:", error);
    }
  };

  const startDocument = (type: "report" | "minutes") => {
    setReporterName("");
    setDocumentTitle("");
    setDocumentType(type);
  };

  const createDocument = async () => {
    const type = documentType();
    const reporter = reporterName().trim();
    const title = documentTitle().trim();
    if (!type || !reporter || !title) return;
    const safePart = (value: string) => value
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "-")
      .replace(/\s+/g, " ")
      .replace(/[. ]+$/g, "")
      .trim() || "document";
    const [yyyy, mm] = selectedDate().split("-");
    const folder = `diary/${yyyy}/${mm}`;
    const typeName = type === "report" ? "report" : "minutes";
    const base = `${selectedDate()}_${typeName}_${safePart(title)}_${safePart(reporter)}`;
    const paths = new Set<string>();
    const collectPaths = (entries: VaultEntry[]) => {
      for (const entry of entries) {
        paths.add(entry.relative_path);
        if (entry.children) collectPaths(entry.children);
      }
    };
    collectPaths(vaultStore.fileTree());
    let path = `${folder}/${base}.md`;
    let suffix = 2;
    while (paths.has(path)) path = `${folder}/${base}-${suffix++}.md`;

    const lines = [
      `# ${title}`,
      "",
      `- ${t("calendar.documentDate")}: ${selectedDate()}`,
      `- ${t("calendar.reporterName")}: ${reporter}`,
      "",
    ];
    const sections = type === "report"
      ? ["calendar.reportDone", "calendar.reportNext", "calendar.reportIssues"]
      : ["calendar.minutesAgenda", "calendar.minutesParticipants", "calendar.minutesDiscussion", "calendar.minutesDecisions", "calendar.minutesActions", "calendar.minutesNextMeeting"];
    for (const section of sections) lines.push(`## ${t(section)}`, "", "");

    try {
      await invoke("create_dir", { relativePath: "diary" }).catch(() => {});
      await invoke("create_dir", { relativePath: `diary/${yyyy}` }).catch(() => {});
      await invoke("create_dir", { relativePath: folder }).catch(() => {});
      await vaultStore.createFile(path, `${lines.join("\n")}\n`);
      setDocumentType(null);
      await vaultStore.openFile(path);
    } catch (error) {
      console.error("Failed to create calendar document:", error);
    }
  };

  const handleDayClick = (day: CalendarDay) => {
    // Single-click selects (and jumps month if needed). Double-click
    // (or single-click on a date that already has a note) opens the
    // note. We treat the second click on the same date as "open".
    const wasSelected = selectedDate() === day.dateStr;
    setSelectedDate(day.dateStr);
    // If the user clicked an out-of-month day, also jump the visible
    // month so the selected day stays visible.
    if (!day.isCurrentMonth) {
      const [y, m] = day.dateStr.split("-").map(Number);
      setYear(y);
      setMonth(m - 1);
    }
    // Auto-open if the date already has a note (one click = open).
    // For dates without a note, the user has to use the bottom button
    // or right-click → create.
    if (day.hasDailyNote && wasSelected) {
      void openDailyNote(day.dateStr);
    } else if (day.hasDailyNote) {
      void openDailyNote(day.dateStr);
    }
  };

  // Right-click on a calendar date now ALWAYS creates-or-opens that
  // date's daily note immediately. The previous behaviour was to pop
  // up a one-item context menu first ("Create note for this date" or
  // "Open note for this date"), which the user pointed out is one
  // click of friction for no benefit — the menu only ever has one
  // option anyway, since the action is determined entirely by whether
  // the date already has a note. So we skip the menu and just call
  // the same handler the bottom button uses.
  const handleDayContextMenu = (event: MouseEvent, day: CalendarDay) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedDate(day.dateStr);
    if (!day.isCurrentMonth) {
      const [y, m] = day.dateStr.split("-").map(Number);
      setYear(y);
      setMonth(m - 1);
    }
    void createOrOpenDailyNote(day.dateStr);
  };

  // --- Year/month picker popup -------------------------------------
  const openPicker = () => {
    setPickerYear(year());
    setPickerMonth(month());
    setShowPicker(true);
  };

  const closePicker = () => setShowPicker(false);

  const confirmPicker = () => {
    setYear(pickerYear());
    setMonth(pickerMonth());
    setShowPicker(false);
  };

  // Close picker on outside click — installed lazily while the picker
  // is open so we don't pay the listener cost otherwise.
  let pickerRef: HTMLDivElement | undefined;
  const handleDocClick = (event: MouseEvent) => {
    if (!showPicker()) return;
    if (pickerRef && !pickerRef.contains(event.target as Node)) {
      closePicker();
    }
  };
  document.addEventListener("mousedown", handleDocClick, true);
  onCleanup(() => document.removeEventListener("mousedown", handleDocClick, true));

  // --- Render ------------------------------------------------------
  return (
    <div style={{ padding: "8px", position: "relative" }}>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "margin-bottom": "8px",
          gap: "4px",
        }}
      >
        <button
          onClick={goPrevMonth}
          title="‹"
          style={navButtonStyle}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          ‹
        </button>

        {/*
          Year/month label has TWO actions on the same button:
            - LEFT click  → open the year/month picker popup
            - RIGHT click → jump back to today
          The previous design had a separate ⊙ icon button next to
          this label, but the user prefers consolidating both
          behaviours onto the label so the calendar header has fewer
          icons to scan. The tooltip shows both actions so the
          right-click affordance is discoverable.
        */}
        <button
          onClick={openPicker}
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            goToday();
          }}
          title={`${t("calendar.pickYearMonth")} · ${t("calendar.backToToday")}`}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--mz-text-primary)",
            cursor: "pointer",
            "font-size": "var(--mz-font-size-sm)",
            "font-weight": "600",
            "font-family": "var(--mz-font-sans)",
            padding: "2px 8px",
            "border-radius": "var(--mz-radius-sm)",
            flex: "1",
          }}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          {formatMonthYear(year(), month())}
        </button>

        <button
          onClick={goNextMonth}
          title="›"
          style={navButtonStyle}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          ›
        </button>
      </div>

      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(7, 1fr)",
          "text-align": "center",
          "margin-bottom": "4px",
        }}
      >
        <For each={weekdayLabels()}>
          {(weekday) => (
            <div
              style={{
                padding: "2px 0",
                "font-size": "10px",
                color: "var(--mz-text-muted)",
                "font-weight": "500",
              }}
            >
              {weekday}
            </div>
          )}
        </For>
      </div>

      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(7, 1fr)",
          gap: "1px",
        }}
      >
        <For each={calendarDays()}>
          {(day) => {
            const isSelected = () => selectedDate() === day.dateStr;
            const isHovered = () => hoveredDate() === day.dateStr;
            // Background priority: today > hover (when not selected) >
            // transparent. Selection is shown via the border, NOT the
            // background, so a selected-and-hovered cell still gets
            // the hover tint to confirm pointer is over it.
            const bgColor = () => {
              if (day.isToday) return "var(--mz-accent)";
              if (isHovered()) return "var(--mz-bg-hover)";
              return "transparent";
            };
            return (
              <button
                onClick={() => handleDayClick(day)}
                onContextMenu={(event) => handleDayContextMenu(event, day)}
                onMouseEnter={() => setHoveredDate(day.dateStr)}
                onMouseLeave={() => {
                    // Only clear if we're still the hovered cell —
                    // protects against out-of-order enter/leave events
                    // when SolidJS re-renders the For mid-hover.
                    if (hoveredDate() === day.dateStr) setHoveredDate(null);
                }}
                title={day.dateStr}
                style={{
                  width: "100%",
                  "aspect-ratio": "1",
                  border: isSelected() && !day.isToday
                    ? "1px solid var(--mz-accent)"
                    : "1px solid transparent",
                  background: bgColor(),
                  color: day.isToday
                    ? "var(--mz-text-on-accent)"
                    : day.isCurrentMonth
                      ? "var(--mz-text-primary)"
                      : "var(--mz-text-muted)",
                  // Now ALL days are clickable (selectable), not just
                  // the ones with existing notes. The cursor reflects
                  // that.
                  cursor: "pointer",
                  "border-radius": "var(--mz-radius-sm)",
                  "font-size": "11px",
                  "font-family": "var(--mz-font-sans)",
                  "font-weight": day.isToday ? "700" : day.hasNote ? "600" : "400",
                  position: "relative",
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  opacity: day.isCurrentMonth ? "1" : "0.4",
                  "box-sizing": "border-box",
                }}
              >
                {day.day}
                <Show when={day.hasNote}>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "4px",
                      height: "4px",
                      "border-radius": "50%",
                      background: day.isToday ? "var(--mz-text-on-accent)" : "var(--mz-accent)",
                    }}
                  />
                </Show>
              </button>
            );
          }}
        </For>
      </div>

      {/* Bottom action button — creates / opens the note for the
          currently selected date. Shows a different label depending
          on whether the date already has a note. */}
      <button
        onClick={() => void createOrOpenDailyNote(selectedDate())}
        style={{
          width: "100%",
          padding: "8px",
          "margin-top": "8px",
          border: "1px solid var(--mz-border)",
          background: "transparent",
          color: "var(--mz-text-secondary)",
          cursor: "pointer",
          "border-radius": "var(--mz-radius-md)",
          "font-size": "var(--mz-font-size-xs)",
          "font-family": "var(--mz-font-sans)",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = "var(--mz-accent)";
          event.currentTarget.style.color = "var(--mz-accent)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = "var(--mz-border)";
          event.currentTarget.style.color = "var(--mz-text-secondary)";
        }}
      >
        {selectedDate() === todayStr()
          ? t("calendar.openToday")
          : `${t("calendar.newNoteForSelected")} (${selectedDate()})`}
      </button>

      <div style={{ display: "flex", gap: "6px", "margin-top": "6px" }}>
        <button onClick={() => startDocument("report")} style={templateButtonStyle}>
          {t("calendar.newDailyReport")}
        </button>
        <button onClick={() => startDocument("minutes")} style={templateButtonStyle}>
          {t("calendar.newMeetingMinutes")}
        </button>
      </div>

      <div style={{ "margin-top": "10px", "border-top": "1px solid var(--mz-border)", padding: "8px 2px 0" }}>
        <div style={{ "margin-bottom": "5px", color: "var(--mz-text-muted)", "font-size": "10px", "font-weight": "600" }}>
          {t("calendar.filesForDate", { date: selectedDate() })}
        </div>
        <Show
          when={selectedDateFiles().length > 0}
          fallback={<div style={{ padding: "4px 2px", color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-xs)" }}>{t("calendar.noFilesForDate")}</div>}
        >
          <div style={{ display: "flex", "flex-direction": "column", gap: "7px", "max-height": "180px", "overflow-y": "auto" }}>
            <For each={selectedDateFileGroups()}>
              {(group) => (
                <section>
                  <div style={{ padding: "3px 5px 2px", color: "var(--mz-text-muted)", "font-size": "9px", "font-weight": "700", "text-transform": "uppercase", "letter-spacing": "0.04em" }}>{group.label}</div>
                  <For each={group.entries}>
                    {(entry) => {
                      const info = () => calendarFileInfo(entry.name, selectedDate());
                      return (
                        <button
                          title={`${info().title}${info().reporter ? ` — ${info().reporter}` : ""}\n${entry.relative_path}`}
                          onClick={() => { void vaultStore.openFile(entry.relative_path).catch((error) => console.error("Failed to open calendar file:", error)); }}
                          style={{ display: "flex", "flex-direction": "column", gap: "1px", width: "100%", padding: "4px 6px", border: "none", background: "transparent", color: "var(--mz-text-secondary)", cursor: "pointer", "text-align": "left", "border-radius": "var(--mz-radius-sm)", "font-size": "var(--mz-font-size-xs)", "font-family": "var(--mz-font-sans)" }}
                          onMouseEnter={(event) => { event.currentTarget.style.background = "var(--mz-bg-hover)"; }}
                          onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{ width: "100%", overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "font-weight": "600" }}>{info().title}</span>
                          <Show when={info().reporter}>
                            {(reporter) => <span style={{ color: "var(--mz-text-muted)", "font-size": "10px" }}>{reporter()}</span>}
                          </Show>
                        </button>
                      );
                    }}
                  </For>
                </section>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Show when={documentType()}>
        {(type) => (
          <div
            role="presentation"
            onClick={(event) => { if (event.target === event.currentTarget) setDocumentType(null); }}
            style={{
              position: "fixed",
              inset: "0",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              background: "rgba(0,0,0,0.48)",
              "z-index": "20000",
              padding: "16px",
            }}
          >
            <form
              onSubmit={(event) => { event.preventDefault(); void createDocument(); }}
              style={{
                width: "min(420px, 100%)",
                display: "flex",
                "flex-direction": "column",
                gap: "12px",
                padding: "22px",
                background: "var(--mz-bg-secondary)",
                border: "1px solid var(--mz-border-strong)",
                "border-radius": "var(--mz-radius-lg)",
                "box-shadow": "0 12px 40px rgba(0,0,0,0.35)",
                "font-family": "var(--mz-font-sans)",
              }}
            >
              <h2 style={{ margin: "0 0 4px", color: "var(--mz-text-primary)", "font-size": "var(--mz-font-size-lg)" }}>
                {type() === "report" ? t("calendar.reportDialogTitle") : t("calendar.minutesDialogTitle")}
              </h2>
              <div style={{ color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-sm)" }}>{selectedDate()}</div>
              <label style={fieldLabelStyle}>
                {t("calendar.reporterName")}
                <input required value={reporterName()} onInput={(event) => setReporterName(event.currentTarget.value)} style={fieldInputStyle} />
              </label>
              <label style={fieldLabelStyle}>
                {t("calendar.documentTitle")}
                <input required value={documentTitle()} onInput={(event) => setDocumentTitle(event.currentTarget.value)} style={fieldInputStyle} />
              </label>
              <div style={{ display: "flex", "justify-content": "flex-end", gap: "8px", "margin-top": "4px" }}>
                <button type="button" onClick={() => setDocumentType(null)} style={dialogButtonStyle(false)}>{t("common.cancel")}</button>
                <button type="submit" style={dialogButtonStyle(true)}>{t("calendar.createDocument")}</button>
              </div>
            </form>
          </div>
        )}
      </Show>

      {/* Year/month picker popup — overlays the calendar grid */}
      <Show when={showPicker()}>
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            top: "44px",
            left: "8px",
            right: "8px",
            background: "var(--mz-bg-secondary)",
            border: "1px solid var(--mz-border-strong)",
            "border-radius": "var(--mz-radius-md)",
            "box-shadow": "0 8px 24px rgba(0,0,0,0.35)",
            padding: "12px",
            "z-index": "100",
          }}
        >
          <div
            style={{
              "font-size": "11px",
              color: "var(--mz-text-muted)",
              "font-weight": "600",
              "text-transform": "uppercase",
              "letter-spacing": "0.5px",
              "margin-bottom": "6px",
            }}
          >
            {t("calendar.year")}
          </div>
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              gap: "8px",
              "margin-bottom": "12px",
            }}
          >
            <button
              onClick={() => setPickerYear((y) => y - 1)}
              style={navButtonStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              ‹
            </button>
            {/*
              Use type="text" instead of type="number" so the browser
              does NOT render the up/down spinner buttons inside the
              input. We do numeric validation ourselves in onInput by
              stripping non-digits and parsing the result. Fixed-width
              (90px) instead of flex:1 so the input doesn't grow and
              push the `›` next-year button outside the popup body.
              The popup is only ~280px wide on the default sidebar,
              and a flex:1 input ate too much horizontal space.
            */}
            <input
              type="text"
              inputMode="numeric"
              value={pickerYear()}
              onInput={(e) => {
                const target = e.currentTarget as HTMLInputElement;
                // Strip anything that isn't a digit, then parse.
                const cleaned = target.value.replace(/[^0-9]/g, "");
                if (cleaned.length === 0) return;
                const v = parseInt(cleaned, 10);
                if (!Number.isNaN(v)) setPickerYear(v);
                // If the user typed a non-digit, write the cleaned
                // value back so the cursor stays at the right place.
                if (cleaned !== target.value) {
                    target.value = cleaned;
                }
              }}
              style={{
                width: "90px",
                "flex-shrink": "0",
                background: "var(--mz-bg-primary)",
                color: "var(--mz-text-primary)",
                border: "1px solid var(--mz-border)",
                "border-radius": "var(--mz-radius-sm)",
                padding: "4px 8px",
                "font-size": "var(--mz-font-size-sm)",
                "font-family": "var(--mz-font-sans)",
                "text-align": "center",
                "box-sizing": "border-box",
              }}
            />
            <button
              onClick={() => setPickerYear((y) => y + 1)}
              style={navButtonStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              ›
            </button>
          </div>

          <div
            style={{
              "font-size": "11px",
              color: "var(--mz-text-muted)",
              "font-weight": "600",
              "text-transform": "uppercase",
              "letter-spacing": "0.5px",
              "margin-bottom": "6px",
            }}
          >
            {t("calendar.month")}
          </div>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(3, 1fr)",
              gap: "4px",
              "margin-bottom": "12px",
            }}
          >
            <For each={monthLabels()}>
              {(label, idx) => {
                const isPickerMonth = () => pickerMonth() === idx();
                return (
                  <button
                    onClick={() => setPickerMonth(idx())}
                    style={{
                      padding: "6px 4px",
                      border: "1px solid",
                      "border-color": isPickerMonth()
                        ? "var(--mz-accent)"
                        : "var(--mz-border)",
                      background: isPickerMonth()
                        ? "var(--mz-accent-subtle)"
                        : "transparent",
                      color: isPickerMonth()
                        ? "var(--mz-accent)"
                        : "var(--mz-text-primary)",
                      cursor: "pointer",
                      "border-radius": "var(--mz-radius-sm)",
                      "font-size": "11px",
                      "font-family": "var(--mz-font-sans)",
                      "font-weight": isPickerMonth() ? "600" : "400",
                    }}
                    onMouseEnter={(event) => {
                      if (!isPickerMonth()) {
                        event.currentTarget.style.background = "var(--mz-bg-hover)";
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!isPickerMonth()) {
                        event.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {label}
                  </button>
                );
              }}
            </For>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => {
                const now = new Date();
                setPickerYear(now.getFullYear());
                setPickerMonth(now.getMonth());
              }}
              style={{
                flex: "1",
                padding: "6px",
                border: "1px solid var(--mz-border)",
                background: "transparent",
                color: "var(--mz-text-secondary)",
                cursor: "pointer",
                "border-radius": "var(--mz-radius-sm)",
                "font-size": "var(--mz-font-size-xs)",
                "font-family": "var(--mz-font-sans)",
              }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              {t("calendar.backToToday")}
            </button>
            <button
              onClick={confirmPicker}
              style={{
                flex: "1",
                padding: "6px",
                border: "none",
                background: "var(--mz-accent)",
                color: "var(--mz-text-on-accent)",
                cursor: "pointer",
                "border-radius": "var(--mz-radius-sm)",
                "font-size": "var(--mz-font-size-xs)",
                "font-weight": "600",
                "font-family": "var(--mz-font-sans)",
              }}
            >
              {t("calendar.confirm")}
            </button>
          </div>
        </div>
      </Show>

    </div>
  );
};

const navButtonStyle = {
  width: "28px",
  height: "28px",
  border: "none",
  background: "transparent",
  color: "var(--mz-text-secondary)",
  cursor: "pointer",
  "border-radius": "var(--mz-radius-sm)",
  "font-size": "16px",
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
  "font-family": "var(--mz-font-sans)",
  "flex-shrink": "0",
} as const;

const templateButtonStyle = {
  flex: "1",
  padding: "7px 4px",
  border: "1px solid var(--mz-border)",
  background: "var(--mz-bg-secondary)",
  color: "var(--mz-text-secondary)",
  cursor: "pointer",
  "border-radius": "var(--mz-radius-md)",
  "font-size": "var(--mz-font-size-xs)",
  "font-family": "var(--mz-font-sans)",
} as const;

const fieldLabelStyle = {
  display: "flex",
  "flex-direction": "column",
  gap: "6px",
  color: "var(--mz-text-secondary)",
  "font-size": "var(--mz-font-size-sm)",
} as const;

const fieldInputStyle = {
  width: "100%",
  "box-sizing": "border-box",
  padding: "9px 10px",
  border: "1px solid var(--mz-border)",
  "border-radius": "var(--mz-radius-sm)",
  background: "var(--mz-bg-primary)",
  color: "var(--mz-text-primary)",
  "font-size": "var(--mz-font-size-sm)",
  "font-family": "var(--mz-font-sans)",
} as const;

function dialogButtonStyle(primary: boolean) {
  return {
    padding: "7px 12px",
    border: primary ? "1px solid var(--mz-accent)" : "1px solid var(--mz-border)",
    "border-radius": "var(--mz-radius-sm)",
    background: primary ? "var(--mz-accent)" : "transparent",
    color: primary ? "var(--mz-text-on-accent)" : "var(--mz-text-secondary)",
    cursor: "pointer",
    "font-size": "var(--mz-font-size-sm)",
    "font-family": "var(--mz-font-sans)",
  } as const;
}

function hoverIn(event: MouseEvent) {
  (event.currentTarget as HTMLElement).style.background = "var(--mz-bg-hover)";
}

function hoverOut(event: MouseEvent) {
  (event.currentTarget as HTMLElement).style.background = "transparent";
}
