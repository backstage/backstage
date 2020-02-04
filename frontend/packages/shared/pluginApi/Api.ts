type ApiInfo = {
  id: string;
  title: string;
  description: string;
};

export type AnyApi = Api<any>;

export type ApiType<T> = T extends Api<infer U> ? U : never;

// This class is currently only used as a marker for generating documentation.
//
// See backstage.spotify.net/docs/backstage-frontend/apis/documenting-your-api.md
//
// @ts-ignore: The type parameter is read by doc parser.
export default class Api<T> {
  constructor(private readonly info: ApiInfo) {
    if (!info.id.match(/^[a-zA-Z]+$/)) {
      throw new Error(`API id must only contain ascii letters, got '${info.id}'`);
    }
  }

  get id(): string {
    return this.info.id;
  }

  get title(): string {
    return this.info.title;
  }

  get description(): string {
    return this.info.description;
  }

  toString() {
    return `api{${this.info.id}}`;
  }
}
