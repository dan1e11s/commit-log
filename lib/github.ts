import { Octokit } from "@octokit/rest";

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
    };
    description: string | null;
    private: boolean;
}

export interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}

export interface ParsedCommit {
    hash: string;
    type: "FEAT" | "FIX" | "IMPROVEMENT" | null;
    title: string;
    description: string;
    date: string;
}

/**
 * Создаёт Octokit клиент с токеном пользователя
 */
export function createGitHubClient(accessToken: string) {
    return new Octokit({
        auth: accessToken,
    });
}

/**
 * Получает список репозиториев пользователя
 */
export async function fetchUserRepositories(
    accessToken: string
): Promise<Repository[]> {
    const octokit = createGitHubClient(accessToken);

    try {
        const { data } = await octokit.repos.listForAuthenticatedUser({
            sort: "updated",
            per_page: 100,
        });

        return data as Repository[];
    } catch (error) {
        console.error("Error fetching repositories:", error);
        throw new Error("Не удалось получить список репозиториев");
    }
}

/**
 * Получает коммиты из репозитория
 */
export async function fetchCommits(
    accessToken: string,
    owner: string,
    repo: string,
    since?: Date
): Promise<Commit[]> {
    const octokit = createGitHubClient(accessToken);

    try {
        const params: any = {
            owner,
            repo,
            per_page: 100,
        };

        if (since) {
            params.since = since.toISOString();
        }

        const { data } = await octokit.repos.listCommits(params);

        return data as Commit[];
    } catch (error) {
        console.error("Error fetching commits:", error);
        throw new Error("Не удалось получить коммиты");
    }
}

/**
 * Парсит Conventional Commit и извлекает тип и сообщение
 */
export function parseConventionalCommit(commit: Commit): ParsedCommit | null {
    const message = commit.commit.message;
    const lines = message.split("\n");
    const firstLine = lines[0];

    // Регулярка для Conventional Commits: type(scope): message
    const conventionalRegex = /^(feat|fix|improvement|refactor)(\(.+\))?:\s*(.+)$/i;
    const match = firstLine.match(conventionalRegex);

    if (!match) {
        return null;
    }

    const rawType = match[1].toLowerCase();
    let type: "FEAT" | "FIX" | "IMPROVEMENT";

    if (rawType === "feat") {
        type = "FEAT";
    } else if (rawType === "fix") {
        type = "FIX";
    } else if (rawType === "improvement" || rawType === "refactor") {
        type = "IMPROVEMENT";
    } else {
        return null;
    }

    const title = match[3].trim();

    // Описание - это всё после первой строки
    const description = lines.slice(1).join("\n").trim();

    return {
        hash: commit.sha,
        type,
        title,
        description,
        date: commit.commit.author.date,
    };
}

/**
 * Получает и парсит коммиты из репозитория
 */
export async function fetchAndParseCommits(
    accessToken: string,
    owner: string,
    repo: string,
    since?: Date
): Promise<ParsedCommit[]> {
    const commits = await fetchCommits(accessToken, owner, repo, since);

    const parsedCommits: ParsedCommit[] = [];

    for (const commit of commits) {
        const parsed = parseConventionalCommit(commit);
        if (parsed) {
            parsedCommits.push(parsed);
        }
    }

    return parsedCommits;
}
