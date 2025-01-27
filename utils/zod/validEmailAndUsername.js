const { z } = require("zod");

const validEmailAndUsername = z.object({
  email: z.string().email("Email invalide").nonempty("L'email est requis"),
  username: z
    .string()
    .min(2, "Le nom d'utilisateur doit avoir au moins 2 caractères")
    .max(25, "Le nom d'utilisateur doit avoir moins de 25 caractères")
    .nonempty("Le nom d'utilisateur est requis"),
});

module.exports = validEmailAndUsername;
