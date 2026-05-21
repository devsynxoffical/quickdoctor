import { redirect } from "next/navigation";

export default function SelfInjectableLegacyRoute() {
  redirect("/register");
}
