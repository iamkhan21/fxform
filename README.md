# @iamkhan21/fxform [![NPM version](https://img.shields.io/npm/v/@iamkhan21/fxform?color=a1b858&label=)](https://www.npmjs.com/package/@iamkhan21/fxform)

Reactive forms based on effector and zod


## Usage example

```ts
import { z, ZodLiteral, type ZodNumber, type ZodString } from "zod";
import { createForm } from "@iamkhan21/fxform";


/**
 * email: ["", z.string().trim().email()] as [string, ZodString]
 * email - Name of field
 * '' - initial value
 * z.string().trim().email() - zod validation scheme
 */
const formData = {
  email: ["", z.string().trim().email()] as [string, ZodString],
  age: [null, z.number().gte(18)] as [number | null, ZodNumber],
  agreeWithRules: [false, z.literal(true)] as [boolean, ZodLiteral<true>],
};

const form = createForm(formData);
```


## License

[MIT](./LICENSE) License © 2022 [Ivan Khanevich](https://github.com/iamkhan21)
