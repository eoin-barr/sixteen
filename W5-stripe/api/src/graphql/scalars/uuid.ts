import { arg, core, scalarType } from 'nexus';

export const GqlUUID = scalarType({
  name: 'UUID',
  serialize: (value) => value,
  asNexusMethod: 'uuid',
  sourceType: 'string',
});

export const uuidArg = (opts?: core.NexusArgConfig<'UUID'>) =>
  arg({ ...opts, type: 'UUID' });
