package ghactions

type User struct {
	Name  string `json:"name"`  // "Octo Cat"
	Email string `json:"email"` // "octocat@github.com"
}

type Commit struct {
	ID        string `json:"id"`        // "acb5820ced9479c074f688cc328bf03f341a511d"
	TreeID    string `json:"tree_id"`   // "d23f6eedb1e1b9610bbc754ddb5197bfe7271223"
	Message   string `json:"message"`   // "Create linter.yml"
	Timestamp string `json:"timestamp"` // "2020-01-22T19:33:05Z"
	Author    User   `json:"author"`
	Committer User   `json:"committer"`
}

type Repository struct {
	ID       int64  `json:"id"`        // 217723378
	NodeID   string `json:"node_id"`   // MDEwOlJlcG9zaXRvcnkyMTc3MjMzNzg="
	Name     string `json:"name"`      // o-repo"
	FullName string `json:"full_name"` //  "octo-org/octo-repo"
	HTMLURL  string `json:"html_url"`  // "https://github.com/octo-org/octo-repo"
}

type WorkflowRunResponse struct {
	ID             int64      `json:"id"`             // 30433642
	NodeID         string     `json:"node_id"`        // "MDEyOldvcmtmbG93IFJ1bjI2OTI4OQ=="
	HeadBranch     string     `json:"head_branch"`    // "master"
	HeadSha        string     `json:"head_sha"`       // "acb5820ced9479c074f688cc328bf03f341a511d"
	RunNumber      int64      `json:"run_number"`     // 562
	CheckSuiteID   int64      `json:"check_suite_id"` // 414944374
	Event          string     `json:"event"`          // "push"
	Status         string     `json:"status"`         // "queued"
	Conclusion     *string    `json:"conclusion"`     // null
	URL            string     `json:"url"`            // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642"
	HTMLURL        string     `json:"html_url"`       // "https://github.com/octo-org/octo-repo/actions/runs/30433642"
	CreatedAt      string     `json:"created_at"`     // "2020-01-22T19:33:08Z"
	UpdatedAt      string     `json:"updated_at"`     // "2020-01-22T19:33:08Z"
	JobsURL        string     `json:"jobs_url"`       // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642/jobs"
	LogsURL        string     `json:"logs_url"`       // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642/logs"
	ArtifactsURL   string     `json:"artifacts_url"`  // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642/artifacts"
	CancelURL      string     `json:"cancel_url"`     // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642/cancel"
	RerunURL       string     `json:"rerun_url"`      // "https://api.github.com/repos/octo-org/octo-repo/actions/runs/30433642/rerun"
	WorkflowURL    string     `json:"workflow_url"`   // "https://api.github.com/repos/octo-org/octo-repo/actions/workflows/30433642"
	HeadCommit     Commit     `json:"head_commit"`
	Repository     Repository `json:"repository"`
	HeadRepository Repository `json:"head_repository"`
}

type WorkflowRunsListResponse struct {
	TotalCount int64                 `json:"total_count"`
	Runs       []WorkflowRunResponse `json:"workflow_runs"`
}
