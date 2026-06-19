import { defineLogicFunction } from 'twenty-sdk/define';

import { TACHE_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { syncTacheToClearvio } from 'src/logic-functions/utils/sync-tache-to-clearvio';

export default defineLogicFunction({
  universalIdentifier: TACHE_CLEARVIO_SYNC_UNIVERSAL_IDENTIFIER,
  name: 'tacheClearvioSync',
  description: 'Synchronise une Tâche Nevario modifiée vers Clearvio',
  databaseEventTriggerSettings: {
    eventName: 'tache.updated',
    updatedFields: ['titre', 'description', 'statut', 'priorite', 'dateDebut', 'dateEcheance', 'sousTraitant'],
  },
  handler: async (event: { recordId: string }) => {
    await syncTacheToClearvio(event.recordId);
  },
});
