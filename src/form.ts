import { combine, createDomain, forward, sample } from "effector";
import type { SafeParseReturnType, ZodType } from "zod";
import { debounce } from "patronum/debounce";
import type {
	Field,
	Fields,
	FieldsSources,
	Form,
	FormDraft,
	FormValues,
} from "./types";

function createField<T>(initialValue: T, validator: ZodType): Field<T> {
	const filed = createDomain();
	const value$ = filed.createStore(initialValue);

	const error$ = filed.createStore("");
	const isTouched$ = filed.createStore(false);
	const isValid$ = filed.createStore(validator.safeParse(initialValue).success);

	const set = filed.createEvent<T>();
	const reset = filed.createEvent();

	const validateFx = filed.createEffect<T, SafeParseReturnType<string, string>>(
		(value) => validator.safeParse(value),
	);

	debounce({
		source: set,
		timeout: 350,
		target: validateFx,
	});

	value$.reset(reset).on(set, (_, value) => value);
	error$
		.reset(reset)
		.on(validateFx.doneData, (_, result) =>
			result.success ? "" : result.error.issues[0].message,
		);
	isValid$
		.reset(reset)
		.on(set, () => false)
		.on(validateFx.doneData, (_, result) => result.success);
	isTouched$.reset(reset).on(set, () => true);

	return { value$, error$, isTouched$, isValid$, set, reset };
}

export function createForm<T extends FormDraft>(formData: T): Form<T> {
	const fields = {} as Fields<T>;
	const fieldSources = {} as FieldsSources<T>;

	for (const [key, value] of Object.entries(formData)) {
		const field = createField(...value);
		fieldSources[key as keyof T] = field.value$;
		fields[key as keyof T] = field;
	}

	const form = createDomain();
	const reset = form.createEvent<void>();
	const submit = form.createEvent<void>();
	const submitted = form.createEvent<FormValues<T>>();

	// @ts-ignore
	sample({
		clock: submit,
		source: fieldSources,
		fn: (formValues: FormValues<T>) => formValues,
		target: submitted,
	});

	forward({
		from: reset,
		to: Object.values(fields).map((field) => field.reset),
	});

	const isValid$ = combine(
		Object.values(fields).map((field) => field.isValid$),
		(states) => states.every(Boolean),
	);

	return {
		fields,
		isValid$,
		reset,
		submit,
		submitted,
	};
}
