import { defineLogicFunction } from 'twenty-sdk/define';

import { RISQUE_CLEARVIO_CREATE_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { syncRisqueToClearvio } from 'src/logic-functions/utils/sync-risque-to-clearvio';

export default defineLogicFunction({
  universalIdentifier: RISQUE_CLEARVIO_CREATE_UNIVERSAL_IDENTIFIER,
  name: 'risqueClearvioCreate',
  description: 'Crée le risque Clearvio correspondant à un nouveau RisqueProjet Nevario',
  databaseEventTriggerSettings: {
    eventName: 'risqueProjet.created',
  },
  handler: async (event: { recordId: string }) => {
    await syncRisqueToClearvio(event.recordId);
  },
});
