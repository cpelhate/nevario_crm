import { defineLogicFunction } from 'twenty-sdk/define';

import { TACHE_CLEARVIO_CREATE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { syncTacheToClearvio } from 'src/logic-functions/utils/sync-tache-to-clearvio';

export default defineLogicFunction({
  universalIdentifier: TACHE_CLEARVIO_CREATE_UNIVERSAL_IDENTIFIER,
  name: 'tacheClearvioCreate',
  description: 'Crée la tâche Clearvio correspondante à une nouvelle Tâche Nevario',
  databaseEventTriggerSettings: {
    eventName: 'tache.created',
  },
  handler: async (event: { recordId: string }) => {
    await syncTacheToClearvio(event.recordId);
  },
});
