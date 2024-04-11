import { useForm } from "react-hook-form";
import { AuthSection } from "../components/AuthSection";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const {error} = useAuth();
  const { t } = useTranslation("login");

  const onSubmit = async (data) => {
    console.log(data);
  };

  const texts = {
    title: t("title"),
    highlited: t("highlited"),
    subtitle: t("subtitle"),
    buttonText: t("buttonText"),
    steamText: t("steamText"),
    questionText: t("questionText"),
    actionText: t("actionText"),
    emailInput: t("emailInput"),
    passwordInput: t("passwordInput"),
  };

  return (
      <AuthSection texts={texts} onSubmit={handleSubmit(onSubmit)} error={error} actionRoute='/signup'>
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
      </AuthSection>
  );
}
