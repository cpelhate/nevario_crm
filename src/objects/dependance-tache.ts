import { FieldType, RelationType, defineObject } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '8ad062cf-f685-4a28-bb64-19224442c9e7',
  nameSingular: 'dependanceTache',
  namePlural: 'dependancesTaches',
  labelSingular: 'Dépendance de tâche',
  labelPlural: 'Dépendances de tâches',
  icon: 'IconArrowsConnected',
  isSearchable: false,
  fields: [
    {
      universalIdentifier: '075012a3-2edb-4b17-b77d-0c2594a19265',
      type: FieldType.RELATION,
      name: 'tacheDependante',
      label: 'Tâche dépendante',
      isNullable: false,
      relationTargetObjectMetadataUniversalIdentifier: 'a62c6875-9ac0-4d27-bbd6-e888a5d00077',
      relationTargetFieldMetadataUniversalIdentifier: '59787c8e-b366-4bc7-ab6d-2d19b6dfe43f',
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'tacheDependanteId' },
    },
    {
      universalIdentifier: 'f329d1a7-bf0d-4a89-89c4-b00c1a1fee8c',
      type: FieldType.RELATION,
      name: 'tacheBloquante',
      label: 'Tâche bloquante',
      isNullable: false,
      relationTargetObjectMetadataUniversalIdentifier: 'a62c6875-9ac0-4d27-bbd6-e888a5d00077',
      relationTargetFieldMetadataUniversalIdentifier: '8f6d629d-7bc9-4c89-9018-e9dfbaa5ccc2',
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'tacheBloquanteId' },
    },
    {
      universalIdentifier: 'ae9dfa92-d574-460a-9f1f-3f583b22cfa6',
      type: FieldType.SELECT,
      name: 'type',
      label: 'Type de dépendance',
      isNullable: false,
      options: [
        { value: 'FIN_DEBUT', label: 'Fin → Début', color: 'blue', position: 0 },
        { value: 'DEBUT_DEBUT', label: 'Début → Début', color: 'green', position: 1 },
      ],
    },
    {
      universalIdentifier: 'e594a516-1a7e-48df-a3bb-b114f1339e66',
      type: FieldType.TEXT,
      name: 'externalId',
      label: 'ID Clearvio',
    },
  ],
  labelIdentifierFieldMetadataUniversalIdentifier: 'e594a516-1a7e-48df-a3bb-b114f1339e66',
});
