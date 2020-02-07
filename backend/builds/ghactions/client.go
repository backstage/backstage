package ghactions

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type Client struct {
	client      *http.Client
	baseURL     string
	accessToken string
}

func NewFromEnv() (*Client, error) {
	accessToken := os.Getenv("BOSS_GH_ACCESS_TOKEN")

	if accessToken == "" {
		return nil, fmt.Errorf("BOSS_GH_ACCESS_TOKEN not set")
	}

	return New(http.DefaultClient, "https://api.github.com", accessToken), nil
}

func New(client *http.Client, baseURL, accessToken string) *Client {
	return &Client{
		client:      client,
		baseURL:     baseURL,
		accessToken: accessToken,
	}
}

func (c *Client) createRequest(ctx context.Context, owner, repo, path string) (*http.Request, error) {
	url := fmt.Sprintf("%s/repos/%s/%s/actions%s", c.baseURL, owner, repo, path)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", "Bearer "+c.accessToken)

	return req.WithContext(ctx), nil
}

func (c *Client) ListWorkflowRuns(ctx context.Context, owner, repo string) (*WorkflowRunsListResponse, error) {
	req, err := c.createRequest(ctx, owner, repo, "/runs")
	if err != nil {
		return nil, err
	}

	res, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Upstream fetch failed with status %d %s", res.StatusCode, res.Status)
	}

	var resData WorkflowRunsListResponse
	if err := json.NewDecoder(res.Body).Decode(&resData); err != nil {
		return nil, err
	}

	return &resData, nil
}

func (c *Client) GetWorkflowRun(ctx context.Context, owner, repo, runId string) (*WorkflowRunResponse, error) {
	req, err := c.createRequest(ctx, owner, repo, fmt.Sprintf("/runs/%s", runId))
	if err != nil {
		return nil, err
	}

	res, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		if res.StatusCode == http.StatusNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("Upstream fetch failed with status %d %s", res.StatusCode, res.Status)
	}

	var resData WorkflowRunResponse
	if err := json.NewDecoder(res.Body).Decode(&resData); err != nil {
		return nil, err
	}

	return &resData, nil
}
