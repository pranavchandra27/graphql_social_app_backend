import { UserInputError } from "apollo-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateLoginInput, validateRegisterInput } from "@utils/validators";
import User from "@models/User";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default {
  Query: {},
  Mutation: {
    // Register new user
    register: async (
      _,
      { registerInput: { firstName, lastName, email, password } }
    ) => {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        firstName,
        lastName,
        email,
        password
      );

      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }

      // Check if user doesn't already exist
      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("email is taken", {
          errors: {
            email: "This email is already registered",
          },
        });
      }

      // Hash user's password
      const hashPassword = bcrypt.hashSync(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        token,
        id: res.id,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        createdAt: res.createdAt,
      };
    },

    // Login user
    login: async (_, { email, password }) => {
      const { valid, errors } = validateLoginInput(email, password);
      const user = await User.findOne({ email });

      if (!valid) {
        throw new UserInputError("Error", errors);
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      };
    },
  },
};
