
//Incomplete but this server could be used on both for collator tests and client tests as well.

export class GitHubIssuesClientMock {
  protected server: any;
  constructor(server: any) {
    this.server = server;
  }
  beforeAllSetup() {

  }
}
