# Pacific Products & Solutions — Project Rules & Guidelines

> **MANDATORY DIRECTIVES FOR AI ASSISTANTS**:
> 1. **Read Project Context First**: Before performing any research, design, or code modification in `D:\PACIFIC RESTROOM CUBICLE`, review `PROJECT_CONTEXT.md` located in the repository root.
> 2. **Maintain Context Integrity**: Whenever you create, modify, or remove any components, routes, stores, database tables, or system workflows, you MUST update `PROJECT_CONTEXT.md` to reflect the current state of the architecture.
> 3. **Zero-Error Validation**: Always execute `npx tsc --noEmit` and `npm run build` before finishing any task to guarantee 0 TypeScript compiler errors and clean production builds.
> 4. **Unit Test Verification**: Always run `npm test` to guarantee 100% test pass rate across data integrity contracts and store tests.
> 5. **3D & Three.js Protocol**:
>    - Ensure transform attributes (`position`, `rotation`, `scale`, `castShadow`, `receiveShadow`) are placed on `<mesh>` or `<group>` elements, NOT directly on `<...Geometry>` primitives.
>    - Preserve Zustand store state contracts in `cubicleStore.ts` and `designStore.ts`.
> 6. **Offline Resilience**:
>    - Never assume Supabase is reachable during development or testing. Always maintain fallback support via `demo-data.ts` and `isSupabaseConfigured()`.
