import { FieldType, RelationType, defineObject } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '9df53838-7867-4054-b745-eba426e75da2',
  nameSingular: 'contact',
  namePlural: 'contacts',
  labelSingular: 'Contact',
  labelPlural: 'Contacts',
  icon: 'IconUser',
  isSearchable: true,
  fields: [
    {
      universalIdentifier: '51c4ef63-724f-43a2-9665-7ad23f1d288f',
      type: FieldType.TEXT,
      name: 'prenom',
      label: 'Prénom',
      isNullable: false,
    },
    {
      universalIdentifier: 'ac0f66a4-3c73-477a-bda8-6c35c7beebc8',
      type: FieldType.TEXT,
      name: 'nom',
      label: 'Nom',
      isNullable: false,
    },
    {
      universalIdentifier: 'df277330-e677-40ab-a5eb-4bd692b23f0f',
      type: FieldType.EMAILS,
      name: 'email',
      label: 'Email',
    },
    {
      universalIdentifier: '332df312-7087-4511-afad-4e82ed6ff0bc',
      type: FieldType.PHONES,
      name: 'telephone',
      label: 'Téléphone',
    },
    {
      universalIdentifier: 'b2726777-e427-4330-9717-aaa24cba7cfb',
      type: FieldType.TEXT,
      name: 'poste',
      label: 'Poste / Fonction',
    },
    {
      universalIdentifier: '24fe31ef-ccc8-44c1-af5e-6c2774395e21',
      type: FieldType.LINKS,
      name: 'linkedin',
      label: 'LinkedIn',
    },
    {
      universalIdentifier: '03831037-8a1a-4cf8-b346-e0d367045cd2',
      type: FieldType.RICH_TEXT,
      name: 'notes',
      label: 'Notes',
    },
    {
      universalIdentifier: '4ea70cc8-6d3a-435e-837d-12a4e2013fdd',
      type: FieldType.RELATION,
      name: 'contactClients',
      label: 'Clients',
      relationTargetObjectMetadataUniversalIdentifier: '5fddacdb-23ec-47ea-894e-3ef82dedd30f',
      relationTargetFieldMetadataUniversalIdentifier: '04e6b9da-f43f-44cb-8f06-030a79f6c097',
      universalSettings: { relationType: RelationType.ONE_TO_MANY },
    },
  ],
  labelIdentifierFieldMetadataUniversalIdentifier: 'ac0f66a4-3c73-477a-bda8-6c35c7beebc8',
});
