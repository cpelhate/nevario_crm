import { defineLogicFunction } from 'twenty-sdk/define';

import { RISQUE_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { syncRisqueToClearvio } from 'src/logic-functions/utils/sync-risque-to-clearvio';

export default defineLogicFunction({
  universalIdentifier: RISQUE_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER,
  name: 'risqueClearvioSync',
  description: 'Synchronise un RisqueProjet Nevario modifié vers Clearvio',
  databaseEventTriggerSettings: {
    eventName: 'risqueProjet.updated',
    updatedFields: ['titre', 'description', 'probabilite', 'impact', 'statut', 'mitigation'],
  },
  handler: async (event: { recordId: string }) => {
    await syncRisqueToClearvio(event.recordId);
  },
});
