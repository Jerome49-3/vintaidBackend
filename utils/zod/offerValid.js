//  product_name: {
//     type: String,
//     maxLength: 50,
//     required: true,
//   },
//   product_description: {
//     type: String,
//     maxLength: 500,
//     required: true,
//   },
//   product_price: {
//     type: Number,
//     max: 100000,
//     required: true,
//   },
//   product_details: Array,
//   product_image: Object,
//   product_pictures: Array,
//   offer_solded: {
//     type: Boolean,
//     default: false,
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },
//   date: {
//     type: Date,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   isFavorite: {
//     type: Boolean,
//   },

const { z } = require("zod");

const offerValid = z.object({
  product_name: z
    .string()
    .min(3, "name's offer must be three caracther minimum")
    .max(500, "name's offer must be five hundred caracther minimum")
    .nonempty("product_name is required"),
  product_description: z
    .string()
    .min(3, "name's description must be three caracther minimum")
    .max(500, "name's description must be five hundred caracther minimum")
    .nonempty("product_description is required"),
  product_price: z.number().nonempty("product_price is required"),
  product_quantity: z
    .number()
    .min(1, "product_quantity must be once quantity minimum")
    .nonempty("product_price is required"),
  account: z.object({
    username: z
      .string()
      .min(2, "Le nom d'utilisateur doit avoir au moins 2 caractères")
      .max(25, "Le nom d'utilisateur doit avoir moins de 25 caractères")
      .nonempty("Le nom d'utilisateur est requis"),
    avatar: z.string().url("URL de l'avatar invalide").optional(),
  }),
  newsletter: z.boolean().optional(),
  token: z.string().optional(),
  hash: z.string().optional(),
  salt: z.string().optional(),
  isAdmin: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  becomeAdmin: z.boolean().default(false),
  emailIsConfirmed: z.boolean().default(false),

  lockDate: z.date().optional(),
  isLocked: z.boolean().default(false),
  lockUntil: z.date().optional(),
  code: z.string().optional(),
  date: z.string().optional(),
});

module.exports = userValid;
