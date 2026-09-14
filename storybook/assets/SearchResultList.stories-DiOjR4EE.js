import{bQ as e,c8 as o,a4 as h}from"./iframe-DXdR4xPj.js";import{s as y,M as S}from"./api-C2sdP6MI.js";import{c as L}from"./SearchResult-B1FDHM4e.js";import{S as s}from"./SearchResultList-BIDAHHhk.js";import{S as q}from"./SearchContext-DKpD-fNO.js";import{L as f}from"./ListItemText-OsK-woHh.js";import{H as x}from"./DefaultResultListItem-CdUnsobM.js";import{C as j}from"./icons-C3fyRmhP.js";import{O as P,a as C}from"./appWrappers-CEl3ywVn.js";import{L as w}from"./ListItem-BOMvkCzo.js";import{L as A}from"./ListItemIcon-CUjJmTtb.js";import{a as _}from"./Plugin-BfH0A7QP.js";import{S as R}from"./Grid-DrAuN9Lo.js";import{L as W}from"./Link-CECNWZIJ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Bc97N_iw.js";import"./useAsync-BqpLlOup.js";import"./useMountedState-ONEV228w.js";import"./lodash-CmjgS8yt.js";import"./useElementFilter-H31d1waJ.js";import"./componentData-CHj3LiZV.js";import"./List-lTcp28bB.js";import"./ListContext-D9s9W3--.js";import"./translation-ekyi-si9.js";import"./EmptyState-ZQbXmwFI.js";import"./makeStyles-BSWJde_H.js";import"./Progress-BoJ7hMwZ.js";import"./LinearProgress-DX3V7Vtp.js";import"./Box-BJkHSLqZ.js";import"./styled-CiGmUP6u.js";import"./ResponseErrorPanel-CYjhFR9o.js";import"./ErrorPanel-PfozazXQ.js";import"./WarningPanel-dmdEkL6N.js";import"./ExpandMore-Cn9fsZkL.js";import"./AccordionDetails-CcwoEpnL.js";import"./index-B9sM2jn7.js";import"./Collapse-D3SHWrK_.js";import"./MarkdownContent-Ndc2BMHt.js";import"./CodeSnippet-CN_ri0t1.js";import"./CopyTextButton-aij2uRTA.js";import"./useCopyToClipboard-DxkyfMR3.js";import"./Tooltip-7f6CFq-V.js";import"./useObjectRef-CbSdwcnt.js";import"./useOverlayTriggerState-9MfyzaMp.js";import"./utils-C-HUDFAG.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./number-YjzVCZ5M.js";import"./I18nProvider-C2KDHo4-.js";import"./useControlledState-BREXAMRj.js";import"./animation-CfYGLk_Q.js";import"./useHover-DQCkeZXu.js";import"./ButtonIcon-B4V4tS0o.js";import"./Button-lJ2CGbxt.js";import"./Label-Zek0cQNR.js";import"./Hidden-DEL9fdLN.js";import"./useLabel-BKLzxkTR.js";import"./useLabels-D61_ZlAV.js";import"./useButton-BvDLj8oC.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./index-DBKaRO06.js";import"./Divider-Czk8sHFY.js";import"./useApp-cePut29r.js";import"./WebStorage-DQ8VF5en.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BS8_YX0o.js";import"./useIsomorphicLayoutEffect-Ch41KCBC.js";import"./BUIProvider-3mC0dqi4.js";import"./BUIRoutingProvider-Cv_U09wD.js";import"./useResolvedHref-CWLs1pfc.js";import"./useRouteRef-B6gXfved.js";import"./index-CvcAu-rV.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
