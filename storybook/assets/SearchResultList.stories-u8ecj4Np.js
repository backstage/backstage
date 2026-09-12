import{bQ as e,c8 as o,a4 as h}from"./iframe-Di5Wv8w_.js";import{s as y,M as S}from"./api-sFd1mE6G.js";import{c as L}from"./SearchResult-BW1WNw5x.js";import{S as s}from"./SearchResultList-EzV0Fhz6.js";import{S as q}from"./SearchContext-BcZY2Teg.js";import{L as f}from"./ListItemText-Dap07-T7.js";import{H as x}from"./DefaultResultListItem-C2LkjOu9.js";import{C as j}from"./icons-B5Xkc5li.js";import{O as P,a as C}from"./appWrappers-CMr_hN3J.js";import{L as w}from"./ListItem-Ct7mIZpE.js";import{L as A}from"./ListItemIcon--p8LLqy0.js";import{a as _}from"./Plugin-mvxujrYQ.js";import{S as R}from"./Grid-D2BXyWtR.js";import{L as W}from"./Link-C0kM2CWc.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-B3tqbWl4.js";import"./useAsync-BD13rqvr.js";import"./useMountedState-BBb1bjBJ.js";import"./lodash-DWZxpKTZ.js";import"./useElementFilter-B9nZuPgx.js";import"./componentData-DrgMeFFe.js";import"./List-DO8RbCmD.js";import"./ListContext-B1eYXRXz.js";import"./translation-B-h6IM3Q.js";import"./EmptyState-CMMbmDSe.js";import"./makeStyles-D-4gmWAY.js";import"./Progress-Zv7HrJub.js";import"./LinearProgress-7acxQB56.js";import"./Box-6skH1RcB.js";import"./styled-BQfLikGu.js";import"./ResponseErrorPanel-7BSyuHC1.js";import"./ErrorPanel-CDwn1Hrm.js";import"./WarningPanel-CjS9JdM2.js";import"./ExpandMore-D5FtygCV.js";import"./AccordionDetails-DCohjdjE.js";import"./index-B9sM2jn7.js";import"./Collapse-BePVl3gM.js";import"./MarkdownContent-BgyzCdaC.js";import"./CodeSnippet-C3q3rE7D.js";import"./CopyTextButton-B3yQMEnv.js";import"./useCopyToClipboard-xoGrWAxd.js";import"./Tooltip-kTdyksyc.js";import"./useObjectRef-VfTF6kKY.js";import"./useOverlayTriggerState-BbiImD-e.js";import"./utils-B6tfyu-3.js";import"./useFocusRing-BPuyfxah.js";import"./openLink-BAk59qtu.js";import"./number-CGr55I-p.js";import"./I18nProvider-Dxi4hkuu.js";import"./useControlledState-BMloOWSe.js";import"./animation-DXfiyiY4.js";import"./useHover-BfN1GoIh.js";import"./ButtonIcon-CeqKDHWs.js";import"./Button-CUbHo8av.js";import"./Label-C3XyxUp7.js";import"./Hidden-CQX9C-br.js";import"./useLabel-CGVvVLBl.js";import"./useLabels-B0juHqyU.js";import"./useButton-BchjX23Y.js";import"./usePress-C2lMTGjY.js";import"./textSelection-D0hNc5Yy.js";import"./index-C_LMY1zh.js";import"./Divider-BG9n4Dr2.js";import"./useApp-WmaZUnnG.js";import"./WebStorage-BtLuZibV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-Dk8LjG0k.js";import"./useIsomorphicLayoutEffect-B-vw5MeX.js";import"./BUIProvider-DydDATQP.js";import"./BUIRoutingProvider-B9l2I63u.js";import"./useResolvedHref-CvA6lHFs.js";import"./useRouteRef-D3v5ZTU6.js";import"./index-BE_MD4Ey.js";const v=C({id:"storybook.search.results.list.route"}),N=new S({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),tt={title:"Plugins/Search/SearchResultList",component:s,decorators:[t=>P(e.jsx(h,{apis:[[y,N]],children:e.jsx(R,{container:!0,direction:"row",children:e.jsx(R,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":v}})],tags:["!manifest"]},n=()=>e.jsx(q,{children:e.jsx(s,{})}),a=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(s,{query:t})},c=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{})}]],children:e.jsx(s,{query:t})})},u=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(s,{query:t})})},m=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t})})},p=()=>{const[t]=o.useState({types:["techdocs"]});return e.jsx(h,{apis:[[y,new S]],children:e.jsx(s,{query:t,noResultsComponent:e.jsx(f,{primary:"No results were found"})})})},D=t=>{const{icon:i,result:r}=t;return e.jsx(W,{to:r.location,children:e.jsxs(w,{alignItems:"flex-start",divider:!0,children:[i&&e.jsx(A,{children:i}),e.jsx(f,{primary:r.title,primaryTypographyProps:{variant:"h6"},secondary:r.text})]})})},l=()=>{const[t]=o.useState({types:["custom"]});return e.jsx(s,{query:t,renderResultItem:({type:i,document:r,highlight:g,rank:I})=>i==="custom"?e.jsx(D,{icon:e.jsx(j,{}),result:r,highlight:g,rank:I},r.location):e.jsx(x,{result:r},r.location)})},d=()=>{const[t]=o.useState({types:["techdocs"]}),r=_({id:"plugin"}).provide(L({name:"DefaultResultListItem",component:async()=>x}));return e.jsx(s,{query:t,children:e.jsx(r,{})})};n.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};c.__docgenInfo={description:"",methods:[],displayName:"Loading"};u.__docgenInfo={description:"",methods:[],displayName:"WithError"};m.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};d.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
