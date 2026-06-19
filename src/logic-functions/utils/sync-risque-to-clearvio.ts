import { CoreApiClient } from 'twenty-client-sdk/core';

export async function syncRisqueToClearvio(recordId: string): Promise<void> {
  const client = new CoreApiClient();

  const { risqueProjet } = await client.query({
    risqueProjet: {
      __args: { id: recordId },
      id: true,
      titre: true,
      description: true,
      probabilite: true,
      impact: true,
      statut: true,
      mitigation: true,
      externalId: true,
      derniereSyncOrigine: true,
      mission: { id: true, clearvioProjectId: true },
    },
  });

  if (risqueProjet.derniereSyncOrigine === 'CLEARVIO') {
    await client.mutation({
      updateRisqueProjet: {
        __args: { id: risqueProjet.id, data: { derniereSyncOrigine: null } },
        id: true,
      },
    });
    return;
  }

  if (!risqueProjet.mission?.clearvioProjectId) return;

  const payload = {
    projectId: risqueProjet.mission.clearvioProjectId,
    externalId: risqueProjet.id,
    title: risqueProjet.titre,
    description: risqueProjet.description,
    probability: risqueProjet.probabilite,
    impact: risqueProjet.impact,
    status: risqueProjet.statut,
    mitigation: risqueProjet.mitigation,
  };

  const url = risqueProjet.externalId
    ? `${process.env.CLEARVIO_API_BASE_URL}/api/integrations/risks/${risqueProjet.externalId}`
    : `${process.env.CLEARVIO_API_BASE_URL}/api/integrations/risks`;

  const response = await fetch(url, {
    method: risqueProjet.externalId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLEARVIO_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Clearvio risk sync failed: ${response.status} ${await response.text()}`);
  }

  if (!risqueProjet.externalId) {
    const clearvioRisk = await response.json();
    await client.mutation({
      updateRisqueProjet: {
        __args: { id: risqueProjet.id, data: { externalId: clearvioRisk.id } },
        id: true,
      },
    });
  }
}
