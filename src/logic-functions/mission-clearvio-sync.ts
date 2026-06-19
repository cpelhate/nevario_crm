import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { MISSION_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

/**
 * Fires when a Mission's statut changes. When it reaches "Signée – En
 * cours" and no Clearvio project is linked yet, creates the matching
 * Project in Clearvio (idempotent on externalMissionId) and stores its id
 * back on the Mission.
 */
export default defineLogicFunction({
  universalIdentifier: MISSION_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER,
  name: 'missionClearvioSync',
  description: "Crée le Project Clearvio correspondant quand une Mission est signée",
  databaseEventTriggerSettings: {
    eventName: 'mission.updated',
    updatedFields: ['statut'],
  },
  handler: async (event: { recordId: string }) => {
    const client = new CoreApiClient();

    const { mission } = await client.query({
      mission: {
        __args: { id: event.recordId },
        id: true,
        nom: true,
        statut: true,
        dateDebut: true,
        dateFinPrevue: true,
        clearvioProjectId: true,
      },
    });

    if (mission.statut !== 'SIGNEE_EN_COURS' || mission.clearvioProjectId) {
      return;
    }

    const response = await fetch(`${process.env.CLEARVIO_API_BASE_URL}/api/integrations/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLEARVIO_API_KEY}`,
      },
      body: JSON.stringify({
        externalMissionId: mission.id,
        name: mission.nom,
        status: 'EN_COURS',
        startDate: mission.dateDebut,
        endDate: mission.dateFinPrevue,
      }),
    });

    if (!response.ok) {
      throw new Error(`Clearvio project creation failed: ${response.status} ${await response.text()}`);
    }

    const project = await response.json();

    await client.mutation({
      updateMission: {
        __args: { id: mission.id, data: { clearvioProjectId: project.id } },
        id: true,
      },
    });
  },
});
