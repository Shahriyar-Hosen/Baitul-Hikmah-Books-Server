import mongoose from "mongoose";

export const handleCastError = (error: mongoose.Error.CastError) => {
  const errors = [
    {
      path: error.path,
      message: "Cast Invalid error",
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: "Cast Error",
    errorMessage: errors,
  };
};
