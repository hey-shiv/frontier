# Frontier Fix Plan

## Root Causes
1. FAST_MODELS raced in parallel — 3 simultaneous requests per generate click (credits wasted)
2. mockGenerator returns same DEFAULT_PROJECTS for any combo not in hardcoded templates (only 7 combos covered)
3. buildPreviewUserPrompt only uses domains[0]/interests[0] in the "creative intersections" hint — secondary picks ignored
4. seed not passed into the prompt text itself — model can't vary based on it
5. Frontend always shows "AI GENERATED" badge even when aiGenerated=false (silent fallback)
6. Frontend silently ignores non-OK API responses
7. GeneratePreviewsResponse.meta type doesn't include source/warning fields
8. generateProjects() returns up to 6; should cap at 4 to match AI output

## Files to Change
- shared/types.ts — add source/warning to meta type
- api/data/openrouter.ts — sequential model attempts, stronger prompt with all fields + seed
- api/data/mockGenerator.ts — dynamic generation from ALL domain×interest×company combos, cap at 4
- api/index.ts — pass source/warning in response meta
- web/pages/generate.tsx — show LOCAL FALLBACK badge, handle errors/warnings, handle non-OK responses

## Checklist
- [ ] types.ts — GeneratePreviewsResponse meta updated
- [ ] openrouter.ts — sequential (not parallel), prompt uses ALL domains/interests/companies/seed
- [ ] mockGenerator.ts — dynamic combos, no DEFAULT_PROJECTS fallback, cap 4
- [ ] api/index.ts — source + warning in meta
- [ ] generate.tsx — UI shows fallback warning, handles errors
- [ ] typecheck passes with no API calls
