import * as yup from "yup";

import { RegExp } from "../../utils";

const digitsOnly = (value) => RegExp.DigitsOnly.test(value);

// export const TitleSchema = yup.object().shape({
//   advertTitle: yup.string().required(),
// });

// export const CategorySchema = yup.object().shape({
//   advertCategory: yup.string().required(),
// });

// export const SubCategorySchema = yup.object().shape({
//   advertSubCategory: yup.string().required(),
// });

// export const MakeSchema = yup.object().shape({
//   make: yup.string().required(),
// });

// export const ModelSchema = yup.object().shape({
//   model: yup.string().required(),
// });

// export const DescriptionSchema = yup.object().shape({
//   description: yup.string().required(),
// });

// export const AgeSchema = yup.object().shape({
//   age: yup.string().test("Digits only", digitsOnly),
// });

export const LengthSchema = yup.object().shape({
  // length: yup.string().required(),
  length: yup.string().test("Digits only", digitsOnly),
});

export const WidthSchema = yup.object().shape({
  // width: yup.string().required(),
  width: yup.string().test("Digits only", digitsOnly),
});

export const DepthSchema = yup.object().shape({
  // depth: yup.string().required(),
  depth: yup.string().test("Digits only", digitsOnly),
});

// export const LocationSchema = yup.object().shape({
//   itemLocation: yup.string().required(),
// });

// export const ManualAddressLocationSchema = yup.object().shape({
//   manualAddressItemLocation: yup.string().required(),
// });

// export const ManualAddressFromPostcodeSchema = yup.object().shape({
//   addressFromPostcode: yup.string().required(),
// });

// export const CollectionAvailableSchema = yup.object().shape({
//   collectionAvailable: yup.string().required(),
// });

// export const DeliveryAvailableSchema = yup.object().shape({
//   deliveryAvailable: yup.string().required(),
// });

// export const DeliveryDistanceSchema = yup.object().shape({
//   deliveryDistance: yup.string().required(),
// });

// export const DeliveryChargeSchema = yup.object().shape({
//   deliveryCharge: yup.string().required(),
// });

// export const PerDaySchema = yup.object().shape({
//   perDay: yup.string().required(),
// });

// export const PerWeekSchema = yup.object().shape({
//   perWeek: yup.string().required(),
// });

// export const WeightSchema = yup.object().shape({
//   weight: yup.string().required(),
//   // weight: yup.string().test('Digits only', digitsOnly),
// });

export const ForSaleSchema = yup.object().shape({
  // forSale: yup.string().required(),
  forSale: yup.string().test("Digits only", digitsOnly),
});

// export const OffersAcceptedSchema = yup.object().shape({
//   offersAccepted: yup.string().required(),
// });
