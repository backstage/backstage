/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigReader } from '@backstage/config';
import express from 'express';
import request, { SuperAgentTest } from 'supertest';
import cookieParser from 'cookie-parser';
import PromiseRouter from 'express-promise-router';
import {
  AuthProviderRouteHandlers,
  AuthResolverContext,
  CookieConfigurer,
} from '../types';
import { createOAuthRouteHandlers } from './createOAuthRouteHandlers';
import { OAuthAuthenticator } from './types';
import { encodeOAuthState, OAuthState } from './state';
import { PassportProfile } from '../passport';
import { parseWebMessageResponse } from '../flow/__testUtils__/parseWebMessageResponse';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { mockServices } from '@backstage/backend-test-utils';

const mockAuthenticator: jest.Mocked<OAuthAuthenticator<unknown, unknown>> = {
  initialize: jest.fn(_r => ({ ctx: 'authenticator' })),
  start: jest.fn(),
  authenticate: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  defaultProfileTransform: jest.fn(async (_r, _c) => ({ profile: {} })),
};

const mockBackstageToken = `a.${btoa(
  JSON.stringify({ sub: 'user:default/mock', ent: [] }),
)}.c`;

const mockSession = {
  accessToken: 'access-token',
  expiresInSeconds: 3,
  scope: 'my-scope',
  tokenType: 'bear',
  idToken: 'id-token',
  refreshToken: 'refresh-token',
};

const fiveKilobyteRefreshToken =
  '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';

