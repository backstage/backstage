import{j as e,r as o,X as h}from"./iframe-C8V0qqb2.js";import{s as y,M as S}from"./api-Dv0pHc3R.js";import{c as L}from"./SearchResult-828VfDRI.js";import{S as s}from"./SearchResultList-BHUuyww7.js";import{S as q}from"./SearchContext-CyOV-sve.js";import{L as f}from"./ListItemText-DBHwkh11.js";import{H as x}from"./DefaultResultListItem-CER0zIgF.js";import{C as j}from"./icons-BZZfcAAK.js";import{w as P,c as C}from"./appWrappers-Du3WPhLE.js";import{L as w}from"./ListItem-B4iIr574.js";import{L as A}from"./ListItemIcon-pqt2YaS-.js";import{c as _}from"./Plugin-I93RwQeV.js";import{S as R}from"./Grid-Bra3ttwr.js";import{L as W}from"./Link-CFUengML.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-BaF9kBhr.js";import"./useAsync-B2DL7Fhv.js";import"./useMountedState-BDtTrzLo.js";import"./lodash-Bfj4pupQ.js";import"./useElementFilter-xXtYfJrB.js";import"./componentData-CT4PJCGx.js";import"./List-8dxWFdZv.js";import"./ListContext-B_b5Xi-t.js";import"./translation-D_arCQn5.js";import"./EmptyState-BgClUdqJ.js";import"./makeStyles-DfmVTKxZ.js";import"./Progress-CyT6PsXM.js";import"./LinearProgress-CoDcAbms.js";import"./Box-BUiGTdjP.js";import"./styled-CMImJkv9.js";import"./ResponseErrorPanel-Cj2pPShW.js";import"./ErrorPanel-DcKrcHGp.js";import"./WarningPanel-B6H3uDj5.js";import"./ExpandMore-BEGfQHca.js";import"./AccordionDetails-C8DFRaIm.js";import"./index-B9sM2jn7.js";import"./Collapse-CuILcLVb.js";import"./MarkdownContent-1akESRxY.js";import"./CopyTextButton-B2kdCxbq.js";import"./useCopyToClipboard-DwdVisi8.js";import"./Tooltip-Cd1w41ri.js";import"./useObjectRef-Bmpa_pzq.js";import"./useOverlayTriggerState-BJpvAEhl.js";import"./utils-D2G7Gr3-.js";import"./useFocusRing-A5enshti.js";import"./number-BQr42Lr5.js";import"./I18nProvider-Cjl-_wzY.js";import"./useControlledState-CSkhWUnX.js";import"./animation-CQDNL3hS.js";import"./useHover-BM2aAfmJ.js";import"./ButtonIcon-BcbsxwMp.js";import"./Button-BEmepp9I.js";import"./Label-lDwdRkmF.js";import"./Hidden-DiQ-sckr.js";import"./useLabel-Du92kFjZ.js";import"./useLabels-D_iZwDzY.js";import"./useButton-dvUW2Qss.js";import"./usePress-DxDbMcWz.js";import"./textSelection-DSE97Rz3.js";import"./getMetaValue-Cs0hmg7u.js";import"./index-X2scoYBO.js";import"./Divider-BtpOfOJ_.js";import"./CodeSnippet-SUEWJKAF.js";import"./useApp-BS939v7w.js";import"./index-CZTs28Z5.js";import"./WebStorage-D6-Ndaj_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DR0cpYN2.js";import"./useIsomorphicLayoutEffect-WT48KY4c.js";import"./BUIProvider-sHU7Fnoa.js";import"./useRouteRef-BcoyzpFr.js";import"./index-FQMFZsiD.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),et={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
