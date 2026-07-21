import{bR as e,ca as o,a5 as h}from"./iframe-DmKIhSd4.js";import{s as y,M as S}from"./api-WggOs8j2.js";import{c as L}from"./SearchResult-BMVZVvv-.js";import{S as s}from"./SearchResultList-DV0sd3J8.js";import{S as q}from"./SearchContext-DPWxmp6F.js";import{L as f}from"./ListItemText-1B3hY1s2.js";import{H as x}from"./DefaultResultListItem-CxBpFHYV.js";import{C as j}from"./icons-ZTg9NslR.js";import{O as P,a as C}from"./appWrappers-B_SBF-C-.js";import{L as w}from"./ListItem-aei1NC_j.js";import{L as A}from"./ListItemIcon-CWZz4Liy.js";import{a as _}from"./Plugin-aY1IVyYD.js";import{S as R}from"./Grid-A2BeQhfO.js";import{L as W}from"./Link-Dk9R5rXS.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BU7cnARE.js";import"./useAsync-DQobIL_Y.js";import"./useMountedState-NDYV-m0y.js";import"./lodash-TPrC5YUF.js";import"./useElementFilter-DM69RQpw.js";import"./componentData-5mRr8Gh0.js";import"./List-C3tYQ8nk.js";import"./ListContext-B0FPCnG9.js";import"./translation-BttZaiqn.js";import"./EmptyState-DIFGTTwU.js";import"./makeStyles-BqK0q-gB.js";import"./Progress-CZ68VttO.js";import"./LinearProgress-ffKn72gL.js";import"./Box-DUl4t4xa.js";import"./styled-CkYeEFkY.js";import"./ResponseErrorPanel-DAVAdfUT.js";import"./ErrorPanel-DKz7aA6r.js";import"./WarningPanel-BCIQ1xuj.js";import"./ExpandMore-rew_O_m2.js";import"./AccordionDetails-ClJpmHIZ.js";import"./index-B9sM2jn7.js";import"./Collapse-DC9E5jJ1.js";import"./MarkdownContent-BHh30bfr.js";import"./CodeSnippet-DHMDlIIT.js";import"./CopyTextButton-DOaErw0y.js";import"./useCopyToClipboard-OUFPmm48.js";import"./Tooltip-BqIA_Hyn.js";import"./useObjectRef-DibnPYi9.js";import"./useOverlayTriggerState-B-0MWh2c.js";import"./utils-Bp1UFdf_.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./number-8YiafpBN.js";import"./I18nProvider-BA08ZmK6.js";import"./useControlledState-OVmM0QOa.js";import"./animation-i-bGx-PV.js";import"./useHover-CwSUiPfU.js";import"./ButtonIcon-CSuiwOk1.js";import"./Button--V2N_X5K.js";import"./Label-C46amIDy.js";import"./Hidden-B2CHbqyo.js";import"./useLabel-BhsNw667.js";import"./useLabels-B-OZcbcW.js";import"./useButton-DGptM25J.js";import"./usePress-DvOXzaHx.js";import"./textSelection-DOq0Tvnx.js";import"./index-BPEgRMek.js";import"./Divider-DqI-o82C.js";import"./useApp-DzXHRUhp.js";import"./WebStorage-DwBWZQei.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Dgw7Nwz5.js";import"./useIsomorphicLayoutEffect-B0rFvhNO.js";import"./BUIProvider-8kFB0Ao9.js";import"./useResolvedHref-XzxGpNLx.js";import"./useRouteRef-CLsiUEjI.js";import"./index-DJiMl0KJ.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
