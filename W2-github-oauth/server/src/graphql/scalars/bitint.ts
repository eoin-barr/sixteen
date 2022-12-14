import { arg, core, scalarType } from "nexus";

const MAX_INT = Number.MAX_SAFE_INTEGER;
const MIN_INT = Number.MIN_SAFE_INTEGER;

function coerceBigInt(value: any) {
  if (value === "") {
    throw new TypeError(
      "BigInt cannot represent non 52-bit signed integer value: (empty string)"
    );
  }

  const num = Number(value);
  if (num > MAX_INT || num < MIN_INT) {
    throw new TypeError(
      `BigInt cannot represent non 52-bit signed integer value: ${String(
        value
      )}`
    );
  }

  const int = Math.floor(num);
  if (int !== num) {
    throw new TypeError(
      `BigInt cannot represent non-integer value: ${String(value)}`
    );
  }

  return int;
}

export const GqlBigInt = scalarType({
  name: "BigInt",
  description:
    "The `BigInt` scalar type represents non-fractional signed whole numeric values. BigInt can represent values between -(2^53) + 1 and 2^53 - 1.",
  serialize: coerceBigInt,
  parseValue: (value) => BigInt(coerceBigInt(value)),
  parseLiteral(ast) {
    if (ast.kind === "IntValue") {
      const num = parseInt(ast.value, 10);
      if (num <= MAX_INT && num >= MIN_INT) {
        return num;
      }
    }
    return null;
  },
  asNexusMethod: "bigInt",
});

export const bigIntArg = (opts?: core.NexusArgConfig<"BigInt">) =>
  arg({ ...opts, type: "BigInt" });