const eightAndAHalfKilobyteRefreshToken =
  'Ad62a2Bfa5cdCdE489CaF47BDBaF9fbd8CCB6b866Bfc04bB2f8ec7D19ddc7d3189e5249e231cAd567745d4Dc83Be5ADd5BdDdC3cdDa8Cbfe2B2f2Cb01876eadF0A444eA420FEfb5EaFD918A9BbfabD8eaa512FdE7F3fC03bA134d99ebb43fe58eE8C7DaA587a563eac5B75E4bc03E31BcD9dB5DABa0a24e7A6B44C0C585Fc2dAA1dCc5ba110BBeeF7404dE5a0e416A86e23aFADd9efA19faabC74DfdbeCe70E396E054fe2dA1dcCddf5f6f36d1dEF8371FD31BbCA9D1e23a6deCfC43Db00750a2feE0fc7ff6dBdeBaC1557ccA546E8B0B2E6860cfdDC96bBf2356Adff7CFCB1AACC183Fc3DE8bEb0dcFb22D19f44B9f4a6fC0AbE9BCa64e31baaD85aEdE42C1E3b4Cd7F8FEEDDda1dC25C50E93353Df12dCACCA85cD7E6Fb99cbAB4Fb59EDAc3De414ffdC1AbBa3AA06Cd11e9c6eAA1Eb6B1dACa1BE7afd34234Ae6B1Fd2e2Aeb7e0C74cbB3F6fFc39ec6Dd805ddA1433cDfD4bCBB8b19Aa6eB2d19eDE0e57E668302b9E700a4f170967E38F0C8c664AcFbAE6f98eAB5e3EC96AcFcf862Ae90843ffdeEBB89DE2933e55a4bCEB45E07aB1AeB2e8dE4e70e7d4aDB8B3020fC48d0FD4A2A03c6Cd97cbc6A169e13b7AE73A37F25082B4aBe19EB050F0768e2Db7D3514BCA067B79687d03260bd0A4bfFe02cF38Fd31bC09D52fccFAD1D73E51BE55f11BECfFBA6F988fEE16004Be54AD6CC87741DaA40Db1f600fEffC0fa17b77F85e883E6F9BE8e92dA6C862C28DBf128de0A8d307Ad6b1ddd4a9493ee1F8731aBd8Da2f0e85Af89DEC18678bd7ffAA75FA5a79f4cF5A0AAb4f3aD1Df7E2BBDD24Dd3BB12f26cA5f0359a9462f5f5e32EBCA7346BF171ba4F1E2af7f3Ee8B3C8C776B4f0D0622EeBDdBa9Cf9314a85c9F2952aaf25bB2B79A2418ACa6f3bbA76eFB99FA0eC8e30F4e7b5853dfB8f6cdAeEb337dbeD2392e95BECF0Aef66fDbeb0803Bc950EEfed4Ff9b865C80bBBdb074facCE5614E8CC6DF0033cF223c2D5dC60Bd6Bc30141dc5120B8D5D429D4e07cAdfBD67BfdAEFEce8D32C15BA9CaDC1dCCDbf2D59CB370B57cDCa083cC9fEabc8B607c74E167cc1AAE121c6265Fee7b39eDFE10d31E8d59ad4e266a176010AC505BEd8ca057Eb224cf57DA4dfb98fd10A3Ee64F6950Ac54dbD3ffcbB35EfC84BEA9cbCa49872eEc9dAb29161d7b80475C42226914B5FaFCecC023c1AecEa9F89Da95bA4EF2Df2c3Daf14cBdBb9533E07E2E6141e76d1558dF33aeFbfe572fcAd33d3cFCC055bDDd8D8d8f1dCAe6Cff2aCCAfe653b7e845ae459563D0da4E995D35559200EF6FaDbDA59a6BBD323cE8E370fC3996Ed9ebcef1dCeABb067c2c9E96adFC22F058bDEb00bc037549CBCEAF3e6D3b0bB914Aa8CB00a4a97D34cc6D15Eecb295B0a26bD83109EF2af3C82AF55f146ffB26Ebe727eD86dDEB1BF7b714Bb0a58Ad152daAaDC7F5dAEDfAA109d6fCe2847D3b32B41E8c29DAC6499bDA10F8A7a5c3E0b2a1d0f2DE2c3e88de4DFDF85B4AD4Ddae8e8D6dF5bF2affd8dFc2185A92E81E9CEFB0cd71Bf5Ac4C09AEe012eFC79B5dFf447b9AAAFadA871AEac9be09cDa26E1c56F54DD8b8Afac765Fc452c0e11B45daC6ec766B80002C544E4e6342b0B445CE1AfEC0FE8E9d7DE5EF5Ec4921515Ddb8Ee7BEbd68d7065154252E75d922A4b8E4d0AaEcc6Dc3db498E9CfF41bb121B69Ebb774B3cf998316C80Fe73F7d688bcDec894BD3adf5c5AA6A36044C5B01D2dCCcc23BF21F91cd95E55ca1aDaA770AE0b65fE67aA95d44D0BBD3FFDa20bc6EdFcC7e2ef5B46225EFF5c767BdCE8C666Cdcae2aCf9ADb7CD3C10b59be627AbE5B0FDEA16dD9C4727FbECF6bEcAb1b8E1f5716eDEbEaf4E550B8c7CAfDd0C0BE15b6D4bBE3261f9c657aB885B8862C74ED9af0FD725CBCBd7ded2B0d6fb8eEdc802BB1EC2c7609399844a2DCaDC0DF2a0ada1fa91E7a4FFeee6C7AEB3A42DCb85eCc3fe6b31B8D857225a43C49CDBAcB9E855CF9C3ecC05cc41FCCdc9c6b10aa201D0471658aaDBB2077abc0516ee7911F8e1A435eEDBf50e0C12b5AB3e40A4DC2aD61Cdefd6CDd2d16dC9c0d5eE5C2573A6AfceB43d9E6f9e3C7BdAa5CbD2FFcB1AcFAdf52B6EC5cc5B0AC36c2c932124dc8C43cd6867fBfAc1F4DFF957E0f8F09Ea0e4C60faccc4D4E84bC0F0163aD1e2E6977ff83FAaebDd2cc1Fa8BCa821B29f34F242E3FdAb05Bde16a0C46af8CeeAC2EaC00Cf81C112e6Ee0b79b9f5Af9eD0acCc330794aeDf8aa3551C35063BF2D108E4a190cDE9055a3eFB08CFCCe7750eCec6eD4BF2dFDbec7b3A9Bb6cDa71eAb0De2CCA3F6bACFF4ce9304b7B5EAd78a5DfDef6cDbd2df49f0F806ECd85Dab8B1B9B76C2AA0d50baBCAd9db11761f572feF3D50CEFAb6Bf3e38Af8EED4cafe43E47BD68dB67fEfaDC7b3FF2eF5C285DF0850bE8b17B2AfDCDa0923b4BF1f0E02a279B0bc87c5d2Ca60ADc1ccccE07f58BeDC8a31bC9F25bF3D7C6fA4be472cfA4B1F0Ffd37d0EcACAa1Cf1dA07Ee8aE5AB9f88E54db4b6be0cEb3aBcb0DdEf5394a40d25e5138aeBBE1f3b191eCcBFcCC949AAd584BFe2Fb932797E6ABBCaB8BEBB96daBD097fedA5fE1dfce3F0E4BEc518aB25FfCBBb0aA007ffafb04d3BbCC5e0347AcBbc3006C05C41CBeeBae17A149b15Bc1533aeB44017cc5BCDfc6c5d2AcCEc4c17A44e53D42dc68C6f93eFa7D1d2f9f2D4e4Dddd90dCa0f15dD1aa40D7eBff9b0Cb7d7Da33FD2cb0d5Af8DbcbaE47Fb86Abf8bE20A7FeBBD4a390abB6abfD8C8D5E41e2BEd8E3eBFD2d1B8d41d605AdEF2BE63E22C09A55fBbAbfbeb8fed339119bf34a8d0BA3e912702b9c0DF7b476FC538eD06571EF2dE208beCDA8134BeEcb1F794BeaaDCd5619fd05EABAA82d58cB0cC9Cc3adA0D5fcF915b6E9dA9517caB500aDEAc8aAB6ad26b3E2F8Bf7cd2004f7cF74cA4b2a495CDed2a7a5CE42b6DC8e95326a7637f21EbFCbEcE8860EfDb31Df9aaF6F133674723f716a600B1c01DC98c7aA4fBe9cb81E7C50F3Bdc966D8BDa1AFcd4EBfB922f2eba045B3726d3Cec02Bdd606ae43aaeaa0EA945D4ec95d9E5E1AcF92aa75F4db4AC453Ccc51ceAdBD7b0614BfeCC303AADc40bCfDDfC76bfafFdbcD47D4B729EEF1CCED07C3dF85EEfC2eCcbbB45F8D5f1D09e9A1964fEF402E29AE024dEEeAeDEfF377E7b2ee2F621165dEB3CE9f4471DEeb396Dc3B508Bb0C2A51c4CC4Ba5Ca1aa9ca7b401D6C0421EDB83CF03EA16bA24ceE3FC4e7Ad4BFc7dAbe16e4C2A51F4e2cAeb7bC7287684268ea7FAae360A1A8aF5BFED450db3D66363284eD57B2f9D25A5c4FE424a7feE764eaA0e47F96b77Af2bd725c1c8DbE5A7FF2e0c7cE7F9eE0FCf7bdF00543a9ED1C485CDC2e82386F440D04FEa6380B9bbE48C605bF0fbDe0dc2cEAe35C2BFB84dF62185B8e6BABBE89DcCF1b1Cedf5aDadeBdd3Bd66cc76aC6badb2F1ec27C411ccd3cCD823feE8A8F9aE8C0e1cc0fE6484fBd2c58C77Fbcbdc662C7EEeb684dAaeE0489C40d8A91d6DCec15A3e506783C35acBD0Dad364AeeC295d7eD1BecdB2d1d9d1352dE4F7f52B50e272ab9E57e8AFbCC54fEEbB640F5FD37b18f6a46D70f0cBCB98aBAdd6EfcF06f5f5Aa6D61b3FD4c1aeB46Be0Da0Dfcaf5c45e2FDF46C43aFcCb952Be929adaFcFeECbCDB6Edc61472DBC37Eeeff5a5B64Bd1Fee6B5e6861EcBfff3d6103a7E3e361EC08Ecb4d81c0FdefAdA9d861c12e7aD85678a23E5E94F3dC9677d4B82Dee5A24dDbebF20B880c25C6955dCCC276ff9C3505a85bBE6aB08E6EFb3C35DC1fcFDC8F86E4bE7C1F0fBF8b1B8594F122fFAd7c6CDe8fba97af1697Ae3e5cFc485B8E0Ae66dbD485afceBAAe550cdc9E4B4CbEbC51c85D6BeCb83BF51f41DDeCAbe4bB75209eA0EaeEe6010Da909b5CBd1D1CBaE7b579F48cd5Af0d2F81c1E8ADcaA4DaCA01Ea206fee4ECBc8fddaa505b41c114EABF753F5aD02B25Be96bEa1dfF5e04EddEcEbA8881EfCe9AB957e0366DdCD9E32ecBdFC1B0Ab6f1effdcb0b1A3d2f7eFEf59EB2bddC130305d4bAe6f627e1087B3Ef5Cdd1f2A75Eadc6B4d79A5b6d55fEA7ea30d3cDd74D74F3bD2aa99b5ab3FC83Acbb9ee0fBa05D4d23DACeBb16cda8A2bF7Ca4D85eee1BAc9D06Cd899861bB5e2e4B9c30E1C887d19DbF81cFe8Ae9b777249f542faAFE3b3bd49Ba5295afbd927A475C0C3B81C1ee6eEB8c00451CFBcCFfF7Fc8aD0b7251c00D507cEfe86BeEeFe5FBded0FBe30CC447DFaB930c04c4460e9f9cbf1BBF2eBFdF06D3AAed2af2BEDBA0f296AEfAf90571F9B63e0876fFADfDf61408B6dedeBfE2dE7a8ee750Ef78B1289b6fCdfdaC58393e373a5dA35d2b149c9FF5a1fA9DFeCc37c678Ce657A172D5d990BbbFDa089288dCa5F89f6CeF7cf6b1EB2609BBD65e6fFfa815Cc59abcE387ead000Af1B1C1cC87faB990D1b9AfcEfDc3D68cCCb9b7475803829dDebA48e92df26AC70027CcEfB6F6FDd1DA25DFB9dA0aE50398998E7EbEEaE11BB68a2E03c5f8306eaca1aF15CeBCB05a6FDb8E3BdAAeFfeC21Db12762dDBABd3eDf12A438B3C37B51cCaCD1Eda73dFCCeF06BCFbECE21F95e2Ae1d0F161dEec60a17D01d1Dc425b85aCD0adeCCBdddd310581aa0eF48FfF8a6A727E95BADefF6Cd011Df1c993DB5aE2ec8c3dD42cD704a5e0AC8bCbae34F245e7ABfba828efa3adFFefb33fCa32ad0b2Bd7C4Ae56C3d932E7A1a24bE87Bd235067A73CcBC5A8Cd44B0Fa5131dacCDEA7454aAb7c0Dfb006B6EbFAd3dD1EAEee79c9Da23FA02D88CD8333BE964E7D2eBbd1AAAE06E67463CCb6eceA604Cdd2A16d834599c86914Ea9b063243C4Ebe8E6aa677fdE2b67A6eE4Cfe1801273137ec777DEfc84D4B3d0e96dFF1f7CCaB0CFD307Ba1fC16b9C4f4d1fee0ee0f05BB1102eEeA5E49e7f339BE6d9335Bf2F28d57f194D9facA9c5af5B08B08D7530c7DDe99D0Ae0D8dD5d0c13B77fDf1E3Bc0aA8e71C32EAD5AaD7Bed538F26d4deaA3A67C667201C5Fd62A5FaeDde62E6DC78E62bEeaBFaa030cFDa4E86f5B3C48bBE7bB4Be5528D3D0fd69BCCE1D8B6d04Ee6B9a1B5c49572B21FFFf1bDf06cd98fa9ED5fd9Dc3B04bD4530B8CBD5d0106799E4CBCE64c65EFcfb4f84Ba0ced14BECdcd4bb33CA38B4eea4bF7e665Eda4a8ADfBfae5C45b2B91e2C1eCD0CcBC85275d4Ca8318638eB77Eab97845c40Ccd34f7ef99385Ce275B30013f7BfC2c088a2F332DAF6Ca2CFB21d5f8EAF177B519cAF56ca42a9DAfadBAECb5E16Bf671BDB2BBb15c8eb1F4Cb9dfDbfbcFcFAEABAD3aeeCF8e84BbEECf3dDf0f7FdBCF44aa1A4ac7bFac026B8Ab6C0004a1dCc6bc2b5eb8fA7cEEe9cEeAce5d287BCE0E5f3bBffdFaED134286794D704b32DD36cF2FF80dd39FB09cAbCF1FaF07a2aFB0EA7FeA464b90f77090B846Fad58Ca0fB83eA3d6C4dDBCFd17b8c5EFCc7a6e1efDaaE8B4Ecae65C89BC80Df9bC844cE9aDCcFdaE2be0f0Bc6AdBDB6E814d2050febEB3BaFCfBCCADF749BC2Cde2BeC0e7E6e14afa92Fe5fd51A8Ef62aC53FAE304B0f4317Ab5db11fD13ecAcd8995E6F87Fe4Ff5FF89e4B7b44A754f52a7E4fDDCdfDDefEE4aD7AcAacDCa17fd3a2b43D4bc74B3Cad0aeee8eDBa25D56e3Ba0C5cd8B8E2a2c0B8f951Fd7AFC75edEAee0c28bf3cEBc3af7C60ca147fC9cF0886B066e263f36CA5B5BB36aB82f0f0A58FE3d67f1a9fc24270e6170ac34E6eE5c1bc64B1B5f416afbb8E8edD2cFA9fdcAF7Be904EBaA1abF8b0c2D5cc176C5866fcbCECa5342d7439Cc5E859dBe6a18e9c58EC2e9a5bc20a79D3E3CF073aD4c4F12409E787fFA0Dd1C6d3f01b3CeaDC7F5Cc9be3415f0DFFD5F2E2Fb0dBA6843CCB1aECbF1480E8fCFc16e2cEDB8B8e292dFFeF1bBc6F9C7DD4b873DBbbD528d0fB1E4D02ba3EDe9f1c13b4DEE0FC8BAAdc5cAB40AF2EC4eFDAAfD31104bC04CEFFCbEAae6aA1C91FAccAEed7B3dE6FF226Db01f62E239fba8BD5aE9B7C9a4DeeF746ec2F9580368FB1DDcF785e410aec4a70005a609CBBebf42f714b3c59a76cB06c3c86Ca3dfbB5EcAC';

