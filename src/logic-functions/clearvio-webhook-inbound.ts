import { createHmac, timingSafeEqual } from 'crypto';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { CLEARVIO_WEBHOOK_INBOUND_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

type ClearvioWebhookBody = {
  event: string;
  payload: Record<string, any>;
  timestamp: string;
};

function isValidSignature(rawBody: string, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', process.env.CLEARVIO_WEBHOOK_SECRET ?? '')
    .update(rawBody)
    .digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function findMissionByClearvioProjectId(client: CoreApiClient, projectId: string) {
  const { missions } = await client.query({
    missions: {
      __args: { filter: { clearvioProjectId: { eq: projectId } } },
      id: true,
    },
  });
  return missions[0] ?? null;
}

async function upsertTache(client: CoreApiClient, payload: any) {
  const { taches } = await client.query({
    taches: {
      __args: { filter: { externalId: { eq: payload.id } } },
      id: true,
    },
  });

  const data = {
    titre: payload.title,
    description: payload.description ?? null,
    statut: payload.status,
    priorite: payload.priority,
    dateDebut: payload.startDate ?? null,
    dateEcheance: payload.dueDate ?? null,
    derniereSyncOrigine: 'CLEARVIO',
  };

  if (taches[0]) {
    await client.mutation({
      updateTache: { __args: { id: taches[0].id, data }, id: true },
    });
    return;
  }

  const mission = await findMissionByClearvioProjectId(client, payload.projectId);
  if (!mission) return;

  await client.mutation({
    createTache: {
      __args: { data: { ...data, externalId: payload.id, mission: mission.id } },
      id: true,
    },
  });
}

async function upsertRisque(client: CoreApiClient, payload: any) {
  const { risquesProjet } = await client.query({
    risquesProjet: {
      __args: { filter: { externalId: { eq: payload.id } } },
      id: true,
    },
  });

  const data = {
    titre: payload.title,
    description: payload.description ?? null,
    probabilite: payload.probability,
    impact: payload.impact,
    statut: payload.status,
    mitigation: payload.mitigation ?? null,
    derniereSyncOrigine: 'CLEARVIO',
  };

  if (risquesProjet[0]) {
    await client.mutation({
      updateRisqueProjet: { __args: { id: risquesProjet[0].id, data }, id: true },
    });
    return;
  }

  const mission = await findMissionByClearvioProjectId(client, payload.projectId);
  if (!mission) return;

  await client.mutation({
    createRisqueProjet: {
      __args: { data: { ...data, externalId: payload.id, mission: mission.id } },
      id: true,
    },
  });
}

async function deleteByExternalId(
  client: CoreApiClient,
  objectPlural: 'taches' | 'risquesProjet',
  mutationName: 'destroyTache' | 'destroyRisqueProjet',
  externalId: string,
) {
  const { [objectPlural]: records } = (await client.query({
    [objectPlural]: { __args: { filter: { externalId: { eq: externalId } } }, id: true },
  })) as Record<string, { id: string }[]>;

  if (records[0]) {
    await client.mutation({ [mutationName]: { __args: { id: records[0].id }, id: true } } as any);
  }
}

/**
 * Receives Clearvio's outbound webhooks (task.created/updated/deleted,
 * risk.created/updated/deleted). Verifies the HMAC
 * signature, then upserts the matching Tache/RisqueProjet with
 * derniereSyncOrigine="CLEARVIO" so the outbound sync functions know to
 * skip pushing this change straight back (anti-loop).
 */
export default defineLogicFunction({
  universalIdentifier: CLEARVIO_WEBHOOK_INBOUND_UNIVERSAL_IDENTIFIER,
  name: 'clearvioWebhookInbound',
  description: 'Reçoit les webhooks Clearvio (tâches, risques) et met à jour Nevario',
  httpRouteTriggerSettings: {
    path: '/webhooks/clearvio',
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: ['x-clearvio-signature'],
  },
  handler: async (request: { rawBody: string; headers: Record<string, string> }) => {
    const signature = request.headers['x-clearvio-signature'];
    if (!isValidSignature(request.rawBody, signature)) {
      return { status: 401, body: { error: 'Invalid signature' } };
    }

    const { event, payload }: ClearvioWebhookBody = JSON.parse(request.rawBody);
    const client = new CoreApiClient();

    switch (event) {
      case 'task.created':
      case 'task.updated':
        await upsertTache(client, payload.task);
        break;
      case 'task.deleted':
        await deleteByExternalId(client, 'taches', 'destroyTache', payload.externalId);
        break;
      case 'risk.created':
      case 'risk.updated':
        await upsertRisque(client, payload.risk);
        break;
      case 'risk.deleted':
        await deleteByExternalId(client, 'risquesProjet', 'destroyRisqueProjet', payload.externalId);
        break;
      default:
        break;
    }

    return { status: 200, body: { ok: true } };
  },
});
