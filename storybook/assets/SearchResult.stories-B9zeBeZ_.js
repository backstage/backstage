import{aP as I,aQ as L,aR as S,aS as j,aE as g,j as t,a2 as D}from"./iframe-BOELprFv.js";import{c as f,D as v}from"./InsertDriveFile-BqIoB2u7.js";import{s as C,M as _}from"./api-VTpynOT_.js";import{S as o,c as k}from"./SearchResult-DzznjvKe.js";import{L as R}from"./List-j_RiqkVh.js";import{H as n}from"./DefaultResultListItem-HwfNHCmK.js";import{a as N}from"./SearchResultList-CJ5VSHVV.js";import{w as q}from"./appWrappers-CEl2Ow7o.js";import{L as w}from"./ListItem-ByTdyqTk.js";import{c as E}from"./Plugin-CSZJYMuj.js";import{S as A}from"./SearchContext-XCyLugQa.js";import{L as W}from"./Link-BwYnYGUx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B2u1vAKH.js";import"./Add-BVbnWBDr.js";import"./ArrowForwardIos-D3ZU5jGt.js";import"./translation-BwbvaU23.js";import"./useAnalytics-BJhOaRVB.js";import"./Select-SuEW4Z4L.js";import"./index-B9sM2jn7.js";import"./Popover-Cr3nyACi.js";import"./Modal-BJvjIkRj.js";import"./Portal-DWJfagAU.js";import"./formControlState-D3tH8cjE.js";import"./MenuItem-B0o8WK2K.js";import"./ListSubheader-gAAkbWvj.js";import"./Chip-BbhJQ5Fv.js";import"./makeStyles-CSWS6G8b.js";import"./EmptyState-DHk_Bh53.js";import"./Grid-CH5PqTNF.js";import"./Progress-Bm5vgsbo.js";import"./LinearProgress-Elx0sqSC.js";import"./Box-DfaVDnxz.js";import"./styled-B9TjYplk.js";import"./ResponseErrorPanel-Bi4VGTVu.js";import"./ErrorPanel-BX4gje7O.js";import"./WarningPanel-gBQydIWZ.js";import"./ExpandMore-CeVFAaVG.js";import"./AccordionDetails-DJi0nM9u.js";import"./Collapse-Bi9pfq6r.js";import"./MarkdownContent-CU1C2Ktg.js";import"./CodeSnippet-CSsor0Bd.js";import"./CopyTextButton-DnL4XEYg.js";import"./useCopyToClipboard-lbUBEzRz.js";import"./useMountedState-B_d8GdoW.js";import"./Tooltip-CNoLi4pN.js";import"./Popper-ehh25wyz.js";import"./ListItemText-DFIr4HdJ.js";import"./ListContext-IUdz5Dmy.js";import"./Divider-CYs6LHZd.js";import"./useAsync-DhMveIGN.js";import"./lodash-DvkL6iKH.js";import"./useElementFilter-8r9t1fC7.js";import"./componentData-DXRZVCfF.js";import"./ListItemIcon-BTcHpD-9.js";import"./WebStorage-Ck90zCQN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CDnTt6Oa.js";import"./useIsomorphicLayoutEffect-DcG3e63B.js";import"./useApp-7Kwzc3rd.js";import"./BUIProvider-BVnThpam.js";import"./openLink-OWDAQw2O.js";import"./useResolvedHref-BWB2xz1Y.js";import"./useRouteRef-CcqJk9jr.js";import"./index-B4exrKOF.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};
