import{j as e,r as s,a1 as D}from"./iframe-V0mCSmm6.js";import{S as o,D as i,a as _,b as G}from"./InsertDriveFile-CwMOiHS7.js";import{s as F,M as w}from"./api-DkbhmyCo.js";import{c as Q}from"./SearchResult-BBVMYiY8.js";import{S as A}from"./SearchContext-DJrQtk6p.js";import{L}from"./ListItemText-DAqxhx2l.js";import{M as q}from"./MenuItem-CQw_qvLE.js";import{w as N,c as b}from"./appWrappers-ydvT4hD9.js";import{L as T}from"./ListItem-UEfIFqBO.js";import{L as E}from"./ListItemIcon-D9SwA85G.js";import{c as M}from"./Plugin-B9VenLT5.js";import{H as O}from"./DefaultResultListItem-Bg_1Ud00.js";import{S as P}from"./Grid-B05O9SBT.js";import{L as H}from"./Link-C8jjCA1D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CT0NTjK3.js";import"./Add-PFRl6Toc.js";import"./ArrowForwardIos-zkxyyPGH.js";import"./translation-ztVbYstm.js";import"./useAnalytics-DfdyZRyp.js";import"./Select-DG-bZp9u.js";import"./index-B9sM2jn7.js";import"./Popover-D6I6p0LS.js";import"./Modal-BnW_oUOG.js";import"./Portal-CVJVAyEW.js";import"./List-DoUtMqL3.js";import"./ListContext-B-_4E_oo.js";import"./formControlState-BmtXmnvT.js";import"./ListSubheader-CaCe0ZvP.js";import"./Chip-BCbGhA2a.js";import"./makeStyles-C-ZAQBJP.js";import"./EmptyState-CFgQ6t3B.js";import"./Progress-ar9qm9er.js";import"./LinearProgress-RZLNKwN8.js";import"./Box-BQ6A2zHk.js";import"./styled-jbaTKMHC.js";import"./ResponseErrorPanel-BrG44iWY.js";import"./ErrorPanel-DKqsc9IJ.js";import"./WarningPanel-Ccz4x3xp.js";import"./ExpandMore-CbnyxO-3.js";import"./AccordionDetails-I2vjSAo4.js";import"./Collapse-B0zJCXOI.js";import"./MarkdownContent-BpLNTF6C.js";import"./CodeSnippet-DND1j3mO.js";import"./CopyTextButton-DU42pp83.js";import"./useCopyToClipboard-C2Z7cgqI.js";import"./useMountedState-C0Jd0rHY.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";import"./Divider-CiNTCJQO.js";import"./useAsync-DVSYYuK0.js";import"./lodash-DiH-Fmp9.js";import"./useElementFilter-DTFKW1gd.js";import"./componentData-Dw75x8hF.js";import"./WebStorage-CkDvSLB8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-GEOeEmbu.js";import"./useIsomorphicLayoutEffect-7ayzRy9d.js";import"./useApp-BhakDC8j.js";import"./BUIProvider-D-6HxlFM.js";import"./openLink-C69Yx9MB.js";import"./useRouteRef-DW6ibuu0.js";import"./index-BftmwaLS.js";const J=b({id:"storybook.search.results.group.route"}),V=new w({results:[{type:"techdocs",document:{location:"search/search-result1",title:"Search Result 1",text:"Some text from the search result 1"}},{type:"custom",document:{location:"search/search-result2",title:"Search Result 2",text:"Some text from the search result 2"}}]}),ot={title:"Plugins/Search/SearchResultGroup",component:o,decorators:[t=>N(e.jsx(D,{apis:[[F,V]],children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})}),{mountedRoutes:{"/":J}})],tags:["!manifest"]},m=()=>e.jsx(A,{children:e.jsx(o,{icon:e.jsx(i,{}),title:"Documentation"})}),d=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})},h=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},y=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,{query:()=>new Promise(()=>{throw new Error})}]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},S=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",titleProps:{color:"secondary"}})},f=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",linkProps:{to:"/custom"}})},x=()=>{const[t,n]=s.useState({types:["software-catalog"]}),c=[{label:"Lifecycle",value:"lifecycle"},{label:"Owner",value:"owner"}],C=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u,[r]:void 0};return{...p,filters:a}})},[]),j=s.useCallback(r=>l=>{n(u=>{const{filters:p,...a}=u,W={...p,[r]:l};return{...a,filters:W}})},[]),k=s.useCallback(r=>()=>{n(l=>{const{filters:u,...p}=l,a={...u};return delete a[r],{...p,filters:a}})},[]);return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",filterOptions:c,renderFilterOption:r=>e.jsx(q,{onClick:C(r.value),children:r.label},r.value),renderFilterField:r=>{switch(r){case"lifecycle":return e.jsxs(G,{label:"Lifecycle",value:t.filters?.lifecycle,onChange:j("lifecycle"),onDelete:k("lifecycle"),children:[e.jsx(q,{value:"production",children:"Production"}),e.jsx(q,{value:"experimental",children:"Experimental"})]},r);case"owner":return e.jsx(_,{label:"Owner",value:t.filters?.owner,onChange:j("owner"),onDelete:k("owner")},r);default:return null}}})},R=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation"})})},g=()=>{const[t]=s.useState({types:["techdocs"]});return e.jsx(D,{apis:[[F,new w]],children:e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",noResultsComponent:e.jsx(L,{primary:"No results were found"})})})},z=t=>{const{icon:n,result:c}=t;return e.jsx(H,{to:c.location,children:e.jsxs(T,{alignItems:"flex-start",divider:!0,children:[n&&e.jsx(E,{children:n}),e.jsx(L,{primary:c.title,primaryTypographyProps:{variant:"h6"},secondary:c.text})]})})},I=()=>{const[t]=s.useState({types:["custom"]});return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Custom",link:"See all custom results",renderResultItem:({document:n,highlight:c,rank:C})=>e.jsx(z,{result:n,highlight:c,rank:C},n.location)})},v=()=>{const[t]=s.useState({types:["techdocs"]}),c=M({id:"plugin"}).provide(Q({name:"DefaultResultListItem",component:async()=>O}));return e.jsx(o,{query:t,icon:e.jsx(i,{}),title:"Documentation",children:e.jsx(c,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};d.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};h.__docgenInfo={description:"",methods:[],displayName:"Loading"};y.__docgenInfo={description:"",methods:[],displayName:"WithError"};S.__docgenInfo={description:"",methods:[],displayName:"WithCustomTitle"};f.__docgenInfo={description:"",methods:[],displayName:"WithCustomLink"};x.__docgenInfo={description:"",methods:[],displayName:"WithFilters"};R.__docgenInfo={description:"",methods:[],displayName:"WithDefaultNoResultsComponent"};g.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};I.__docgenInfo={description:"",methods:[],displayName:"WithCustomResultItem"};v.__docgenInfo={description:"",methods:[],displayName:"WithResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  return <SearchContextProvider>
      <SearchResultGroup icon={<DocsIcon />} title="Documentation" />
    </SearchContextProvider>;
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />;
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {})
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, {
    query: () => new Promise<SearchResultSet>(() => {
      throw new Error();
    })
  }]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" titleProps={{
    color: 'secondary'
  }} />;
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" linkProps={{
    to: '/custom'
  }} />;
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`() => {
  const [query, setQuery] = useState<Partial<SearchQuery>>({
    types: ['software-catalog']
  });
  const filterOptions = [{
    label: 'Lifecycle',
    value: 'lifecycle'
  }, {
    label: 'Owner',
    value: 'owner'
  }];
  const handleFilterAdd = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: undefined
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterChange = useCallback((key: string) => (value: JsonValue) => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters,
        [key]: value
      };
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  const handleFilterDelete = useCallback((key: string) => () => {
    setQuery(prevQuery => {
      const {
        filters: prevFilters,
        ...rest
      } = prevQuery;
      const newFilters = {
        ...prevFilters
      };
      delete newFilters[key];
      return {
        ...rest,
        filters: newFilters
      };
    });
  }, []);
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" filterOptions={filterOptions} renderFilterOption={option => <MenuItem key={option.value} onClick={handleFilterAdd(option.value)}>
          {option.label}
        </MenuItem>} renderFilterField={(key: string) => {
    switch (key) {
      case 'lifecycle':
        return <SearchResultGroupSelectFilterField key={key} label="Lifecycle" value={query.filters?.lifecycle} onChange={handleFilterChange('lifecycle')} onDelete={handleFilterDelete('lifecycle')}>
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="experimental">Experimental</MenuItem>
              </SearchResultGroupSelectFilterField>;
      case 'owner':
        return <SearchResultGroupTextFilterField key={key} label="Owner" value={query.filters?.owner} onChange={handleFilterChange('owner')} onDelete={handleFilterDelete('owner')} />;
      default:
        return null;
    }
  }} />;
}`,...x.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" />
    </TestApiProvider>;
}`,...R.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  return <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
      <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation" noResultsComponent={<ListItemText primary="No results were found" />} />
    </TestApiProvider>;
}`,...g.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['custom']
  });
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Custom" link="See all custom results" renderResultItem={({
    document,
    highlight,
    rank
  }) => <CustomResultListItem key={document.location} result={document} highlight={highlight} rank={rank} />} />;
}`,...I.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => {
  const [query] = useState<Partial<SearchQuery>>({
    types: ['techdocs']
  });
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultSearchResultGroupItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResultGroup query={query} icon={<DocsIcon />} title="Documentation">
      <DefaultSearchResultGroupItem />
    </SearchResultGroup>;
}`,...v.parameters?.docs?.source}}};const it=["Default","WithQuery","Loading","WithError","WithCustomTitle","WithCustomLink","WithFilters","WithDefaultNoResultsComponent","WithCustomNoResultsComponent","WithCustomResultItem","WithResultItemExtensions"];export{m as Default,h as Loading,f as WithCustomLink,g as WithCustomNoResultsComponent,I as WithCustomResultItem,S as WithCustomTitle,R as WithDefaultNoResultsComponent,y as WithError,x as WithFilters,d as WithQuery,v as WithResultItemExtensions,it as __namedExportsOrder,ot as default};
