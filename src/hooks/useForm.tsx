import React, { useCallback, useState } from 'react';

export type FormError<T> = Partial<{ [key in keyof T]: string }>;

export type FormValidationHandler<T> = (data: T) => FormError<T>;

function useForm<T extends { _id?: string }>(
  initialValues: T,
  validateOnChange: boolean,
  validation: FormValidationHandler<T>,
) {
  const [values, setValues] = useState<T>({ ...initialValues, livraison: {} });
  const [errors, setErrors] = useState<FormError<T>>({});

  const handleInputBlur = useCallback<
    React.FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    ({ target: { name, value } }) => {
      setValues((values: any) => {
        const index: keyof T = (name as unknown) as keyof T;
        values[index] = (value as unknown) as T[keyof T];
        return values;
      });
      if (validateOnChange) setErrors(validation(values));
    },
    [validateOnChange, validation, values],
  );

  const handleSwitchChange = useCallback<
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  >(({ target: { name } }, checked) => {
    setValues((values: any) => {
      const index: keyof T = (name as unknown) as keyof T;
      values[index] = (checked as unknown) as T[keyof T];
      return values;
    });
  }, []);

  const handleSelectChange = useCallback<
    (
      event: React.ChangeEvent<{ name?: string; value: unknown }>,
      child: React.ReactNode,
    ) => void
  >(({ target: { name, value } }) => {
    setValues((values: any) => {
      const index: keyof T = (name as unknown) as keyof T;
      values[index] = (value as unknown) as T[keyof T];
      return { ...values };
    });
  }, []);

  const handleInputChange = useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    ({ target: { name, value } }) => {
      setValues((values: any) => {
        const index: keyof T = (name as unknown) as keyof T;
        values[index] = (value as unknown) as T[keyof T];
        return { ...values };
      });
      if (validateOnChange) setErrors(validation(values));
    },
    [validateOnChange, validation, values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback(() => {
    setErrors(validation(values));
    const isValid = JSON.stringify(validation(values)) === '{}';
    return isValid;
  }, [validation, values]);

  const setOption = (e: any) => {
    setValues({ ...values, options: e })
  }

  const setFoodsId = (e: any) => {
    setValues({ ...values, foods: e })
  }

  const setLivraison = (value: any, key: string) => {

    const oldValue: any = values as any;
    const livraison: any = oldValue.livraison;

    setValues({
      ...values,
      livraison: {
        ...livraison,
        [key]: value
      }
    });

  }

  const handleChangeField = (data:any) => {

    setValues({
      ...values,
      valueField: data,
    });

  }


  const addnewLivraison = (value: any) => {
    setValues({
      ...values,
      livraison: { ...value }
    });
  }

  const phoneNumberChange = (value: any, name: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  }

  return {
    values,
    setValues,
    errors,
    validate,
    handleSelectChange,
    handleInputChange,
    handleInputBlur,
    handleSwitchChange,
    resetForm,
    setOption,
    setFoodsId,
    setLivraison,
    handleChangeField,
    addnewLivraison,
    phoneNumberChange
  };
}

export default useForm;
