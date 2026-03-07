import ChangePassword from "./ChangePassword";

export function generateStaticParams() {
  return [{id: '_'}];
}

export default function ChangePasswordPage() {
  return <ChangePassword/>;
}