const baseConfig = {
  authenticator: mockAuthenticator,
  appUrl: 'http://127.0.0.1',
  baseUrl: 'http://127.0.0.1:7007',
  isOriginAllowed: () => true,
  providerId: 'my-provider',
  config: new ConfigReader({}),
  resolverContext: { ctx: 'resolver' } as unknown as AuthResolverContext,
};

function wrapInApp(handlers: AuthProviderRouteHandlers) {
  const middleware = MiddlewareFactory.create({
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig(),
  });
  const app = express();

  const router = PromiseRouter();

  router.use(cookieParser());
  app.use('/my-provider', router);
  app.use(middleware.error());

  router.get('/start', handlers.start.bind(handlers));
  router.get('/handler/frame', handlers.frameHandler.bind(handlers));
  router.post('/handler/frame', handlers.frameHandler.bind(handlers));
  if (handlers.logout) {
    router.post('/logout', handlers.logout.bind(handlers));
  }
  if (handlers.refresh) {
    router.get('/refresh', handlers.refresh.bind(handlers));
    router.post('/refresh', handlers.refresh.bind(handlers));
  }

  return app;
}

function getNonceCookie(test: SuperAgentTest) {
  return test.jar.getCookie('my-provider-nonce', {
    domain: '127.0.0.1',
    path: '/my-provider/handler',
    script: false,
    secure: false,
  });
}

