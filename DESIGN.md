---
name: Care4RareDiseases
description: A light, flat clinical workspace where each rare-disease case carries a woven strip of its own evidence.
colors:
  background: "#faf9f6"
  foreground: "#1a1916"
  body: "#37342e"
  card: "#ffffff"
  surface: "#f4f2ec"
  muted: "#f1eee6"
  secondary: "#efece4"
  muted-foreground: "#5f5b52"
  border: "#e6e2d8"
  input: "#8f8a7e"
  primary: "#13523b"
  primary-hover: "#0e3f2d"
  primary-foreground: "#ffffff"
  sidebar-foreground: "#d4e3da"
  gold: "#c9971c"
  destructive: "#9b2c24"
  destructive-soft: "#f8e9e6"
  pathogenic: "#9b2c24"
  uncertain: "#6b675e"
  warning: "#7d5300"
  warning-soft: "#fbf2dc"
  success: "#1f6143"
  success-soft: "#e6f0ea"
  chart-4: "#2e4a7d"
typography:
  display:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.06em"
  caption:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  rail-label:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.02em"
  mono:
    fontFamily: "Source Code Pro, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  xs: "1px"
  sm: "2px"
  md: "3px"
  lg: "4px"
  xl: "4px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
  4xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.primary}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  plate:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  page-header:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.headline}"
    padding: "16px 24px"
  nav-rail:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.sidebar-foreground}"
    width: "76px"
  nav-item-active:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.rail-label}"
    height: "56px"
  case-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    padding: "12px 20px"
  case-row-selected:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
  tab-active:
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    padding: "4px 2px 8px"
  acmg-tag-pathogenic:
    backgroundColor: "{colors.card}"
    textColor: "{colors.pathogenic}"
    typography: "{typography.caption}"
    padding: "4px 10px"
  acmg-tag-other:
    backgroundColor: "{colors.card}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    padding: "4px 10px"
---

# Design System: Care4RareDiseases

## Overview

**Creative North Star: "The Kente Strip"**

Evidence is woven, not decorated. The system borrows the logic of strip-woven cloth: narrow flat bands laid side by side, each one carrying meaning by being filled or hollow. Every case in the app carries its own strip: one block per observed phenotype, filled forest green when the primary variant's gene explains it, hollow when it does not, and closed by a final block for the ACMG class. The same weave appears small in the case list and full-width in the case header, and the brand mark is the same idea at icon size: four flat bands (gold, white, red, ink) crossed by a green weft.

The ground is a warm off-white page under ink text. White plates hold the selected case and the work panels; quiet warm-grey fills mark inset areas. Density is clinical and calm: 15px body text at 1.5, 1px rules between rows instead of boxes inside boxes, and a three-pane layout (green rail, case list, workspace) built for clinicians reading cases for hours in bright clinic rooms. Colour is scarce and always means something. Green means navigation or "you can press this", gold means "selected", red means Pathogenic or destructive. Nothing else gets a hue.

The system rejects the category default of purple gradient cards, glowing pills and KPI tiles. It is light-only by construction, flat everywhere, and never uses colour alone to carry status.

**Key Characteristics:**
- Flat colour only: no gradients, glows or tinted shadows.
- A green rail, a gold selection mark, and red that is kept for Pathogenic and destructive.
- Square geometry (1-4px corners) and 1px rules.
- The evidence weave: filled means explained, hollow means unexplained, and dashed means analysis not run.
- Status is always a word plus a mark.
- Source Sans 3 throughout, with Source Code Pro reserved for HGVS notation and literal file samples.

## Colors

A warm-neutral paper-and-ink palette with three committed hues, each assigned one job.

### Primary
- **Forest Weft Green** (primary): The nav rail ground and every pressable thing, including primary buttons, outline-button strokes, link-style summaries, active tab underlines, the focus ring, the text caret, and the filled "explained" blocks of the evidence weave. Contrast 8.7:1 on the page ground.
- **Deep Weft Green** (primary-hover): Hover state for green buttons and the background of the active rail item.
- **Rail Mist** (sidebar-foreground): Resting label and icon colour on the green rail.

