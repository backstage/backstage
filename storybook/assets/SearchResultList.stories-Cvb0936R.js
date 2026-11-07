import{j as e,r as o,a3 as h}from"./iframe-D9zyyCLm.js";import{s as y,M as S}from"./api-BcooKewd.js";import{c as L}from"./SearchResult-Bu0iVzz6.js";import{S as s}from"./SearchResultList-DlDxslpV.js";import{S as q}from"./SearchContext-BROEIRe0.js";import{L as f}from"./ListItemText-CSafx1d3.js";import{H as x}from"./DefaultResultListItem-yvBQY8si.js";import{C as j}from"./icons-CTUkUnbG.js";import{w as P,c as C}from"./appWrappers-Mm2hSPXH.js";import{L as w}from"./ListItem-O17-VUI5.js";import{L as A}from"./ListItemIcon-guKHv8rX.js";import{c as _}from"./Plugin-LTeon7ny.js";import{S as R}from"./Grid-BB8AJhQB.js";import{L as W}from"./Link-BQ85eo89.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-b9lD6bMf.js";import"./useAsync-DanSD5vu.js";import"./useMountedState-T1Hh3_OE.js";import"./lodash-c_X8lcuE.js";import"./useElementFilter-B-_1l-Z5.js";import"./componentData-DbTi_SHb.js";import"./List-C4uiJVgu.js";import"./ListContext-BGhsm4dp.js";import"./translation-kHCygu64.js";import"./EmptyState-CUxlUMzA.js";import"./makeStyles-CWCwef5R.js";import"./Progress-r0pYGT6f.js";import"./LinearProgress-DRz-t4H0.js";import"./Box-Defj12pz.js";import"./styled-D79h_skJ.js";import"./ResponseErrorPanel-RnCtMpAR.js";import"./ErrorPanel-KLek1RLY.js";import"./WarningPanel-Dkkr8AIM.js";import"./ExpandMore-C2LE1N2L.js";import"./AccordionDetails-CelqUZr6.js";import"./index-B9sM2jn7.js";import"./Collapse-D4zdbtg3.js";import"./MarkdownContent-CnYiXyLA.js";import"./CodeSnippet-DkBo__Jd.js";import"./CopyTextButton-D8CXvYoG.js";import"./useCopyToClipboard-CYoqdluJ.js";import"./Tooltip-BhAvVrKz.js";import"./useObjectRef-DW2A_FKT.js";import"./useOverlayTriggerState-BkEw8wth.js";import"./utils-BhB9Kn0J.js";import"./useFocusRing-Cyv4kXD7.js";import"./openLink-Dq3aE_9q.js";import"./number-oRZks6E2.js";import"./I18nProvider-CFA5Nn83.js";import"./useControlledState-CNVQPQl6.js";import"./animation-Dc2F1pm8.js";import"./useHover-CXer1LBh.js";import"./ButtonIcon-D9JFIQSe.js";import"./Button-eiFaSVQp.js";import"./Label-8xCw--Gh.js";import"./Hidden-BEbPYnKb.js";import"./useLabel-CNCvRjXr.js";import"./useLabels-Cf60hIuc.js";import"./useButton-Br280P7j.js";import"./usePress-DakPojsx.js";import"./textSelection-B_folLqx.js";import"./getMetaValue-DvVIc-fc.js";import"./index-BJpHCwC2.js";import"./Divider-BqjqocUC.js";import"./useApp-D2m-Ae2p.js";import"./WebStorage-BGXKhQbc.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bcuqb2aR.js";import"./useIsomorphicLayoutEffect-x86gmjWj.js";import"./BUIProvider-CorbBPd2.js";import"./BUIRoutingProvider-CWnqyVtP.js";import"./useResolvedHref-CJObg6YS.js";import"./useRouteRef-B4urRvXS.js";import"./index-CZyC9z6L.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),rt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
