import{j as e,r as o,X as h}from"./iframe-jnmYTFb3.js";import{s as y,M as S}from"./api-AQiNGqYN.js";import{c as L}from"./SearchResult-DlTwRJFG.js";import{S as s}from"./SearchResultList-oP14VUnU.js";import{S as q}from"./SearchContext-DFK_4Z9x.js";import{L as f}from"./ListItemText-BnRAJA86.js";import{H as x}from"./DefaultResultListItem-B601-wDZ.js";import{C as j}from"./icons-DRSEn1Mk.js";import{w as P,c as C}from"./appWrappers-7aB4jZJ6.js";import{L as w}from"./ListItem-BO9RXUpG.js";import{L as A}from"./ListItemIcon-D55y0EHk.js";import{c as _}from"./Plugin-UmQU66Um.js";import{S as R}from"./Grid-DHhCW-Yl.js";import{L as W}from"./Link-DMTmhcL8.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BuCMBFsG.js";import"./useAsync-DMLkPo7x.js";import"./useMountedState-zcJIkXnT.js";import"./lodash-DMwpKwqE.js";import"./useElementFilter-CHwjTomU.js";import"./componentData-DdDQ79Vt.js";import"./List-DNNk4mb1.js";import"./ListContext-DcU_gvQM.js";import"./translation-mGTM5-2G.js";import"./EmptyState-DveIAzxK.js";import"./makeStyles-BpJnXHFG.js";import"./Progress-B8Kne6su.js";import"./LinearProgress-QEwbKcCq.js";import"./Box-C2sZFW6J.js";import"./styled-DtEigLlW.js";import"./ResponseErrorPanel-C5glnDEV.js";import"./ErrorPanel-B_TITbIF.js";import"./WarningPanel-Dg3CiKPr.js";import"./ExpandMore-CA8sV17M.js";import"./AccordionDetails-Cr-qO6HI.js";import"./index-B9sM2jn7.js";import"./Collapse-DTDzxOj5.js";import"./MarkdownContent-DJmkymU6.js";import"./CopyTextButton-gYqzu9p-.js";import"./useCopyToClipboard-Dr9NpXhu.js";import"./Tooltip-B1tKDHkx.js";import"./useObjectRef-FWUTxVt4.js";import"./useOverlayTriggerState-B51CCYAg.js";import"./utils-CKg7Fv9H.js";import"./useFocusRing-BdOMpJmy.js";import"./number-C6hsbYZL.js";import"./I18nProvider-CZql2cBv.js";import"./useControlledState-CrGsVDTu.js";import"./animation-CVivYYSw.js";import"./useHover-uknbF-p6.js";import"./ButtonIcon-sVT7F_2-.js";import"./Button-DgXb-SRY.js";import"./Label-B1pLoO_3.js";import"./Hidden-xHEnn_eG.js";import"./useLabel-0FUhOvtV.js";import"./useLabels-BVz1Fy9t.js";import"./useButton-CukdYqmR.js";import"./usePress-0a27YkJt.js";import"./textSelection-BFpEW1JG.js";import"./getMetaValue-vz9tQ4MU.js";import"./index-C6hgsZfa.js";import"./Divider-Cc2XeNV9.js";import"./CodeSnippet-BwHAf_s7.js";import"./useApp-BB1JgkaP.js";import"./index-C7-0R-zP.js";import"./WebStorage-B-WWV8k2.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-ByXIv6BD.js";import"./useIsomorphicLayoutEffect-Bmcs4Fp6.js";import"./BUIProvider-E5gJ_230.js";import"./useRouteRef-B1W8JDGG.js";import"./index-CdOJX-9o.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
