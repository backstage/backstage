import React from 'react';

import BackstageMenuItem from 'shared/apis/menu/BackstageMenuItem';

import { AppIcon, GroupIcon, ServiceIcon, StorageIcon } from 'shared/icons';
import DataIcon from '@material-ui/icons/DataUsage';
import ReliabilityIcon from '@material-ui/icons/Stars';
import ComplianceIcon from '@material-ui/icons/Business';
import CodeIcon from '@material-ui/icons/Code';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

// Explore icons.
import ProgrammingPlatformIcon from 'shared/assets/icons/explore/pp.png';
import TechLearningIcon from 'shared/assets/icons/explore/techlearning.png';
import SearchIcon from 'shared/assets/icons/explore/search.png';
import MessagingIcon from 'shared/assets/icons/explore/journey.png';
import EncoreIcon from 'shared/assets/icons/explore/encore.png';
import SecurityIcon from 'shared/assets/icons/explore/SecurityTribe.png';
import Tc4bIcon from 'shared/assets/icons/explore/tc4b.jpg';
import MLIcon from 'shared/assets/icons/explore/ml.png';

// Client SDK icons.
import SDKGenericIcon from 'shared/assets/icons/explore/sdk.png';
import BetamaxIcon from 'shared/assets/icons/explore/betamax.png';
import ConnectivitySDKIcon from 'shared/assets/icons/explore/connectivity_logo_black.png';

// Infrastructure and Tooling.
import PlatformDefaultIcon from 'shared/assets/icons/explore/tool-logo.svg';
import DataInfrastructureIcon from 'shared/assets/icons/explore/di.png';
import DataMonitoringIcon from 'shared/assets/icons/explore/datamonitoring.png';
import TingleIcon from 'shared/assets/icons/explore/tingle.png';
import TechDocsIcon from 'shared/assets/icons/explore/techdocs.png';
import SlingshotIcon from 'shared/assets/icons/explore/slingshot.png';
import ScioIcon from 'shared/assets/icons/explore/scio.png';
import StackOverflowEnterpriseIcon from 'shared/assets/icons/explore/soe.png';
import JukeboxIcon from 'shared/assets/icons/explore/jukebox.png';
import KubeflowIcon from 'shared/assets/icons/explore/kubeflow.png';
import KlioIcon from 'shared/assets/icons/explore/klio.png';
import GrpcIcon from 'shared/assets/icons/explore/spoticakes.png';
import BigQueryIcon from 'shared/assets/icons/explore/bigquery.png';
import ScienceBoxIcon from 'shared/assets/icons/explore/sciencebox.png';
import TableauIcon from 'shared/assets/icons/explore/tableau.png';
import QlikSenseIcon from 'shared/assets/icons/explore/qliksense.png';
import MobiusIcon from 'shared/assets/icons/explore/mobius-logo.png';
import DistributedTracingIcon from 'shared/assets/icons/explore/lightstep.png';
import GrafanaIcon from 'shared/assets/icons/explore/grafana.png';
import LuigiIcon from 'shared/assets/icons/explore/luigi.png';
import CassetteIcon from 'shared/assets/icons/explore/cassette-logo.png';
import SecurityTribeIcon from 'shared/assets/icons/explore/SecurityTribe.png';
import ArtifactoryIcon from 'shared/assets/icons/explore/artifactory.png';
import BackstageIcon from 'shared/assets/icons/explore/backstage-platform.png';
import ITGCtrackerIcon from 'shared/assets/icons/explore/itgc_tracker.svg';
import BigtableIcon from 'shared/assets/icons/explore/bigtable.png';

