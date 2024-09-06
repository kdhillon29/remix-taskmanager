import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="container bg-slate-600 h-screen mx-auto text-center p-2">
      <h1 className="bg-red-500 w-1/2 mx-auto">Welcome to Remix</h1>
    </div>
  );
}