function getRefreshTokenCookie(test: SuperAgentTest, chunkNumber?: number) {
  if (chunkNumber !== undefined) {
    return test.jar.getCookie(`my-provider-refresh-token-${chunkNumber}`, {
      domain: '127.0.0.1',
      path: '/my-provider',
      script: false,
      secure: false,
    });
  }
  return test.jar.getCookie('my-provider-refresh-token', {
    domain: '127.0.0.1',
    path: '/my-provider',
    script: false,
    secure: false,
  });
}

function confirmRefreshTokenCookieDeletion(
  res: request.Response,
  {
    domain = false,
    path = '/my-provider',
    chunkNumber,
  }: { domain?: string | false; path?: string; chunkNumber?: number } = {},
): boolean {
  const setCookieHeaders = [res.get('Set-Cookie') ?? []].flat();
  const cookieName =
    chunkNumber !== undefined
      ? `my-provider-refresh-token-${chunkNumber}`
      : 'my-provider-refresh-token';
  return setCookieHeaders.some(
    cookie =>
      cookie.includes(`${cookieName}=;`) &&
      cookie.includes('Max-Age=0') &&
      (domain
        ? cookie.includes(`Domain=${domain}`)
        : !cookie.includes('Domain=')) &&
      (path ? cookie.includes(`Path=${path}`) : true),
  );
}

