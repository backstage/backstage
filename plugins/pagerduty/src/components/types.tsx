export type PagerDutyIncident = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  homepageUrl: string;
  assignees: Partial<PagerDutyUserData>[];
};

export type PagerDutyUserData = {
  email: string;
  name: string;
  homepageUrl: string;
  id: string;
};

export type PagerDutyServicesData = {
  activeIncidents: PagerDutyIncident[];
  escalationPolicy: any; // PagerDutyUserData[];
  id: string;
  name: string;
  homepageUrl: string;
};

export type PagerDutyData = {
  pagerDutyServices: PagerDutyServicesData[];
};
