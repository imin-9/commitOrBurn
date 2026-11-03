import { type HTTPSendRequester, ok, json } from "@chainlink/cre-sdk"

export default function fetchCommitsForUser(
    sendRequester: HTTPSendRequester,
    githubId: string,
    token: string,
    now: Date
): number {
    const utcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ))

    const yesterdayMidnight = new Date(utcMidnight.getTime() - 24 * 60 * 60 * 1000)

    const since = yesterdayMidnight.toISOString()
    const until = utcMidnight.toISOString()

    const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
        }
      }
    }
  `

    const bodyBytes = new TextEncoder().encode(
        JSON.stringify({ query, variables: { login: githubId, from: since, to: until } })
    )
    const body = Buffer.from(bodyBytes).toString("base64")

    const req = {
        url: "https://api.github.com/graphql",
        method: "POST" as const,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: body
    }

    const resp = sendRequester.sendRequest(req).result()
    if (!ok(resp)) throw new Error(`GitHub GraphQL error: ${resp.statusCode}`)

    const data = json(resp) as {
        data?: { user?: { contributionsCollection?: { totalCommitContributions?: number } } }
        errors?: unknown[]
    }

    if (data.errors || !data.data?.user) return 0

    return data.data.user.contributionsCollection?.totalCommitContributions ?? 0
}
