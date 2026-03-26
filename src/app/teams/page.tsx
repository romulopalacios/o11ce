import type { Metadata } from "next";

import { TeamListClient } from "@/components/teams/TeamListClient";
import { PageHero } from "@/components/ui/PageHero";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import * as teamService from "@/server/services/football/teamService";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Selecciones | O11CE",
    description: "Lista de selecciones del Mundial 2026.",
  };
}

export default async function TeamsPage() {
  const allTeams = await teamService.getAll();

  return (
    <>
      <PageHero title="EQUIPOS" subtitle="selecciones nacionales" meta="Mundial 2026" />

      <PageWrapper>
        <section className="section-shell border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6">
          <SectionHeader title="selecciones" />

          <section>
            <TeamListClient teams={allTeams} />
          </section>
        </section>
      </PageWrapper>
    </>
  );
}
