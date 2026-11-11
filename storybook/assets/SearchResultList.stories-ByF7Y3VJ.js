import{j as e,r as o,X as h}from"./iframe-CEdcshkh.js";import{s as y,M as S}from"./api-APEHDTJD.js";import{c as L}from"./SearchResult-WxeqGWzF.js";import{S as s}from"./SearchResultList-DVCUMdp4.js";import{S as q}from"./SearchContext-DO6BZyDs.js";import{L as f}from"./ListItemText-D2eIuV1L.js";import{H as x}from"./DefaultResultListItem-2Yj4-SP0.js";import{C as j}from"./icons-soZZau2p.js";import{w as P,c as C}from"./appWrappers-BBH5xAWV.js";import{L as w}from"./ListItem-G31fJH_u.js";import{L as A}from"./ListItemIcon-56AeOtKm.js";import{c as _}from"./Plugin-BYGw_lsR.js";import{S as R}from"./Grid-Cg_-Bg10.js";import{L as W}from"./Link-D32Zgqnn.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BKVYJGWd.js";import"./useAsync-CzMjBL1F.js";import"./useMountedState-ClsGneNr.js";import"./lodash-DpFEZWQS.js";import"./useElementFilter-m8CDngsL.js";import"./componentData-D9myZqiB.js";import"./List-Sn2FWo5J.js";import"./ListContext-DS5F4hFB.js";import"./translation-DABKEXEC.js";import"./EmptyState-dcQgVYw3.js";import"./makeStyles-1bD4tTRg.js";import"./Progress-BB3llOZy.js";import"./LinearProgress-yqvcxgyC.js";import"./Box-U2ogRZ16.js";import"./styled-BnWtJPbf.js";import"./ResponseErrorPanel-Bxgyafl_.js";import"./ErrorPanel-CamVLn4e.js";import"./WarningPanel-Dmuu57Pn.js";import"./ExpandMore-SNQoBKIF.js";import"./AccordionDetails-BBPsCRMd.js";import"./index-B9sM2jn7.js";import"./Collapse-BngPqMFp.js";import"./MarkdownContent-Dn21_Bly.js";import"./CopyTextButton-DZHfnr63.js";import"./useCopyToClipboard-kbvtY6SN.js";import"./Tooltip-DfjSVAXc.js";import"./useObjectRef-Cea8mF9S.js";import"./useOverlayTriggerState-BX1potNy.js";import"./utils-B3z3rPQ3.js";import"./useFocusRing-CKR_B2iC.js";import"./number-tjQdiso3.js";import"./I18nProvider-GWcSS_jn.js";import"./useControlledState-CY36eiiU.js";import"./animation-NCXLQN6E.js";import"./useHover-C0ptGV0J.js";import"./ButtonIcon-Bk-ZEocg.js";import"./Button-Cztc6Ql0.js";import"./Label-9Olhdt6S.js";import"./Hidden-nn8Lz43U.js";import"./useLabel-BWFl0EGX.js";import"./useLabels-B11tK9ex.js";import"./useButton-DltJ2Eig.js";import"./usePress-CLU-UWu1.js";import"./textSelection-WSwNKXEc.js";import"./getMetaValue-BMvIIQYf.js";import"./index-Bowgs7Nu.js";import"./Divider-B9eEyIik.js";import"./CodeSnippet-DqEPYshT.js";import"./useApp-Bnf2R7wN.js";import"./index-BMdILVLE.js";import"./WebStorage-C2_QJQqP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-C1TtzoqD.js";import"./useIsomorphicLayoutEffect-CfgkDWqJ.js";import"./BUIProvider-BnOYjhiQ.js";import"./useRouteRef-CN_ngary.js";import"./index-CITjFLh0.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
