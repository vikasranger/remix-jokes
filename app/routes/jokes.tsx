import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Form, Link, Outlet, useLoaderData, useNavigate, useParams} from "@remix-run/react";
import {useEffect, useState} from "react";

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
  request
}: LoaderFunctionArgs) =>
{
  const user = await getUser(request);
  const users = await db.user.findMany();

  const jokeListItems = user
    ? await db.joke.findMany({
      orderBy: {createdAt: "desc"},
      select: {
        id: true,
        name: true
      },
      where: {jokesterId: user.id}
    })
    : [];

  return json({
    jokeListItems,
    user,
    users
  });
};

export default function JokesRoute()
{
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const navigation = useNavigate();

  useEffect(() =>
  {
    const userId = data.user?.id;
    if(!params.jokeId && userId)
    {
      navigation(userId);
    }
  }, [data.user?.id]);

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <UserSelect />
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="jokes-outlet">
          <Outlet />
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}

function UserSelect()
{
  const data = useLoaderData<typeof loader>();
  const [selectedUserId, setSelectedUserId] = useState(data.user?.id);
  const navigation = useNavigate();

  function changeUser(userId: string)
  {
    setSelectedUserId(userId);
    navigation(userId);
  }

  function isSelf(userId: string)
  {
    return data.user?.id === userId;
  }

  return (
    <select
      className="user-select"
      value={selectedUserId}
      onChange={(e) => changeUser(e.target.value)}
    >
      <option key={data.user?.id} value={data.user?.id}>
        {"Me🚀"}
      </option>
      {data.users.map((user) => (
        isSelf(user.id) ?
          null :
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
      ))}
    </select>
  );
}
