import{bR as e,ca as o,a5 as h}from"./iframe-Dzms4wRw.js";import{s as y,M as S}from"./api-COs9-f2c.js";import{c as L}from"./SearchResult-Ca5Y7_RB.js";import{S as s}from"./SearchResultList-Bxkwy__M.js";import{S as q}from"./SearchContext-BoDX1sqx.js";import{L as f}from"./ListItemText-k3L9Vy_V.js";import{H as x}from"./DefaultResultListItem-D4mAZVNJ.js";import{C as j}from"./icons-ITutNf6e.js";import{O as P,a as C}from"./appWrappers-CLPANtMh.js";import{L as w}from"./ListItem-Buq3cft7.js";import{L as A}from"./ListItemIcon-B8gunPsx.js";import{a as _}from"./Plugin-DnYYG5UZ.js";import{S as R}from"./Grid-WTfAUw8g.js";import{L as W}from"./Link-cW_x_JDF.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BA98r_JB.js";import"./useAsync-B8rWFzjm.js";import"./useMountedState-DAwMeOiL.js";import"./lodash-Cb2Wy_9k.js";import"./useElementFilter-DCG6PR3c.js";import"./componentData-CJqc5bGR.js";import"./List-9JTk76WA.js";import"./ListContext-DIjUyL6C.js";import"./translation--wGD0UIq.js";import"./EmptyState-D40kyeHB.js";import"./makeStyles-B1h1_YhU.js";import"./Progress-Rmroe7_Q.js";import"./LinearProgress-XQDvZmf6.js";import"./Box-BC3MKl-R.js";import"./styled-D_n4yIWo.js";import"./ResponseErrorPanel-BQM3Igmx.js";import"./ErrorPanel-BcDhh3BV.js";import"./WarningPanel-dN1V6BvF.js";import"./ExpandMore-DFlqtRQ5.js";import"./AccordionDetails-CbTO_NVi.js";import"./index-B9sM2jn7.js";import"./Collapse-BYtfyYGR.js";import"./MarkdownContent-CKbwgw5B.js";import"./CodeSnippet-Csq5GOND.js";import"./CopyTextButton-T0gZU51y.js";import"./useCopyToClipboard-CNCZlV6X.js";import"./Tooltip-BCMj1SD1.js";import"./useObjectRef-Ca6VrkU_.js";import"./useOverlayTriggerState-Dii3Ei3W.js";import"./utils-BkRQYljw.js";import"./useFocusRing-DjtUFVh9.js";import"./openLink-t121PK8W.js";import"./number-GxmQ5IsF.js";import"./I18nProvider-C1u0qXWv.js";import"./useControlledState-DlMtRXuC.js";import"./animation-HA6bSjMC.js";import"./useHover-enCSdk4y.js";import"./ButtonIcon-DIyhhDx0.js";import"./Button-wALy7eva.js";import"./Label-2RfDNyJG.js";import"./Hidden-0sk5EwaH.js";import"./useLabel-Dbodnstf.js";import"./useLabels-F2kTV9EY.js";import"./useButton-D4mlbzSR.js";import"./usePress-Cxa0w_VA.js";import"./textSelection-D8br12C7.js";import"./index-D1xU2CUz.js";import"./Divider-DDXBFSff.js";import"./useApp-BWXSTOil.js";import"./WebStorage-DG83JirR.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DRdDw7Ks.js";import"./useIsomorphicLayoutEffect-BvvMvZSg.js";import"./BUIProvider-CSwrdwOu.js";import"./useResolvedHref-Bf9C5QCr.js";import"./useRouteRef-X_c0yxs5.js";import"./index-DBBakqER.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
