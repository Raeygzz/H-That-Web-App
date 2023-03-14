import * as yup from "yup";

export const LatitudeSchema = yup.object().shape({
  latitude: yup.string().required(),
});

export const LongitudeSchema = yup.object().shape({
  longitude: yup.string().required(),
});
