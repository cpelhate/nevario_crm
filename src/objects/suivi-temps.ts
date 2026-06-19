import { FieldType, RelationType, defineObject } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '8e8042c3-6f90-407e-a72c-57d65029cb16',
  nameSingular: 'suiviTemps',
  namePlural: 'suivisTemps',
  labelSingular: 'Suivi de temps',
  labelPlural: 'Suivis de temps',
  icon: 'IconClock',
  isSearchable: false,
  fields: [
    {
      universalIdentifier: '9c3a17f2-d68c-467b-8175-83339328d445',
      type: FieldType.DATE,
      name: 'date',
      label: 'Date',
      isNullable: false,
    },
    {
      universalIdentifier: 'c807dd7a-fa19-461e-9724-83001200835b',
      type: FieldType.NUMBER,
      name: 'nbHeures',
      label: 'Nombre d\'heures',
      isNullable: false,
    },
    {
      universalIdentifier: 'a39997cc-0eee-41d7-a9b1-3ebb32db4f83',
      type: FieldType.TEXT,
      name: 'description',
      label: 'Description',
    },
    {
      universalIdentifier: '2f76b9f3-962f-4ed7-98e0-d1ace9cd05dd',
      type: FieldType.SELECT,
      name: 'intervenant',
      label: 'Intervenant',
      isNullable: false,
      options: [
        { value: 'NEVARIO', label: 'NEVARIO', color: 'blue', position: 0 },
        { value: 'SOUS_TRAITANT', label: 'Sous-traitant', color: 'orange', position: 1 },
      ],
    },
    {
      universalIdentifier: 'a7668ff5-c109-4d8e-a159-998a009e3e53',
      type: FieldType.RELATION,
      name: 'mission',
      label: 'Mission',
      isNullable: false,
      relationTargetObjectMetadataUniversalIdentifier: '150691d9-e265-4e67-aeaa-a73d7cc6f3e3',
      relationTargetFieldMetadataUniversalIdentifier: 'a6d7cbf9-8e26-466e-aa7a-8db56be3bbde',
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'missionId' },
    },
    {
      universalIdentifier: 'b18c2a6d-5516-4c58-8ffc-3640bd35351c',
      type: FieldType.RELATION,
      name: 'sousTraitant',
      label: 'Sous-traitant',
      relationTargetObjectMetadataUniversalIdentifier: '3be422ce-0015-4a0d-a8d0-80afcc8ee013',
      relationTargetFieldMetadataUniversalIdentifier: 'd379915b-d140-46a6-82ba-78975762095a',
      universalSettings: { relationType: RelationType.MANY_TO_ONE, joinColumnName: 'sousTraitantId' },
    },
  ],
  labelIdentifierFieldMetadataUniversalIdentifier: 'a39997cc-0eee-41d7-a9b1-3ebb32db4f83',
});
