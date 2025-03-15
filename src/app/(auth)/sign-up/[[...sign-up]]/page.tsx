"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function SignUpPage() {
  const router = useRouter();

  const getGuestID = () => {
    const cookies = document.cookie.split("; ");
    const guestCookie = cookies.find((row) => row.startsWith("guestId="));
    return guestCookie ? guestCookie.split("=")[1] : null;
  };

  const guestId = () => {
    const existingGuestID = getGuestID();
    if (existingGuestID) {
      router.push("/dashboard");
      return;
    }

    const newGuestID = `guest-${uuidv4()}`;
    document.cookie = `guestId=${newGuestID}; path=/;`;
    router.push("/dashboard");
  };

  return (
    <SignUp.Root>
      <SignUp.Step name="start">
        <h1>Create an account</h1>

        <Clerk.Connection name="google">Sign up with Google</Clerk.Connection>
        <Clerk.Connection name="github">Sign up with Github</Clerk.Connection>

        <Clerk.Field name="emailAddress">
          <Clerk.Label>Email</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <Clerk.Field name="password">
          <Clerk.Label>Password</Clerk.Label>
          <Clerk.Input />
          <Clerk.FieldError />
        </Clerk.Field>

        <SignUp.Action submit>Sign up</SignUp.Action>
      </SignUp.Step>

      <button onClick={guestId}>Continue as Guest</button>

      <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_code">
          <h1>Check your email</h1>

          <Clerk.Field name="code">
            <Clerk.Label>Email Code</Clerk.Label>
            <Clerk.Input />
            <Clerk.FieldError />
          </Clerk.Field>

          <SignUp.Action submit>Verify</SignUp.Action>
        </SignUp.Strategy>
      </SignUp.Step>
    </SignUp.Root>
  );
}
