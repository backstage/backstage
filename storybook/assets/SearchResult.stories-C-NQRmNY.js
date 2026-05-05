import{aQ as I,aR as L,aS as S,aT as j,aE as g,j as t,a2 as D}from"./iframe-D7zjeBit.js";import{c as f,D as v}from"./InsertDriveFile-Ckzp5Sos.js";import{s as C,M as _}from"./api-CCo5-scy.js";import{S as o,c as k}from"./SearchResult-C1UPkB0z.js";import{L as R}from"./List-_IcS7A5z.js";import{H as n}from"./DefaultResultListItem-Dn9oyKrS.js";import{a as N}from"./SearchResultList-xADsmg9_.js";import{w as q}from"./appWrappers-v5wpWIMC.js";import{L as w}from"./ListItem-PR8H70fv.js";import{c as E}from"./Plugin-CVC2XCl_.js";import{S as A}from"./SearchContext-D2vdUOrz.js";import{L as W}from"./Link-43gYvX88.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bbpa25qa.js";import"./Add-BT2fk6hb.js";import"./ArrowForwardIos-BgNCx0DV.js";import"./translation-B9ufI9Ns.js";import"./useAnalytics-CJoDpLKX.js";import"./Select-BW0qQiBP.js";import"./index-B9sM2jn7.js";import"./Popover-BLVU7E1s.js";import"./Modal-CKF7dnop.js";import"./Portal-B4c0pg-w.js";import"./formControlState-Be-np0TU.js";import"./MenuItem-RejvdPIb.js";import"./ListSubheader-Ce8LG7BM.js";import"./Chip-BBqdvmfX.js";import"./makeStyles-BdLugvEp.js";import"./EmptyState-DxbABYLa.js";import"./Grid-BwBMybgh.js";import"./Progress-Bj4ZZPqW.js";import"./LinearProgress-CuFzMvnp.js";import"./Box-eqPq7tDA.js";import"./styled-Cto7NXi2.js";import"./ResponseErrorPanel-CX6I3Nps.js";import"./ErrorPanel-D3lennx9.js";import"./WarningPanel-CcoG20un.js";import"./ExpandMore-CHCoKjrA.js";import"./AccordionDetails-yQUU3RTP.js";import"./Collapse-CIrQlr20.js";import"./MarkdownContent-DiO1cZeN.js";import"./CodeSnippet-hV1f9Dn9.js";import"./CopyTextButton-Z9HYJ3cw.js";import"./useCopyToClipboard-CckL3d_D.js";import"./useMountedState-kWf6Idih.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";import"./ListItemText-vMMeAjTD.js";import"./ListContext-338I8pjt.js";import"./Divider-B8mQbTru.js";import"./useAsync-Dqyaj-jN.js";import"./lodash-CaiQO1ZN.js";import"./useElementFilter-CPgQI5iw.js";import"./componentData-oJphk98C.js";import"./ListItemIcon-DY3Cfta7.js";import"./WebStorage-DeZ4yBfj.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DYeGzQbF.js";import"./useIsomorphicLayoutEffect-yTyQWuiq.js";import"./useApp-CAJtRMT4.js";import"./BUIProvider-C7yMSiFt.js";import"./openLink-Cd2W8V43.js";import"./useResolvedHref-CxiGpWC6.js";import"./useRouteRef-D3pL_24l.js";import"./index-B9TfV-iv.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
