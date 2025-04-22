const { z } = require("zod");

const userValid = z.object({
  email: z.string().email("Email invalide").nonempty("L'email est requis"),
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
  loginFailed: z.number().nullable(),
  lockDate: z.date().optional(),
  firstReqUser: z.object({
    count: z.number().nullable(),
    date: z.date().optional(),
  }),
  firstReqUserAddOneMn: z.date().optional(),
  isLocked: z.boolean().default(false),
  lockUntil: z.date().optional(),
  code: z.string().optional(),
  date: z.string().optional(),
});

module.exports = userValid;
