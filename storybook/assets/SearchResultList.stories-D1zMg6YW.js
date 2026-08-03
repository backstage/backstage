import{bR as e,ca as o,a5 as h}from"./iframe-Bep9_wBM.js";import{s as y,M as S}from"./api-DO95s3vP.js";import{c as L}from"./SearchResult-DaIh76q4.js";import{S as s}from"./SearchResultList-Bgy0ahcj.js";import{S as q}from"./SearchContext-C1us4aI1.js";import{L as f}from"./ListItemText-CR9yFiV6.js";import{H as x}from"./DefaultResultListItem-BW-qdHC_.js";import{C as j}from"./icons-xyhG0_BL.js";import{O as P,a as C}from"./appWrappers-CuQFJImi.js";import{L as w}from"./ListItem-BMjBWple.js";import{L as A}from"./ListItemIcon-DAE2EAzV.js";import{a as _}from"./Plugin-BMkgF7np.js";import{S as R}from"./Grid-CSg20Lpu.js";import{L as W}from"./Link-ltwtLIEX.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BQV4eG0U.js";import"./useAsync-CsrOrKoz.js";import"./useMountedState-CkGlRQBd.js";import"./lodash-DlmSvGPN.js";import"./useElementFilter-CR50EPNi.js";import"./componentData-D54BP_xR.js";import"./List-BDBMMAfU.js";import"./ListContext-B8pcQC18.js";import"./translation-CnARLUzo.js";import"./EmptyState-DQ7HA-sP.js";import"./makeStyles-n7QD1cTQ.js";import"./Progress-Cr5HF5Oj.js";import"./LinearProgress-CeJjk-e5.js";import"./Box-CFxjkepC.js";import"./styled-BV5dnJ-_.js";import"./ResponseErrorPanel-m_kz0DiX.js";import"./ErrorPanel-Be9D2jSk.js";import"./WarningPanel-Xpni7Uwn.js";import"./ExpandMore-81E6Sqib.js";import"./AccordionDetails-DZeyCTvf.js";import"./index-B9sM2jn7.js";import"./Collapse-Ddu_bpDm.js";import"./MarkdownContent-C8HeSLCC.js";import"./CodeSnippet-DuYu6kRQ.js";import"./CopyTextButton-7iMEdpUR.js";import"./useCopyToClipboard-BOzYRH1r.js";import"./Tooltip-CR5J2eBR.js";import"./useObjectRef-BMeF5lvf.js";import"./useOverlayTriggerState-Bb7OtJVc.js";import"./utils-DKKUPgM-.js";import"./useFocusRing-E1AuPNx9.js";import"./openLink-DRfzd4-2.js";import"./number-VxDrHCY-.js";import"./I18nProvider-7dRPeGho.js";import"./useControlledState-B2mYurZ2.js";import"./animation-DqvQk7gj.js";import"./useHover-DE1qWbCW.js";import"./ButtonIcon-D8UVM1JY.js";import"./Button-C3UUENf1.js";import"./Label-CXp4l2Zb.js";import"./Hidden-oYhCQ5Lr.js";import"./useLabel-BiWRb2jR.js";import"./useLabels-BH6rqbM3.js";import"./useButton-0kbhVXvj.js";import"./usePress-vAS4agaY.js";import"./textSelection-DySWx5du.js";import"./index-tx8xlZoJ.js";import"./Divider-CvC6qSqk.js";import"./useApp-DlngHpLU.js";import"./WebStorage-BSKoLNuv.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D9nTlCHA.js";import"./useIsomorphicLayoutEffect-HedzCu6T.js";import"./BUIProvider-dkMaKCFj.js";import"./useResolvedHref-DTL4x9Ct.js";import"./useRouteRef-DRGEjaP9.js";import"./index-CEGXvcpa.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const tt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,tt as __namedExportsOrder,et as default};
