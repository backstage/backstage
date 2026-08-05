import{bR as e,ca as o,a5 as h}from"./iframe-CMKJKLUT.js";import{s as y,M as S}from"./api-BFUTBlr4.js";import{c as L}from"./SearchResult-BD0wlChA.js";import{S as s}from"./SearchResultList-FiPKT9_k.js";import{S as q}from"./SearchContext-KuwRrPoO.js";import{L as f}from"./ListItemText-5TxI4qRi.js";import{H as x}from"./DefaultResultListItem-Ltq5oy1M.js";import{C as j}from"./icons-Dsa-CbN6.js";import{O as P,a as C}from"./appWrappers-qSalhW3b.js";import{L as w}from"./ListItem--taqkzDX.js";import{L as A}from"./ListItemIcon-Bz6vf59e.js";import{a as _}from"./Plugin-s_CjJwq9.js";import{S as R}from"./Grid-UmxeFSJB.js";import{L as W}from"./Link-C7EGKb3p.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-CnatrMx6.js";import"./useAsync-CK-mdy1E.js";import"./useMountedState-BmumZoH9.js";import"./lodash-BVa2wb4L.js";import"./useElementFilter-B-Ka8xkG.js";import"./componentData-C2NoQW7v.js";import"./List-Dqpl4jxs.js";import"./ListContext-CStQo49q.js";import"./translation-DtMHvCmq.js";import"./EmptyState-DVlhjFpk.js";import"./makeStyles-CXoO9pfI.js";import"./Progress-D0u33zrF.js";import"./LinearProgress-Bb6vhX_n.js";import"./Box-CcFL9itu.js";import"./styled-DkbS0659.js";import"./ResponseErrorPanel-CusCfafp.js";import"./ErrorPanel-ByA4ySh0.js";import"./WarningPanel-C-AUthRw.js";import"./ExpandMore-BN9yJXZF.js";import"./AccordionDetails-C7lg9HDC.js";import"./index-B9sM2jn7.js";import"./Collapse-BfaQXjdc.js";import"./MarkdownContent-VZ5DDeAS.js";import"./CodeSnippet-DQMlBITq.js";import"./CopyTextButton-CSEg_w8f.js";import"./useCopyToClipboard-o7cyc8UL.js";import"./Tooltip-DNowRtwz.js";import"./useObjectRef-BuVj0MY8.js";import"./useOverlayTriggerState-gM5yelRW.js";import"./utils-CvvRR5aT.js";import"./useFocusRing-BsrOlbwX.js";import"./openLink-CuYP7gPT.js";import"./number-BK7i31-5.js";import"./I18nProvider-DNttPEDV.js";import"./useControlledState-v_oGfpQe.js";import"./animation-UqwXZAR_.js";import"./useHover-b_v_F8vi.js";import"./ButtonIcon-BmTr9hep.js";import"./Button-D2707XjA.js";import"./Label-CdTMbHUG.js";import"./Hidden-yy8u865W.js";import"./useLabel-DYjQeQ13.js";import"./useLabels-s9NhyS06.js";import"./useButton-BBt4i9aT.js";import"./usePress-SWIST_DD.js";import"./textSelection-BBT3_o9i.js";import"./index-DmjMZt5B.js";import"./Divider-B8kBeCp6.js";import"./useApp-jTIyofwr.js";import"./WebStorage-DWe_Ynxt.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DMS8beTD.js";import"./useIsomorphicLayoutEffect-DcDY9lkM.js";import"./BUIProvider-DkcvuMdl.js";import"./useResolvedHref-BMahjBhp.js";import"./useRouteRef-B7ZWNnS3.js";import"./index-C_93cPm_.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
