import{j as e,r as o,a3 as h}from"./iframe-GY9q4FO8.js";import{s as y,M as S}from"./api-B1ZAIvuT.js";import{c as L}from"./SearchResult-CrAZ1QtM.js";import{S as s}from"./SearchResultList-CA_IIMCb.js";import{S as q}from"./SearchContext-DGUf_VK5.js";import{L as f}from"./ListItemText-Bk-2uhgD.js";import{H as x}from"./DefaultResultListItem-DGQ7aBkM.js";import{C as j}from"./icons-CQqecDdm.js";import{w as P,c as C}from"./appWrappers-abPoRayI.js";import{L as w}from"./ListItem-ChY-Ftn4.js";import{L as A}from"./ListItemIcon-DCGmOeYQ.js";import{c as _}from"./Plugin-Bm6diPSA.js";import{S as R}from"./Grid-B0Qn3Dnm.js";import{L as W}from"./Link-C7aPd1jE.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-ChuvGTuC.js";import"./useAsync-Dcd2mgGY.js";import"./useMountedState-Dc2o9XUu.js";import"./lodash-DzeDbzRd.js";import"./useElementFilter-Bx2TSURJ.js";import"./componentData-DBWoKExG.js";import"./List-WDJE0HvX.js";import"./ListContext-Dnh-YOBQ.js";import"./translation-6SYtXLCA.js";import"./EmptyState-Bm6Ans8l.js";import"./makeStyles-2U49SRly.js";import"./Progress-Br8GDZQI.js";import"./LinearProgress-D-wPu52A.js";import"./Box-BD1hfHK_.js";import"./styled-gNaRwUS_.js";import"./ResponseErrorPanel-BQBrBjoF.js";import"./ErrorPanel-B2usRCC0.js";import"./WarningPanel-BKcSoPj-.js";import"./ExpandMore-mPh2u-wz.js";import"./AccordionDetails-DlHqPWZU.js";import"./index-B9sM2jn7.js";import"./Collapse-BzXHHZIv.js";import"./MarkdownContent-DNX1ANkJ.js";import"./CodeSnippet-DWYcITvw.js";import"./CopyTextButton-DlLc650l.js";import"./useCopyToClipboard-YyT6YTC8.js";import"./Tooltip-Cl5tUfxA.js";import"./useObjectRef-DlPyeYly.js";import"./useOverlayTriggerState-6qevt50p.js";import"./utils-UG8wIxPz.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./number-B5JXBwAu.js";import"./I18nProvider-BhiwSHej.js";import"./useControlledState-BK9RR_T7.js";import"./animation-CJ3qHqN2.js";import"./useHover-BHwy1G7-.js";import"./ButtonIcon-CnthuoFG.js";import"./Button-gV3JsRfd.js";import"./Label-Bc_GMvnu.js";import"./Hidden-nquVvtJw.js";import"./useLabel-uMVcdOMo.js";import"./useLabels-DnIs0d0f.js";import"./useButton-CUs3xyC6.js";import"./usePress-CTng4HyG.js";import"./textSelection-DeC98-eF.js";import"./getMetaValue-XB_wrXKe.js";import"./index-CbkTlW2S.js";import"./Divider-D09MS3Wy.js";import"./useApp-KPq2D3WO.js";import"./WebStorage-B4wqdseN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Cmm3TayF.js";import"./useIsomorphicLayoutEffect-muWHuJxm.js";import"./BUIProvider-CuGVHqZV.js";import"./BUIRoutingProvider-Jw2VtAIF.js";import"./useResolvedHref-DHULiug-.js";import"./useRouteRef-Df-4BPXn.js";import"./index-C3IUYLj9.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const st=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,st as __namedExportsOrder,rt as default};
