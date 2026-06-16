import{cf as I,cg as L,cj as S,ce as j,bu as g,bR as t,a5 as D}from"./iframe-A5q7KvPV.js";import{a as f,D as v}from"./InsertDriveFile-CdSdydVs.js";import{s as C,M as _}from"./api-DY5NJNHK.js";import{S as o,c as k}from"./SearchResult-CKuNu2H_.js";import{L as R}from"./List-BHb0DGH0.js";import{H as n}from"./DefaultResultListItem-CI-5FSPD.js";import{a as N}from"./SearchResultList-C5QURT8a.js";import{O as q}from"./appWrappers-BjWfYF9M.js";import{L as w}from"./ListItem-CLjawmK4.js";import{a as A}from"./Plugin-DAJ_YWFd.js";import{S as E}from"./SearchContext-BGFENsFy.js";import{L as W}from"./Link-BMgV47st.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CK16TDpQ.js";import"./Add-B42hFfy-.js";import"./ArrowForwardIos-BCXjTW1F.js";import"./translation-CAGjbybP.js";import"./useAnalytics-Ds2gUWuY.js";import"./Select-QB9tCMwo.js";import"./index-B9sM2jn7.js";import"./Popover-X-ryUqSd.js";import"./Modal-NqX8GTQ0.js";import"./Portal-CYnqZvqi.js";import"./formControlState-BpLmWJLS.js";import"./MenuItem-b-m50k9y.js";import"./ListSubheader-RShJPGjk.js";import"./Chip-BB37PRoF.js";import"./makeStyles-BSDvNkE_.js";import"./EmptyState-G6LAt4qO.js";import"./Grid-B2YGGSgc.js";import"./Progress-Dm888nDn.js";import"./LinearProgress-DE4YfTgd.js";import"./Box-Do1kLFaD.js";import"./styled-CaiGGCTB.js";import"./ResponseErrorPanel-C-j0SRAP.js";import"./ErrorPanel-BFFMrVVW.js";import"./WarningPanel-aF7tzwTa.js";import"./ExpandMore-DZiXAgMM.js";import"./AccordionDetails-CJeHfiZr.js";import"./Collapse-DNyQVL9b.js";import"./MarkdownContent-97mqW_uF.js";import"./CodeSnippet-DoTexFgi.js";import"./ListItemText-BWLQ0n6h.js";import"./ListContext-BrmWluE9.js";import"./CopyTextButton-DvCyKSRO.js";import"./useCopyToClipboard-BHlmIXZx.js";import"./useMountedState-D9Kraart.js";import"./Tooltip-DV_BwGfD.js";import"./Popper-FC50uWcj.js";import"./Divider-yQcNjI7O.js";import"./useAsync-D9Dadyr-.js";import"./lodash-9IYu6p8I.js";import"./useElementFilter-Bic431WH.js";import"./componentData-DiVyrxHk.js";import"./ListItemIcon-CrnEtBQ7.js";import"./WebStorage-BCRoi_Wl.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-C3BGiy9r.js";import"./useIsomorphicLayoutEffect-mmhg8n2s.js";import"./useApp-Rwr12CC0.js";import"./BUIProvider-Dj-0esdq.js";import"./openLink-Cwj0uu6r.js";import"./useResolvedHref-mXGtO_J8.js";import"./useRouteRef-Veftxdeu.js";import"./index-CPIaraR9.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
