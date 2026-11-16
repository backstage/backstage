import{j as e,r as o,X as h}from"./iframe-BKMB85pu.js";import{s as y,M as S}from"./api-B2C_FvkV.js";import{c as L}from"./SearchResult-CHHFSNR8.js";import{S as s}from"./SearchResultList-8FgA_cmr.js";import{S as q}from"./SearchContext-mZRriRV6.js";import{L as f}from"./ListItemText-sdDqdehA.js";import{H as x}from"./DefaultResultListItem-NzwhHdV4.js";import{C as j}from"./icons-BWzkx05a.js";import{w as P,c as C}from"./appWrappers-BmjUi_Q7.js";import{L as w}from"./ListItem-t7nuvK6y.js";import{L as A}from"./ListItemIcon-uEqTuhmI.js";import{c as _}from"./Plugin-MBMQWI5y.js";import{S as R}from"./Grid-viPz66aT.js";import{L as W}from"./Link-fH8EKjwa.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Byp1p_wz.js";import"./useAsync-D6wO_nB8.js";import"./useMountedState-DH0AZbbi.js";import"./lodash-BeJ40VgY.js";import"./useElementFilter-D-jLNncI.js";import"./componentData-BabFSg2o.js";import"./List-DE1EjvNy.js";import"./ListContext-CjUxhhLX.js";import"./translation-BP0mbqkT.js";import"./EmptyState-iY_f4f1m.js";import"./makeStyles-BbaqMEn9.js";import"./Progress-CutJHZ0-.js";import"./LinearProgress-B8PgKj1w.js";import"./Box-BIjxIEHL.js";import"./styled-CmE3HJ3H.js";import"./ResponseErrorPanel-4ILaJYHM.js";import"./ErrorPanel-DMnVYPRB.js";import"./WarningPanel-DeZlQeYj.js";import"./ExpandMore-Bs02VRS8.js";import"./AccordionDetails-D0Ke5GTc.js";import"./index-B9sM2jn7.js";import"./Collapse-DeMnbEls.js";import"./MarkdownContent-5Nh2VUb_.js";import"./CopyTextButton-CxBpZbdV.js";import"./useCopyToClipboard-BuPEM0nO.js";import"./Tooltip-BemYkD6q.js";import"./useObjectRef-CqnWYM4T.js";import"./useOverlayTriggerState-BIOnmv4V.js";import"./utils-Nyu7VTFu.js";import"./useFocusRing-jnagQyYL.js";import"./number-CuQ36X_j.js";import"./I18nProvider-29Kr0hRB.js";import"./useControlledState-D3rG0KvC.js";import"./animation-R0urY-IW.js";import"./useHover-BaAG1-q2.js";import"./ButtonIcon-DlomWlgb.js";import"./Button-BvAYTrV8.js";import"./Label-Y7OAC7uK.js";import"./Hidden-DHN5dLew.js";import"./useLabel-CeJz4BMW.js";import"./useLabels-CFKWkPDt.js";import"./useButton-BR5xtNl4.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./getMetaValue-TGQihhTK.js";import"./index-CSiDGQP5.js";import"./Divider-s0tWw9xa.js";import"./CodeSnippet-DcKj-6qM.js";import"./useApp-CJurmApE.js";import"./index-DT_vTdsS.js";import"./WebStorage-AkAjoW4A.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DKtD9w_S.js";import"./useIsomorphicLayoutEffect-Ledex52N.js";import"./BUIProvider-DtnM-lk2.js";import"./useRouteRef-DLCzdJMd.js";import"./index-CxKjejfY.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
