import * as yup from "yup";

export const LabelSchema = yup.object().shape({
  labelName: yup.string().required(),
});

export const Address1Schema = yup.object().shape({
  address1: yup.string().required(),
});

export const Address2Schema = yup.object().shape({
  address2: yup.string().required(),
});

export const CitySchema = yup.object().shape({
  city: yup.string().required(),
});

export const CountrySchema = yup.object().shape({
  country: yup.string().required(),
});

export const PostcodeSchema = yup.object().shape({
  postcode: yup.string().required(),
});
