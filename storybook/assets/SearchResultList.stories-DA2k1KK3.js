import{bQ as e,c8 as o,a4 as h}from"./iframe-CdNUyns1.js";import{s as y,M as S}from"./api-CJ6_TV01.js";import{c as L}from"./SearchResult-98hvf8Ws.js";import{S as s}from"./SearchResultList-BIexeik0.js";import{S as q}from"./SearchContext-rED9KIgs.js";import{L as f}from"./ListItemText-0KNl44ZE.js";import{H as x}from"./DefaultResultListItem-ICyoFqFI.js";import{C as j}from"./icons-Dno7EAn0.js";import{O as P,a as C}from"./appWrappers-sNq04yOy.js";import{L as w}from"./ListItem-DgRPj49U.js";import{L as A}from"./ListItemIcon-CVinhI_C.js";import{a as _}from"./Plugin-DCfX2pcG.js";import{S as R}from"./Grid-CuUKwjma.js";import{L as W}from"./Link-NLVSI6WU.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-uPHW0hxD.js";import"./useAsync-BIYaz7CT.js";import"./useMountedState-CtNbdOCx.js";import"./lodash-LaLztEdN.js";import"./useElementFilter-NrW5IiZh.js";import"./componentData-Do4BBWyJ.js";import"./List-DcrVr_XM.js";import"./ListContext-BojgFJwk.js";import"./translation-DwScucU2.js";import"./EmptyState-RFQLZLrU.js";import"./makeStyles-CHAgNhAt.js";import"./Progress-Cq59B8bg.js";import"./LinearProgress-hcOufhOW.js";import"./Box-DFc3IFyj.js";import"./styled-_ZZ8vobE.js";import"./ResponseErrorPanel-BDjFBm00.js";import"./ErrorPanel-BEqNr6KB.js";import"./WarningPanel-C4FRvUub.js";import"./ExpandMore-CAqCuZZf.js";import"./AccordionDetails-wdruAoAq.js";import"./index-B9sM2jn7.js";import"./Collapse--EAsaz9T.js";import"./MarkdownContent-CDZMdAKe.js";import"./CodeSnippet-DQpn4qYh.js";import"./CopyTextButton-ByOwGKR1.js";import"./useCopyToClipboard-D3Ajb6Br.js";import"./Tooltip-DtfFdx8E.js";import"./useObjectRef-CFuPSG1M.js";import"./useOverlayTriggerState-CxgiGkff.js";import"./utils-B3O2Yp_M.js";import"./useFocusRing-BuKVGuQV.js";import"./openLink-DihNKPlJ.js";import"./number-CzhiuJx7.js";import"./I18nProvider-B6FBVrT9.js";import"./useControlledState-BN5fLvZ3.js";import"./animation-Dtm5YrM0.js";import"./useHover-Cn5cU9qj.js";import"./ButtonIcon-ZRgf0k-E.js";import"./Button-Cb98tIb7.js";import"./Label-D16an-mE.js";import"./Hidden-CS8th6sD.js";import"./useLabel-BERv6pEw.js";import"./useLabels-uizblfZx.js";import"./useButton-BtcENp-V.js";import"./usePress-_7EGmIU1.js";import"./textSelection-SXrH1sR5.js";import"./index-C5_u8aRu.js";import"./Divider-C8Hu2NoW.js";import"./useApp-B1xNj-di.js";import"./WebStorage-68-l6i1G.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CLx3WYbR.js";import"./useIsomorphicLayoutEffect-euStiqxR.js";import"./BUIProvider-BJ06Zhnc.js";import"./BUIRoutingProvider-DGbwW94E.js";import"./useResolvedHref-CfjkVgWI.js";import"./useRouteRef-BmVqI5YB.js";import"./index-Cn4V3qtH.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
