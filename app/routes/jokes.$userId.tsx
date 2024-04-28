import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Outlet, useLoaderData} from "@remix-run/react";
import JokesList from "~/components/jokesList";

import stylesUrl from "~/styles/jokes.css";
import {db} from "~/utils/db.server";
import {getUser} from "~/utils/session.server";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesUrl
  }
];
           
export const loader = async({
  params,
  request
}: LoaderFunctionArgs) =>
{
  const user = await getUser(request);
  console.log("params", params);
  const paramUserId = params.userId;

  // In the official deployed version of the app, we don't want to deploy
  // a site with none-moderated content, so we only show users their own jokes
  const jokeListItems = user
    ? await db.joke.findMany({
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        name: true
      },
      where: {jokesterId: paramUserId ?? user.id}
    })
    : [];

  return json({
    jokeListItems,
    user,
    self: user?.id === paramUserId
  });
};

export default function JokesUserRoute()
{
  const data = useLoaderData<typeof loader>();
  console.log("user data", data);

  return (
    <div className="jokeList-container">
      <JokesList jokeListItems={data.jokeListItems} showAdd={data.self}/>
      <div className="jokes-outlet">
        <Outlet />
      </div>
    </div>
  );
}
