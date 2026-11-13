import{j as e,r as o,X as h}from"./iframe-a5iorYt_.js";import{s as y,M as S}from"./api-BkLfedZG.js";import{c as L}from"./SearchResult-ea__zZYU.js";import{S as s}from"./SearchResultList-BG8g7BLz.js";import{S as q}from"./SearchContext-DQUl4_YI.js";import{L as f}from"./ListItemText-DPcnvc1K.js";import{H as x}from"./DefaultResultListItem-BQUhFKHx.js";import{C as j}from"./icons-D22RbPnK.js";import{w as P,c as C}from"./appWrappers-DS30rzTn.js";import{L as w}from"./ListItem-C_oFpBsa.js";import{L as A}from"./ListItemIcon-zcWHzz5p.js";import{c as _}from"./Plugin-D9FjVq-H.js";import{S as R}from"./Grid-GKprjDXV.js";import{L as W}from"./Link-CkwOc38T.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DCNn34Rq.js";import"./useAsync-CxmaK9zZ.js";import"./useMountedState-BQtZDAQ3.js";import"./lodash-Ba724kq_.js";import"./useElementFilter-DaZ59J0i.js";import"./componentData-CiQPq3BR.js";import"./List-DC5vfnmZ.js";import"./ListContext-Dj5C0Bx_.js";import"./translation-CuZyM59u.js";import"./EmptyState-2VsQADQe.js";import"./makeStyles-C3e0W14-.js";import"./Progress-mcoMQIul.js";import"./LinearProgress-D3Cct-wL.js";import"./Box-BeM7E2iG.js";import"./styled-D8mefoHX.js";import"./ResponseErrorPanel-DJSyaEat.js";import"./ErrorPanel-DCIylhjP.js";import"./WarningPanel-dTLQC0wO.js";import"./ExpandMore-C4_a14Ka.js";import"./AccordionDetails-Di5rumEH.js";import"./index-B9sM2jn7.js";import"./Collapse-ex4-Upv2.js";import"./MarkdownContent-sAOjAFni.js";import"./CopyTextButton-CGf0YRCN.js";import"./useCopyToClipboard-DGLK9DJc.js";import"./Tooltip-Dhxyt2Bc.js";import"./useObjectRef-DomNprMl.js";import"./useOverlayTriggerState-oc_4bf5x.js";import"./utils-CKuAz2Wi.js";import"./useFocusRing-BW-GobYG.js";import"./number-Ccp2yLIm.js";import"./I18nProvider-Cha0UYwj.js";import"./useControlledState-x1Vpl6eH.js";import"./animation-CocdaLDQ.js";import"./useHover-D7-ycX7p.js";import"./ButtonIcon-CXYdBlUn.js";import"./Button-DH0afYUU.js";import"./Label-Orfe5toA.js";import"./Hidden-Bu-9bwhW.js";import"./useLabel-Bgchr9R9.js";import"./useLabels-BoVBLTQ5.js";import"./useButton-6YfvAB0s.js";import"./usePress-BUjc0uWv.js";import"./textSelection-C8mzHD_X.js";import"./getMetaValue-BDmRRgum.js";import"./index-DmAgGD7M.js";import"./Divider-DGoABXJT.js";import"./CodeSnippet-Dz_bEVXA.js";import"./useApp-Ch2_fjtz.js";import"./index-CIXpXNvI.js";import"./WebStorage-CrYb5zEE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CKU1UQ6z.js";import"./useIsomorphicLayoutEffect-BI45JR--.js";import"./BUIProvider-CnPnbG6C.js";import"./useRouteRef-C0wkGfeM.js";import"./index-B19-WIzK.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
