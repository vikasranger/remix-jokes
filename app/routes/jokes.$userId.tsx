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
  const paramUserId = params.userId;

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

  return (
    <div className="container">
      {data.jokeListItems.length > 0 &&
        <JokesList jokeListItems={data.jokeListItems} showAdd={data.self} />
      }
      <div className="jokes-outlet">
        <Outlet />
      </div>
    </div>
  );
}
