import { ZodType } from "zod";
import { Event, Store } from "effector";

export type FormDraft = Record<string, [unknown, ZodType]>;

export type FieldsSources<T extends FormDraft> = {
	[K in keyof T]: Store<T[K][0]>;
};

export type Fields<T extends FormDraft> = { [K in keyof T]: Field<T[K][0]> };

export type FormValues<T extends FormDraft> = { [K in keyof T]: T[K][0] };

export type Form<T extends FormDraft> = {
	fields: Fields<T>;
	isValid$: Store<boolean>;
	reset: Event<void>;
	submit: Event<void>;
	submitted: Event<FormValues<T>>;
};

export type Field<T> = {
	value$: Store<T>;
	error$: Store<string>;
	isTouched$: Store<boolean>;
	isValid$: Store<boolean>;
	set: Event<T>;
	reset: Event<void>;
};