### Secondary
- **Selection Gold** (gold): Marks selection and nothing else. It is the 4px bar on the active rail item and the 4px inset on the selected case row. Gold is a fill, never text. Text selection uses a pale gold wash (#f0dfae) under ink.

### Tertiary
- **Pathogenic Red** (pathogenic / destructive): One hue with two meanings, both serious: an ACMG Pathogenic or Likely pathogenic classification, and a destructive action. Pathogenic is drawn as a filled red mark and Likely pathogenic as an outlined red mark. Every other class is grey. Contrast 7.2:1. **Red Wash** (destructive-soft) is the hover fill for remove buttons and the ground of error banners.

### Neutral
- **Warm Paper** (background): Page ground, case-list ground.
- **Ink** (foreground): Headings, values, current lifecycle stage. 16.7:1.
- **Body Ink** (body): Long-form text and secondary values. 11.8:1.
- **Plate White** (card): Plates, page headers, the selected case row, inputs.
- **Inset Linen** (surface), **Muted Linen** (muted), **Quiet Linen** (secondary): Inset panels, skeletons, disabled chips, secondary buttons.
- **Muted Ink** (muted-foreground): Sub-lines, micro-labels, captions, inactive tabs. 6.4:1.
- **Linen Rule** (border): Every 1px rule and plate border.
- **Field Stroke** (input): Input borders and hollow or dashed evidence strokes. 3.3:1 against the page.
- **Unclassified Grey** (uncertain): The mark for VUS, benign and any non-pathogenic class.
- **Status pairs**: warning on warning-soft (6.4:1), success on success-soft (7.0:1). They are used for banners and notices, always with a word.
- **Chart Indigo** (chart-4): A categorical chart colour only. Charts run green, gold, red, indigo, then field grey, in that order.

### Named Rules
**The One Job Rule.** Each hue has one job. Green is for the rail and things you press. Gold is for selection. Red is for Pathogenic or destructive. If an element is none of these, it is neutral.

**The Flat Colour Rule.** Every colour is a flat fill. No gradients, glows, or tinted or coloured shadows anywhere.

**The Word-Plus-Mark Rule.** Status is never colour alone. Every classification, lifecycle stage and evidence block pairs a word ("Pathogenic", "Known feature", "Results ready") with a shape (filled, outlined, hollow, dashed, ticked).

## Typography

**Display Font:** Source Sans 3 (with ui-sans-serif, system-ui)
**Body Font:** Source Sans 3
**Label/Mono Font:** Source Code Pro (with ui-monospace, Menlo)

**Character:** One humanist sans does all the talking, from the 32px gene symbol to 12px rail labels, and is held together by weight rather than by family changes. Tabular numerals are on globally so counts and ages align.

### Hierarchy
- **Display** (700, 30px, line-height 1, -0.01em): The case ID in the workspace header. One per screen.
- **Figure** (700, 32px, line-height 1, -0.01em): The gene symbol inside the primary-variant plate, set as the plate's main value.
- **Headline** (700, 24px, -0.01em): The page title in the standard page header (Dashboard, Settings, Help, Reports, Data).
- **Title** (600, 20px): Dialog and empty-state headings.
- **Body** (400, 15px, 1.5): Default reading text, table values, tab labels (600).
- **Body small** (400, 14px): Buttons (600), helper text, secondary row text.
- **Label** (700, 13px, 0.06em, uppercase, muted ink): The heading of a plate or list section, such as "Primary variant", "Your cases · 10" or "Observed phenotypes · 3 of 3 known features of GATAD2B". The label is the section's only heading and often carries a count.
- **Caption** (400 or 600, 13px): Weave captions, case-row meta, ACMG tag text (700), lifecycle labels (600).
- **Rail label** (600, 12px, 0.02em): Nav rail item labels under their icons.
- **Mono** (500, 15px): HGVS notation (cDNA and protein change) and literal file-format samples.

### Named Rules
**The HGVS Mono Rule.** Monospace is used for HGVS notation and literal file or code samples only. Gene symbols, IDs and labels stay in Source Sans 3.

**The Micro-Label Rule.** Plate and list-section headings are uppercase 13px/700 labels in muted ink. Each label names the section it heads and is that section's heading. It is never an eyebrow stacked above another heading.

## Layout

The app shell is a horizontal three-pane frame at desktop width. It has a 76px forest-green rail, a 300px case list on the warm page ground with a right rule, and a fluid workspace. Standard screens (Dashboard, Settings, Help, Reports, Data) replace the list and workspace with one column. That column opens on the **page header**: a white bar with a 1px bottom rule, 16px by 24px padding, a 24px/700 title, and a muted sub-line beneath it. The patients workspace header is the same white bar with a bottom rule, widened to 36px side padding. It holds the 30px case ID and a muted demographics line, with underline tabs pushed right, then the full-width evidence weave and the lifecycle strip.

Workspace content sits in a max 1280px column with 24px padding. Plates form a two-column grid at `lg` with a 28px gap, or a 2:3 split for analysis panels with a 24px gap. Inside plates, rows are 10px top and bottom, separated by 1px rules. Definition lists use a 130px label column. Case rows are 12px by 20px.

Spacing steps observed: 4, 8, 12, 16, 20, 24, 28, 36px.

Responsive behaviour: standard screens collapse to a single column below `lg`. The patients three-pane layout is fixed-width and does not adapt below desktop (a known gap; see Do's and Don'ts).

## Elevation & Depth

The system is flat and uses tonal layers. Depth comes from paper versus plate (warm ground under white plates), 1px rules, and the gold inset that marks the selected row. Resting surfaces never cast shadows.

### Shadow Vocabulary
- **Overlay lift** (`box-shadow: 0 12px 32px -12px rgb(26 25 22 / 0.35)`): The analysis-progress modal. It is a neutral ink-tinted shadow, used only for blocking overlays.
- **Library overlay** (Tailwind `shadow-md` / `shadow-lg`, neutral black alpha): Popovers, menus, selects, dialogs and sheets from the component library.

### Named Rules
**The Flat-At-Rest Rule.** Plates, rows, buttons and headers have no shadow. Only floating overlays lift, and their shadow is neutral, never coloured.

## Shapes

The geometry is square and woven. Radius tokens run from 1px to 4px: buttons and inputs at 3px, plates at 4px, and evidence blocks, ACMG tags and lifecycle cells fully square. The only round forms are status dots (the lifecycle stage marks) and switch or slider thumbs. Structural rules are 1px. Evidence marks use a heavier 1.5px stroke (2px on the phenotype-list squares) so that filled, outlined, hollow and dashed read clearly at small sizes. Adjacent lifecycle cells overlap by 1px so they share a single rule. Evidence blocks are separated by a 1-2px gap, which reads like the seam between woven strips.

## Components

### Buttons
Solid, quiet and unmistakably pressable.
- **Shape:** Nearly square (3px), 36px tall; 32px small, 40px large, and 48px for the case's main "Run genotype–phenotype analysis" action.
- **Primary:** Forest green fill, white 14px/600 label, 16px side padding.
- **Hover / Focus:** Hover darkens to deep weft green. Focus shows a green ring.
- **Outline:** A 1.5px green stroke on white with a green label. Hover fills with success-soft. Used for "New case" and secondary actions.
- **Destructive:** Pathogenic red fill, white label.
- **Link:** Green text, underline on hover. The "Add phenotypes" disclosure uses this treatment.

### Chips
- **Style:** Common-term chips are white with a 1px rule and 14px body-ink text, square-cornered.
- **State:** Hover turns the border and text green. Once a term is added, the chip is disabled on a muted fill with muted text.

### Cards / Containers (Plates)
- **Corner Style:** 4px.
- **Background:** Plate white on the warm page.
- **Shadow Strategy:** None (see Elevation & Depth).
- **Border:** 1px linen rule.
- **Internal Padding:** 24px. A plate opens with its micro-label heading (16px below it), and its contents are ruled rows.

### Inputs / Fields
- **Style:** 36px tall, 3px corners, 1px field-stroke border (3.3:1), white fill where placed on the page ground.
- **Focus:** The border turns green, with a translucent green ring.
- **Error:** Red border.

### Navigation
- **Rail:** 76px forest green, brand mark at the top, then 56px items with a 20px line icon over a 12px/600 label in rail mist.
- **Active item:** Deep weft green fill, white label, and a 4px gold bar on the left edge inset 8px top and bottom.
- **Hover:** A translucent deep-green fill, and the label turns white.
- **Focus:** A white outline inset into the item.
- **Account:** A square 40px initials tile with a half-opacity mist border at the foot of the rail.
- **Tabs:** Underline tabs on a 1px rule, 28px apart, 15px/600 in muted ink. The active tab turns ink with a 3px green underline.

### Case Row
Each case-list row is a full-width button. It shows the case ID (16px/600) on the left and "gene · status word" (13px) on the right, with the compact evidence strip below. The selected row becomes a white plate with a 4px gold inset on its left edge. Hover lightens toward white.

### Evidence Strip and Evidence Weave (signature)
The woven record of a case. There is one block per observed phenotype:
- **Filled green:** the variant's gene explains it.
- **Hollow (green outline):** it does not.
- **Last block:** the ACMG class, drawn as filled red (Pathogenic), outlined red on white (Likely pathogenic) or filled grey (other).

When analysis has not run, every phenotype block is dashed and explained blocks are only tinted, never filled. The caption adds "· analysis not run". A case with no phenotypes shows a single dashed field-stroke bar.

The compact strip in the case list is 10px tall, with 1px gaps and an 18px class block. The header weave puts each phenotype block (minimum 150px) above "Known feature" or "Not a known feature" and closes with a 150px class block. That block reads "Pathogenic" with "ACMG · GENE" underneath. The weave's caption leads with the count in ink: "3 of 3 observed phenotypes are known features of GATAD2B".

### ACMG Tag
The classification as a word plus a mark. It is a square tag with a 1.5px border, 13px/700 text and a 10px square mark:
- **Pathogenic:** filled red mark, red border and text.
- **Likely pathogenic:** hollow red mark, red border and text.
- **Other classes:** grey mark, field-stroke border, body-ink text.

### Lifecycle Strip
A three-cell case lifecycle: Pending analysis → Results ready → Reviewed. The cells are square with 1px rules and 13px/600 text. Completed stages carry a filled ink dot with a tick. The current stage is outlined in ink, with an ink ring-dot. Future stages are muted with a hollow dot. Screen readers also hear "(complete)" or "(current)".

### Phenotype Plate
A ruled list in which each observed phenotype carries a 14px square mark with a 2px green stroke. The mark is filled when the phenotype is a known feature and hollow when it is not. The row shows the word on the right and a remove button whose hover fill is red wash. The plate's micro-label carries the fit count. The case's primary action sits directly under the list.

### Brand Mark
Four flat vertical bands (gold, white, red, ink) crossed by a forest-green weft. It is drawn in SVG at 40px on the rail inside a 35%-white hairline frame, and as a 64px app icon on a green ground.

## Do's and Don'ts

### Do:
- **Do** use forest green (#13523b) only for the rail and for things that can be pressed or focused.
- **Do** reserve gold (#c9971c) for selection: the active rail bar and the selected case's 4px inset. Gold is a fill, never text.
- **Do** draw Pathogenic as a filled red mark, Likely pathogenic as an outlined red mark, and every other class in grey.
- **Do** pair every status with a word and a mark (filled, outlined, hollow, dashed, ticked).
- **Do** draw evidence for a case pending analysis with dashed strokes and say "analysis not run".
- **Do** open every standard screen with the page header: a white bar, 1px bottom rule, 24px/700 title, muted sub-line.
- **Do** head plates and list sections with the uppercase 13px/700 micro-label, and put the section's count in it when there is one.
- **Do** separate rows with 1px linen rules inside white plates on the warm page.
- **Do** keep corners at 1-4px and every fill flat.
- **Do** set HGVS notation in Source Code Pro.

### Don't:
- **Don't** use gradients, glows, or tinted or coloured shadows. Resting surfaces have no shadow at all.
- **Don't** use red for anything except Pathogenic, Likely pathogenic and destructive actions.
- **Don't** convey status, classification or selection by colour alone.
- **Don't** build purple gradient cards, glowing pills or KPI tiles.
- **Don't** set gene symbols, IDs or labels in monospace.
- **Don't** stack an uppercase label above another heading as an eyebrow. The micro-label is the heading.
- **Don't** show HPO IDs or other identifiers the data does not contain.
- **Don't** add a dark theme through OS preference. The app is light-only by construction.
