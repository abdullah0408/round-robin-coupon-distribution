// "use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignUp from "@clerk/elements/sign-up";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function SignUpPage() {


//   return (
//     <div>
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <SignUp.Root>
//             <SignUp.Step name="start">
//               <div className="space-y-4">
//                 <div>
//                   <Clerk.Field name="emailAddress">
//                     <Clerk.Label className="block text-sm font-medium text-gray-700">
//                       Email
//                     </Clerk.Label>
//                     <Clerk.Input className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
//                     <Clerk.FieldError className="text-red-500 text-xs mt-1" />
//                   </Clerk.Field>
//                 </div>
//                 <div>
//                   <Clerk.Field name="password">
//                     <Clerk.Label className="block text-sm font-medium text-gray-700">
//                       Password
//                     </Clerk.Label>
//                     <Clerk.Input
//                       type="password"
//                       className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                     />
//                     <Clerk.FieldError className="text-red-500 text-xs mt-1" />
//                   </Clerk.Field>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <SignUp.Action submit>
//                     <Button className="w-full">Sign up</Button>
//                   </SignUp.Action>
//                   <Button variant="outline" className="w-full" onClick={guestId}>
//                     Continue as Guest
//                   </Button>
//                 </div>
//               </div>
//             </SignUp.Step>

//             <SignUp.Step name="verifications">
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <h1 className="text-xl font-bold">Check your email</h1>
//                 </div>
//                 <Clerk.Field name="code">
//                   <Clerk.Label className="block text-sm font-medium text-gray-700">
//                     Email Code
//                   </Clerk.Label>
//                   <Clerk.Input className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
//                   <Clerk.FieldError className="text-red-500 text-xs mt-1" />
//                 </Clerk.Field>
//                 <SignUp.Action submit>
//                   <Button className="w-full">Verify</Button>
//                 </SignUp.Action>
//               </div>
//             </SignUp.Step>
//           </SignUp.Root>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



'use client'

import { Button } from '@/components/ui/button';
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";

export default function SignUpPage() {

  const router = useRouter();

  const getGuestID = () => {
    const cookies = document.cookie.split("; ");
    const guestCookie = cookies.find((row) => row.startsWith("guestId="));
    return guestCookie ? guestCookie.split("=")[1] : null;
  };

  const guestId = () => {
    const existingGuestId = getGuestID();
    if (existingGuestId) {
      router.push("/dashboard");
      return;
    }

    const newGuestId = `guest-${uuidv4()}`;
    document.cookie = `guestId=${newGuestId}; path=/;`;
    router.push("/dashboard");
  };
  return (
    <div className="grid w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
              Create an account
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="emailAddress" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Email</Clerk.Label>
              <Clerk.Input
                type="email"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <div>
          <SignUp.Action
            submit
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 mb-2 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Sign Up
          </SignUp.Action>
          <Button
            onClick={guestId}
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Continue as Guest
          </Button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
        <SignUp.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
              Verify email code
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Email code</Clerk.Label>
              <Clerk.Input
                type="otp"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Verify
            </SignUp.Action>
          </SignUp.Strategy>
          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
        <SignUp.Step
          name="continue"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
              className="mx-auto size-10 text-zinc-950"
              aria-hidden
            >
              <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
              </mask>
              <g fill="currentColor" mask="url(#a)">
                <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
              </g>
            </svg>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
              Continue registration
            </h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <Clerk.Field name="username" className="space-y-2">
            <Clerk.Label className="text-sm font-medium text-zinc-950">Username</Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
            />
            <Clerk.FieldError className="block text-sm text-red-400" />
          </Clerk.Field>
          <SignUp.Action
            submit
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Continue
          </SignUp.Action>
          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  )
}