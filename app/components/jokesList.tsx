import {Link} from "@remix-run/react";

export default function JokesList(props: {
  jokeListItems: {id: string, name: string}[],
  showAdd: boolean
})
{
  const {
    jokeListItems,
    showAdd
  } = props;
  return (
    <div className="jokes-list">
      <Link to=".">Get a random joke</Link>
      {showAdd &&
        <><p>or</p>
          <Link to="new" className="button">
            Add your own
          </Link>
        </>
      }
      <p>Here are a few more jokes to check out:</p>
      <ul>
        {jokeListItems.length > 0 ? (
          jokeListItems.map(({
            id,
            name
          }) => (
            <li key={id}>
              <Link prefetch="intent" to={id}>
                {name}
              </Link>
            </li>
          ))
        ) : (
          <li>No jokes found</li>
        )}
      </ul>
    </div>
  );
}
