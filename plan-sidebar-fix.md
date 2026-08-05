# Bug Fix Plan — weather13 sidebar integration

## Critical

| # | Bug | Location | Cause | Fix |
|---|-----|----------|-------|-----|
| 1 | `<main>` nesting | `SidebarInset.vue:10` + `weather13.vue:279` | SidebarInset renders `<main>`, weather13 also has `<main>` inside | Change SidebarInset's `<main>` → `<div>` |
| 2 | Cannot toggle sidebar | `weather13.vue` | SidebarTrigger imported but never used in template | Add `<SidebarTrigger />` left of city name in detail header bar |
| 3 | SidebarProvider not a real component | `use-sidebar.js:31-70` | Functional component without defineComponent → provide() outside setup context | Rewrite with `<script setup>` + template, move provide into setup |

## Medium

| # | Bug | Location | Cause | Fix |
|---|-----|----------|-------|-----|
| 4 | Unused Button import | `SidebarMenuButton.vue:4` | Button imported but Primitive used instead | Remove `import { Button }` line |
| 5 | Duplicate width control | `Sidebar.vue:24-26+L32-34` | Both CSS class and inline style set width | Remove width from CSS class, keep inline style only |
| 6 | Unused constants | `use-sidebar.js:5-6` | SIDEBAR_WIDTH / SIDEBAR_WIDTH_ICON declared but unused | Remove dead constants |

## Minor

| # | Bug | Location | Cause | Fix |
|---|-----|----------|-------|-----|
| 7 | size prop not applied | `SidebarMenuButton.vue:10` | data-size attr has no CSS sizing | Remove prop or add size variants |
| 8 | Double flex structure | `weather13.vue:279` | SidebarInset + inner `<main>` both flex | Resolved by fix #1 |

## Files to modify

```
src/components/ui/sidebar/use-sidebar.js       # #3, #6
src/components/ui/sidebar/Sidebar.vue           # #5
src/components/ui/sidebar/SidebarMenuButton.vue # #4, #7
src/components/ui/sidebar/SidebarInset.vue      # #1
src/pages/weathers/weather13.vue                # #2
```

## Fix order

1. use-sidebar.js — rewrite SidebarProvider with defineComponent
2. SidebarInset.vue — `<main>` → `<div>`
3. weather13.vue — add SidebarTrigger + cleanup
4. Sidebar.vue — remove duplicate width
5. SidebarMenuButton.vue — cleanup imports
