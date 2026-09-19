import{j as e,r as o,a3 as h}from"./iframe-CxlUpTpq.js";import{s as y,M as S}from"./api-BjL1FgrG.js";import{c as L}from"./SearchResult-T3j5UIpx.js";import{S as s}from"./SearchResultList-Cy3buah-.js";import{S as q}from"./SearchContext-CDV3EPdy.js";import{L as f}from"./ListItemText-DTWT_exv.js";import{H as x}from"./DefaultResultListItem-CHadi4o5.js";import{C as j}from"./icons-C0C-08qb.js";import{w as P,c as C}from"./appWrappers-Ca4f0dkS.js";import{L as w}from"./ListItem-CFzuWqPn.js";import{L as A}from"./ListItemIcon-CHUdDd5R.js";import{c as _}from"./Plugin-e9Kg4zls.js";import{S as R}from"./Grid-BLfllSxx.js";import{L as W}from"./Link-bOvDEdKZ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CsE2FyHM.js";import"./useAsync-mJPdi9qv.js";import"./useMountedState-DkDBMh4e.js";import"./lodash-7klT_A_g.js";import"./useElementFilter-DodF_1dW.js";import"./componentData-aELes_pk.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./translation-5EbjjLIH.js";import"./EmptyState-HhDdXCbq.js";import"./makeStyles-DbA2ZWGd.js";import"./Progress-BQTAcVVk.js";import"./LinearProgress-Cgq6kP0I.js";import"./Box-BmCEZaGT.js";import"./styled-ri-sX4kt.js";import"./ResponseErrorPanel-DvZCCMjf.js";import"./ErrorPanel-DVQwZFE4.js";import"./WarningPanel-DujtwXI3.js";import"./ExpandMore-JdlG67sm.js";import"./AccordionDetails-DoQbYKV5.js";import"./index-B9sM2jn7.js";import"./Collapse-CV0Gnfx7.js";import"./MarkdownContent-DNdcex5U.js";import"./CodeSnippet-DNItfSxA.js";import"./CopyTextButton-BZZjHxUE.js";import"./useCopyToClipboard-QnRjVoLF.js";import"./Tooltip-CHTJ2CJI.js";import"./useObjectRef-Dh3jViZn.js";import"./useOverlayTriggerState-G8ih59XW.js";import"./utils-BiH69BEF.js";import"./useFocusRing-DKBxNAkp.js";import"./openLink-DT4-HiOA.js";import"./number-wfr-a2dw.js";import"./I18nProvider-g-YIgX08.js";import"./useControlledState-CxsccuSa.js";import"./animation-D6w75ks6.js";import"./useHover-DMFi8o2f.js";import"./ButtonIcon-BJxB3R9Y.js";import"./Button-Dk1TuodQ.js";import"./Label-Ci2BW9le.js";import"./Hidden-f_G1o6Y7.js";import"./useLabel-DDDO_Y6W.js";import"./useLabels-ZAvHqBgR.js";import"./useButton-DqI1YsZH.js";import"./usePress-BAaUvFTM.js";import"./textSelection-B_r4mkkT.js";import"./index-m_RVXM54.js";import"./Divider-Bkd74j0H.js";import"./useApp-xRl_5Yzb.js";import"./WebStorage-s88Gv2oc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BPlKEDSy.js";import"./useIsomorphicLayoutEffect-BeMyXhL0.js";import"./BUIProvider-DWmcpNws.js";import"./BUIRoutingProvider-CBigqi8l.js";import"./useResolvedHref-CfM4jAOQ.js";import"./useRouteRef-BmfNWQxi.js";import"./index-22DygKJ2.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultList />
    </SearchContextProvider>;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultList query={query} />;
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} />
    </TestApiProvider>;
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultList query={query} noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultList query={query} renderResultItem={({
    type,
    document,
    highlight,
    rank
  }) => {
    switch (type) {
      case 'custom':
        return <CustomResultListItem key={document.location} icon={<CatalogIcon />} result={document} highlight={highlight} rank={rank} />;
      default:
        return <DefaultResultListItem key={document.location} result={document} />;
    }
  }} />;
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultListItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultList query={query}>
      <DefaultSearchResultListItem />
    </SearchResultList>;
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
