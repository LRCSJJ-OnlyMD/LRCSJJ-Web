import { router } from "../trpc";
import { authRouter } from "./auth";
import { clubsRouter } from "./clubs";
import { athletesRouter } from "./athletes";
import { insuranceRouter } from "./insurance";
import { seasonsRouter } from "./seasons";
import { championshipsRouter } from "./championships";
import { leagueTeamsRouter } from "./leagueTeams";
import { mapConfigRouter } from "./mapConfig";
import { clubManagerRouter } from "./club-manager";
import { notificationsRouter } from "./notifications";

export const appRouter = router({
  auth: authRouter,
  clubs: clubsRouter,
  athletes: athletesRouter,
  insurance: insuranceRouter,
  seasons: seasonsRouter,
  championships: championshipsRouter,
  leagueTeams: leagueTeamsRouter,
  mapConfig: mapConfigRouter,
  clubManager: clubManagerRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
