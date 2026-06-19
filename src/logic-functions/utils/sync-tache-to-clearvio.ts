import { CoreApiClient } from 'twenty-client-sdk/core';

const STATUT_MAP: Record<string, string> = {
  A_FAIRE: 'A_FAIRE',
  EN_COURS: 'EN_COURS',
  EN_REVUE: 'EN_REVUE',
  TERMINE: 'TERMINE',
  BLOQUE: 'BLOQUE',
};

/**
 * Pushes a Tache to Clearvio (create or update, upserted on externalId).
 * If derniereSyncOrigine is "CLEARVIO" the change just came in via the
 * inbound webhook, so the flag is cleared and the push is skipped - this
 * is what breaks the Nevario<->Clearvio sync loop.
 */
export async function syncTacheToClearvio(recordId: string): Promise<void> {
  const client = new CoreApiClient();

  const { tache } = await client.query({
    tache: {
      __args: { id: recordId },
      id: true,
      titre: true,
      description: true,
      statut: true,
      priorite: true,
      dateDebut: true,
      dateEcheance: true,
      externalId: true,
      derniereSyncOrigine: true,
      mission: { id: true, clearvioProjectId: true },
    },
  });

  if (tache.derniereSyncOrigine === 'CLEARVIO') {
    await client.mutation({
      updateTache: {
        __args: { id: tache.id, data: { derniereSyncOrigine: null } },
        id: true,
      },
    });
    return;
  }

  if (!tache.mission?.clearvioProjectId) return;

  const payload = {
    projectId: tache.mission.clearvioProjectId,
    externalId: tache.id,
    title: tache.titre,
    description: tache.description,
    status: STATUT_MAP[tache.statut] ?? 'A_FAIRE',
    priority: tache.priorite,
    dueDate: tache.dateEcheance,
    startDate: tache.dateDebut,
  };

  const url = tache.externalId
    ? `${process.env.CLEARVIO_API_BASE_URL}/api/integrations/tasks/${tache.externalId}`
    : `${process.env.CLEARVIO_API_BASE_URL}/api/integrations/tasks`;

  const response = await fetch(url, {
    method: tache.externalId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLEARVIO_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Clearvio task sync failed: ${response.status} ${await response.text()}`);
  }

  if (!tache.externalId) {
    const clearvioTask = await response.json();
    await client.mutation({
      updateTache: {
        __args: { id: tache.id, data: { externalId: clearvioTask.id } },
        id: true,
      },
    });
  }
}
