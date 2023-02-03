import { useEffect, useState } from "react";

export type DbQuery = {
  // https://docs.datomic.com/cloud/query/query-data-reference.html#predicates
  // https://cljs.info/cheatsheet/
  // https://github.com/tonsky/datascript/wiki/Getting-started
  // https://clojure.github.io/clojure/clojure.core-api.html#clojure.core/read-string
  query: string;
  inputs: string;
};

async function fetchEvents<T>(q: DbQuery): Promise<T[]> {
  const result = await logseq.DB.datascriptQuery(q.query, q.inputs);
  return result as T[];
}

type DbQueryResult<T> =
  | {
      loading: true;
      data: undefined | T[];
    }
  | {
      loading: false;
      data: T[];
    };

export function useDbQuery<T>(query: DbQuery): DbQueryResult<T> {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<T[]>([]);

  useEffect(() => {
    setLoading(true);
    let active = true;
    fetchEvents<T>(query).then((it) => {
      if (active) {
        setLoading(false);
        setEvents(it);
      }
    });
    const onChangeHook = logseq.DB.onChanged((e) => {
      setLoading(true);
      fetchEvents<T>(query).then((it) => {
        if (active) {
          setLoading(false);
          setEvents(it);
        }
      });
    });
    return () => {
      onChangeHook();
      active = false;
    };
  }, [query]);

  if (loading) {
    return {
      loading: true,
      data: events,
    };
  } else {
    return {
      loading: false,
      data: events,
    };
  }
}
