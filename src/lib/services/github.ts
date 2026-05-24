import "server-only";

/**
 * Live stats pulled from the Vector-OS GitHub org. No DB persistence — these
 * are fetched on the server and cached by Next's data cache (see REVALIDATE).
 *
 * Auth is optional: set GITHUB_TOKEN to lift the rate limit from 60 req/hr
 * (unauthenticated, per-IP) to 5000 req/hr. Caching keeps us well under either.
 */

const ORG = "Vector-OS";
const API = "https://api.github.com";

/** Data-cache lifetime for every GitHub call, in seconds (10 min). */
const REVALIDATE = 600;

/** Hard cap on repo pages walked, so a misbehaving API can't loop forever. */
const MAX_REPO_PAGES = 5;

export type GithubOrgStats = {
  repos: number;
  members: number;
  stars: number;
};

type Org = { public_repos: number };
type Repo = { stargazers_count: number };
type Member = { login: string };

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Cached GET against the GitHub API. Returns null on any failure. */
async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: ghHeaders(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Walk paginated org repos so the star total covers every repo, not just 100. */
async function fetchAllRepos(): Promise<Repo[] | null> {
  const all: Repo[] = [];
  for (let page = 1; page <= MAX_REPO_PAGES; page++) {
    const batch = await ghFetch<Repo[]>(
      `/orgs/${ORG}/repos?per_page=100&page=${page}`,
    );
    if (batch === null) return page === 1 ? null : all;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

/**
 * Repo count, public-member count, and total stars across the org.
 * Returns null only when GitHub is fully unreachable, so callers can fall
 * back to static values instead of rendering zeros.
 */
export async function getOrgStats(): Promise<GithubOrgStats | null> {
  const [org, repos, members] = await Promise.all([
    ghFetch<Org>(`/orgs/${ORG}`),
    fetchAllRepos(),
    ghFetch<Member[]>(`/orgs/${ORG}/members?per_page=100`),
  ]);

  if (!org && !repos && !members) return null;

  const stars = repos?.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

  return {
    repos: org?.public_repos ?? repos?.length ?? 0,
    members: members?.length ?? 0,
    stars: stars ?? 0,
  };
}