export function setupMenu(pluginManager) {
  const rp = pluginManager.rootPlugin;

  const menuRoot = (pluginManager.menu = new BackstageMenuItem(rp, 'root', ''));

  menuRoot.add(new BackstageMenuItem(rp, 'tools', 'Tools'));

  menuRoot.add(
    new BackstageMenuItem(rp, 'explore', 'Explore', {
      searchable: false,
    }),
  );

  /**
   * This is a non-searchable menu item that is used by plugins to add links to the search.
   */
  menuRoot.add(new BackstageMenuItem(rp, 'general', 'General'));

  //-------------------------------------
  // Explore
  //-------------------------------------
  // Platforms
  menuRoot.getByIdPath('explore').add(new BackstageMenuItem(rp, 'platform', 'Platforms', { searchable: false }));

  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'metadata', 'Content Metadata', {
      img: 'https://cdn2.techadvisor.co.uk/cmsdata/reviews/3620240/Spotify-Menu.png',
      url: '/docs/metadata',
      desc:
        "The source for all of Spotify's ingested, curated and refined content metadata to create a catalog that both listeners and creators expect.",
      newsTag: 'contentmetadata',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'pzn', 'Personalization', {
      img:
        'https://domain.me/wp-content/uploads/2016/10/ME-blog-cover-Personalization-The-Future-of-Marketing-okt-2016.jpg',
      url: 'https://confluence.spotify.net/display/PZNPL/Product+Pages',
      desc: 'Understand the ways content on Spotify can be similar to other content',
      newsTag: 'personalization',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'messaging', 'Quicksilver Messaging', {
      img: MessagingIcon,
      fit: 'contain',
      url: 'https://confluence.spotify.net/display/quicksilver/Quicksilver+Messaging+Platform',
      desc:
        'Quicksilver is the internal messaging tool used to send in-app, email and push messages to Spotify listeners.',
      newsTag: 'quicksilver',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'pp', 'Programming', {
      img: ProgrammingPlatformIcon,
      url: 'https://docs.google.com/document/d/1JlTWLPF39uDKMOWKrjzQ4_BaVa6X28B9_vTVaNbOxEM/edit#',
      desc:
        'Content aggregation, curation and personalization of views. Tools for curating playlists and programming which playlists go where.',
      newsTag: 'programming',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'security', 'Security', {
      img: SecurityIcon, // or external URL.
      fit: 'contain',
      url: '/docs/security',
      desc: 'Security guidelines you should take into account when building and reviewing your service.',
      newsTag: 'security',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'encore', 'Encore', {
      img: EncoreIcon,
      url: 'https://encore.spotify.net/',
      desc:
        'Our new approach to design systems. It’s everything you need to build beautiful, scalable apps that look and feel like Spotify.',
      newsTag: 'encore',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'storage', 'Storage', {
      img:
        'https://storage.googleapis.com/gweb-cloudblog-publish/images/google-cloud-storage-pub-sub3a60.max-700x700.PNG',
      url: '/docs/storage',
      desc:
        'Enabling squads to focus on their vision by providing reliable, easy to use storage solutions that grow with Spotify.',
      newsTag: 'storage',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'search', 'Search', {
      img: SearchIcon,
      url: 'https://confluence.spotify.net/display/JAM/Search+Product+Area',
      desc: 'Enables a frictionless path from intent expressed through text, to great sessions and the right entities.',
      newsTag: 'search',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'connect', 'Spotify Connect', {
      img: 'https://assets.sbnation.com/assets/3147739/spotify-connect-devices1_560.jpg',
      url: 'https://www.spotify.com/connect/',
      desc: 'Listen on your speakers or TV, using the Spotify app as a remote.',
      newsTag: 'connect',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'tl', 'Tech Learning', {
      img: TechLearningIcon,
      url: '/docs/tech-learning',
      desc: 'Educational programs to grow the breadth and depth of Spotify employees’ technical skill sets.',
      newsTag: 'techlearning',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'web-api', 'Spotify Web API', {
      img: 'https://developer.spotify.com/assets/WebAPI_intro.png',
      url: 'https://developer.spotify.com/documentation/web-api/',
      desc:
        'Spotify Web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue.',
      newsTag: 'webapi',
    }),
  );
  menuRoot.getByIdPath('explore.platform').add(
    new BackstageMenuItem(rp, 'research', 'Research', {
      img: 'https://s3.envato.com/files/2709ab7e-dd8f-4243-983d-82a5c763e46a/inline_image_preview.jpg',
      url: 'https://research.spotify.com',
      desc: "Extending the State of the Art in Technologies related to Spotify's Products",
      newsTag: 'research',
    }),
  );
  if (FeatureFlags.getItem('machine-learning')) {
    menuRoot.getByIdPath('explore.platform').add(
      new BackstageMenuItem(rp, 'ml', 'Machine Learning', {
        img: MLIcon,
        url: '/machine-learning',
        lifecycle: 'Alpha',
        desc: 'Spotify’s ML Platform to discover, share, and manage your ML work.',
        newsTag: 'ml',
      }),
    );
  }
  if (FeatureFlags.getItem('sciencebox-cloud-notebook-creator')) {
    menuRoot.getByIdPath('explore.platform').add(
      new BackstageMenuItem(rp, 'sciencebox', 'ScienceBox Cloud', {
        img: ScienceBoxIcon,
        url: '/sciencebox-cloud',
        lifecycle: 'Alpha',
        desc: "Spotify's Platform to simplify your data analysis workflow",
        newsTag: 'scienceboxcloud',
      }),
    );
  }

  // Client SDKs
  menuRoot.getByIdPath('explore').add(new BackstageMenuItem(rp, 'sdk', 'Client SDKs', { searchable: false }));
  menuRoot.getByIdPath('explore.sdk').add(
    new BackstageMenuItem(rp, 'betamax', 'Betamax', {
      img: BetamaxIcon,
      url: '/docs/betamax-sdk',
      desc: 'The Betamax SDK enables Spotify to create reliable and creative video experiences our users love.',
      newsTag: 'betamax',
    }),
  );
  menuRoot.getByIdPath('explore.sdk').add(
    new BackstageMenuItem(rp, 'gabito', 'Event Delivery', {
      img: 'https://spotifylabscom.files.wordpress.com/2016/03/gabo-system-design-2x.png',
      url: '/docs/gabito-docs/',
      desc:
        'Event Delivery (Gabito) is a reliable, high throughput, highly available, cost efficient event delivery system infrastructure.',
      newsTag: 'eventdelivery',
    }),
  );
  menuRoot.getByIdPath('explore.sdk').add(
    new BackstageMenuItem(rp, 'rcs', 'Remote Configuration', {
      img: SDKGenericIcon,
      url: '/docs/remote-configuration/',
      desc:
        'Remote configuration is a configuration platform for dynamic configuration assignment to a given service or client.',
      newsTag: 'remoteconfig',
    }),
  );
  menuRoot.getByIdPath('explore.sdk').add(
    new BackstageMenuItem(rp, 'connectivity-sdk', 'Connectivity', {
      img: ConnectivitySDKIcon,
      url: '/docs/connectivity-sdk-docs/',
      desc:
        'The Connectivity SDK is a self-contained and complete solution for working with mobile and desktop apps, enabling authenticated networking to the Spotify backend as well as general networking for other internet services, such as CDNs.',
      newsTag: 'connectivity',
    }),
  );

  // Infrastructure and tooling
  menuRoot
    .getByIdPath('explore')
    .add(new BackstageMenuItem(rp, 'infra', 'Infrastructure & Tooling', { searchable: false }));
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'tingle', 'Tingle', {
      img: TingleIcon,
      url: '/docs/tingle',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'mobile'],
      desc: "Tingle is Spotify's centralized CI/CD system for backend, data and web-services.",
      newsTag: 'tingle',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'gke', 'GKE', {
      img: 'https://miro.medium.com/max/1200/1*_saMmI_5Kse6rqZPkiekfg.png',
      url: '/docs/gke',
      lifecycle: 'GA',
      domains: ['backend'],
      desc: 'Managed tool for deploying containerized applications in a developer and cost efficient way.',
      newsTag: 'gke',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'grpc', 'gRPC', {
      img: GrpcIcon,
      url: '/docs/grpc',
      lifecycle: 'GA',
      domains: ['backend'],
      desc: 'An open source RPC framework.',
      newsTag: 'grpc',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'techdocs', 'TechDocs', {
      img: TechDocsIcon,
      url: '/docs/docs',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'data-science', 'mobile', 'ml'],
      desc: 'TechDocs is the way to write technical documentation at Spotify.',
      newsTag: 'techdocs',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'scio', 'Scio', {
      img: ScioIcon,
      url: 'https://spotify.github.io/scio/',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: 'An Open Source Scala API for Apache Beam and Google Cloud Dataflow.',
      newsTag: 'scio',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'slingshot', 'Slingshot', {
      img: SlingshotIcon,
      url: '/docs/slingshot/',
      lifecycle: 'GA',
      domains: ['web'],
      desc: 'Provides temporary review instances as a result of a Tingle Review Build.',
      newsTag: 'slingshot',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'teamcity', 'TeamCity', {
      img: 'https://www.nclouds.com/blog/wp-content/uploads/2017/04/teamcity-post-banner.jpg',
      url: 'https://teamcity.spotify.net',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc: 'CI platform for mobile and desktop clients.',
      newsTag: 'teamcity',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'data-monitoring', 'Data Monitoring', {
      img: DataMonitoringIcon,
      url: '/data-monitoring',
      lifecycle: 'Beta',
      domains: ['data'],
      desc: 'Dashboarding tool to monitor the health of your data',
      newsTag: 'datamonitoring',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'data-discovery', 'Data Discovery', {
      img: DataInfrastructureIcon,
      url: '/data',
      lifecycle: 'Beta',
      domains: ['data', 'data-science'],
      desc: 'Experience for finding high quality data in Spotify ecosystem.',
      newsTag: 'datadiscovery',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'lexikon', 'Lexikon', {
      img: PlatformDefaultIcon,
      url: 'https://lexikon.spotify.net/',
      lifecycle: 'GA',
      domains: ['data-science'],
      desc: "Spotify's data and knowledge management solution.",
      newsTag: 'lexikon',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'ti', 'Tech Insights', {
      img: PlatformDefaultIcon,
      url: '/tech-insights',
      lifecycle: 'Beta',
      domains: ['backend', 'web', 'data', 'data-science', 'mobile'],
      desc: 'Get a overview of the Spotify tech landscape and its health.',
      newsTag: 'techinsights',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'soe', 'Stack Overflow Enterprise', {
      img: StackOverflowEnterpriseIcon,
      url: 'https://spotify.stackenterprise.co/',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'data-science', 'mobile'],
      desc: "Spotify's main technical support tool",
      newsTag: 'soe',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'jukebox', 'Jukebox', {
      img: JukeboxIcon,
      url: '/docs/jukebox/',
      lifecycle: 'Alpha',
      domains: ['data', 'data-science', 'ml'],
      desc: 'Components enabling ML Feature Stores',
      newsTag: 'jukebox',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'kubeflow', 'Kubeflow', {
      img: KubeflowIcon,
      url: '/docs/spotify-kubeflow/',
      lifecycle: 'Alpha',
      domains: ['data', 'data-science', 'ml'],
      desc: 'Components enabling rapid ML model iteration',
      newsTag: 'kubeflow',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'klio', 'Klio', {
      img: KlioIcon,
      url: '/docs/klio-docs/',
      lifecycle: 'Alpha',
      domains: ['data', 'data-science', 'ml'],
      desc: 'Python API for Apache Beam and Google Cloud Dataflow',
      newsTag: 'klio',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'tc4x', 'Test Certified', {
      img: Tc4bIcon,
      url: '/docs/tc4x-docs',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'mobile'],
      desc:
        'Test Certified Programs for all disciplines, which help guide you to high levels of quality and confidence with your products.',
      newsTag: 'testcertified',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'xclogparser', 'XCLogParser', {
      img: PlatformDefaultIcon,
      url: 'https://github.com/spotify/XCLogParser',
      lifecycle: 'Beta',
      domains: ['mobile'],
      desc: 'Xcode Log Parsing and Reporting tools that gives insight on iOS Build performance.',
      newsTag: 'xclogparser',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'androidstudiotuner', 'Android Studio Tuner', {
      img: PlatformDefaultIcon,
      url:
        'https://backstage.spotify.net/docs/client-golden-path/part-1-configuring-your-local-development-environment/10-configuring-android-locally/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc: 'Tool that optimizes Android Studio performance and development environment settings',
      newsTag: 'androidstudiotuner',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'remotebuild', 'Remote Build', {
      img: PlatformDefaultIcon,
      url: '/docs/client-android/remote-build/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc:
        'A tool that does quick remote builds of the Android Music Client that is then synced to your local development machine',
      newsTag: 'remotebuild',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'qliksense', 'Qlik Sense', {
      img: QlikSenseIcon,
      url:
        'https://backstage.spotify.net/docs/data-science-golden-path/part-3-creating-your-first-qlik-sense-app/1-introduction/',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: "Spotify's visualisation toolkit.",
      newsTag: 'qliksense',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'tableau', 'Tableau', {
      img: TableauIcon,
      url:
        'https://backstage.spotify.net/docs/data-science-golden-path/part-2-creating-your-first-tableau-dashboard/1-introduction/',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: "Spotify's visualisation toolkit.",
      newsTag: 'tableau',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'scienceboxclassic', 'Science Box Classic', {
      img: ScienceBoxIcon,
      url: 'https://confluence.spotify.net/display/SB/Science+Box',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: "Spotify's data science toolkit.",
      newsTag: 'scienceboxclassic',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'bigquery', 'BigQuery', {
      img: BigQueryIcon,
      url: 'https://console.cloud.google.com/bigquery',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: "Google's cloud-based web service for interactive SQL queries against big data sets.",
      newsTag: 'bigquery',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'bigqueryrunner', 'BigQuery Runner', {
      img: PlatformDefaultIcon,
      url: 'https://confluence.spotify.net/display/BBQ/BQ+Runner+Documentation',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: 'A tool that allows you to run queries on a schedule.',
      newsTag: 'bqrunner',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'bigqueryload', 'BigQuery Load', {
      img: PlatformDefaultIcon,
      url: 'https://confluence.spotify.net/display/BBQ/BQ+Load+User+Manual',
      lifecycle: 'GA',
      domains: ['data', 'data-science'],
      desc: 'A tool that allows you to load data from Google Cloud Storage to BigQuery on a schedule.',
      newsTag: 'bqload',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'elitzur', 'Elitzur', {
      img: PlatformDefaultIcon,
      url: 'https://backstage.spotify.net/docs/elitzur/',
      lifecycle: 'Beta',
      domains: ['data'],
      desc: 'Library to validate dataset column values using custom-types at run-time in Scio Pipelines.',
      newsTag: 'elitzur',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'contours', 'Contours', {
      img: PlatformDefaultIcon,
      url: 'https://backstage.spotify.net/docs/data-profiling-docs/',
      lifecycle: 'Alpha',
      domains: ['data'],
      desc: 'Library to generate descriptive statistics of each field in your dataset.',
      newsTag: 'contours',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'iceluigi', 'Ice-Luigi', {
      img: PlatformDefaultIcon,
      url: 'https://ghe.spotify.net/datainfra/ice-luigi',
      lifecycle: 'Alpha',
      domains: ['data'],
      desc: 'Luigi tasks and targets to make it easier to test Data Pipelines.',
      newsTag: 'iceluigi',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'ratatool', 'Ratatool', {
      img: PlatformDefaultIcon,
      url: 'https://github.com/spotify/ratatool/',
      lifecycle: 'Beta',
      domains: ['data'],
      desc: 'Tool for random data sampling and generation.',
      newsTag: 'ratatool',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'mobius', 'Mobius', {
      img: MobiusIcon,
      url: '/docs/mobius-docs/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc: 'Mobius is a functional reactive framework for managing state evolution and side-effects.',
      newsTag: 'mobius',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'hubsrenderer', ' HubsRenderer', {
      img: PlatformDefaultIcon,
      url: '/docs/hubs-renderer-docs/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc:
        'HubsRenderer is Spotify’s component-driven UI framework. We use it to build, tweak, and ship user interface features in new or existing apps. It also makes it easy to build backend-driven UIs.',
      newsTag: 'hubsrenderer',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'crashview', 'Crash View', {
      img: PlatformDefaultIcon,
      url: '/docs/crash-stack-documentation',
      lifecycle: 'Alpha',
      domains: ['mobile'],
      desc: "Crash View is Spotify's tool to find your crashes in the main music app.",
      newsTag: 'crashview',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'experimentation', 'Experimentation Platform', {
      img: PlatformDefaultIcon,
      lifecycle: 'Alpha',
      domains: ['backend', 'web', 'data', 'data-science', 'mobile'],
      url: '/docs/experimentation-platform-docs/',
      desc:
        'The experimentation platform enables users to quickly iterate through new ideas or improvements, learn from them to adopt better solutions',
      newsTag: 'experimentation',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'grafana', 'Grafana', {
      img: GrafanaIcon,
      url: '/docs/monitoring/',
      lifecycle: 'GA',
      domains: ['backend', 'web'],
      desc: 'Observability platform frontend for graphing and time series analytics, in real time.',
      newsTag: 'grafana',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'distributedtracing', 'Distributed Tracing', {
      img: DistributedTracingIcon,
      url: '/docs/tracing/',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'mobile'],
      desc: 'Observability platform tool to instrument and trace requests at scale, in real time. ',
      newsTag: 'tracing',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'spotifystatus', 'Spotity Status', {
      img: PlatformDefaultIcon,
      url: 'https://status.spotify.net',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'mobile'],
      desc:
        'The starting place for incidents. Know at a glance whether there are known problems affecting Spotify and how those incidents are progressing towards resolution.',
      newsTag: 'spotifystatus',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'styx', 'Styx', {
      img: PlatformDefaultIcon,
      url: 'https://ghe.spotify.net/datainfra/styx',
      lifecycle: 'GA',
      domains: ['data'],
      desc:
        'A service for scheduling the execution of docker containers used to periodically trigger batch data workflows.',
      newsTag: 'styx',
    }),
  );
  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'luigi', 'Luigi', {
      img: LuigiIcon,
      url: 'https://github.com/spotify/luigi',
      lifecycle: 'GA',
      domains: ['data'],
      desc: 'An open source Python library for defining tasks and their dependencies within a data workflow.',
      newsTag: 'luigi',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'artifactory', 'Artifactory', {
      img: ArtifactoryIcon,
      url: '/docs/artifactory/',
      lifecycle: 'GA',
      domains: ['backend', 'web', 'data', 'mobile'],
      desc: 'Store and manage your binaries.',
      newsTag: 'artifactory',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'cloudefficiency', 'Cost Efficiency', {
      img: PlatformDefaultIcon,
      url: '/docs/gcp-efficiency-score-service',
      lifecycle: 'Beta',
      domains: ['backend'],
      desc:
        'Tool that calculates cost efficiency based on utilization of cloud resources and provides recommendations for better efficiency.',
      newsTag: 'cost',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'cassette-ios', 'Cassette (iOS)', {
      img: CassetteIcon,
      url: 'https://backstage.spotify.net/docs/client-ios-docs/Writing-Cassette-Tests/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc: 'Cassette is a framework for writing fast and stable integration tests',
      newsTag: 'casetteios',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'cassette-android', 'Cassette (Android)', {
      img: CassetteIcon,
      url: 'https://backstage.spotify.net/docs/client-android/03-testing/03-cassette-tests/overview/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc: 'Cassette is a framework for writing fast and stable integration tests',
      newsTag: 'casetteandroid',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'gabito', 'Gabito', {
      img: DataInfrastructureIcon,
      url: '/docs/gabito-docs',
      lifecycle: 'Beta',
      domains: ['data', 'data-science', 'backend', 'web', 'mobile'],
      desc:
        'Instrumentation SDKs and Event Delivery Infrastructure. Reliable, high throughput, highly available and cost efficient',
      newsTag: 'gabito',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'safetynet', 'Safetynet', {
      img: SecurityTribeIcon,
      url: '/docs/security/safetynet/',
      lifecycle: 'Beta',
      domains: ['backend', 'web', 'data'],
      desc: "Safetynet is Security's product for detecting and alerting on malicious activity in our environment.",
      newsTag: 'safetynet',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'client-performance-dashboards', 'Client Performance Dashboards', {
      img: PlatformDefaultIcon,
      url: 'https://arewefastyet.spotify.net/',
      lifecycle: 'GA',
      domains: ['mobile'],
      desc:
        'A series of interactive dashboards for digging into Client Performance data to find out how fast and efficient our products are.',
      newsTag: 'perfdashboards',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'remote-admin', 'Remote Admin', {
      img: PlatformDefaultIcon,
      url: 'https://remoteadmin.spotifyinternal.com/',
      lifecycle: 'GA',
      domains: ['backend', 'mobile'],
      desc:
        'A backend tool which enables live traffic visualization for selected users. Has additional debugging functionality for Spotify Connect.',
      newsTag: 'remoteadmin',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'padlock', 'Padlock', {
      img: PlatformDefaultIcon,
      url: '/docs/padlock',
      lifecycle: 'GA',
      domains: ['backend', 'data'],
      desc: 'Padlock is a key management service that helps service-owners respect users privacy.',
      newsTag: 'padlock',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'scio-anonym', 'Scio Anonym', {
      img: PlatformDefaultIcon,
      url: '/docs/padlock/adoption/scio/scio_anonym',
      lifecycle: 'Alpha',
      domains: ['data'],
      desc: 'Scio Anonym is a library for producing and consuming personal data in Scio pipelines.',
      newsTag: 'scioanonym',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'backstage', 'Backstage Platform', {
      img: BackstageIcon,
      url: '/docs/backstage',
      desc: 'The Spotify platform for internal tooling. Information targeted to contributors.',
      domains: ['web', 'backend'],
      newsTag: 'backstagedevs',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'itgctracker', 'ITGC Tracker', {
      img: ITGCtrackerIcon,
      url: '/itgc/tracker',
      lifecycle: 'Alpha',
      domains: ['backend', 'itgc'],
      desc:
        'The ITGC tracker allows you to visualize the state of all components in scope for ITGC or awating to be reviewed.',
      newsTag: 'itgctrcker',
    }),
  );

  menuRoot.getByIdPath('explore.infra').add(
    new BackstageMenuItem(rp, 'bigtable', 'Bigtable', {
      img: BigtableIcon,
      url: '/docs/storage/bigtable',
      lifecycle: 'GA',
      domains: ['backend', 'data'],
      desc:
        'Bigtable is a high performance cross-region replicated NoSQL database service for large analytical and operational workloads.',
      newsTag: 'bigtable',
    }),
  );

  //-------------------------------------
  // Data
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(new BackstageMenuItem(rp, 'data', 'Data', { img: <DataIcon /> }));
  menuRoot.getByIdPath('tools.data').add(
    new BackstageMenuItem(rp, 'dataMonitoring', 'Data Monitoring', {
      url: '/data-monitoring',
    }),
  );
  menuRoot
    .getByIdPath('tools.data')
    .add(new BackstageMenuItem(rp, 'realtimeEvents', 'Realtime Events', { url: '/realtime-events' }));
  menuRoot
    .getByIdPath('tools.data')
    .add(new BackstageMenuItem(rp, 'dataAccessStatus', 'Data Access Status', { url: '/data-requests/access/status' }));
  menuRoot
    .getByIdPath('tools.data')
    .add(new BackstageMenuItem(rp, 'alchemy', 'Data Alchemy', { url: 'https://alchemy.spotify.net' }));

  //-------------------------------------
  // Data Science
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(new BackstageMenuItem(rp, 'data-science', 'Data Science', { img: <DataIcon /> }));

  menuRoot.getByIdPath('tools.data-science').add(
    new BackstageMenuItem(rp, 'qliksense', 'Qlik Sense', {
      url: 'https://confluence.spotify.net/display/IT/Qlik+sense+access',
    }),
  );
  menuRoot.getByIdPath('tools.data-science').add(
    new BackstageMenuItem(rp, 'tableau', 'Tableau Desktop', {
      url: 'https://confluence.spotify.net/display/IT/Access+to+Tableau+Desktop',
    }),
  );

  //-------------------------------------
  // Code
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(new BackstageMenuItem(rp, 'code', 'Code', { img: <CodeIcon /> }));
  menuRoot.getByIdPath('tools.code').add(new BackstageMenuItem(rp, 'ghe', 'GHE', { url: 'https://ghe.spotify.net' }));
  menuRoot.getByIdPath('tools.code').add(
    new BackstageMenuItem(rp, 'foss', 'Open Source @ Spotify', {
      url: 'https://foss.spotify.net',
    }),
  );
  menuRoot.getByIdPath('tools.code').add(
    new BackstageMenuItem(rp, 'tingleConsole', 'Tingle Console', {
      url: 'https://tingle-console.spotify.net/',
    }),
  );
  menuRoot.getByIdPath('tools.code').add(
    new BackstageMenuItem(rp, 'tingle-validator', 'Tingle Build Info Validator', {
      url: 'https://build-info-validator.spotify.net/',
    }),
  );

  //-------------------------------------
  // Reliability
  //-------------------------------------
  menuRoot
    .getByIdPath('tools')
    .add(new BackstageMenuItem(rp, 'reliability', 'Reliability', { img: <ReliabilityIcon /> }));
  menuRoot.getByIdPath('tools.reliability').add(
    new BackstageMenuItem(rp, 'grafanaMonitoring', 'Grafana Monitoring', {
      url: 'https://grafana.spotify.net',
    }),
  );
  menuRoot.getByIdPath('tools.reliability').add(
    new BackstageMenuItem(rp, 'distributedTracing', 'Distributed Tracing', {
      url: 'https://app.lightstep.com/spotify',
    }),
  );

  //-------------------------------------
  // Services
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(
    new BackstageMenuItem(rp, 'services', 'Services', {
      img: <ServiceIcon />,
    }),
  );
  menuRoot.getByIdPath('tools.services').add(
    new BackstageMenuItem(rp, 'apolloLibrary', 'Apollo library', {
      url: 'https://developer.spotify.net/products/apollo.html',
    }),
  );
  menuRoot.getByIdPath('tools.services').add(
    new BackstageMenuItem(rp, 'serviceDiscovery', 'Service Discovery', {
      url: 'https://developer.spotify.net/products/nameless.html',
    }),
  );

  //-------------------------------------
  // Apps
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(
    new BackstageMenuItem(rp, 'apps', 'Apps', {
      img: <AppIcon />,
    }),
  );
  menuRoot.getByIdPath('tools.apps').add(
    new BackstageMenuItem(rp, 'junit', 'Visualization of JUnit test data', {
      url: 'https://odeneye.spotify.net/',
    }),
  );
  menuRoot.getByIdPath('tools.apps').add(
    new BackstageMenuItem(rp, 'integrationTesting', 'Integration testing', {
      url: 'https://developer.spotify.net/products/cassette.html',
    }),
  );
  menuRoot.getByIdPath('tools.apps').add(
    new BackstageMenuItem(rp, 'productQuality', 'Product Quality', {
      url: 'https://product-quality.spotify.net/',
    }),
  );

  //-------------------------------------
  // Compliance
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(
    new BackstageMenuItem(rp, 'compliance', 'Compliance', {
      img: <ComplianceIcon />,
    }),
  );
  menuRoot.getByIdPath('tools.compliance').add(
    new BackstageMenuItem(rp, 'itgc', 'ITGC Components', {
      url: '/itgc/components',
    }),
  );
  menuRoot.getByIdPath('tools.compliance').add(
    new BackstageMenuItem(rp, 'activity', 'ITGC Activity', {
      url: '/itgc/activity',
    }),
  );
  menuRoot.getByIdPath('tools.compliance').add(
    new BackstageMenuItem(rp, 'yopass', 'Yopass - send passwords', {
      url: 'https://yopass.spotify.net',
    }),
  );

  //-------------------------------------
  // Groups & Access
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(
    new BackstageMenuItem(rp, 'groups', 'Groups & Access', {
      img: <GroupIcon />,
    }),
  );

  //-------------------------------------
  // Storage
  //-------------------------------------
  menuRoot.getByIdPath('tools').add(
    new BackstageMenuItem(rp, 'storage', 'Storage', {
      img: <StorageIcon />,
      searchable: false,
    }),
  );
  menuRoot.getByIdPath('tools.storage').add(
    new BackstageMenuItem(rp, 'storage', 'Selection Guide (Beta)', {
      url: '/storage-selection-guide',
    }),
  );

  return menuRoot;
}
