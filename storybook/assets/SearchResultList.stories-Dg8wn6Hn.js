import{bQ as e,c8 as o,a4 as h}from"./iframe-DwtLqRd0.js";import{s as y,M as S}from"./api-DxNEVkKW.js";import{c as L}from"./SearchResult-B37pIwXx.js";import{S as s}from"./SearchResultList-DzviSS1V.js";import{S as q}from"./SearchContext-D6TEp6Kl.js";import{L as f}from"./ListItemText-cHlJFKh4.js";import{H as x}from"./DefaultResultListItem-BQzZWhN8.js";import{C as j}from"./icons-xwcOF-DF.js";import{O as P,a as C}from"./appWrappers-6k9AmxPn.js";import{L as w}from"./ListItem-CZsOW-2D.js";import{L as A}from"./ListItemIcon-BfSf7ZSX.js";import{a as _}from"./Plugin-Bv4fnmgI.js";import{S as R}from"./Grid-CYWjZ88i.js";import{L as W}from"./Link-DWcyScs4.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DP-R2foX.js";import"./useAsync-P5fwF-TJ.js";import"./useMountedState-BdNpbXH7.js";import"./lodash-B5HI3AG3.js";import"./useElementFilter-BdTA8zl6.js";import"./componentData-Cgv6y0Zt.js";import"./List-78xudjL7.js";import"./ListContext-DHZNjXO9.js";import"./translation-DW_Jyixv.js";import"./EmptyState-A0DWwrKM.js";import"./makeStyles-61D4HnMF.js";import"./Progress-XkvrXrtz.js";import"./LinearProgress-KNfvptRp.js";import"./Box-7z3gKpft.js";import"./styled-2OXr0LLp.js";import"./ResponseErrorPanel-CfnUgPjC.js";import"./ErrorPanel-CT1n2_ZK.js";import"./WarningPanel-DRno-0iq.js";import"./ExpandMore-D33EVsRn.js";import"./AccordionDetails-BJnR58rH.js";import"./index-B9sM2jn7.js";import"./Collapse-hzPe5c6V.js";import"./MarkdownContent-BO8s6WkT.js";import"./CodeSnippet-d_5XlQdb.js";import"./CopyTextButton-DE8yBP_S.js";import"./useCopyToClipboard-2YTYmtJX.js";import"./Tooltip-DaCyvBEk.js";import"./useObjectRef-C3WIJKuW.js";import"./useOverlayTriggerState-tkyO9oaJ.js";import"./utils-CTdfKX7K.js";import"./useFocusRing-Br9K8cEf.js";import"./openLink-Chp0fPN0.js";import"./number-Bm7tKJss.js";import"./I18nProvider-nGJGLiEq.js";import"./useControlledState-kobszWOc.js";import"./animation-WaI6kgjy.js";import"./useHover-BPNWkg3J.js";import"./ButtonIcon-DLANXsyX.js";import"./Button-CN2KE0n5.js";import"./Label-CnMUtZHy.js";import"./Hidden-Bs1ekBhh.js";import"./useLabel-csUjoQn4.js";import"./useLabels-DBBGWQnZ.js";import"./useButton-A_NfRVcv.js";import"./usePress-C5TgjZ1H.js";import"./textSelection-DEZhmmiP.js";import"./index-BnPMaZ6y.js";import"./Divider-JeuTwy37.js";import"./useApp-CwD5tnbo.js";import"./WebStorage-Das6G0h5.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-if6xlNcL.js";import"./useIsomorphicLayoutEffect-CclSZCNC.js";import"./BUIProvider-c6TORPmv.js";import"./BUIRoutingProvider-D8L55R8m.js";import"./useResolvedHref-B6eHfBkG.js";import"./useRouteRef-B5ZPUVdA.js";import"./index-5hB1atvh.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
