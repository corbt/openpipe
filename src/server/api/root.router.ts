import { promptVariantsRouter } from "~/server/api/routers/promptVariants.router";
import { createTRPCRouter } from "~/server/api/trpc";
import { experimentsRouter } from "./routers/experiments.router";
import { scenariosRouter } from "./routers/scenarios.router";
import { modelOutputsRouter } from "./routers/modelOutputs.router";
import { templateVarsRouter } from "./routers/templateVariables.router";
import { evaluationsRouter } from "./routers/evaluations.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  promptVariants: promptVariantsRouter,
  experiments: experimentsRouter,
  scenarios: scenariosRouter,
  outputs: modelOutputsRouter,
  templateVars: templateVarsRouter,
  evaluations: evaluationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
