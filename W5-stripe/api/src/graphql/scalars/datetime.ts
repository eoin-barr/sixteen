import { arg, core, scalarType } from 'nexus';

export const GqlDateTime = scalarType({
  name: 'DateTime',
  serialize: (value: any) => value.getTime(),
  parseValue: (value: any) => new Date(value),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
  asNexusMethod: 'dateTime',
  sourceType: 'Date',
});

export const dateTimeArg = (opts?: core.NexusArgConfig<'DateTime'>) =>
  arg({ ...opts, type: 'DateTime' });
