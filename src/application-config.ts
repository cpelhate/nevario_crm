import { defineApplication } from 'twenty-sdk/define';

import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  serverVariables: {
    CLEARVIO_API_BASE_URL: {
      description: 'URL de base de l\'API Clearvio (ex: https://clearvio.vercel.app)',
      isRequired: true,
    },
    CLEARVIO_API_KEY: {
      description: 'Clé API Clearvio (Bearer token) pour les appels machine-à-machine',
      isSecret: true,
      isRequired: true,
    },
    CLEARVIO_WEBHOOK_SECRET: {
      description: 'Secret HMAC partagé pour vérifier les webhooks entrants de Clearvio',
      isSecret: true,
      isRequired: true,
    },
  },
});
