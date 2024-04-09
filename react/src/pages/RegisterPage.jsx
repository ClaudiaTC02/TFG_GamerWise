import { FormInput } from "../components/FormInput";
import { Header } from "../components/Header";

export default function RegisterPage() {
  return (
    <div>
      <Header />
      <h1>¡Únete a GamerWise!</h1>
      <form>
        <FormInput type="text">User</FormInput>
        <FormInput type="email">Email</FormInput>
        <FormInput type="password">Password</FormInput>
        <FormInput type="password">Repeat the password</FormInput>
      </form>
    </div>
  );
}
