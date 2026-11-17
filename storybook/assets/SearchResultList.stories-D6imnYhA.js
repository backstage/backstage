import{j as e,r as o,X as h}from"./iframe-Czj8FpnD.js";import{s as y,M as S}from"./api-1Xk9C035.js";import{c as L}from"./SearchResult-BB9Ohy-Y.js";import{S as s}from"./SearchResultList-BLQ93-Xy.js";import{S as q}from"./SearchContext-BMb5KSef.js";import{L as f}from"./ListItemText-CExtKkWv.js";import{H as x}from"./DefaultResultListItem-C3xZa83x.js";import{C as j}from"./icons-Bt04087f.js";import{w as P,c as C}from"./appWrappers-DEViVHj_.js";import{L as w}from"./ListItem-CckUwNqO.js";import{L as A}from"./ListItemIcon-OmSOrp3e.js";import{c as _}from"./Plugin-B8Z9loEX.js";import{S as R}from"./Grid-DIMgJpwW.js";import{L as W}from"./Link-n7xySPGa.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-yVJ1Dxzq.js";import"./useAsync-BmHwdEWF.js";import"./useMountedState-vyNKaWGu.js";import"./lodash-C1WtViFu.js";import"./useElementFilter-ByxUm4_K.js";import"./componentData-Pl94iQU9.js";import"./List-DZtaOPeh.js";import"./ListContext-DjY1Lg1l.js";import"./translation-8nTVBmd_.js";import"./EmptyState-CovRjmiN.js";import"./makeStyles-CFi4fJAr.js";import"./Progress-Bv7NRxMq.js";import"./LinearProgress-qZcacrJF.js";import"./Box-CpxpfSAX.js";import"./styled-PK73AnSt.js";import"./ResponseErrorPanel-C3SuF34z.js";import"./ErrorPanel-CwtJA1hm.js";import"./WarningPanel-DZvJxQfy.js";import"./ExpandMore-D8WejM5t.js";import"./AccordionDetails-BO48btiP.js";import"./index-B9sM2jn7.js";import"./Collapse-Cyk-VDZc.js";import"./MarkdownContent-CXWp1uZN.js";import"./CopyTextButton-B8MZ6iDF.js";import"./useCopyToClipboard-CDjnk5fm.js";import"./Tooltip-ClVCahfe.js";import"./useObjectRef-CyY6Q9V8.js";import"./useOverlayTriggerState-2rMwEAbI.js";import"./utils-Cs3-rVue.js";import"./useFocusRing-CwUtzNaZ.js";import"./number-BSntpDAw.js";import"./I18nProvider-DcvSd-3L.js";import"./useControlledState-BUpBSTwT.js";import"./animation-DTzXe6sA.js";import"./useHover-DmfU1sNI.js";import"./ButtonIcon-CpDPbKJJ.js";import"./Button-WAnZG6Vk.js";import"./Label-Blh7v6VS.js";import"./Hidden-D92ts2Xi.js";import"./useLabel-v9mJauUl.js";import"./useLabels-CAcUUNYA.js";import"./useButton-DuqPYhB5.js";import"./usePress-BgiTNIgt.js";import"./textSelection-YqIZsSWD.js";import"./getMetaValue-DkJYbvS7.js";import"./index-BCAPzNLa.js";import"./Divider-DvRCmGd1.js";import"./CodeSnippet-DYG555LD.js";import"./useApp-CmVnEtRW.js";import"./index-BCJhT9-Z.js";import"./WebStorage-DPLipu3o.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CohdTpxD.js";import"./useIsomorphicLayoutEffect-BmCQ-fHU.js";import"./BUIProvider-OJJxz-jo.js";import"./useRouteRef-BjF1yfEL.js";import"./index-DU-eUBoq.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