function getGrantedScopesCookie(test: SuperAgentTest) {
  return test.jar.getCookie('my-provider-granted-scope', {
    domain: '127.0.0.1',
    path: '/my-provider',
    script: false,
    secure: false,
  });
}

function extractTokenStringSlice(tokenString: string, index: number): string {
  const chunkSize = 4000;
  const start = index * chunkSize;
  return tokenString.slice(start, start + chunkSize);
}

describe('createOAuthRouteHandlers', () => {
  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    const handlers = createOAuthRouteHandlers(baseConfig);
    expect(handlers).toEqual({
      start: expect.any(Function),
      frameHandler: expect.any(Function),
      refresh: expect.any(Function),
      logout: expect.any(Function),
    });
  });

  describe('start', () => {
    it('should require an env query', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app).get('/my-provider/start');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: {
          name: 'InputError',
          message: 'No env provided in request query parameters',
        },
      });
    });

    it('should start', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      mockAuthenticator.start.mockResolvedValue({
        url: 'https://example.com/redirect',
      });

      const res = await agent.get(
        '/my-provider/start?env=development&scope=my-scope',
      );

      const { value: nonce } = getNonceCookie(agent);

      expect(res.text).toBe('');
      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://example.com/redirect');
      expect(res.get('Content-Length')).toBe('0');

      expect(mockAuthenticator.start).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          scope: 'my-scope',
          state: encodeOAuthState({
            nonce: decodeURIComponent(nonce),
            env: 'development',
          }),
        },
        { ctx: 'authenticator' },
      );
    });

    it('should start with additional parameters, transform state, and persist scopes', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            stateTransform: async state => ({
              state: { ...state, nonce: '123' },
            }),
          }),
        ),
      );

      mockAuthenticator.start.mockResolvedValue({
        url: 'https://example.com/redirect',
      });

      const res = await agent.get('/my-provider/start').query({
        env: 'development',
        scope: 'my-scope',
        origin: 'https://remotehost',
        redirectUrl: 'https://remotehost/redirect',
        flow: 'redirect',
      });

      expect(res.text).toBe('');
      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://example.com/redirect');
      expect(res.get('Content-Length')).toBe('0');

      expect(mockAuthenticator.start).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          scope: 'my-scope',
          state: encodeOAuthState({
            nonce: '123',
            env: 'development',
            origin: 'https://remotehost',
            redirectUrl: 'https://remotehost/redirect',
            flow: 'redirect',
            scope: 'my-scope',
          }),
        },
        { ctx: 'authenticator' },
      );
    });
  });

  describe('frameHandler', () => {
    it('should authenticate', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        { req: expect.anything() },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: {},
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope',
          },
        },
      });

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent)).toBeUndefined();
    });

    it('should authenticate when refresh token is bigger than 4KB', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          refreshToken: fiveKilobyteRefreshToken,
        },
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        { req: expect.anything() },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: {},
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope',
          },
        },
      });

      expect(getRefreshTokenCookie(agent, 0).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 0),
      );
      expect(getRefreshTokenCookie(agent, 1).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 1),
      );
      expect(getGrantedScopesCookie(agent)).toBeUndefined();
    });

    it('should replace and clean up chunked token bigger than 4KB', async () => {
      // Create and use a custom cookie configurer to make sure to circumvent legacy cookie removal mechanism logic
      const customCookieConfigurer: CookieConfigurer = ({
        callbackUrl,
        providerId,
      }) => {
        const { pathname } = new URL(callbackUrl);
        const path = pathname.endsWith(`${providerId}/handler/frame`)
          ? pathname.slice(0, -'/handler/frame'.length)
          : `${pathname}/${providerId}`;
        return {
          path: path,
          secure: false,
          sameSite: 'lax',
        };
      };
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            cookieConfigurer: customCookieConfigurer,
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          refreshToken: fiveKilobyteRefreshToken,
        },
      });

      // Simulate 8.5KB token (3-chunks) that should be replaced with 5KB token (2-chunks)
      agent.jar.setCookie(
        `my-provider-refresh-token-0=${extractTokenStringSlice(
          eightAndAHalfKilobyteRefreshToken,
          0,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-1=${extractTokenStringSlice(
          eightAndAHalfKilobyteRefreshToken,
          1,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-2=${extractTokenStringSlice(
          eightAndAHalfKilobyteRefreshToken,
          2,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        { req: expect.anything() },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: {},
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope',
          },
        },
      });

      expect(getRefreshTokenCookie(agent, 0).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 0),
      );
      expect(getRefreshTokenCookie(agent, 1).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 1),
      );
      // verify that the old chunked cookie 2 is cleaned up
      expect(getRefreshTokenCookie(agent, 2)).toBeUndefined();

      // verify that deletion was ordered for old chunked cookies
      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 0,
          domain: false,
        }),
      ).toBe(true);
      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 1,
          domain: false,
        }),
      ).toBe(true);
      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 2,
          domain: false,
        }),
      ).toBe(true);

      expect(getGrantedScopesCookie(agent)).toBeUndefined();
    });

    it('should clean up old cookies (non-chunked) with domain attribute during migration', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=old-refresh-token; Domain=127.0.0.1',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(res.status).toBe(200);
      expect(
        confirmRefreshTokenCookieDeletion(res, { domain: '127.0.0.1' }),
      ).toBe(true);

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
    });

    it('should clean up old chunked cookies with domain attribute during migration', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      // Simulate old chunked cookies with domain attribute (legacy format)
      agent.jar.setCookie(
        `my-provider-refresh-token-0=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          0,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-1=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          1,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          refreshToken: fiveKilobyteRefreshToken,
        },
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(res.status).toBe(200);

      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 0,
          domain: '127.0.0.1',
        }),
      ).toBe(true);
      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 1,
          domain: '127.0.0.1',
        }),
      ).toBe(true);

      expect(getRefreshTokenCookie(agent, 0).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 0),
      );
      expect(getRefreshTokenCookie(agent, 1).value).toBe(
        extractTokenStringSlice(fiveKilobyteRefreshToken, 1),
      );
    });

    it('should clean up old chunked cookies with domain when migrating to non-chunked', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      agent.jar.setCookie(
        `my-provider-refresh-token-0=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          0,
        )}; Domain=127.0.0.1`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-1=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          1,
        )}; Domain=127.0.0.1`,
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(res.status).toBe(200);

      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 0,
          domain: false,
        }),
      ).toBe(true);
      expect(
        confirmRefreshTokenCookieDeletion(res, {
          chunkNumber: 1,
          domain: false,
        }),
      ).toBe(true);

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getRefreshTokenCookie(agent, 0)).toBeUndefined();
      expect(getRefreshTokenCookie(agent, 1)).toBeUndefined();
    });

    it('should authenticate with sign-in, profile transform, and persisted scopes', async () => {
      const mockAuditor = mockServices.auditor.mock();
      const auditEvent = {
        success: jest.fn().mockResolvedValue(undefined),
        fail: jest.fn().mockResolvedValue(undefined),
      };
      mockAuditor.createEvent.mockResolvedValue(auditEvent);
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
            auditor: mockAuditor,
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
          scope: 'my-scope my-other-scope',
        } as OAuthState),
      });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        response: {
          profile: { email: 'em@i.l' },
          providerInfo: {
            accessToken: 'access-token',
            expiresInSeconds: 3,
            idToken: 'id-token',
            scope: 'my-scope my-other-scope',
          },
          backstageIdentity: {
            identity: {
              type: 'user',
              ownershipEntityRefs: [],
              userEntityRef: 'user:default/mock',
            },
            token: mockBackstageToken,
          },
        },
      });

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent).value).toBe(
        'my-scope%20my-other-scope',
      );

      expect(mockAuditor.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'auth-login',
          severityLevel: 'low',
          meta: {
            providerId: 'my-provider',
            email: 'em@i.l',
          },
        }),
      );
    });

    it('should redirect with persisted scope', async () => {
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-nonce=123',
        '127.0.0.1',
        '/my-provider/handler',
      );

      mockAuthenticator.authenticate.mockResolvedValue({
        fullProfile: { id: 'id' } as PassportProfile,
        session: mockSession,
      });

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
          scope: 'my-scope my-other-scope',
          flow: 'redirect',
          redirectUrl: 'https://127.0.0.1:3000/redirect',
        } as OAuthState),
      });

      expect(res.status).toBe(302);
      expect(res.get('Location')).toBe('https://127.0.0.1:3000/redirect');

      expect(getRefreshTokenCookie(agent).value).toBe('refresh-token');
      expect(getGrantedScopesCookie(agent).value).toBe(
        'my-scope%20my-other-scope',
      );
    });

    it('should require a valid origin', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            origin: 'invalid-origin',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'App origin is invalid, failed to parse',
        },
      });
    });

    it('should reject origins that are not allowed', async () => {
      const app = wrapInApp(
        createOAuthRouteHandlers({
          ...baseConfig,
          isOriginAllowed: () => false,
        }),
      );
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            origin: 'http://localhost:3000',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: "Origin 'http://localhost:3000' is not allowed",
        },
      });
    });

    it('should reject missing state env', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            nonce: '123',
          } as OAuthState),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'OAuth state is invalid, missing env',
        },
      });
    });

    it('should reject missing cookie nonce', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
          }),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'Auth response is missing cookie nonce',
        },
      });
    });

    it('should reject missing state nonce', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
          } as OAuthState),
        });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'OAuth state is invalid, missing nonce',
        },
      });
    });

    it('should reject mismatched nonce', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-nonce=456',
        '127.0.0.1',
        '/my-provider/handler',
      );

      const res = await agent.get('/my-provider/handler/frame').query({
        state: encodeOAuthState({
          env: 'development',
          nonce: '123',
        } as OAuthState),
      });

      expect(res.status).toBe(200);
      expect(parseWebMessageResponse(res.text).response).toEqual({
        type: 'authorization_response',
        error: {
          name: 'NotAllowedError',
          message: 'Invalid nonce',
        },
      });
    });
  });

  describe('refresh', () => {
    it('should refresh', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .query({ scope: 'my-scope' });

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: 'refresh-token',
          scope: 'my-scope',
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: {},
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'my-scope',
        },
      });
    });

    it('should refresh for chunked token', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        `my-provider-refresh-token-0=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          0,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        `my-provider-refresh-token-1=${extractTokenStringSlice(
          fiveKilobyteRefreshToken,
          1,
        )}`,
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: {
          ...mockSession,
          scope,
          refreshToken: fiveKilobyteRefreshToken,
        },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest')
        .query({ scope: 'my-scope' });

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: fiveKilobyteRefreshToken,
          scope: 'my-scope',
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: {},
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'my-scope',
        },
      });
    });

    it('should refresh with sign-in, profile transform, and persisted scopes', async () => {
      const mockAuditor = mockServices.auditor.mock();
      const auditEvent = {
        success: jest.fn().mockResolvedValue(undefined),
        fail: jest.fn().mockResolvedValue(undefined),
      };
      mockAuditor.createEvent.mockResolvedValue(auditEvent);
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({
            ...baseConfig,
            authenticator: {
              ...mockAuthenticator,
              shouldPersistScopes: true,
            },
            profileTransform: async () => ({ profile: { email: 'em@i.l' } }),
            signInResolver: async () => ({ token: mockBackstageToken }),
            auditor: mockAuditor,
          }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );
      agent.jar.setCookie(
        'my-provider-granted-scope=persisted-scope',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(mockAuthenticator.refresh).toHaveBeenCalledWith(
        {
          req: expect.anything(),
          refreshToken: 'refresh-token',
          scope: 'persisted-scope',
          scopeAlreadyGranted: true,
        },
        { ctx: 'authenticator' },
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        profile: { email: 'em@i.l' },
        providerInfo: {
          accessToken: 'access-token',
          expiresInSeconds: 3,
          idToken: 'id-token',
          scope: 'persisted-scope',
        },
        backstageIdentity: {
          identity: {
            type: 'user',
            ownershipEntityRefs: [],
            userEntityRef: 'user:default/mock',
          },
          token: mockBackstageToken,
        },
      });
      expect(getRefreshTokenCookie(agent).value).toBe('new-refresh-token');
    });

    it('should forward errors and emit failure audit event', async () => {
      const mockAuditor = mockServices.auditor.mock();
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({ ...baseConfig, auditor: mockAuditor }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockRejectedValue(new Error('NOPE'));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Refresh failed; caused by Error: NOPE',
        },
      });
    });

    it('should require refresh cookie', async () => {
      const res = await request(wrapInApp(createOAuthRouteHandlers(baseConfig)))
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message:
            'Refresh failed; caused by InputError: Missing session cookie',
        },
      });
    });

    it('should reject requests without CSRF header', async () => {
      const res = await request(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      ).post('/my-provider/refresh');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should reject requests with invalid CSRF header', async () => {
      const res = await request(wrapInApp(createOAuthRouteHandlers(baseConfig)))
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'invalid');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should set sessionDuration to configured value', async () => {
      const baseConfigWithSessionDuration = {
        ...baseConfig,
        config: new ConfigReader({
          sessionDuration: { days: 7 },
        }),
      };

      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfigWithSessionDuration)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      const expectedExpirationDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const cookie = getRefreshTokenCookie(agent);
      expect(cookie.expiration_date).toBeGreaterThanOrEqual(
        expectedExpirationDate - 1000,
      );
      expect(cookie.expiration_date).toBeLessThanOrEqual(
        expectedExpirationDate + 1000,
      );
    });

    it('should set sessionDuration to default of 1000 days when not configured', async () => {
      const agent = request.agent(
        wrapInApp(createOAuthRouteHandlers(baseConfig)),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      mockAuthenticator.refresh.mockImplementation(async ({ scope }) => ({
        fullProfile: { id: 'id' } as PassportProfile,
        session: { ...mockSession, scope, refreshToken: 'new-refresh-token' },
      }));

      const res = await agent
        .post('/my-provider/refresh')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      const expectedExpirationDate = Date.now() + 1000 * 24 * 60 * 60 * 1000;
      const cookie = getRefreshTokenCookie(agent);
      expect(cookie.expiration_date).toBeGreaterThanOrEqual(
        expectedExpirationDate - 5000,
      );
      expect(cookie.expiration_date).toBeLessThanOrEqual(
        expectedExpirationDate + 5000,
      );
    });
  });

  describe('logout', () => {
    it('should log out', async () => {
      const mockAuditor = mockServices.auditor.mock();
      const auditEvent = {
        success: jest.fn().mockResolvedValue(undefined),
        fail: jest.fn().mockResolvedValue(undefined),
      };
      mockAuditor.createEvent.mockResolvedValue(auditEvent);
      const agent = request.agent(
        wrapInApp(
          createOAuthRouteHandlers({ ...baseConfig, auditor: mockAuditor }),
        ),
      );

      agent.jar.setCookie(
        'my-provider-refresh-token=my-refresh-token',
        '127.0.0.1',
        '/my-provider',
      );

      expect(getRefreshTokenCookie(agent).value).toBe('my-refresh-token');

      const res = await agent
        .post('/my-provider/logout')
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});

      expect(getRefreshTokenCookie(agent)).toBeUndefined();

      expect(mockAuditor.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventId: 'auth-logout',
          severityLevel: 'low',
          meta: {
            providerId: 'my-provider',
          },
        }),
      );
    });

    it('should reject requests without CSRF header', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));

      const res = await request(app).post('/my-provider/logout');
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should reject requests with invalid CSRF header', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));

      const res = await request(app)
        .post('/my-provider/logout')
        .set('X-Requested-With', 'wrong-value');
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        error: {
          name: 'AuthenticationError',
          message: 'Invalid X-Requested-With header',
        },
      });
    });

    it('should set error search param and redirect on caught error', async () => {
      const app = wrapInApp(createOAuthRouteHandlers(baseConfig));
      const res = await request(app)
        .get('/my-provider/handler/frame')
        .query({
          state: encodeOAuthState({
            env: 'development',
            nonce: '123',
            flow: 'redirect',
            redirectUrl: 'http://localhost:3000',
          }),
        });

      // Check if it redirects on error
      expect(res.status).toBe(302);

      // Extract the redirect URL from the location header
      const redirectLocation = res.header.location;
      expect(redirectLocation).toBeDefined();

      // Create a URL object from the redirect location
      const redirectUrl = new URL(redirectLocation);

      // Verify that the 'error' search param is set with the encoded error message
      const errorMessage = redirectUrl.searchParams.get('error');
      expect(errorMessage).toBe('Auth response is missing cookie nonce');
    });
  });
});
