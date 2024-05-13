import { FormInput } from "../components/FormInput";
import { AuthSection } from "../components/AuthSection";

import { useForm } from "react-hook-form";

import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Footer } from "../components/Footer";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm();
  const { signUp, error, user, setError } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("register");

  const texts = {
    title: t("title"),
    highlited: t("highlited"),
    subtitle: t("subtitle"),
    buttonText: t("buttonText"),
    steamText: t("steamText"),
    questionText: t("questionText"),
    actionText: t("actionText"),
    usernameInput: t("usernameInput"),
    emailInput: t("emailInput"),
    passwordInput: t("passwordInput"),
    repeatPasswordInput: t("repeatPasswordInput"),
  };

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      setError(null); // Clean state
    };
  }, [setError]);

  const onSubmit = async (data) => {
    signUp(data);
  };

  return (
    <>
      <AuthSection
        texts={texts}
        onSubmit={handleSubmit(onSubmit)}
        error={error}
        actionRoute="/login"
      >
        <FormInput
          type="text"
          name="name"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
        >
          {texts.usernameInput}
        </FormInput>
        <FormInput
          type="email"
          name="email"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
        >
          {texts.emailInput}
        </FormInput>
        <FormInput
          type="password"
          name="password"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
        >
          {texts.passwordInput}
        </FormInput>
        <FormInput
          type="password"
          name="password-repeat"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          passwordValue={watch("password")}
        >
          {texts.repeatPasswordInput}
        </FormInput>
      </AuthSection>
      <Footer />
    </>
  );
}
