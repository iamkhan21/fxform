import { ZodType } from "zod";
import { Event, Store } from "effector";

export type Field = {
  value$: Store<string>;
  error$: Store<string>;
  isTouched$: Store<boolean>;
  isValid$: Store<true | false>;
  set: Event<string>;
  reset: Event<void>;
};

export type Form<T> = {
  fields: Record<string, Field>;
  isValid$: Store<boolean>;
  reset: Event<void>;
  submit: Event<void>;
  submitted: Event<Record<keyof T, string>>;
};

export type Fields<T extends Record<string, [string, ZodType]>> = Record<
  keyof T,
  Field
>;

export type FieldsSources<T extends Record<string, [string, ZodType]>> = Record<
  keyof T,
  Store<string>
>;
