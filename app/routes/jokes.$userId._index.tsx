import type {LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {isRouteErrorResponse, Link, useLoaderData, useRouteError} from "@remix-run/react";

import {db} from "~/utils/db.server";
import {requireUserId} from "~/utils/session.server";

export const loader = async({
  params,
  request
}: LoaderFunctionArgs) =>
{

  const userId = params.userId;
  const logInUserId = await requireUserId(request);
  if(!logInUserId)
  {
    throw new Response("No user loggedIn", {status: 404});
  }

  const count = await db.joke.count({where: {jokesterId: userId}});
  const randomRowNumber = Math.floor(Math.random() * count);

  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
    where: {jokesterId: userId}
  });
  if(!randomJoke)
  {
    if(userId !== logInUserId)
    {
      throw new Response("Add not allowed", {status: 401});
    }
    else
    {
      throw new Response("No random joke found", {status: 404});
    }
  }
  return json({randomJoke});
};

export default function JokesUserIndexRoute()
{
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary()
{
  const error = useRouteError();
  console.error(error);

  if(isRouteErrorResponse(error) && (error.status === 404 || error.status === 401))
  {
    return (
      <div className="error-container">
        <p>
          There are no jokes to display.
          <br />
          <small>
            Note: this is the deployed version of the jokes app example and
            because we don't want to show you none-moderated content, we only
            display jokes you create in this version.
          </small>
        </p>
        {error.status === 404 && <Link to="new">Add your own</Link>}
      </div>
    );
  }

  return <div className="error-container">I did a whoopsies.</div>;
}
