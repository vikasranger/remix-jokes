import type {LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {requireUserId} from "~/utils/session.server";

export const loader = async({
  request
}: LoaderFunctionArgs) =>
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
