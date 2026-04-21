import{aN as I,aO as L,aP as S,aQ as j,aD as g,j as t,a1 as D}from"./iframe-V0mCSmm6.js";import{c as f,D as v}from"./InsertDriveFile-CwMOiHS7.js";import{s as C,M as _}from"./api-DkbhmyCo.js";import{S as o,c as N}from"./SearchResult-BBVMYiY8.js";import{L as R}from"./List-DoUtMqL3.js";import{H as n}from"./DefaultResultListItem-Bg_1Ud00.js";import{a as k}from"./SearchResultList-7uJpqfGP.js";import{w as q}from"./appWrappers-ydvT4hD9.js";import{L as w}from"./ListItem-UEfIFqBO.js";import{c as A}from"./Plugin-B9VenLT5.js";import{S as E}from"./SearchContext-DJrQtk6p.js";import{L as W}from"./Link-C8jjCA1D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CT0NTjK3.js";import"./Add-PFRl6Toc.js";import"./ArrowForwardIos-zkxyyPGH.js";import"./translation-ztVbYstm.js";import"./useAnalytics-DfdyZRyp.js";import"./Select-DG-bZp9u.js";import"./index-B9sM2jn7.js";import"./Popover-D6I6p0LS.js";import"./Modal-BnW_oUOG.js";import"./Portal-CVJVAyEW.js";import"./formControlState-BmtXmnvT.js";import"./MenuItem-CQw_qvLE.js";import"./ListSubheader-CaCe0ZvP.js";import"./Chip-BCbGhA2a.js";import"./makeStyles-C-ZAQBJP.js";import"./EmptyState-CFgQ6t3B.js";import"./Grid-B05O9SBT.js";import"./Progress-ar9qm9er.js";import"./LinearProgress-RZLNKwN8.js";import"./Box-BQ6A2zHk.js";import"./styled-jbaTKMHC.js";import"./ResponseErrorPanel-BrG44iWY.js";import"./ErrorPanel-DKqsc9IJ.js";import"./WarningPanel-Ccz4x3xp.js";import"./ExpandMore-CbnyxO-3.js";import"./AccordionDetails-I2vjSAo4.js";import"./Collapse-B0zJCXOI.js";import"./MarkdownContent-BpLNTF6C.js";import"./CodeSnippet-DND1j3mO.js";import"./CopyTextButton-DU42pp83.js";import"./useCopyToClipboard-C2Z7cgqI.js";import"./useMountedState-C0Jd0rHY.js";import"./Tooltip-DNCzzYek.js";import"./Popper-BF5YkCw8.js";import"./ListItemText-DAqxhx2l.js";import"./ListContext-B-_4E_oo.js";import"./Divider-CiNTCJQO.js";import"./useAsync-DVSYYuK0.js";import"./lodash-DiH-Fmp9.js";import"./useElementFilter-DTFKW1gd.js";import"./componentData-Dw75x8hF.js";import"./ListItemIcon-D9SwA85G.js";import"./WebStorage-CkDvSLB8.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-GEOeEmbu.js";import"./useIsomorphicLayoutEffect-7ayzRy9d.js";import"./useApp-BhakDC8j.js";import"./BUIProvider-D-6HxlFM.js";import"./openLink-C69Yx9MB.js";import"./useRouteRef-DW6ibuu0.js";import"./index-BftmwaLS.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),Zt={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(k,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(N({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...d.parameters?.docs?.source}}};const $t=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,$t as __namedExportsOrder,Zt as default};
