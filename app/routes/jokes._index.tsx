import type {LoaderArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/utils/session.server";

export const loader = async({
  request
}: LoaderArgs) =>
{
  const logInUserId = await requireUserId(request);
  if(!logInUserId)
  {
    throw new Response("No random joke found", {status: 404});
  }

  return json({});
};

export default function JokesIndexRoute()
{
  return (
    <div></div>
  );
}
