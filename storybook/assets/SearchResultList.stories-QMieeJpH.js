import{j as e,r as o,X as h}from"./iframe-BS0xFXlr.js";import{s as y,M as S}from"./api-kGNx5yom.js";import{c as L}from"./SearchResult-zasZniMo.js";import{S as s}from"./SearchResultList-BWDdQ1-T.js";import{S as q}from"./SearchContext-B9Loq1p_.js";import{L as f}from"./ListItemText-DrTF3v8k.js";import{H as x}from"./DefaultResultListItem-Dl12V070.js";import{C as j}from"./icons-BjZ8_UXF.js";import{w as P,c as C}from"./appWrappers-DW7yYuoj.js";import{L as w}from"./ListItem-BV0lDcKg.js";import{L as A}from"./ListItemIcon-BszJDTWm.js";import{c as _}from"./Plugin-k9Gq8mFW.js";import{S as R}from"./Grid-BC-GErrP.js";import{L as W}from"./Link-CIfFi95r.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BnNCqh3j.js";import"./useAsync--6P2rWtU.js";import"./useMountedState-7-fWW0Pc.js";import"./lodash-diAnziC6.js";import"./useElementFilter-DGrN0HI8.js";import"./componentData-D0MlWBgw.js";import"./List-3z7MBLVl.js";import"./ListContext-D9vaJRo5.js";import"./translation-DosiATzG.js";import"./EmptyState-uj1yMhLi.js";import"./makeStyles-BLXzgJv8.js";import"./Progress-De7rqdJv.js";import"./LinearProgress-D6Z7Fa4e.js";import"./Box-CLuirzLp.js";import"./styled-DTU31MMc.js";import"./ResponseErrorPanel-C6YnMbyT.js";import"./ErrorPanel-bQ-UrNen.js";import"./WarningPanel-ocZowaRi.js";import"./ExpandMore-BJk8aIJ8.js";import"./AccordionDetails-38LltlXO.js";import"./index-B9sM2jn7.js";import"./Collapse-BMt5zQG_.js";import"./MarkdownContent-CvGzwc1y.js";import"./CopyTextButton-DcDFfQKz.js";import"./useCopyToClipboard-Cq600UYw.js";import"./Tooltip-BKQmVUTS.js";import"./useObjectRef-DUcg5Ry6.js";import"./useOverlayTriggerState-BmqdnQuv.js";import"./utils-Cm8LN8Qs.js";import"./useFocusRing-DN0Vfw2w.js";import"./number-BpBkSV7H.js";import"./I18nProvider-PG7J6CX1.js";import"./useControlledState--_QEZGZM.js";import"./animation-C8VQ-2r7.js";import"./useHover-CBc8HZSH.js";import"./ButtonIcon-CkaKpehC.js";import"./Button-CEQzuGsm.js";import"./Label-CYKe4XnV.js";import"./Hidden-B4kfQ2c4.js";import"./useLabel-BuvGyTAc.js";import"./useLabels-BEdhgbVu.js";import"./useButton-AcAPGB9_.js";import"./usePress-DqAt-yTJ.js";import"./textSelection-CBFVLC_r.js";import"./getMetaValue-gNZTl7Dq.js";import"./index-DiKBASFX.js";import"./Divider-DPIySf_q.js";import"./CodeSnippet-Chslpo80.js";import"./useApp-DZ3AraTi.js";import"./index-BJ65rCJn.js";import"./WebStorage-CJ4Cwwlg.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DYKzFvqa.js";import"./useIsomorphicLayoutEffect-CMRMm7Qb.js";import"./BUIProvider-DQGs-4H3.js";import"./useRouteRef-QbHDpXig.js";import"./index-DC7FuYq9.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
