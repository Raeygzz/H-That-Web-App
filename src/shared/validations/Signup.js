import * as yup from "yup";

import { RegExp } from "../../utils";

const emailPattern = (value) => RegExp.EmailPattern.test(value);
const passwordPattern = (value) => RegExp.PasswordPattern.test(value);

export const EmailSchema = yup.object().shape({
  email: yup.string().test("Email Pattern", emailPattern),
});

export const PasswordSchema = yup.object().shape({
  password: yup.string().test("Password Pattern", passwordPattern),
});

export const ConfirmPasswordSchema = yup.object().shape({
  confirmPassword: yup
    .string()
    .test("Confirm Password Pattern", passwordPattern),
});
