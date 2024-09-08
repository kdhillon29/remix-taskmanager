import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix taskmanager App" },
    {
      name: "description",
      content:
        "Simple taskmanager app with remix,prisma,mongodb and zod validation!",
    },
  ];
};
//protect the page from unauthenticated users
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return { user };
};
export default function Index() {
  return (
    <div className="container bg-purple-200 h-screen mx-auto text-center p-2">
      <h1 className="bg-blue-200 text-3xl w-[80%] mx-auto p-4 tracking-wide">
        Welcome to Remix TaskaManager App
      </h1>
    </div>
  );
}
