import{bQ as e,c8 as o,a4 as h}from"./iframe-Bbqeoxyy.js";import{s as y,M as S}from"./api-DB9jU94S.js";import{c as L}from"./SearchResult-DnP77tHk.js";import{S as s}from"./SearchResultList-CJG8n9kf.js";import{S as q}from"./SearchContext-XBRuy8rf.js";import{L as f}from"./ListItemText-lg2s-VSy.js";import{H as x}from"./DefaultResultListItem-XD_bdo2C.js";import{C as j}from"./icons-DgvWxyX7.js";import{O as P,a as C}from"./appWrappers-Cwn0Pqwo.js";import{L as w}from"./ListItem--VGhdB2A.js";import{L as A}from"./ListItemIcon-CLGQMzmW.js";import{a as _}from"./Plugin-DszoB1Sy.js";import{S as R}from"./Grid-DzJPcTRQ.js";import{L as W}from"./Link-Cr34xYgP.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-meCmxkTG.js";import"./useAsync-CpoIPyM5.js";import"./useMountedState-BNNLW-R1.js";import"./lodash-Bx6Dz-vC.js";import"./useElementFilter-DDgOQqoE.js";import"./componentData-BMhuiOL0.js";import"./List-DxT-GkgB.js";import"./ListContext-Cf3kUXlp.js";import"./translation-7SEylcvB.js";import"./EmptyState-CoQu07al.js";import"./makeStyles-DFmhOTr7.js";import"./Progress-BtBSjOaJ.js";import"./LinearProgress-CBzlDTOw.js";import"./Box-BxF7iS_5.js";import"./styled-B7YU-aJo.js";import"./ResponseErrorPanel-szvF5ffN.js";import"./ErrorPanel-BcGDf_vy.js";import"./WarningPanel-BbJx_kd7.js";import"./ExpandMore-DLJ_FpHY.js";import"./AccordionDetails-DDWkg8jt.js";import"./index-B9sM2jn7.js";import"./Collapse-CJjxMxkO.js";import"./MarkdownContent-m8bFswZ4.js";import"./CodeSnippet-DWUHhZ0c.js";import"./CopyTextButton-BZOmoZRL.js";import"./useCopyToClipboard-ODYpAmVN.js";import"./Tooltip-CFwX76yy.js";import"./useObjectRef-Cou_yZVk.js";import"./useOverlayTriggerState-WXzfO5cP.js";import"./utils-DuG_PdhV.js";import"./useFocusRing-CJyvvUb2.js";import"./openLink-DSranXhD.js";import"./number-B0As9b-E.js";import"./I18nProvider-o7BfuMCW.js";import"./useControlledState-Dwmvm7Z8.js";import"./animation-UzooCWZq.js";import"./useHover-8JiRj4U9.js";import"./ButtonIcon-bZXMNDvR.js";import"./Button-DBxI9neY.js";import"./Label-BYZanQTo.js";import"./Hidden-wfkm4vEc.js";import"./useLabel-CueqYSAw.js";import"./useLabels-CD6Jijpq.js";import"./useButton-CP9W9vY-.js";import"./usePress-DupziYu-.js";import"./textSelection-CSZvk6XP.js";import"./index-CWg0XmG9.js";import"./Divider-CjIx6zL2.js";import"./useApp-D-XDRZX8.js";import"./WebStorage-CklWyxiV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-ByLRTfPO.js";import"./useIsomorphicLayoutEffect-BmZ68710.js";import"./BUIProvider-BFo_P3jr.js";import"./BUIRoutingProvider-DBaglhBD.js";import"./useResolvedHref-Bglto435.js";import"./useRouteRef-B4gE6065.js";import"./index-KzxoBRt_.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const rt=["Default","WithQuery","Loading","WithError","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{n as Default,c as Loading,p as WithCustomNoResultsComponent,l as WithCustomResultItem,m as WithDefaultNoResultsComponent,u as WithError,a as WithQuery,d as WithResultItemExtensions,rt as __namedExportsOrder,tt as default};
