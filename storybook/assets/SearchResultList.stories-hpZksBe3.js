import{j as e,r as o,X as h}from"./iframe-bb_jNxxL.js";import{s as y,M as S}from"./api-5h9TKDvy.js";import{c as L}from"./SearchResult-DOa-zG9v.js";import{S as s}from"./SearchResultList-BToRx_lY.js";import{S as q}from"./SearchContext-bLZShiWZ.js";import{L as f}from"./ListItemText-h_XmDgas.js";import{H as x}from"./DefaultResultListItem-Dsl6fX2u.js";import{C as j}from"./icons-tcKdi4rO.js";import{w as P,c as C}from"./appWrappers-BbEhkavX.js";import{L as w}from"./ListItem-BW0PV3ll.js";import{L as A}from"./ListItemIcon-B263LN9-.js";import{c as _}from"./Plugin-CzXt5oxY.js";import{S as R}from"./Grid-BTQv340N.js";import{L as W}from"./Link-BhEUyXEZ.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BwMaIldS.js";import"./useAsync-TRDsFk28.js";import"./useMountedState-COkifDVC.js";import"./lodash-CwxrZd2c.js";import"./useElementFilter-DY3cwT9p.js";import"./componentData-BL_B3cjh.js";import"./List-BoIjCh7L.js";import"./ListContext-oQxTFKFx.js";import"./translation-HxwCKQ5S.js";import"./EmptyState-efObLrLh.js";import"./makeStyles-CgTSz4WE.js";import"./Progress-vIr_oIj8.js";import"./LinearProgress-KCoz6Pow.js";import"./Box-DOhXTkmR.js";import"./styled-Bf8yAc5R.js";import"./ResponseErrorPanel-B1SgnZz8.js";import"./ErrorPanel-BV0RjseS.js";import"./WarningPanel-CHsT-ENQ.js";import"./ExpandMore-DJjOoNS8.js";import"./AccordionDetails-DTiGxQIY.js";import"./index-B9sM2jn7.js";import"./Collapse-C1vt9U0h.js";import"./MarkdownContent-Chp8Woi7.js";import"./CopyTextButton-B7qnFsel.js";import"./useCopyToClipboard-CmNq9oJ2.js";import"./Tooltip-BiZdYZQM.js";import"./useObjectRef-CTDjzFB8.js";import"./useOverlayTriggerState-Cwdw0na1.js";import"./utils-Cyge8L4m.js";import"./useFocusRing-DDqjVrJn.js";import"./number-DwC5Q0g4.js";import"./I18nProvider-B9G7Dj3y.js";import"./useControlledState-B45Nf08u.js";import"./animation-BLiFJPlN.js";import"./useHover-dfqWQZHs.js";import"./ButtonIcon-D9OaYA-z.js";import"./Button-B0WaVeZf.js";import"./Label-C64Zc2HQ.js";import"./Hidden-7ff-isZb.js";import"./useLabel-DvDKUI6U.js";import"./useLabels-B5_kFWwx.js";import"./useButton-Dgm20RBw.js";import"./usePress-iPbewX15.js";import"./textSelection-DLp-xbkE.js";import"./getMetaValue-BAPq9Qsv.js";import"./index-gvfFGbLs.js";import"./Divider-BI-7TC7K.js";import"./CodeSnippet-CE86ZW0y.js";import"./useApp-BYyXk-4Q.js";import"./index-B6EXqJ8A.js";import"./WebStorage-Bt9Lic2H.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DnkvtyWr.js";import"./useIsomorphicLayoutEffect-duTqWr5A.js";import"./BUIProvider-3fANo4od.js";import"./useRouteRef-CxgSV8i1.js";import"./index-dQxF3Oj4.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
